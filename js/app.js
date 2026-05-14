// ===============================
// BANCO GLOBAL
// ===============================

window.db = (function () {

    try {

        const data = localStorage.getItem('sentinela_ops_db');

        return data
            ? JSON.parse(data)
            : {
                perfil: {},
                postos: [],
                rondas: [],
                intervaloAtivo: null
            };

    } catch (e) {

        console.error("Erro ao carregar DB:", e);

        return {
            perfil: {},
            postos: [],
            rondas: [],
            intervaloAtivo: null
        };

    }

})();

// COMPATIBILIDADE GLOBAL
window.fotoBase64 = "";
window.db = window.db;


// ===============================
// SALVAR LOCAL
// ===============================

function saveLocal() {

    localStorage.setItem(
        'sentinela_ops_db',
        JSON.stringify(window.db)
    );

}

window.saveLocal = saveLocal;


// ===============================
// CARREGAR DADOS FIREBASE
// ===============================

async function carregarDadosSincronizados(uid) {

    try {

        console.log("Sincronizando dados...");

        // =====================
        // PERFIL
        // =====================

        const docP = await fs.collection("usuarios")
            .doc(uid)
            .get();

        if (docP.exists) {

            window.db.perfil = docP.data();

        }

        // =====================
        // POSTOS
        // =====================

        const snapPostos = await fs.collection("postos")
            .get();

        window.db.postos = snapPostos.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // =====================
        // RONDAS
        // =====================

        const snapRondas = await fs.collection("rondas")
            .where("uid", "==", uid)
            .orderBy("timestamp", "desc")
            .limit(30)
            .get();

        window.db.rondas = snapRondas.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // =====================
        // SALVA LOCAL
        // =====================

        saveLocal();

        console.log("Dados sincronizados!");

        // =====================
        // ABRE HOME
        // =====================

        showView('home');

    } catch (erro) {

        console.error(
            "ERRO AO CARREGAR DADOS:",
            erro
        );

        alert(
            "Erro ao carregar dados do sistema."
        );

    }

}

window.carregarDadosSincronizados = carregarDadosSincronizados;


// ===============================
// TROCAR TELAS
// ===============================

function showView(v) {

    // ESCONDE TELAS
    document.querySelectorAll(
        '#view-home, #view-rondas, #view-postos, #view-perfil'
    ).forEach(el => {

        el.classList.add('hidden');

    });

    // MOSTRA TELA
    const view = document.getElementById('view-' + v);

    if (view) {

        view.classList.remove('hidden');

    }

    // REMOVE ACTIVE
    document.querySelectorAll('.nav-item')
        .forEach(i => {

            i.classList.remove('active');

        });

    // ATIVA MENU
    const nav = document.getElementById('nav-' + v);

    if (nav) {

        nav.classList.add('active');

    }

    // =====================
    // RONDAS
    // =====================

    if (v === 'rondas') {

        const placa = document.getElementById('r-placa');

        if (placa) {

            placa.value =
                window.db?.perfil?.placa || "N/A";

        }

        if (typeof atualizarSelectPostos === "function") {

            atualizarSelectPostos();

        }

        if (typeof renderRondas === "function") {

            renderRondas();

        }

    }

    // =====================
    // PERFIL
    // =====================

    if (v === 'perfil') {

        if (typeof preencherCamposPerfil === "function") {

            preencherCamposPerfil();

        }

    }

    // =====================
    // POSTOS
    // =====================

    if (v === 'postos') {

        console.log("POSTOS ABERTO");

        if (typeof renderPostos === "function") {

            renderPostos();

        }

    }

}

window.showView = showView;


// ===============================
// GERENCIAR INTERVALO
// ===============================

function gerenciarIntervalo() {

    const btn =
        document.getElementById('btn-intervalo');

    if (!window.db.intervaloAtivo) {

        window.db.intervaloAtivo =
            new Date().toLocaleTimeString(
                'pt-BR',
                {
                    hour: '2-digit',
                    minute: '2-digit'
                }
            );

        if (btn) {

            btn.innerText =
                "🏁 FINALIZAR INTERVALO (" +
                window.db.intervaloAtivo +
                ")";

            btn.classList.replace(
                'btn-info',
                'btn-danger'
            );

        }

    } else {

        alert(
            "Intervalo iniciado às " +
            window.db.intervaloAtivo +
            " finalizado agora."
        );

        window.db.intervaloAtivo = null;

        if (btn) {

            btn.innerText =
                "☕ INICIAR INTERVALO";

            btn.classList.replace(
                'btn-danger',
                'btn-info'
            );

        }

    }

    saveLocal();

}

window.gerenciarIntervalo = gerenciarIntervalo;

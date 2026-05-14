let db = JSON.parse(localStorage.getItem('sentinela_ops_db')) || {
    perfil: {},
    postos: [],
    rondas: [],
    intervaloAtivo: null
};

let fotoBase64 = "";

// SALVAR LOCAL
function saveLocal() {

    localStorage.setItem(
        'sentinela_ops_db',
        JSON.stringify(db)
    );

}

// CARREGAR DADOS FIREBASE
async function carregarDadosSincronizados(uid) {

    try {

        // PERFIL
        const docP = await fs.collection("usuarios")
            .doc(uid)
            .get();

        if (docP.exists) {
            db.perfil = docP.data();
        }

        // TODOS OS POSTOS
        const snapPostos = await fs.collection("postos").get();

        db.postos = snapPostos.docs.map(d => ({
            id: d.id,
            ...d.data()
        }));

        // RONDAS
        const snapRondas = await fs.collection("rondas")
            .where("uid", "==", uid)
            .orderBy("timestamp", "desc")
            .limit(30)
            .get();

        db.rondas = snapRondas.docs.map(d => d.data());

        // SALVA LOCAL
        saveLocal();

        // ABRE HOME
        showView('home');

    } catch (erro) {

        console.error(
            "ERRO AO CARREGAR DADOS:",
            erro
        );

        alert(
            "Erro ao carregar dados do sistema.\n" +
            "Verifique as regras do Firestore."
        );

    }

}

// TROCAR TELAS
function showView(v) {

    document.querySelectorAll('.container')
        .forEach(el => el.classList.add('hidden'));

    document.getElementById('view-' + v)
        .classList.remove('hidden');

    document.querySelectorAll('.nav-item')
        .forEach(i => i.classList.remove('active'));

    document.getElementById('nav-' + v)
        .classList.add('active');

    // RONDAS
    if (v === 'rondas') {

        const placa = document.getElementById('r-placa');

        if (placa) {
            placa.value = db.perfil.placa || "N/A";
        }

        if (typeof atualizarSelectPostos === "function") {
            atualizarSelectPostos();
        }

        if (typeof renderRondas === "function") {
            renderRondas();
        }

    }

    // PERFIL
    if (v === 'perfil') {

        if (typeof preencherCamposPerfil === "function") {
            preencherCamposPerfil();
        }

    }

    // POSTOS
    if (v === 'postos') {

        if (typeof renderPostos === "function") {
            renderPostos();
        }

    }

}

// INTERVALO
function gerenciarIntervalo() {

    const btn = document.getElementById('btn-intervalo');

    if (!db.intervaloAtivo) {

        db.intervaloAtivo = new Date()
            .toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });

        btn.innerText =
            "🏁 FINALIZAR INTERVALO (" +
            db.intervaloAtivo +
            ")";

        btn.classList.replace(
            'btn-info',
            'btn-danger'
        );

    } else {

        alert(
            "Intervalo iniciado às " +
            db.intervaloAtivo +
            " finalizado agora."
        );

        db.intervaloAtivo = null;

        btn.innerText = "☕ INICIAR INTERVALO";

        btn.classList.replace(
            'btn-danger',
            'btn-info'
        );

    }

    saveLocal();

}

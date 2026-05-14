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

        console.error(
            "Erro ao carregar banco local:",
            e
        );

        return {
            perfil: {},
            postos: [],
            rondas: [],
            intervaloAtivo: null
        };
    }

})();

let fotoBase64 = "";


// ===============================
// SALVAR LOCAL
// ===============================

function saveLocal() {

    localStorage.setItem(
        'sentinela_ops_db',
        JSON.stringify(window.db)
    );

}


// ===============================
// CARREGAR DADOS FIREBASE
// ===============================

async function carregarDadosSincronizados(uid) {

    try {

        // ===============================
        // PERFIL
        // ===============================

        const docP = await fs
            .collection("usuarios")
            .doc(uid)
            .get();

        if (docP.exists) {

            window.db.perfil = docP.data();

            console.log(
                "PERFIL CARREGADO:",
                window.db.perfil
            );

        } else {

            console.warn(
                "Perfil não encontrado no Firestore"
            );

            window.db.perfil = {};

        }


        // ===============================
        // POSTOS
        // ===============================

        const snapPostos = await fs
            .collection("postos")
            .get();

        window.db.postos = snapPostos.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));


        // ===============================
        // RONDAS
        // ===============================

        const snapRondas = await fs
            .collection("rondas")
            .where("uid", "==", uid)
            .orderBy("timestamp", "desc")
            .limit(30)
            .get();

        window.db.rondas = snapRondas.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));


        // ===============================
        // SALVA LOCAL
        // ===============================

        saveLocal();


        // ===============================
        // ABRE HOME
        // ===============================

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
    const view = document.getElementById(
        'view-' + v
    );

    if (view) {
        view.classList.remove('hidden');
    }

    // REMOVE ACTIVE
    document.querySelectorAll('.nav-item')
        .forEach(i => {
            i.classList.remove('active');
        });

    // ATIVA NAV
    const nav = document.getElementById(
        'nav-' + v
    );

    if (nav) {
        nav.classList.add('active');
    }

    // ===============================
    // RONDAS
    // ===============================

    if (v === 'rondas') {

        const placa = document.getElementById(
            'r-placa'
        );

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

    // ===============================
    // PERFIL
    // ===============================

    if (v === 'perfil') {

        if (typeof preencherCamposPerfil === "function") {
            preencherCamposPerfil();
        }

    }

    // ===============================
    // POSTOS
    // ===============================

    if (v === 'postos') {

        console.log(
            "POSTOS ABERTO"
        );

        if (typeof renderPostos === "function") {
            renderPostos();
        }

    }

}


// ===============================
// VERIFICAR ADM
// ===============================

function usuarioEhAdm() {

    return (
        window.db?.perfil?.adm === true
    );

}

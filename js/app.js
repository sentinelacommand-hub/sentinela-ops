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

    try {

        localStorage.setItem(
            'sentinela_ops_db',
            JSON.stringify(window.db)
        );

    } catch (e) {

        console.error(
            "Erro ao salvar local:",
            e
        );

    }

}


// ===============================
// CARREGAR DADOS FIREBASE
// ===============================

async function carregarDadosSincronizados(uid) {

    try {

        // ===============================
        // VALIDAÇÕES
        // ===============================

        if (!uid) {

            console.error("UID inválido");
            return;

        }

        if (!window.fs) {

            console.error("Firestore não iniciado");
            return;

        }


        // ===============================
        // PERFIL
        // ===============================

        try {

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
                    "Perfil não encontrado"
                );

                window.db.perfil = {};

            }

        } catch (e) {

            console.error(
                "Erro ao carregar perfil:",
                e
            );

            window.db.perfil = {};

        }


        // ===============================
        // POSTOS
        // ===============================

        try {

            const snapPostos = await fs
                .collection("postos")
                .get();

            window.db.postos = snapPostos.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            console.log(
                "POSTOS CARREGADOS:",
                window.db.postos.length
            );

        } catch (e) {

            console.error(
                "Erro ao carregar postos:",
                e
            );

            window.db.postos = [];

        }


        // ===============================
        // RONDAS
        // ===============================

        try {

            const snapRondas = await fs
                .collection("rondas")
                .where("uid", "==", uid)
                .limit(30)
                .get();

            window.db.rondas = snapRondas.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            console.log(
                "RONDAS CARREGADAS:",
                window.db.rondas.length
            );

        } catch (e) {

            console.error(
                "Erro ao carregar rondas:",
                e
            );

            window.db.rondas = [];

        }


        // ===============================
        // SALVA LOCAL
        // ===============================

        saveLocal();


        // ===============================
        // ABRE HOME
        // ===============================

        if (typeof showView === "function") {

            showView('home');

        }

        console.log(
            "SISTEMA CARREGADO COM SUCESSO"
        );

    } catch (erro) {

        console.error(
            "ERRO GERAL:",
            erro
        );

    }

}


// ===============================
// TROCAR TELAS
// ===============================

function showView(v) {

    document.querySelectorAll(
        '#view-home, #view-rondas, #view-postos, #view-perfil'
    ).forEach(el => {
        el.classList.add('hidden');
    });

    const view = document.getElementById(
        'view-' + v
    );

    if (view) {

        view.classList.remove('hidden');

    }

    document.querySelectorAll('.nav-item')
        .forEach(i => {
            i.classList.remove('active');
        });

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

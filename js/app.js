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

        // ===== PERFIL =====
        const docP = await fs
            .collection("usuarios")
            .doc(uid)
            .get();

        if (docP.exists) {

            window.db.perfil = docP.data();

        } else {

            window.db.perfil = {};

        }

        // ===== POSTOS =====
        const snapPostos = await fs
            .collection("postos")
            .get();

        window.db.postos = snapPostos.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // ===== RONDAS =====
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

        // ===== SALVA LOCAL =====
        saveLocal();

        // ===== ABRE HOME =====
        showView('home');

        console.log("DADOS CARREGADOS!");

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

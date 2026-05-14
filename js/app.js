// BANCO GLOBAL
window.db = JSON.parse(
    localStorage.getItem('sentinela_ops_db')
) || {
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

// TROCAR TELAS
function showView(v) {

    // ESCONDE APENAS AS TELAS INTERNAS
    document.querySelectorAll(
        '#view-home, #view-rondas, #view-postos, #view-perfil'
    ).forEach(el => {
        el.classList.add('hidden');
    });

    // MOSTRA A VIEW
    const view = document.getElementById('view-' + v);

    if (view) {
        view.classList.remove('hidden');
    }

    // REMOVE ACTIVE DOS BOTÕES
    document.querySelectorAll('.nav-item')
        .forEach(i => i.classList.remove('active'));

    // ATIVA BOTÃO ATUAL
    const nav = document.getElementById('nav-' + v);

    if (nav) {
        nav.classList.add('active');
    }

    // ===== HOME =====
    if (v === 'home') {

        console.log("HOME ABERTA");

    }

    // ===== RONDAS =====
    if (v === 'rondas') {

        const placa = document.getElementById('r-placa');

        if (placa) {
            placa.value = db?.perfil?.placa || "N/A";
        }

        if (typeof atualizarSelectPostos === "function") {
            atualizarSelectPostos();
        }

        if (typeof renderRondas === "function") {
            renderRondas();
        }

    }

    // ===== PERFIL =====
    if (v === 'perfil') {

        if (typeof preencherCamposPerfil === "function") {
            preencherCamposPerfil();
        }

    }

    // ===== POSTOS =====
    if (v === 'postos') {

        console.log("POSTOS ABERTO");

        if (typeof renderPostos === "function") {
            renderPostos();
        }

    }

}

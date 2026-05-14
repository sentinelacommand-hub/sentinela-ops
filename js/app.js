function showView(v) {

    // ESCONDE SOMENTE AS TELAS INTERNAS
    document.querySelectorAll(
        '#view-home, #view-rondas, #view-postos, #view-perfil'
    ).forEach(el => {
        el.classList.add('hidden');
    });

    // MOSTRA A TELA
    const view = document.getElementById('view-' + v);

    if (view) {
        view.classList.remove('hidden');
    }

    // NAVBAR
    document.querySelectorAll('.nav-item')
        .forEach(i => i.classList.remove('active'));

    const nav = document.getElementById('nav-' + v);

    if (nav) {
        nav.classList.add('active');
    }

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

window.db = (function () {
    try {
        const data = localStorage.getItem('sentinela_ops_db');
        return data ? JSON.parse(data) : { perfil: {}, postos: [], rondas: [], intervaloAtivo: null };
    } catch (e) {
        console.error("Erro ao carregar banco local:", e);
        return { perfil: {}, postos: [], rondas: [], intervaloAtivo: null };
    }
})();

let fotoBase64 = "";

function saveLocal() {
    localStorage.setItem('sentinela_ops_db', JSON.stringify(window.db));
}

async function carregarDadosSincronizados(uid) {
    try {
        const docP = await fs.collection("usuarios").doc(uid).get();
        if (docP.exists) {
            window.db.perfil = docP.data();
        } else {
            window.db.perfil = {};
        }

        const snapPostos = await fs.collection("postos").get();
        window.db.postos = snapPostos.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const snapRondas = await fs.collection("rondas").where("uid", "==", uid).orderBy("timestamp", "desc").limit(30).get();
        window.db.rondas = snapRondas.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        saveLocal();
        showView('home');
    } catch (erro) {
        console.error("ERRO AO CARREGAR DADOS:", erro);
        alert("Erro ao carregar dados do sistema.");
    }
}

function showView(v) {
    document.querySelectorAll('#view-home, #view-rondas, #view-postos, #view-perfil').forEach(el => el.classList.add('hidden'));
    const view = document.getElementById('view-' + v);
    if (view) view.classList.remove('hidden');

    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    const nav = document.getElementById('nav-' + v);
    if (nav) nav.classList.add('active');

    if (v === 'rondas') {
        const placa = document.getElementById('r-placa');
        if (placa) placa.value = window.db?.perfil?.placa || "N/A";
        if (typeof atualizarSelectPostos === "function") atualizarSelectPostos();
        if (typeof renderRondas === "function") renderRondas();
    }
    if (v === 'perfil' && typeof preencherCamposPerfil === "function") preencherCamposPerfil();
    if (v === 'postos' && typeof renderPostos === "function") renderPostos();
}

function usuarioEhAdm() {
    return (window.db?.perfil?.adm === true);
}

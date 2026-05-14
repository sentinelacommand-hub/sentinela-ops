let db = JSON.parse(localStorage.getItem('sentinela_ops_db')) || { perfil: {}, postos: [], rondas: [], intervaloAtivo: null };
let fotoBase64 = "";

function saveLocal() { 
    localStorage.setItem('sentinela_ops_db', JSON.stringify(db)); 
}

async function carregarDadosSincronizados(uid) {
    const docP = await fs.collection("usuarios").doc(uid).get();
    if (docP.exists) db.perfil = docP.data();

    const snapPostos = await fs.collection("postos").where("uid", "==", uid).get();
    db.postos = snapPostos.docs.map(d => ({ id: d.id, ...d.data() }));

    const snapRondas = await fs.collection("rondas").where("uid", "==", uid).orderBy("timestamp", "desc").limit(30).get();
    db.rondas = snapRondas.docs.map(d => d.data());

    saveLocal();
    showView('home');
}

function showView(v) {
    document.querySelectorAll('.container').forEach(el => el.classList.add('hidden'));
    document.getElementById('view-' + v).classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.getElementById('nav-' + v).classList.add('active');

    if (v === 'rondas') {
        document.getElementById('r-placa').value = db.perfil.placa || "N/A";
        atualizarSelectPostos();
        renderRondas();
    }
    if (v === 'perfil') preencherCamposPerfil();
    if (v === 'postos') renderPostos();
}

// Lógica de intervalo mantida conforme original (chamada no HTML)
function gerenciarIntervalo() {
    const btn = document.getElementById('btn-intervalo');
    if (!db.intervaloAtivo) {
        db.intervaloAtivo = new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});
        btn.innerText = "🏁 FINALIZAR INTERVALO (" + db.intervaloAtivo + ")";
        btn.classList.replace('btn-info', 'btn-danger');
    } else {
        alert("Intervalo iniciado às " + db.intervaloAtivo + " finalizado agora.");
        db.intervaloAtivo = null;
        btn.innerText = "☕ INICIAR INTERVALO";
        btn.classList.replace('btn-danger', 'btn-info');
    }
    saveLocal();
}
function toggleCheck(el) { 
    el.classList.toggle('ok'); 
}

function toggleFiscalizacao() {
    const m = document.getElementById('r-motivo').value;
    document.getElementById('sec-fiscalizacao').style.display = (m === 'Fiscalização') ? 'block' : 'none';
}

function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxWidth = 800;
                const scale = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * scale;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                fotoBase64 = canvas.toDataURL('image/jpeg', 0.7);
            };
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function atualizarSelectPostos() {
    const sel = document.getElementById('r-posto');
    sel.innerHTML = '<option value="">Selecione o posto...</option>';
    db.postos.forEach(p => sel.innerHTML += `<option value="${p.nome}">${p.nome}</option>`);
}

function preencherCamposPerfil() {
    const p = db.perfil;
    document.getElementById('p-nome').value = p.nome || "";
    document.getElementById('p-matrícula').value = p.matricula || "";
    document.getElementById('p-cargo').value = p.cargo || "";
    document.getElementById('p-placa').value = p.placa || "";
    document.getElementById('p-empresa').value = p.empresa || "";
    document.getElementById('p-cnpj').value = p.cnpj || "";
}

async function salvarPerfil() {
    const p = {
        nome: document.getElementById('p-nome').value,
        matricula: document.getElementById('p-matrícula').value,
        cargo: document.getElementById('p-cargo').value,
        placa: document.getElementById('p-placa').value.toUpperCase(),
        empresa: document.getElementById('p-empresa').value,
        cnpj: document.getElementById('p-cnpj').value
    };
    db.perfil = p;
    saveLocal();
    await fs.collection("usuarios").doc(auth.currentUser.uid).set(p);
    alert("✅ Perfil salvo!");
}

async function zerarRondasPlantao() {
    if (!auth.currentUser) return alert("Usuário não autenticado.");
    const confirmar = confirm("ATENÇÃO!\n\nEsta ação irá apagar todas as rondas registradas do usuário logado para iniciar um novo plantão.\n\nDeseja continuar?");
    if (!confirmar) return;

    try {
        await excluirRondasFirebaseUsuario(auth.currentUser.uid);
        limparDadosLocaisRondas();
        renderRondas();
        alert("✅ Rondas zeradas com sucesso! Novo plantão iniciado.");
    } catch (e) {
        alert("Erro ao zerar rondas: " + e.message);
    }
}

async function excluirRondasFirebaseUsuario(uid) {
    while (true) {
        const snap = await fs.collection("rondas").where("uid", "==", uid).limit(450).get();
        if (snap.empty) break;
        const batch = fs.batch();
        snap.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        if (snap.size < 450) break;
    }
}

function limparDadosLocaisRondas() {
    db.rondas = [];
    const dadosLocais = JSON.parse(localStorage.getItem('sentinela_ops_db')) || {};
    const baseAtualizada = {
        perfil: dadosLocais.perfil || db.perfil || {},
        postos: dadosLocais.postos || db.postos || [],
        rondas: [],
        intervaloAtivo: dadosLocais.intervaloAtivo || db.intervaloAtivo || null
    };
    localStorage.setItem('sentinela_ops_db', JSON.stringify(baseAtualizada));
    
    const chavesParaRemover = [];
    for (let i = 0; i < localStorage.length; i++) {
        const chave = localStorage.key(i);
        if (chave && chave !== 'sentinela_ops_db' && chave.toLowerCase().includes('ronda')) {
            chavesParaRemover.push(chave);
        }
    }
    chavesParaRemover.forEach(chave => localStorage.removeItem(chave));
}
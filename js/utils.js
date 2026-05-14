function toggleCheck(el) { el.classList.toggle('ok'); }

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
    if(!sel) return;
    sel.innerHTML = '<option value="">Selecione o posto...</option>';
    window.db.postos.forEach(p => sel.innerHTML += `<option value="${p.nome}">${p.nome}</option>`);
}

function preencherCamposPerfil() {
    const p = window.db.perfil;
    document.getElementById('p-nome').value = p.nome || "";
    document.getElementById('p-matricula').value = p.matricula || "";
    document.getElementById('p-cargo').value = p.cargo || "";
    document.getElementById('p-placa').value = p.placa || "";
    document.getElementById('p-empresa').value = p.empresa || "";
    document.getElementById('p-cnpj').value = p.cnpj || "";
}

async function salvarPerfil() {
    const p = {
        nome: document.getElementById('p-nome').value,
        matricula: document.getElementById('p-matricula').value,
        cargo: document.getElementById('p-cargo').value,
        placa: document.getElementById('p-placa').value.toUpperCase(),
        empresa: document.getElementById('p-empresa').value,
        cnpj: document.getElementById('p-cnpj').value,
        adm: window.db.perfil.adm || false
    };
    window.db.perfil = p;
    saveLocal();
    await fs.collection("usuarios").doc(auth.currentUser.uid).set(p);
    alert("✅ Perfil salvo!");
}

async function zerarRondasPlantao() {
    if (!auth.currentUser) return;
    if (!confirm("Deseja zerar as rondas para um novo plantão?")) return;
    try {
        const snap = await fs.collection("rondas").where("uid", "==", auth.currentUser.uid).get();
        const batch = fs.batch();
        snap.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        window.db.rondas = [];
        saveLocal();
        renderRondas();
        alert("✅ Plantão zerado!");
    } catch (e) { alert("Erro ao zerar."); }
}

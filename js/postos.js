// --- FUNÇÕES POSTOS ---
ADCIONAR NOVO POSTO
async function adicionarPosto() {
    const nome = prompt("Nome do Posto:");
    if(!nome) return;
    const endereco = prompt("Endereço:");
    const novoPosto = { nome: nome.toUpperCase(), endereco: endereco || "Sem endereço", uid: auth.currentUser.uid };
    const docRef = await fs.collection("postos").add(novoPosto);
    db.postos.push({ id: docRef.id, ...novoPosto });
    saveLocal();
    renderPostos();
}

FILTRAR E ORDENAR POSTOS
function renderPostos() {
    const busca = document.getElementById('busca-posto').value.toUpperCase();
    const container = document.getElementById('lista-postos');
    const filtrados = db.postos.filter(p => p.nome.includes(busca));
    container.innerHTML = filtrados.map((p, i) => `
        <div class="posto-item">
            <div style="flex:1;" onclick="editarPosto('${p.id}', ${db.postos.indexOf(p)})">
                <b>${p.nome}</b><br><small>${p.endereco}</small>
            </div>
            <div style="display:flex;">
                <button onclick="window.open('https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.endereco)}', '_blank')" class="btn-small" style="background:#238636;">ROTA</button>
                <button onclick="editarPosto('${p.id}', ${db.postos.indexOf(p)})" class="btn-small" style="background:#2563eb;">✏️</button>
                <button onclick="excluirPosto('${p.id}', ${db.postos.indexOf(p)})" class="btn-small" style="background:#f85149;">🗑️</button>
            </div>
        </div>
    `).join('');
}

EDITAR POSTOS
async function editarPosto(id, index) {
    const posto = db.postos[index];
    const novoNome = prompt("Editar nome do Posto:", posto.nome);
    const novoEndereco = prompt("Editar endereço:", posto.endereco);

    if (novoNome) {
        const dadosAtualizados = {
            nome: novoNome.toUpperCase(),
            endereco: novoEndereco || "Sem endereço"
        };
       
        // Atualiza no Firebase
        if(id) await fs.collection("postos").doc(id).update(dadosAtualizados);
       
        // Atualiza localmente
        db.postos[index] = { ...posto, ...dadosAtualizados };
        saveLocal();
        renderPostos();
        alert("Posto atualizado!");
    }
}

EXCLUIR POSTOS

async function excluirPosto(id, index) {
    if(!confirm("Excluir posto?")) return;
    if(id) await fs.collection("postos").doc(id).delete();
    db.postos.splice(index, 1);
    saveLocal();
    renderPostos();
}
// --- NOVAS FUNÇÕES: RESET DE PLANTÃO / ZERAR RONDAS ---
async function zerarRondasPlantao() {
    if (!auth.currentUser) return alert("Usuário não autenticado.");

    const confirmar = confirm(
        "ATENÇÃO!\n\n" +
        "Esta ação irá apagar todas as rondas registradas do usuário logado para iniciar um novo plantão.\n\n" +
        "Deseja continuar?"
    );

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
        const snap = await fs.collection("rondas")
            .where("uid", "==", uid)
            .limit(450)
            .get();

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

// --- OUTRAS FUNÇÕES ---
function atualizarSelectPostos() {
    const sel = document.getElementById('r-posto');
    sel.innerHTML = '<option value="">Selecione o posto...</option>';
    db.postos.forEach(p => sel.innerHTML += `<option value="${p.nome}">${p.nome}</option>`);
}

RECONHECIMENTO DO ADMIN
// ===============================
// IDENTIFICAÇÃO DE ADMINISTRADOR
// ===============================

// SOMENTE ADMIN
if (!db.perfil || !db.perfil.admin) {
    alert("Apenas administradores podem criar postos.");
    return;
}

// MOSTRAR BOTÕES SOMENTE PARA ADMIN
${db.perfil && db.perfil.admin ? `

    <button
        onclick="editarPosto('${p.id}', ${i})"
        class="btn-small"
        style="background:#2563eb;"
    >
        ✏️
    </button>

    <button
        onclick="excluirPosto('${p.id}', ${i})"
        class="btn-small"
        style="background:#f85149;"
    >
        🗑️
    </button>

` : ''}

// SOMENTE ADMIN
if (!db.perfil || !db.perfil.admin) {
    alert("Apenas administradores podem editar postos.");
    return;
}

// SOMENTE ADMIN
if (!db.perfil || !db.perfil.admin) {
    alert("Apenas administradores podem excluir postos.");
    return;
}


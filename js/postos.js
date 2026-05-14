async function adicionarPosto() {
    if (!window.db.perfil.adm) {
        alert("Apenas administradores podem criar postos.");
        return;
    }
    const nome = prompt("Nome do Posto:");
    if (!nome) return;
    const endereco = prompt("Endereço:");
    const novoPosto = { nome: nome.toUpperCase(), endereco: endereco || "Sem endereço" };
    try {
        const docRef = await fs.collection("postos").add(novoPosto);
        window.db.postos.push({ id: docRef.id, ...novoPosto });
        saveLocal();
        renderPostos();
        alert("Posto adicionado!");
    } catch (erro) {
        alert("Erro ao adicionar posto.");
    }
}

function renderPostos() {
    const busca = document.getElementById('busca-posto').value.toUpperCase();
    const container = document.getElementById('lista-postos');
    const filtrados = window.db.postos.filter(p => p.nome.includes(busca));

    container.innerHTML = filtrados.map((p, i) => `
        <div class="posto-item">
            <div style="flex:1;">
                <b>${p.nome}</b><br><small>${p.endereco}</small>
            </div>
            <div style="display:flex; gap:5px;">
                <button onclick="window.open('https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.endereco)}', '_blank')" class="btn-small" style="background:#238636;">ROTA</button>
                ${window.db.perfil.adm ? `
                    <button onclick="editarPosto('${p.id}', ${window.db.postos.indexOf(p)})" class="btn-small" style="background:#2563eb;">✏️</button>
                    <button onclick="excluirPosto('${p.id}', ${window.db.postos.indexOf(p)})" class="btn-small" style="background:#f85149;">🗑️</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

async function editarPosto(id, index) {
    if (!window.db.perfil.adm) return alert("Acesso negado.");
    const posto = window.db.postos[index];
    const novoNome = prompt("Editar nome:", posto.nome);
    if (!novoNome) return;
    const novoEndereco = prompt("Editar endereço:", posto.endereco);
    const dados = { nome: novoNome.toUpperCase(), endereco: novoEndereco || "Sem endereço" };
    try {
        await fs.collection("postos").doc(id).update(dados);
        window.db.postos[index] = { ...posto, ...dados };
        saveLocal();
        renderPostos();
    } catch (e) { alert("Erro ao editar."); }
}

async function excluirPosto(id, index) {
    if (!window.db.perfil.adm || !confirm("Excluir posto?")) return;
    try {
        await fs.collection("postos").doc(id).delete();
        window.db.postos.splice(index, 1);
        saveLocal();
        renderPostos();
    } catch (e) { alert("Erro ao excluir."); }
}

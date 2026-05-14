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

async function editarPosto(id, index) {
    const posto = db.postos[index];
    const novoNome = prompt("Editar nome do Posto:", posto.nome);
    const novoEndereco = prompt("Editar endereço:", posto.endereco);

    if (novoNome) {
        const dadosAtualizados = { 
            nome: novoNome.toUpperCase(), 
            endereco: novoEndereco || "Sem endereço" 
        };
        
        if(id) await fs.collection("postos").doc(id).update(dadosAtualizados);
        
        db.postos[index] = { ...posto, ...dadosAtualizados };
        saveLocal();
        renderPostos();
        alert("Posto atualizado!");
    }
}

async function excluirPosto(id, index) {
    if(!confirm("Excluir posto?")) return;
    if(id) await fs.collection("postos").doc(id).delete();
    db.postos.splice(index, 1);
    saveLocal();
    renderPostos();
}

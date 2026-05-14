async function adicionarPosto() {

    // SOMENTE ADMIN
    if (!db.perfil.admin) {
        alert("Apenas administradores podem criar postos.");
        return;
    }

    const nome = prompt("Nome do Posto:");
    if (!nome) return;

    const endereco = prompt("Endereço:");

    const novoPosto = {
        nome: nome.toUpperCase(),
        endereco: endereco || "Sem endereço"
    };

    try {

        // SALVA NO FIREBASE
        const docRef = await fs.collection("postos").add(novoPosto);

        // SALVA LOCAL
        db.postos.push({
            id: docRef.id,
            ...novoPosto
        });

        saveLocal();

        renderPostos();

        alert("Posto adicionado!");

    } catch (erro) {

        console.error(erro);

        alert("Erro ao adicionar posto.");

    }

}

function renderPostos() {

    const busca = document
        .getElementById('busca-posto')
        .value
        .toUpperCase();

    const container = document.getElementById('lista-postos');

    const filtrados = db.postos.filter(p =>
        p.nome.includes(busca)
    );

    container.innerHTML = filtrados.map((p, i) => `

        <div class="posto-item">

            <div style="flex:1;" onclick="editarPosto('${p.id}', ${i})">

                <b>${p.nome}</b><br>

                <small>${p.endereco}</small>

            </div>

            <div style="display:flex; gap:5px;">

                <button
                    onclick="window.open(
                        'https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.endereco)}',
                        '_blank'
                    )"
                    class="btn-small"
                    style="background:#238636;"
                >
                    ROTA
                </button>

                ${db.perfil.admin ? `

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

            </div>

        </div>

    `).join('');
}

async function editarPosto(id, index) {

    // SOMENTE ADMIN
    if (!db.perfil.admin) {
        alert("Apenas administradores podem editar postos.");
        return;
    }

    const posto = db.postos[index];

    const novoNome = prompt(
        "Editar nome do Posto:",
        posto.nome
    );

    if (!novoNome) return;

    const novoEndereco = prompt(
        "Editar endereço:",
        posto.endereco
    );

    const dadosAtualizados = {
        nome: novoNome.toUpperCase(),
        endereco: novoEndereco || "Sem endereço"
    };

    try {

        // ATUALIZA FIREBASE
        await fs.collection("postos")
            .doc(id)
            .update(dadosAtualizados);

        // ATUALIZA LOCAL
        db.postos[index] = {
            ...posto,
            ...dadosAtualizados
        };

        saveLocal();

        renderPostos();

        alert("Posto atualizado!");

    } catch (erro) {

        console.error(erro);

        alert("Erro ao atualizar posto.");

    }

}

async function excluirPosto(id, index) {

    // SOMENTE ADMIN
    if (!db.perfil.admin) {
        alert("Apenas administradores podem excluir postos.");
        return;
    }

    if (!confirm("Excluir posto?")) return;

    try {

        // REMOVE FIREBASE
        await fs.collection("postos")
            .doc(id)
            .delete();

        // REMOVE LOCAL
        db.postos.splice(index, 1);

        saveLocal();

        renderPostos();

        alert("Posto removido!");

    } catch (erro) {

        console.error(erro);

        alert("Erro ao excluir posto.");

    }

}

// CARREGA TODOS OS POSTOS DO FIREBASE
async function carregarPostos() {

    try {

        const snapshot = await fs.collection("postos").get();

        db.postos = [];

        snapshot.forEach(doc => {

            db.postos.push({
                id: doc.id,
                ...doc.data()
            });

        });

        saveLocal();

        renderPostos();

    } catch (erro) {

        console.error("Erro ao carregar postos:", erro);

    }

}

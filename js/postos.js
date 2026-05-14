function renderPostos() {

    // VERIFICA CAMPO BUSCA
    const campoBusca = document.getElementById('busca-posto');
    const busca = campoBusca ? campoBusca.value.toUpperCase() : "";

    // VERIFICA CONTAINER
    const container = document.getElementById('lista-postos');
    if (!container) return;

    // GARANTE ARRAY (Usamos um spread [...] para não mexer na lista original do banco de dados)
    let listaParaExibir = db.postos ? [...db.postos] : [];

    // 1. FILTRO
    let filtrados = listaParaExibir.filter(p =>
        p.nome.includes(busca)
    );

    // 2. ORDENAÇÃO A-Z (Aplicada sobre os filtrados)
    filtrados.sort((a, b) =>
        (a.nome || "").localeCompare(
            (b.nome || ""),
            'pt-BR',
            { sensitivity: 'base' }
        )
    );

    // 3. RENDERIZA
    container.innerHTML = filtrados.map((p) => {
        // Buscamos o índice real na array db.postos para as funções de editar/excluir
        const indexReal = db.postos.findIndex(item => item.id === p.id);

        return `
        <div class="posto-item">
            <div style="flex:1;">
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

                ${db.perfil && db.perfil.admin ? `
                    <button
                        onclick="editarPosto('${p.id}', ${indexReal})"
                        class="btn-small"
                        style="background:#2563eb;"
                    >
                        ✏️
                    </button>

                    <button
                        onclick="excluirPosto('${p.id}', ${indexReal})"
                        class="btn-small"
                        style="background:#f85149;"
                    >
                        🗑️
                    </button>
                ` : ''}
            </div>
        </div>
    `}).join('');
}

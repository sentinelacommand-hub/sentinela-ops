function renderPostos() {

    // VERIFICA CAMPO BUSCA
    const campoBusca =
        document.getElementById('busca-posto');

    const busca = campoBusca
        ? campoBusca.value.toUpperCase()
        : "";

    // VERIFICA CONTAINER
    const container =
        document.getElementById('lista-postos');

    if (!container) return;

    // GARANTE ARRAY
    const lista = db.postos || [];

    // ===============================
    // NOVA FUNÇÃO: ORDENA A-Z
    // ===============================

    lista.sort((a, b) =>
        (a.nome || "").localeCompare(
            (b.nome || ""),
            'pt-BR',
            { sensitivity: 'base' }
        )
    );

    // FILTRO
    const filtrados = lista.filter(p =>
        p.nome.includes(busca)
    );

    // RENDERIZA
    container.innerHTML = filtrados.map((p, i) => `

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

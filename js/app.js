const router = {
    views: {
        login: `
            <div class="login-container">
                <h2>Acesso ao Sistema</h2>
                <input type="email" id="email" placeholder="E-mail">
                <input type="password" id="password" placeholder="Senha">
                <button class="btn-primary" onclick="auth.login()">Entrar</button>
            </div>
        `,
        home: `
            <h1>Dashboard Operacional</h1>
            <div class="grid">
                <div class="card"><h3>Rondas Hoje</h3><p id="count-rondas">0</p></div>
                <div class="card"><h3>Ocorrências</h3><p id="count-ocor">0</p></div>
            </div>
            <h2>Atividades Recentes</h2>
            <div id="recent-activity"></div>
        `,
        rondas: `
            <h1>Registrar Ronda</h1>
            <div class="card">
                <select id="posto-select"></select>
                <textarea id="obs" placeholder="Observações do Supervisor"></textarea>
                <input type="file" id="foto" accept="image/*">
                <button class="btn-primary" onclick="rondas.save()">Finalizar Ronda</button>
            </div>
            <div id="lista-rondas"></div>
        `
    },

    navigate(viewName) {
        const user = firebase.auth().currentUser;
        if (!user && viewName !== 'login') {
            this.navigate('login');
            return;
        }

        document.getElementById('app').innerHTML = this.views[viewName];
        
        // Inicializa lógicas específicas da view
        if (viewName === 'rondas') rondas.loadPostos();
        if (viewName === 'home') dashboard.loadStats();
    }
};

// Listener de autenticação
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        document.getElementById('sidebar').classList.remove('hidden');
        router.navigate('home');
    } else {
        router.navigate('login');
    }
    document.getElementById('loader').style.display = 'none';
});

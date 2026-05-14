function login() {
    const e = document.getElementById('login-email').value;
    const s = document.getElementById('login-senha').value;
    if(!e || !s) return alert("Preencha os campos!");
    auth.signInWithEmailAndPassword(e, s).catch(err => alert("Erro: " + err.message));
}

function cadastrar() {
    const e = document.getElementById('login-email').value;
    const s = document.getElementById('login-senha').value;
    auth.createUserWithEmailAndPassword(e, s).then(() => alert("Conta criada!")).catch(err => alert(err.message));
}

function logout() { 
    auth.signOut(); 
}

auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('view-login').classList.add('hidden');
        document.getElementById('app-content').classList.remove('hidden');
        carregarDadosSincronizados(user.uid);
    } else {
        document.getElementById('view-login').classList.remove('hidden');
        document.getElementById('app-content').classList.add('hidden');
    }
});

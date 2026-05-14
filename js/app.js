async function carregarDadosSincronizados(uid) {
    const docP = await fs.collection("usuarios").doc(uid).get();
    if (docP.exists) db.perfil = docP.data();

    // TODOS OS POSTOS DO SISTEMA
    const snapPostos = await fs.collection("postos").get();
    db.postos = snapPostos.docs.map(d => ({ id: d.id, ...d.data() }));

    // RONDAS CONTINUAM POR USUÁRIO
    const snapRondas = await fs.collection("rondas")
        .where("uid", "==", uid)
        .orderBy("timestamp", "desc")
        .limit(30)
        .get();

    db.rondas = snapRondas.docs.map(d => d.data());

    saveLocal();
    showView('home');
}

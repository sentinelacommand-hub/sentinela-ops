async function carregarDadosSincronizados(uid) {

    try {

        // PERFIL
        const docP = await fs.collection("usuarios")
            .doc(uid)
            .get();

        if (docP.exists) {
            db.perfil = docP.data();
        }

        // TODOS OS POSTOS DO SISTEMA
        const snapPostos = await fs.collection("postos").get();

        db.postos = snapPostos.docs.map(d => ({
            id: d.id,
            ...d.data()
        }));

        // RONDAS DO USUÁRIO
        const snapRondas = await fs.collection("rondas")
            .where("uid", "==", uid)
            .orderBy("timestamp", "desc")
            .limit(30)
            .get();

        db.rondas = snapRondas.docs.map(d => d.data());

        // SALVA LOCAL
        saveLocal();

        // ABRE HOME
        showView('home');

    } catch (erro) {

        console.error("ERRO AO CARREGAR DADOS:", erro);

        alert(
            "Erro ao carregar dados do sistema.\n" +
            "Verifique as regras do Firestore."
        );

    }

}

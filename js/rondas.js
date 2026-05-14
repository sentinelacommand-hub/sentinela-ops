const rondas = {
    async save() {
        const posto = document.getElementById('posto-select').value;
        const obs = document.getElementById('obs').value;
        const fotoFile = document.getElementById('foto').files[0];

        // Captura GPS
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const gps = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };

            // Upload Foto
            let fotoUrl = "";
            if (fotoFile) {
                const storageRef = firebase.storage().ref(`rondas/${Date.now()}`);
                await storageRef.put(fotoFile);
                fotoUrl = await storageRef.getDownloadURL();
            }

            // Salva no Firestore
            await db.collection('rondas').add({
                supervisor: firebase.auth().currentUser.displayName,
                posto: posto,
                observacao: obs,
                gps: gps,
                foto: fotoUrl,
                dataHora: firebase.firestore.FieldValue.serverTimestamp()
            });

            alert("Ronda registrada com sucesso!");
            router.navigate('home');
        });
    }
};

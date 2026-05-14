async function salvarRonda() {
    const posto = document.getElementById('r-posto').value;
    if(!posto) return alert("Selecione um posto!");

    const checklist = {};
    document.querySelectorAll('#checklist .check-item').forEach(i => {
        checklist[i.innerText] = i.classList.contains('ok') ? 'OK' : 'PENDENTE';
    });

    const novaRonda = {
        id: Date.now(),
        uid: auth.currentUser.uid,
        posto: posto,
        motivo: document.getElementById('r-motivo').value,
        km: document.getElementById('r-km').value || '0',
        data: new Date().toLocaleDateString('pt-BR'),
        hora: new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}),
        colaborador: document.getElementById('r-func').value || "N/A",
        obs: document.getElementById('r-obs').value || "Sem alterações",
        checklist: checklist,
        foto: fotoBase64,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await fs.collection("rondas").add(novaRonda);
        db.rondas.unshift(novaRonda);
        saveLocal();
        renderRondas();
        gerarCardIndividual(novaRonda);
        limparFormRonda();
        alert("✅ Ronda registrada e Card gerado!");
    } catch(e) {
        alert("Erro ao sincronizar. Salvo localmente.");
    }
}

function renderRondas() {
    const container = document.getElementById('historico-rondas');
    container.innerHTML = db.rondas.map((r) => `
        <div class="ronda-entry">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong>${r.hora}</strong> - ${r.posto}<br>
                    <small>${r.motivo} | KM: ${r.km}</small>
                </div>
                <button onclick='reimprimirCard(${JSON.stringify(r).replace(/'/g, "&apos;")})' class="btn-small" style="background:var(--accent); color:#000;">🖨️ CARD</button>
            </div>
        </div>
    `).join('');
}

function reimprimirCard(ronda) {
    gerarCardIndividual(ronda);
}

function gerarCardIndividual(r) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: [80, 200] });
    let y = 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("COMPROVANTE DE VISITA", 40, y, { align: "center" });

    y += 7;
    if (r.foto) {
        try { doc.addImage(r.foto, 'JPEG', 5, y, 70, 45); y += 50; } catch (e) { y += 5; }
    }

    doc.setFontSize(11);
    doc.text(r.posto.toUpperCase(), 40, y, { align: "center" });
    y += 7;
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Data: ${r.data} | Hora: ${r.hora}`, 5, y);
    y += 5;
    doc.text(`VTR: ${db.perfil.placa || "---"} | KM: ${r.km}`, 5, y);
    y += 5;
    doc.text(`COLABORADOR: ${r.colaborador.toUpperCase()}`, 5, y);
    
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.text("STATUS OPERACIONAL:", 5, y);
    
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    Object.entries(r.checklist || {}).forEach(([item, status]) => {
        y += 4;
        doc.text(`• ${item}: ${status}`, 8, y);
    });

    y += 8;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("OBSERVAÇÕES:", 5, y);
    
    doc.setFont("helvetica", "normal");
    const obs = doc.splitTextToSize(r.obs, 70);
    doc.text(obs, 5, y + 5);

    y += (obs.length * 5) + 15;
    doc.setFont("helvetica", "bold");
    doc.text(`${(db.perfil.cargo || "Supervisor").toUpperCase()}:`, 5, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.text((db.perfil.nome || "N/A").toUpperCase(), 5, y);

    doc.save(`Card_${r.posto}_${r.hora.replace(':','-')}.pdf`);
}

function limparFormRonda() {
    document.getElementById('r-km').value = "";
    document.getElementById('r-obs').value = "";
    document.getElementById('r-func').value = "";
    fotoBase64 = "";
    document.getElementById('r-foto').value = "";
}

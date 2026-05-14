async function gerarRelatorioPDF(rondaId) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const docSnap = await db.collection('rondas').doc(rondaId).get();
    const data = docSnap.data();

    doc.setFontSize(20);
    doc.text("Relatório de Ronda Operacional", 10, 20);
    doc.setFontSize(12);
    doc.text(`Supervisor: ${data.supervisor}`, 10, 40);
    doc.text(`Posto: ${data.posto}`, 10, 50);
    doc.text(`Data: ${data.dataHora.toDate().toLocaleString()}`, 10, 60);
    doc.text(`Observações: ${data.observacao}`, 10, 70);
    
    doc.save(`ronda_${rondaId}.pdf`);
}

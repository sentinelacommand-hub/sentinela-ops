function gerarRelatorioPlantao() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const p = window.db.perfil;
    let y = 20;

    doc.setFont("helvetica", "bold").setFontSize(16);
    doc.text("RELATÓRIO DE PLANTÃO OPERACIONAL", 105, y, { align: "center" });
    
    y += 15;
    doc.setFontSize(10).text("DADOS DO OPERADOR", 10, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`Operador: ${p.nome || "N/A"}`, 10, y);
    doc.text(`Cargo: ${p.cargo || "N/A"}`, 100, y);
    y += 5;
    doc.text(`Matrícula: ${p.matricula || "N/A"}`, 10, y);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 100, y);

    y += 10;
    doc.line(10, y, 200, y);
    y += 10;
    doc.setFont("helvetica", "bold").text("REGISTROS DE ATIVIDADES", 10, y);
    y += 8;

    window.db.rondas.forEach((r, index) => {
        if(y > 250) { doc.addPage(); y = 20; }
        doc.setFont("helvetica", "bold").setFontSize(9);
        doc.text(`${index + 1}. POSTO: ${r.posto.toUpperCase()}`, 10, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.text(`Hora: ${r.hora} | Colaborador: ${r.colaborador}`, 15, y);
        y += 5;
        doc.text(`Motivo: ${r.motivo} | KM: ${r.km}`, 15, y);
        y += 5;
        const obs = doc.splitTextToSize(`Obs: ${r.obs}`, 180);
        doc.text(obs, 15, y);
        y += (obs.length * 5) + 7;
    });

    doc.save(`Relatorio_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);
}

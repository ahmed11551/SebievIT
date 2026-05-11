import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateCP = (data: {
  name: string;
  calcCMS: string;
  calcType: string;
  calcFeatures: string[];
  total: number;
  options: any;
}) => {
  try {
    const doc = new jsPDF();

    // Add font/styling (using standard fonts for simplicity)
    // Note: Default fonts in jsPDF do not support Cyrillic. 
    // We will use Latin labels for now to ensure the file downloads.
    
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text('COMMERCIAL PROPOSAL', 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Customer: ${data.name}`, 20, 45);
    doc.text(`Date: ${new Date().toLocaleDateString('ru-RU')}`, 20, 52);
    doc.text(`Engineer: Ahmed Sebiev (Senior Fullstack)`, 20, 59);

    // Table Data
    const selectedCMS = data.options.cms.find((c: any) => c.id === data.calcCMS);
    const selectedType = data.options.type.find((t: any) => t.id === data.calcType);
    const selectedFeatures = data.options.features.filter((f: any) => data.calcFeatures.includes(f.id));

    const tableRows = [
      ['Base Development (React/NestJS)', '120 000 RUB'],
      [selectedCMS.label.replace(/[^a-zA-Z0-9\s\(\)\/]/g, ''), selectedCMS.price > 0 ? `+${selectedCMS.price.toLocaleString()} RUB` : 'Included'],
      [selectedType.label.replace(/[^a-zA-Z0-9\s\(\)\/]/g, ''), selectedType.price !== 0 ? `${selectedType.price.toLocaleString()} RUB` : '0 RUB'],
      ...selectedFeatures.map((f: any) => [f.label.replace(/[^a-zA-Z0-9\s\(\)\/]/g, ''), `+${f.price.toLocaleString()} RUB`])
    ];

    autoTable(doc, {
      startY: 75,
      head: [['Component', 'Cost']],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: { 1: { halign: 'right' } },
      margin: { left: 20, right: 20 }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 150;

    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text(`TOTAL: ${data.total.toLocaleString()} RUB`, 20, finalY + 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('Timeline: from 10 business days', 20, finalY + 35);
    doc.text('Warranty: 12 months', 20, finalY + 42);
    doc.text('Tech Support: 3 months included', 20, finalY + 49);

    // Footer
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 270, 190, 270);
    doc.text('Telegram: @SebievTL | +7 (925) 940-94-04', 20, 280);

    doc.save(`CP_Ahmed_Sebiev_${data.name.replace(/\s+/g, '_')}.pdf`);
  } catch (err) {
    console.error("PDF generation error:", err);
    alert("Could not generate PDF. Please contact Ahmed via Telegram.");
  }
};

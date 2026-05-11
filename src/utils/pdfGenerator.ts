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

    // Professional Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('COMMERCIAL PROPOSAL', 20, 25);
    
    doc.setFontSize(10);
    doc.text('Ahmed Sebiev | Senior Fullstack Engineer', 20, 32);

    // Client Info Section
    doc.setTextColor(100, 116, 139); // slate-500
    doc.setFontSize(9);
    doc.text('CLIENT:', 20, 55);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.text(data.name, 20, 62);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    doc.text('DATE:', 140, 55);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.text(new Date().toLocaleDateString('en-US'), 140, 62);

    // Table Data
    const selectedCMS = data.options.cms.find((c: any) => c.id === data.calcCMS);
    const selectedType = data.options.type.find((t: any) => t.id === data.calcType);
    const selectedFeatures = data.options.features.filter((f: any) => data.calcFeatures.includes(f.id));

    const tableRows = [
      ['Platform Base (React/NestJS/Cloud)', '120,000 RUB'],
      [selectedCMS.label.replace(/[^a-zA-Z0-9\s\(\)\/]/g, '') || 'Custom CMS', selectedCMS.price > 0 ? `+${selectedCMS.price.toLocaleString()} RUB` : 'Included'],
      [selectedType.label.replace(/[^a-zA-Z0-9\s\(\)\/]/g, '') || 'New Project', selectedType.price !== 0 ? `${selectedType.price.toLocaleString()} RUB` : '0 RUB'],
      ...selectedFeatures.map((f: any) => [f.label.replace(/[^a-zA-Z0-9\s\(\)\/]/g, '') || 'Feature', `+${f.price.toLocaleString()} RUB`]),
      ['Performance & Security Audit', 'FREE'],
      ['3 Months After-Care Support', 'FREE'],
      ['PROMOTIONAL DISCOUNT (Spring Sale)', '-40%']
    ];

    autoTable(doc, {
      startY: 75,
      head: [['SERVICE COMPONENT', 'INVESTMENT']],
      body: tableRows,
      theme: 'grid',
      headStyles: { 
        fillColor: [15, 23, 42], 
        textColor: [255, 255, 255], 
        fontStyle: 'bold',
        fontSize: 10,
        cellPadding: 5
      },
      bodyStyles: {
        fontSize: 10,
        cellPadding: 5
      },
      columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } },
      margin: { left: 20, right: 20 }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 150;

    // Summary Box
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(20, finalY + 10, 170, 30, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(`TOTAL INVESTMENT:`, 30, finalY + 28);
    doc.setFontSize(18);
    doc.text(`${data.total.toLocaleString()} RUB`, 130, finalY + 28);

    // Terms
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('PROJECT TERMS:', 20, finalY + 55);
    
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('• Timeline: Estimate starts from 10 business days.', 20, finalY + 65);
    doc.text('• Guarantee: 12 months full source code warranty.', 20, finalY + 72);
    doc.text('• Support: Priority technical support during development & 3 months after.', 20, finalY + 79);

    // Signature Area
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 250, 80, 250);
    doc.text('Ahmed Sebiev', 20, 258);
    doc.text('Lead Engineer', 20, 263);

    // Footer Socials
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 280, 210, 17, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Telegram: @SebievTL | Phone: +7 (925) 940-94-04 | Email: Ahmed1155@mail.ru', 45, 291);

    doc.save(`Estimation_Sebiev_${data.name.replace(/\s+/g, '_')}.pdf`);
  } catch (err) {
    console.error("PDF generation error:", err);
    alert("Could not generate PDF. Please contact Ahmed via Telegram.");
  }
};

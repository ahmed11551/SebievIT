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
    doc.rect(0, 0, 210, 50, 'F');
    
    // Logo Icon (Stylized Abstract Logo)
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(20, 15, 12, 12, 'F'); 
    doc.setFillColor(255, 255, 255);
    doc.rect(23, 18, 6, 6, 'F');
    doc.setFillColor(16, 185, 129);
    doc.rect(25, 20, 2, 2, 'F');

    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text('COMMERCIAL PROPOSAL', 40, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text('SEBIEV SOFTWARE ARCHITECTURE', 40, 32);
    doc.text('High-Performance Fullstack Solutions', 40, 37);

    // Client Info Section (Shifted down for header)
    doc.setTextColor(100, 116, 139); // slate-500
    doc.setFontSize(9);
    doc.text('CLIENT:', 20, 65);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(data.name, 20, 72);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text('PROPOSAL ID:', 140, 65);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.text(`EST-${Math.floor(1000 + Math.random() * 9000)}-2025`, 140, 72);
    
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    doc.text('DATE:', 140, 80);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.text(new Date().toLocaleDateString('en-US'), 140, 87);

    // Table Data
    const selectedCMS = data.options.cms.find((c: any) => c.id === data.calcCMS);
    const selectedType = data.options.type.find((t: any) => t.id === data.calcType);
    const selectedFeatures = data.options.features.filter((f: any) => data.calcFeatures.includes(f.id));

    const tableRows = [
      ['Platform Core (React/Node.js/Next.js)', '120,000 RUB'],
      [selectedCMS.label.replace(/[^a-zA-Z0-9\s\(\)\/]/g, '') || 'Custom Architecture', selectedCMS.price > 0 ? `+${selectedCMS.price.toLocaleString()} RUB` : 'Included'],
      [selectedType.label.replace(/[^a-zA-Z0-9\s\(\)\/]/g, '') || 'New Development', selectedType.price !== 0 ? `${selectedType.price.toLocaleString()} RUB` : 'Standard'],
      ...selectedFeatures.map((f: any) => [f.label.replace(/[^a-zA-Z0-9\s\(\)\/]/g, '') || 'Feature', `+${f.price.toLocaleString()} RUB`]),
      ['Performance & SSR Optimization', 'FREE'],
      ['Security Hardening (OWASP Top 10)', 'FREE'],
      ['3 Months Premium Support', 'FREE'],
      ['SPECIAL SPRING DISCOUNT', '-40%']
    ];

    autoTable(doc, {
      startY: 100,
      head: [['SERVICE COMPONENT DESCRIPTION', 'INVESTMENT']],
      body: tableRows,
      theme: 'grid',
      headStyles: { 
        fillColor: [15, 23, 42], 
        textColor: [255, 255, 255], 
        fontStyle: 'bold',
        fontSize: 10,
        cellPadding: 6
      },
      bodyStyles: {
        fontSize: 10,
        cellPadding: 5,
        textColor: [51, 65, 85] // slate-700
      },
      columnStyles: { 
        0: { cellWidth: 130 },
        1: { halign: 'right', fontStyle: 'bold', textColor: [15, 23, 42] } 
      },
      margin: { left: 20, right: 20 }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 180;

    // Summary Box
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(20, finalY + 10, 170, 35, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(`TOTAL INVESTMENT:`, 30, finalY + 31);
    doc.setFontSize(22);
    doc.text(`${data.total.toLocaleString()} RUB`, 110, finalY + 31);

    // Bonuses Section
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text('FREE BONUSES INCLUDED:', 20, finalY + 65);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.text('[+] SEO Basic Setup (Meta tags, SSR, Speed Index)', 25, finalY + 75);
    doc.text('[+] Deployment to Production (Vercel/DigitalOcean/Hetzner)', 25, finalY + 82);
    doc.text('[+] Technical Documentation and Screen Guidance', 25, finalY + 89);

    // Terms
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text('PROJECT TERMS:', 20, finalY + 110);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text('• Timeline: Estimated starts from 14 business days.', 20, finalY + 120);
    doc.text('• Guarantee: 12 months full source code warranty.', 20, finalY + 127);
    doc.text('• Payment: 50% upfront, 50% upon project completion.', 20, finalY + 134);

    // Signature Area
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 272, 80, 272);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.text('Ahmed Sebiev', 20, 280);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Software Architect', 20, 285);

    // Footer Socials
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 290, 210, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('Telegram: @SebievTL | Phone: +7 (925) 940-94-04 | Website: ahmed-dev.pro', 55, 296);

    doc.save(`Estimation_Sebiev_${data.name.replace(/\s+/g, '_')}.pdf`);
  } catch (err) {
    console.error("PDF generation error:", err);
    alert("Could not generate PDF. Please contact Ahmed via Telegram.");
  }
};

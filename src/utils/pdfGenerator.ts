import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateCP = (data: {
  name: string;
  calcCMS: string;
  calcType: string;
  calcFeatures: string[];
  total: number;
  options: any;
}) => {
  const doc = new jsPDF() as any;

  // Add font/styling (using standard fonts for simplicity, better to use custom fonts if possible)
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ', 20, 30);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Заказчик: ${data.name}`, 20, 45);
  doc.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, 20, 52);
  doc.text(`Инженер: Ахмед Себиев (Senior Fullstack)`, 20, 59);

  // Table Data
  const selectedCMS = data.options.cms.find((c: any) => c.id === data.calcCMS);
  const selectedType = data.options.type.find((t: any) => t.id === data.calcType);
  const selectedFeatures = data.options.features.filter((f: any) => data.calcFeatures.includes(f.id));

  const tableRows = [
    ['Базовая разработка (React/NestJS)', '120 000 ₽'],
    [selectedCMS.label, selectedCMS.price > 0 ? `+${selectedCMS.price.toLocaleString()} ₽` : 'Включено'],
    [selectedType.label, selectedType.price !== 0 ? `${selectedType.price.toLocaleString()} ₽` : '0 ₽'],
    ...selectedFeatures.map((f: any) => [f.label, `+${f.price.toLocaleString()} ₽`])
  ];

  doc.autoTable({
    startY: 75,
    head: [['Компонент', 'Стоимость']],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: { 1: { halign: 'right' } },
    margin: { left: 20, right: 20 }
  });

  const finalY = (doc as any).lastAutoTable.finalY || 150;

  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(`ИТОГО: ${data.total.toLocaleString()} руб.`, 20, finalY + 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Срок разработки: от 10 рабочих дней', 20, finalY + 35);
  doc.text('Гарантия на код: 12 месяцев', 20, finalY + 42);
  doc.text('Техническая поддержка: 3 месяца включено', 20, finalY + 49);

  // Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(20, 270, 190, 270);
  
  // Note: Standard jsPDF fonts might have issues with Cyrillic. 
  // In a full production build, we would embed a custom font file.
  
  doc.text('Telegram: @SebievTL | +7 (925) 940-94-04', 20, 280);

  doc.save(`CP_Ahmed_Sebiev_${data.name.replace(/\s+/g, '_')}.pdf`);
};

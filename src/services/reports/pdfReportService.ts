
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ReportData, RowData } from '@/types/importacao';
import { formatarValorCurrency } from '@/utils/formatting/currencyUtils';

/**
 * Generate a PDF remittance report from the selected rows
 */
export const generatePDFReport = async (reportData: ReportData): Promise<Blob> => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text("RELATÓRIO DE REMESSA BANCÁRIA", 105, 20, { align: 'center' });
  
  // Add horizontal line
  doc.setDrawColor(0);
  doc.line(15, 25, 195, 25);
  
  // Add header information
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text(`Empresa: ${reportData.empresa}`, 15, 35);
  doc.text(`Data de Geração: ${reportData.dataGeracao}`, 15, 42);
  doc.text(`Referência da Remessa: ${reportData.referencia}`, 15, 49);
  doc.text(`Total Registros: ${reportData.totalRegistros}`, 15, 56);
  
  // Add horizontal line
  doc.line(15, 62, 195, 62);
  
  // Add BENEFICIÁRIOS text
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("BENEFICIÁRIOS:", 15, 72);
  
  // Define table columns
  const tableColumns = [
    { header: 'Nome Completo', dataKey: 'NOME' },
    { header: 'CPF', dataKey: 'INSCRICAO' },
    { header: 'Banco', dataKey: 'BANCO' },
    { header: 'Agência', dataKey: 'AGENCIA' },
    { header: 'Conta', dataKey: 'CONTA' },
    { header: 'Tipo', dataKey: 'TIPO' },
    { header: 'Valor (R$)', dataKey: 'VALOR' }
  ];
  
  // Format data for the table - Ensure names are in uppercase
  const tableData = reportData.beneficiarios.map(row => ({
    NOME: typeof row.NOME === 'string' ? row.NOME.toUpperCase() : String(row.NOME).toUpperCase(),
    INSCRICAO: row.INSCRICAO,
    BANCO: row.BANCO.toString().padStart(3, '0'),
    AGENCIA: row.AGENCIA,
    CONTA: row.CONTA,
    TIPO: row.TIPO,
    VALOR: typeof row.VALOR === 'number' 
      ? formatarValorCurrency(row.VALOR).replace('R$', '').trim()
      : formatarValorCurrency(parseFloat(row.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.'))).replace('R$', '').trim()
  }));
  
  // Create the table with improved styling
  (doc as any).autoTable({
    startY: 77,
    head: [tableColumns.map(col => col.header)],
    body: tableData.map(row => tableColumns.map(col => row[col.dataKey])),
    theme: 'grid',
    headStyles: {
      fillColor: [60, 60, 60],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { top: 77 },
    didDrawPage: (data) => {
      // Ensure the table starts at the beginning of each page
      data.settings.margin.top = 20;
    }
  });
  
  // Add total row - Corrigido: Posicionar "TOTAL:" e valor corretamente
  const finalY = (doc as any).lastAutoTable.finalY;
  doc.line(15, finalY + 5, 195, finalY + 5);
  
  doc.setFont(undefined, 'bold');
  // Posicionar "TOTAL:" mais à esquerda e o valor à direita
  doc.text("TOTAL:", 100, finalY + 12);
  doc.text(formatarValorCurrency(reportData.valorTotal), 178, finalY + 12, { align: 'right' });
  
  doc.line(15, finalY + 17, 195, finalY + 17);
  
  // Add observations
  const obsY = finalY + 30;
  doc.setFontSize(10);
  doc.setFont(undefined, 'italic');
  doc.text("Observações:", 15, obsY);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  doc.text("Este relatório foi gerado automaticamente pelo sistema de Remessas.", 15, obsY + 7);
  doc.text("Em caso de dúvidas, entre em contato com o departamento financeiro.", 15, obsY + 14);
  
  // Add page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Página ${i} de ${pageCount}`, 105, 287, { align: 'center' });
  }
  
  // Generate the PDF as a Blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
};

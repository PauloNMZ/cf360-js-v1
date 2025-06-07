
import { jsPDF } from 'jspdf';
import { ReportData, RowData } from '@/types/importacao';
import { TotaisPorCategoria } from './bankCategorization';
import { formatarValorCurrency } from '@/utils/formatting/currencyUtils';
import { formatarCpfCnpj } from '@/utils/formatting/cnabFormatters';

/**
 * Adiciona cabeçalho do relatório ao PDF
 */
export const adicionarCabecalho = (doc: jsPDF, reportData: ReportData): void => {
  // Add title
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text("RELATÓRIO DE REMESSA BANCÁRIA", 105, 20, { align: 'center' });
  
  // Add horizontal line
  doc.setDrawColor(0);
  doc.line(15, 25, 195, 25);
  
  // Add header information with company name and FORMATTED CNPJ on separate lines
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text(`Empresa: ${reportData.empresaNome}`, 15, 35);
  doc.text(`CNPJ: ${formatarCpfCnpj(reportData.empresaCnpj)}`, 15, 42);
  doc.text(`Data de Geração: ${reportData.dataGeracao}`, 15, 49);
  doc.text(`Data de Pagamento: ${reportData.dataPagamento}`, 15, 56);
  doc.text(`Referência da Remessa: ${reportData.referencia}`, 15, 63);
  
  // Add total value information - adjusted position
  const valorTotalFormatado = formatarValorCurrency(reportData.valorTotal);
  doc.text(`Valor total dessa remessa: ${valorTotalFormatado} com ${reportData.totalRegistros} favorecidos`, 15, 70);
  
  // Add horizontal line - adjusted position
  doc.line(15, 76, 195, 76);
  
  // Add BENEFICIÁRIOS text - adjusted position
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("BENEFICIÁRIOS:", 15, 86);
};

/**
 * Configura e retorna dados formatados para a tabela
 */
export const prepararDadosTabela = (favorecidosOrdenados: RowData[]) => {
  // Define table columns
  const tableColumns = [
    { header: 'Nome Completo', dataKey: 'NOME' },
    { header: 'CPF/CNPJ', dataKey: 'INSCRICAO' },
    { header: 'Banco', dataKey: 'BANCO' },
    { header: 'Agência', dataKey: 'AGENCIA' },
    { header: 'Conta', dataKey: 'CONTA' },
    { header: 'Tipo', dataKey: 'TIPO' },
    { header: 'Valor (R$)', dataKey: 'VALOR' }
  ];
  
  // Format data for the table using ordered beneficiaries
  const tableData = favorecidosOrdenados.map(row => ({
    NOME: typeof row.NOME === 'string' ? row.NOME.toUpperCase() : String(row.NOME).toUpperCase(),
    INSCRICAO: formatarCpfCnpj(row.INSCRICAO),
    BANCO: row.BANCO.toString().padStart(3, '0'),
    AGENCIA: row.AGENCIA,
    CONTA: row.CONTA,
    TIPO: row.TIPO,
    VALOR: typeof row.VALOR === 'number' 
      ? formatarValorCurrency(row.VALOR).replace('R$', '').trim()
      : formatarValorCurrency(parseFloat(row.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.'))).replace('R$', '').trim()
  }));

  return { tableColumns, tableData };
};

/**
 * Adiciona tabela de beneficiários ao PDF
 */
export const adicionarTabelaBeneficiarios = (doc: jsPDF, tableColumns: any[], tableData: any[]): void => {
  // Create the table with improved styling - adjusted starting position
  (doc as any).autoTable({
    startY: 91,
    head: [tableColumns.map(col => col.header)],
    body: tableData.map(row => tableColumns.map(col => row[col.dataKey])),
    theme: 'grid',
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 9
    },
    columnStyles: {
      // Centralizando colunas específicas
      2: { halign: 'center' }, // Banco
      3: { halign: 'center' }, // Agência
      5: { halign: 'center' }, // Tipo
      // Alinhando à direita colunas específicas
      1: { halign: 'right' },  // CPF/CNPJ
      4: { halign: 'right' },  // Conta
      6: { halign: 'right' },  // Valor
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { top: 70 },
    didDrawPage: (data) => {
      // Ensure the table starts at the beginning of each page
      data.settings.margin.top = 20;
    }
  });
};

/**
 * Adiciona linha de total ao PDF
 */
export const adicionarLinhaTotal = (doc: jsPDF, valorTotal: number): void => {
  const finalY = (doc as any).lastAutoTable.finalY;
  doc.line(15, finalY + 5, 195, finalY + 5);
  
  doc.setFont(undefined, 'bold');
  // Posicionar "TOTAL:" mais à esquerda para evitar sobreposição
  doc.text("TOTAL:", 130, finalY + 12);
  doc.text(formatarValorCurrency(valorTotal).replace('R$', '').trim(), 178, finalY + 12, { align: 'right' });
  
  doc.line(15, finalY + 17, 195, finalY + 17);
};

/**
 * Adiciona seção de totais por categoria ao PDF
 */
export const adicionarSecaoTotais = (doc: jsPDF, startY: number, totais: TotaisPorCategoria): void => {
  // Título da seção
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("TOTAIS POR INSTITUIÇÃO FINANCEIRA:", 15, startY);
  
  // Linha superior
  doc.line(15, startY + 5, 195, startY + 5);
  
  // Banco do Brasil
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  const textoBB = `Banco do Brasil (001):     ${totais.bancoBrasil.quantidade} favorecido${totais.bancoBrasil.quantidade !== 1 ? 's' : ''} - ${formatarValorCurrency(totais.bancoBrasil.valor)}`;
  doc.text(textoBB, 15, startY + 15);
  
  // Demais Instituições Financeiras
  const textoDemais = `Demais Inst. Financeiras:  ${totais.demaisIF.quantidade} favorecido${totais.demaisIF.quantidade !== 1 ? 's' : ''} - ${formatarValorCurrency(totais.demaisIF.valor)}`;
  doc.text(textoDemais, 15, startY + 25);
  
  // Linha separadora
  doc.line(15, startY + 30, 195, startY + 30);
  
  // Total geral
  doc.setFont(undefined, 'bold');
  const textoTotal = `TOTAL REMESSA:             ${totais.total.quantidade} favorecido${totais.total.quantidade !== 1 ? 's' : ''} - ${formatarValorCurrency(totais.total.valor)}`;
  doc.text(textoTotal, 15, startY + 40);
};

/**
 * Adiciona observações e numeração de páginas ao PDF
 */
export const adicionarRodape = (doc: jsPDF, obsY: number): void => {
  // Add observations
  doc.setFontSize(10);
  doc.setFont(undefined, 'italic');
  doc.text("Observações:", 15, obsY);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  doc.text("Este relatório foi gerado automaticamente pelo sistema Cash Flow 360.", 15, obsY + 7);
  doc.text("Em caso de dúvidas, entre em contato com o departamento financeiro.", 15, obsY + 14);
  
  // Add page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Página ${i} de ${pageCount}`, 105, 287, { align: 'center' });
  }
};

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ReportData, RowData } from '@/types/importacao';
import { ReportSortType } from '@/types/reportSorting';
import { formatarValorCurrency } from '@/utils/formatting/currencyUtils';
import { formatarCpfCnpj } from '@/utils/formatting/cnabFormatters';

// Tipos para categorização dos favorecidos
interface TotaisPorCategoria {
  bancoBrasil: {
    quantidade: number;
    valor: number;
  };
  demaisIF: {
    quantidade: number;
    valor: number;
  };
  total: {
    quantidade: number;
    valor: number;
  };
}

/**
 * Categoriza favorecidos entre Banco do Brasil e demais instituições
 */
const categorizarFavorecidosPorBanco = (favorecidos: RowData[]): TotaisPorCategoria => {
  const totais: TotaisPorCategoria = {
    bancoBrasil: { quantidade: 0, valor: 0 },
    demaisIF: { quantidade: 0, valor: 0 },
    total: { quantidade: 0, valor: 0 }
  };

  favorecidos.forEach(favorecido => {
    const valor = typeof favorecido.VALOR === 'number' 
      ? favorecido.VALOR
      : parseFloat(favorecido.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
    
    if (!isNaN(valor)) {
      const banco = favorecido.BANCO.toString().padStart(3, '0');
      
      if (banco === '001') {
        // Banco do Brasil
        totais.bancoBrasil.quantidade++;
        totais.bancoBrasil.valor += valor;
      } else {
        // Demais Instituições Financeiras
        totais.demaisIF.quantidade++;
        totais.demaisIF.valor += valor;
      }
    }
  });

  // Calcular totais gerais
  totais.total.quantidade = totais.bancoBrasil.quantidade + totais.demaisIF.quantidade;
  totais.total.valor = totais.bancoBrasil.valor + totais.demaisIF.valor;

  return totais;
};

/**
 * Ordena favorecidos de acordo com o tipo de ordenação escolhido
 */
const ordenarFavorecidos = (favorecidos: RowData[], sortType: ReportSortType = ReportSortType.BY_NAME): RowData[] => {
  console.log("=== Sorting favorecidos ===");
  console.log("Input favorecidos count:", favorecidos.length);
  console.log("Sort type:", sortType);
  
  const sortedFavorecidos = [...favorecidos].sort((a, b) => {
    switch (sortType) {
      case ReportSortType.BY_NAME:
        const nomeA = (a.NOME || '').toString().toUpperCase();
        const nomeB = (b.NOME || '').toString().toUpperCase();
        return nomeA.localeCompare(nomeB);
      
      case ReportSortType.BY_BANK_NAME:
        const bancoA = (a.BANCO || '').toString().padStart(3, '0');
        const bancoB = (b.BANCO || '').toString().padStart(3, '0');
        const compareBanco = bancoA.localeCompare(bancoB);
        
        if (compareBanco !== 0) return compareBanco;
        
        const nomeA2 = (a.NOME || '').toString().toUpperCase();
        const nomeB2 = (b.NOME || '').toString().toUpperCase();
        const compareNome = nomeA2.localeCompare(nomeB2);
        
        if (compareNome !== 0) return compareNome;
        
        const tipoA = (a.TIPO || '').toString();
        const tipoB = (b.TIPO || '').toString();
        return tipoA.localeCompare(tipoB);
      
      case ReportSortType.BY_BANK_VALUE:
        const bancoA3 = (a.BANCO || '').toString().padStart(3, '0');
        const bancoB3 = (b.BANCO || '').toString().padStart(3, '0');
        const compareBanco3 = bancoA3.localeCompare(bancoB3);
        
        if (compareBanco3 !== 0) return compareBanco3;
        
        const valorA = typeof a.VALOR === 'number' 
          ? a.VALOR
          : parseFloat(a.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
        const valorB = typeof b.VALOR === 'number' 
          ? b.VALOR
          : parseFloat(b.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
        
        return valorB - valorA; // Decrescente
      
      case ReportSortType.BY_VALUE_DESC:
        const valorA2 = typeof a.VALOR === 'number' 
          ? a.VALOR
          : parseFloat(a.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
        const valorB2 = typeof b.VALOR === 'number' 
          ? b.VALOR
          : parseFloat(b.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
        
        return valorB2 - valorA2; // Decrescente
      
      default:
        return 0;
    }
  });

  console.log("Sorting completed with type:", sortType);
  return sortedFavorecidos;
};

/**
 * Adiciona seção de totais por categoria ao PDF
 */
const adicionarSecaoTotais = (doc: jsPDF, startY: number, totais: TotaisPorCategoria): void => {
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
 * Generate a PDF remittance report from the selected rows
 */
export const generatePDFReport = async (reportData: ReportData, sortType: ReportSortType = ReportSortType.BY_NAME): Promise<Blob> => {
  console.log("=== Generating PDF Report ===");
  console.log("Received reportData with", reportData.beneficiarios.length, "beneficiarios");
  console.log("Sort type:", sortType);
  
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Ordenar favorecidos de acordo com o tipo escolhido
  const favorecidosOrdenados = ordenarFavorecidos(reportData.beneficiarios, sortType);
  
  // Categorizar favorecidos por banco
  const totaisPorCategoria = categorizarFavorecidosPorBanco(favorecidosOrdenados);
  
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
  
  // Add total row - CORRIGIDO: Posicionar "TOTAL:" mais à esquerda e valor à direita
  const finalY = (doc as any).lastAutoTable.finalY;
  doc.line(15, finalY + 5, 195, finalY + 5);
  
  doc.setFont(undefined, 'bold');
  // Posicionar "TOTAL:" mais à esquerda para evitar sobreposição
  doc.text("TOTAL:", 130, finalY + 12);
  doc.text(formatarValorCurrency(reportData.valorTotal).replace('R$', '').trim(), 178, finalY + 12, { align: 'right' });
  
  doc.line(15, finalY + 17, 195, finalY + 17);
  
  // Adicionar seção de totais por categoria
  const secaoTotaisY = finalY + 30;
  adicionarSecaoTotais(doc, secaoTotaisY, totaisPorCategoria);
  
  // Add observations - adjusted position to account for new totals section
  const obsY = secaoTotaisY + 55;
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
  
  // Generate the PDF as a Blob
  const pdfBlob = doc.output('blob');
  console.log("=== PDF generation completed ===");
  return pdfBlob;
};


import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ReportData } from '@/types/importacao';
import { ReportSortType } from '@/types/reportSorting';
import { ordenarFavorecidos } from './utils/favorecidosSorting';
import { categorizarFavorecidosPorBanco } from './utils/bankCategorization';
import {
  adicionarCabecalho,
  prepararDadosTabela,
  adicionarTabelaBeneficiarios,
  adicionarLinhaTotal,
  adicionarSecaoTotais,
  adicionarRodape
} from './utils/pdfSections';

/**
 * Generate a PDF remittance report from the selected rows
 */
export const generatePDFReport = async (reportData: ReportData, sortType: ReportSortType = ReportSortType.BY_NAME): Promise<Blob> => {
  console.log("=== 📄 DEBUG generatePDFReport ===");
  console.log("sortType received in generatePDFReport:", sortType);
  console.log("sortType type:", typeof sortType);
  console.log("sortType stringified:", JSON.stringify(sortType));
  console.log("reportData.beneficiarios count:", reportData.beneficiarios.length);
  
  // Create a new PDF document
  const doc = new jsPDF();
  
  console.log("=== 🔄 About to call ordenarFavorecidos ===");
  console.log("Passing sortType to ordenarFavorecidos:", sortType);
  
  // Ordenar favorecidos de acordo com o tipo escolhido
  const favorecidosOrdenados = ordenarFavorecidos(reportData.beneficiarios, sortType);
  
  console.log("=== ✅ Got ordenarFavorecidos result ===");
  console.log("favorecidosOrdenados count:", favorecidosOrdenados.length);
  
  // Categorizar favorecidos por banco
  const totaisPorCategoria = categorizarFavorecidosPorBanco(favorecidosOrdenados);
  
  // Adicionar cabeçalho
  adicionarCabecalho(doc, reportData);
  
  // Preparar dados da tabela
  const { tableColumns, tableData } = prepararDadosTabela(favorecidosOrdenados);
  
  // Adicionar tabela de beneficiários
  adicionarTabelaBeneficiarios(doc, tableColumns, tableData);
  
  // Adicionar linha de total
  adicionarLinhaTotal(doc, reportData.valorTotal);
  
  // Adicionar seção de totais por categoria
  const finalY = (doc as any).lastAutoTable.finalY;
  const secaoTotaisY = finalY + 30;
  adicionarSecaoTotais(doc, secaoTotaisY, totaisPorCategoria);
  
  // Adicionar rodapé com observações e numeração
  const obsY = secaoTotaisY + 55;
  adicionarRodape(doc, obsY);
  
  // Generate the PDF as a Blob
  const pdfBlob = doc.output('blob');
  
  console.log("=== 📄 PDF generated successfully ===");
  return pdfBlob;
};

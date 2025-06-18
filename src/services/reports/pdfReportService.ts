
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
  console.log("=== 📄 DEBUG generatePDFReport - INÍCIO ===");
  console.log("sortType received in generatePDFReport:", sortType);
  console.log("sortType type:", typeof sortType);
  console.log("sortType stringified:", JSON.stringify(sortType));
  console.log("reportData.beneficiarios count:", reportData.beneficiarios.length);
  console.log("reportData structure:", {
    empresaNome: reportData.empresaNome,
    empresaCnpj: reportData.empresaCnpj,
    valorTotal: reportData.valorTotal,
    totalRegistros: reportData.totalRegistros
  });
  
  try {
    // ADDED: Validação dos dados de entrada
    if (!reportData || !reportData.beneficiarios || reportData.beneficiarios.length === 0) {
      throw new Error("Dados do relatório inválidos ou vazios");
    }

    // ADDED: Validação dos beneficiários
    console.log("=== 🔍 Validando beneficiários ===");
    reportData.beneficiarios.forEach((beneficiario, index) => {
      console.log(`Beneficiário ${index}:`, {
        NOME: beneficiario.NOME,
        VALOR: beneficiario.VALOR,
        BANCO: beneficiario.BANCO,
        TIPO: beneficiario.TIPO
      });
      
      if (!beneficiario.NOME || !beneficiario.VALOR || !beneficiario.BANCO) {
        console.error(`❌ Beneficiário ${index} com dados incompletos:`, beneficiario);
        throw new Error(`Beneficiário ${index} possui dados incompletos`);
      }
    });

    // Create a new PDF document
    console.log("=== 📄 Criando documento PDF ===");
    const doc = new jsPDF();
    
    console.log("=== 🔄 About to call ordenarFavorecidos ===");
    console.log("Passing sortType to ordenarFavorecidos:", sortType);
    
    // Ordenar favorecidos de acordo com o tipo escolhido
    const favorecidosOrdenados = ordenarFavorecidos(reportData.beneficiarios, sortType);
    
    console.log("=== ✅ Got ordenarFavorecidos result ===");
    console.log("favorecidosOrdenados count:", favorecidosOrdenados.length);
    
    // ADDED: Verificar se a ordenação funcionou
    console.log("=== 📊 Verificando ordenação ===");
    favorecidosOrdenados.slice(0, 5).forEach((fav, idx) => {
      console.log(`Pos ${idx}: ${fav.NOME} - Valor: ${fav.VALOR}`);
    });
    
    // Categorizar favorecidos por banco
    console.log("=== 🏦 Categorizando por banco ===");
    const totaisPorCategoria = categorizarFavorecidosPorBanco(favorecidosOrdenados);
    console.log("Totais por categoria:", totaisPorCategoria);
    
    // Adicionar cabeçalho
    console.log("=== 📋 Adicionando cabeçalho ===");
    adicionarCabecalho(doc, reportData);
    
    // Preparar dados da tabela
    console.log("=== 📊 Preparando dados da tabela ===");
    const { tableColumns, tableData } = prepararDadosTabela(favorecidosOrdenados);
    console.log("Colunas da tabela:", tableColumns.length);
    console.log("Linhas de dados:", tableData.length);
    
    // Adicionar tabela de beneficiários
    console.log("=== 📋 Adicionando tabela de beneficiários ===");
    adicionarTabelaBeneficiarios(doc, tableColumns, tableData);
    
    // Adicionar linha de total
    console.log("=== 💰 Adicionando linha de total ===");
    adicionarLinhaTotal(doc, reportData.valorTotal);
    
    // Adicionar seção de totais por categoria
    console.log("=== 🏦 Adicionando seção de totais ===");
    const finalY = (doc as any).lastAutoTable.finalY;
    const secaoTotaisY = finalY + 30;
    adicionarSecaoTotais(doc, secaoTotaisY, totaisPorCategoria);
    
    // Adicionar rodapé com observações e numeração
    console.log("=== 📄 Adicionando rodapé ===");
    const obsY = secaoTotaisY + 55;
    adicionarRodape(doc, obsY);
    
    // Generate the PDF as a Blob
    console.log("=== 💾 Gerando blob do PDF ===");
    const pdfBlob = doc.output('blob');
    
    // ADDED: Verificar se o blob foi criado corretamente
    if (!pdfBlob || pdfBlob.size === 0) {
      throw new Error("Falha ao gerar o blob do PDF - blob vazio ou nulo");
    }
    
    console.log("=== 📄 PDF generated successfully ===");
    console.log("PDF blob size:", pdfBlob.size, "bytes");
    console.log("PDF blob type:", pdfBlob.type);
    
    return pdfBlob;
    
  } catch (error) {
    console.error("❌ Erro ao gerar PDF:", error);
    console.error("Stack trace:", error.stack);
    throw new Error(`Falha na geração do PDF: ${error.message}`);
  }
};

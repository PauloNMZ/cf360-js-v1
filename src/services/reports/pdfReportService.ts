
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
  console.log("reportData received:", reportData);
  console.log("reportData.beneficiarios count:", reportData?.beneficiarios?.length || 0);
  
  // ENHANCED: Detailed reportData structure logging
  if (reportData) {
    console.log("reportData structure:", {
      empresaNome: reportData.empresaNome,
      empresaCnpj: reportData.empresaCnpj,
      valorTotal: reportData.valorTotal,
      totalRegistros: reportData.totalRegistros,
      dataGeracao: reportData.dataGeracao,
      dataPagamento: reportData.dataPagamento,
      referencia: reportData.referencia,
      beneficiarios: reportData.beneficiarios ? 'array present' : 'array missing',
      beneficiarios_count: reportData.beneficiarios?.length || 0
    });
  } else {
    console.error("❌ reportData is null or undefined");
    throw new Error("Dados do relatório não fornecidos");
  }
  
  try {
    // ENHANCED: Comprehensive input validation
    console.log("=== 🔍 Validating input data ===");
    
    if (!reportData) {
      throw new Error("Dados do relatório não fornecidos");
    }
    
    if (!reportData.beneficiarios) {
      throw new Error("Lista de beneficiários não fornecida");
    }
    
    if (!Array.isArray(reportData.beneficiarios)) {
      throw new Error("Lista de beneficiários deve ser um array");
    }
    
    if (reportData.beneficiarios.length === 0) {
      throw new Error("Lista de beneficiários está vazia");
    }

    console.log("✅ Basic validation passed");

    // ENHANCED: Validate each beneficiario
    console.log("=== 🔍 Validating each beneficiário ===");
    reportData.beneficiarios.forEach((beneficiario, index) => {
      console.log(`Validating beneficiário ${index}:`, {
        NOME: beneficiario.NOME,
        INSCRICAO: beneficiario.INSCRICAO,
        BANCO: beneficiario.BANCO,
        AGENCIA: beneficiario.AGENCIA,
        CONTA: beneficiario.CONTA,
        TIPO: beneficiario.TIPO,
        VALOR: beneficiario.VALOR,
        VALOR_type: typeof beneficiario.VALOR
      });
      
      if (!beneficiario.NOME) {
        console.error(`❌ Beneficiário ${index} - NOME missing:`, beneficiario);
        throw new Error(`Beneficiário ${index} - Nome é obrigatório`);
      }
      
      if (!beneficiario.INSCRICAO) {
        console.error(`❌ Beneficiário ${index} - INSCRICAO missing:`, beneficiario);
        throw new Error(`Beneficiário ${index} - CPF/CNPJ é obrigatório`);
      }
      
      if (!beneficiario.BANCO) {
        console.error(`❌ Beneficiário ${index} - BANCO missing:`, beneficiario);
        throw new Error(`Beneficiário ${index} - Banco é obrigatório`);
      }
      
      if (!beneficiario.AGENCIA) {
        console.error(`❌ Beneficiário ${index} - AGENCIA missing:`, beneficiario);
        throw new Error(`Beneficiário ${index} - Agência é obrigatória`);
      }
      
      if (!beneficiario.CONTA) {
        console.error(`❌ Beneficiário ${index} - CONTA missing:`, beneficiario);
        throw new Error(`Beneficiário ${index} - Conta é obrigatória`);
      }
      
      if (beneficiario.VALOR === undefined || beneficiario.VALOR === null) {
        console.error(`❌ Beneficiário ${index} - VALOR missing:`, beneficiario);
        throw new Error(`Beneficiário ${index} - Valor é obrigatório`);
      }
      
      const valor = Number(beneficiario.VALOR);
      if (isNaN(valor) || valor <= 0) {
        console.error(`❌ Beneficiário ${index} - VALOR invalid:`, beneficiario.VALOR);
        throw new Error(`Beneficiário ${index} - Valor deve ser um número maior que zero`);
      }
      
      console.log(`✅ Beneficiário ${index} validation passed`);
    });

    console.log("✅ All beneficiários validation passed");

    // Create a new PDF document
    console.log("=== 📄 Creating PDF document ===");
    const doc = new jsPDF();
    console.log("✅ PDF document created");
    
    console.log("=== 🔄 About to call ordenarFavorecidos ===");
    console.log("Passing sortType to ordenarFavorecidos:", sortType);
    
    // Ordenar favorecidos de acordo com o tipo escolhido
    console.log("=== 📊 Starting ordenarFavorecidos ===");
    const favorecidosOrdenados = ordenarFavorecidos(reportData.beneficiarios, sortType);
    console.log("✅ ordenarFavorecidos completed");
    console.log("favorecidosOrdenados count:", favorecidosOrdenados.length);
    
    // ENHANCED: Verify sorting worked correctly
    console.log("=== 📊 Verifying sorting results ===");
    favorecidosOrdenados.slice(0, 5).forEach((fav, idx) => {
      console.log(`Sorted position ${idx}: ${fav.NOME} - Banco: ${fav.BANCO} - Valor: ${fav.VALOR}`);
    });
    
    // Categorizar favorecidos por banco
    console.log("=== 🏦 Starting categorizarFavorecidosPorBanco ===");
    const totaisPorCategoria = categorizarFavorecidosPorBanco(favorecidosOrdenados);
    console.log("✅ categorization completed");
    console.log("Totais por categoria:", totaisPorCategoria);
    
    // Adicionar cabeçalho
    console.log("=== 📋 Adding header ===");
    adicionarCabecalho(doc, reportData);
    console.log("✅ Header added");
    
    // Preparar dados da tabela
    console.log("=== 📊 Preparing table data ===");
    const { tableColumns, tableData } = prepararDadosTabela(favorecidosOrdenados);
    console.log("✅ Table data prepared");
    console.log("Table columns count:", tableColumns.length);
    console.log("Table rows count:", tableData.length);
    
    // Adicionar tabela de beneficiários
    console.log("=== 📋 Adding beneficiaries table ===");
    adicionarTabelaBeneficiarios(doc, tableColumns, tableData);
    console.log("✅ Beneficiaries table added");
    
    // Adicionar linha de total
    console.log("=== 💰 Adding total line ===");
    adicionarLinhaTotal(doc, reportData.valorTotal);
    console.log("✅ Total line added");
    
    // Adicionar seção de totais por categoria
    console.log("=== 🏦 Adding totals section ===");
    const finalY = (doc as any).lastAutoTable.finalY;
    const secaoTotaisY = finalY + 30;
    adicionarSecaoTotais(doc, secaoTotaisY, totaisPorCategoria);
    console.log("✅ Totals section added");
    
    // Adicionar rodapé com observações e numeração
    console.log("=== 📄 Adding footer ===");
    const obsY = secaoTotaisY + 55;
    adicionarRodape(doc, obsY);
    console.log("✅ Footer added");
    
    // Generate the PDF as a Blob
    console.log("=== 💾 Generating PDF blob ===");
    
    try {
      const pdfBlob = doc.output('blob');
      console.log("✅ PDF blob generated successfully");
      
      // ENHANCED: Validate the generated blob
      if (!pdfBlob) {
        throw new Error("PDF blob is null");
      }
      
      if (pdfBlob.size === 0) {
        throw new Error("PDF blob is empty (size = 0)");
      }
      
      if (pdfBlob.type !== 'application/pdf') {
        console.warn("⚠️ PDF blob type is not application/pdf:", pdfBlob.type);
      }
      
      console.log("=== 📄 PDF generated successfully ===");
      console.log("PDF blob size:", pdfBlob.size, "bytes");
      console.log("PDF blob type:", pdfBlob.type);
      
      return pdfBlob;
      
    } catch (blobError) {
      console.error("❌ Error generating PDF blob:", blobError);
      throw new Error(`Falha ao gerar blob do PDF: ${blobError.message}`);
    }
    
  } catch (error) {
    console.error("❌ Error in generatePDFReport:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Stack trace:", error.stack);
    
    // Re-throw with more context
    throw new Error(`Falha na geração do PDF: ${error.message}`);
  }
};


import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { formatarValorCurrency } from '@/utils/formatting/currencyUtils';
import { RowData } from '@/types/importacao';

interface ReportGenerationOptions {
  companyName: string;
  remittanceReference: string;
  responsibleName: string;
  department: string;
}

/**
 * Generate an Excel remittance report from the selected rows
 */
export const generateRemittanceReport = async (
  selectedRows: RowData[],
  options: ReportGenerationOptions
) => {
  // Create report data with proper formatting
  const formattedData = selectedRows.map((row, index) => {
    // Format values for the report
    const valor = typeof row.VALOR === 'number' 
      ? row.VALOR 
      : parseFloat(row.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
    
    return {
      'Seq': index + 1,
      'Nome': row.NOME,
      'CPF/CNPJ': row.INSCRICAO,
      'Banco': row.BANCO.toString().padStart(3, '0'),
      'Agência': row.AGENCIA,
      'Conta': row.CONTA,
      'Tipo': row.TIPO,
      'Valor': formatarValorCurrency(valor)
    };
  });
  
  // Calculate total amount
  const totalAmount = selectedRows.reduce((sum, row) => {
    const valor = typeof row.VALOR === 'number' 
      ? row.VALOR 
      : parseFloat(row.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
    
    return sum + valor;
  }, 0);
  
  // Generate current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('pt-BR');
  const formattedTime = currentDate.toLocaleTimeString('pt-BR');
  
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(formattedData);
  
  // Set column widths for better readability
  const colWidths = [
    { wch: 5 },   // Seq
    { wch: 40 },  // Nome
    { wch: 18 },  // CPF/CNPJ
    { wch: 7 },   // Banco
    { wch: 10 },  // Agência
    { wch: 15 },  // Conta
    { wch: 10 },  // Tipo
    { wch: 15 },  // Valor
  ];
  ws['!cols'] = colWidths;
  
  // Add header information (before the data)
  XLSX.utils.sheet_add_aoa(ws, [
    [`Empresa: ${options.companyName}`],
    [`Data de Geração: ${formattedDate} ${formattedTime}`],
    [`Referência da Remessa: ${options.remittanceReference}`],
    [`Total de Registros: ${selectedRows.length}`],
    [`Valor Total: ${formatarValorCurrency(totalAmount)}`],
    [''],  // Empty row before the data
  ], { origin: 'A1' });
  
  // Adjust the origin of the data
  ws['!ref'] = XLSX.utils.encode_range(
    { r: 6, c: 0 },  // Starting after the header
    { r: 6 + formattedData.length, c: 7 }
  );
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, "Remessa Bancária");
  
  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const fileData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Return the file so it can be attached to an email or saved
  return {
    file: fileData,
    fileName: `Remessa_Bancaria_${formattedDate.replace(/\//g, '-')}.xlsx`,
    totalAmount,
    totalRegistros: selectedRows.length,
    formattedDate
  };
};

/**
 * Generate the standard email message for the financial director
 */
export const generateEmailMessage = (
  formattedDate: string,
  options: ReportGenerationOptions
) => {
  return `Prezado Diretor Financeiro,

Segue em anexo o relatório detalhado da remessa bancária gerada em ${formattedDate}, contendo os valores a serem creditados nas respectivas contas dos beneficiários. Solicitamos a sua análise e autorização para a liberação dos pagamentos.

Atenciosamente,
${options.responsibleName}
${options.department}`;
};

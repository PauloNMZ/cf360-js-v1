
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { formatarValorCurrency } from '@/utils/formatting/currencyUtils';
import { RowData } from '@/types/importacao';

interface ReportGenerationOptions {
  companyName: string;
  companyCnpj: string;
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
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Remessa Bancária');
  
  // Add header information with company name and CNPJ on separate lines
  worksheet.addRow([`Empresa: ${options.companyName}`]);
  worksheet.addRow([`CNPJ: ${options.companyCnpj}`]);
  worksheet.addRow([`Data de Geração: ${formattedDate} ${formattedTime}`]);
  worksheet.addRow([`Referência da Remessa: ${options.remittanceReference}`]);
  worksheet.addRow([`Total de Registros: ${selectedRows.length}`]);
  worksheet.addRow([`Valor Total: ${formatarValorCurrency(totalAmount)}`]);
  worksheet.addRow([]); // Empty row
  
  // Add headers
  const headers = Object.keys(formattedData[0]);
  worksheet.addRow(headers);
  
  // Add data
  formattedData.forEach(row => {
    worksheet.addRow(Object.values(row));
  });
  
  // Set column widths
  worksheet.columns.forEach((column, index) => {
    const widths = [5, 40, 18, 7, 10, 15, 10, 15];
    column.width = widths[index];
  });
  
  // Style the header row (now at row 8 instead of 7)
  const headerRow = worksheet.getRow(8);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };
  
  // Generate Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  const fileData = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
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

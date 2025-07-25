
import { useState } from 'react';
import { EmailFormValues } from '@/types/importacao';
import { sendEmail, logEmailActivity, getCurrentUserEmail } from '@/services/emailService';
import { generateRemittanceReport } from '@/services/reports/remittanceReportService';
import { formatarValorCurrency } from '@/utils/formatting/currencyUtils';
import { useNotificationModalContext } from '@/components/ui/NotificationModalProvider';

export const useEmailConfigDialog = () => {
  const [showEmailConfigDialog, setShowEmailConfigDialog] = useState(false);
  const [reportDate, setReportDate] = useState('');
  const [defaultEmailMessage, setDefaultEmailMessage] = useState('');
  const { showSuccess, showError, showInfo } = useNotificationModalContext();
  
  const createDefaultEmailMessage = (formattedDate: string, totalValue: number) => {
    const formattedDateForEmail = formattedDate.split(' ')[0]; // Just the date part
    const formattedTotalValue = formatarValorCurrency(totalValue);
    const emailMsg = `Prezado Diretor Financeiro,

Segue em anexo o relatório detalhado da remessa bancária gerada em ${formattedDateForEmail}, contendo os valores a serem creditados nas respectivas contas dos beneficiários no valor total de ${formattedTotalValue}. Solicitamos a sua análise e autorização para a liberação dos pagamentos.

Atenciosamente,
[Nome do responsável]
[Departamento]`;

    setDefaultEmailMessage(emailMsg);
    return formattedDateForEmail;
  };
  
  const handleSendEmailReport = (
    setShowPDFPreviewDialog: (show: boolean) => void,
    convenentes: Array<any>,
    selectedConvenenteId: any
  ) => {
    // Close PDF dialog
    setShowPDFPreviewDialog(false);
    
    // Get selected convenente name for company name in email form
    let companyName = "";
    if (selectedConvenenteId) {
      const selectedConvenente = convenentes.find(
        c => c.id === selectedConvenenteId
      );
      if (selectedConvenente) {
        companyName = selectedConvenente.razaoSocial;
      }
    }
    
    // Open email config dialog
    setShowEmailConfigDialog(true);
    
    // Update default company name in the email form
    if (companyName) {
      // This will be picked up by the EmailConfigDialog component
      localStorage.setItem('tempEmailCompanyName', companyName);
    }
  };
  
  const handleEmailSubmit = async (
    emailFormValues: EmailFormValues,
    reportData: any,
    reportAttachment: Blob | null,
    reportFileName: string,
    originalPaymentDate?: string // Add optional parameter for original payment date
  ) => {
    try {
      // Show sending email notification
      showInfo("Enviando...", "Enviando relatório por e-mail...");
      
      // Prepare email data - using Excel report as attachment
      let emailAttachment = reportAttachment;
      let attachmentFileName = reportFileName;
      
      // If there's no Excel report (unlikely), create it now
      if (!emailAttachment && reportData) {
        // Use the original payment date if provided, otherwise fallback to reportData
        const paymentDateToUse = originalPaymentDate || reportData.dataPagamento || "Não definida";
        
        const reportOptions = {
          companyName: emailFormValues.companyName,
          companyCnpj: emailFormValues.companyName.includes('CNPJ:') 
            ? emailFormValues.companyName.split('CNPJ: ')[1] || ""
            : "",
          remittanceReference: emailFormValues.remittanceReference,
          responsibleName: emailFormValues.senderName,
          department: emailFormValues.senderDepartment,
          paymentDate: paymentDateToUse // Use the original payment date
        };
        
        const excelReport = await generateRemittanceReport(reportData.beneficiarios, reportOptions);
        emailAttachment = excelReport.file;
        attachmentFileName = excelReport.fileName;
      }
      
      if (!emailAttachment) {
        throw new Error("Falha ao gerar anexo do e-mail");
      }
      
      // Garantir que o email do remetente seja sempre o do usuário logado
      const userEmail = getCurrentUserEmail();
      
      const emailData = {
        recipientEmail: emailFormValues.recipientEmail,
        senderName: emailFormValues.senderName,
        senderEmail: userEmail, // Sempre usar o email do usuário logado
        senderDepartment: emailFormValues.senderDepartment,
        subject: `Relatório de Remessa Bancária - ${emailFormValues.remittanceReference}`,
        message: emailFormValues.message,
        attachmentFile: emailAttachment,
        attachmentFileName: attachmentFileName
      };
      
      // Send the email
      const response = await sendEmail(emailData);
      
      // Log email activity for audit
      logEmailActivity(emailData, response);
      
      // Close the email dialog
      setShowEmailConfigDialog(false);
      
      if (response.success) {
        showSuccess("Sucesso!", `E-mail enviado para ${emailFormValues.recipientEmail}`);
      } else {
        showError("Erro!", response.error || "Ocorreu um erro ao enviar o relatório.");
      }
      
    } catch (error) {
      console.error("Erro ao enviar relatório por e-mail:", error);
      showError("Erro!", "Erro ao enviar relatório por e-mail.");
    }
  };
  
  return {
    showEmailConfigDialog,
    setShowEmailConfigDialog,
    reportDate,
    setReportDate,
    defaultEmailMessage,
    setDefaultEmailMessage,
    createDefaultEmailMessage,
    handleSendEmailReport,
    handleEmailSubmit
  };
};

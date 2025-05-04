
import { toast } from "@/components/ui/sonner";
import { saveAs } from 'file-saver';

interface EmailData {
  recipientEmail: string;
  senderName: string;
  senderEmail: string;
  senderDepartment: string;
  subject: string;
  message: string;
  attachmentFile: Blob;
  attachmentFileName: string;
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Mock email service - in production, this would integrate with a real email sending API
 */
export const sendEmail = async (emailData: EmailData): Promise<EmailResponse> => {
  try {
    console.log("Enviando email para:", emailData.recipientEmail);
    console.log("De:", emailData.senderName, "<" + emailData.senderEmail + ">");
    console.log("Assunto:", emailData.subject);
    console.log("Anexo:", emailData.attachmentFileName, `(${(emailData.attachmentFile.size / 1024).toFixed(2)} KB)`);
    
    // In a real application, we would send the email to a server endpoint
    // For demonstration purposes, we'll simulate a successful API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Save the attachment for demonstration purposes
    saveAs(emailData.attachmentFile, emailData.attachmentFileName);
    
    // In a real implementation this would actually send the email
    // instead of just saving the attachment
    
    console.log("Email enviado com sucesso (simulado)");
    
    return {
      success: true,
      messageId: `mock-email-${Date.now()}`
    };
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido ao enviar e-mail"
    };
  }
};

/**
 * Log email sending activity for audit purposes
 */
export const logEmailActivity = (emailData: EmailData, response: EmailResponse) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    recipient: emailData.recipientEmail,
    sender: emailData.senderName,
    senderEmail: emailData.senderEmail,
    subject: emailData.subject,
    attachmentName: emailData.attachmentFileName,
    success: response.success,
    messageId: response.messageId || null,
    error: response.error || null
  };
  
  // Em um aplicativo real, isso seria armazenado em um banco de dados
  console.log("Registro de atividade de e-mail:", logEntry);
  
  // Para fins de demonstração, armazenamos no localStorage
  const existingLogs = JSON.parse(localStorage.getItem('emailActivityLogs') || '[]');
  existingLogs.push(logEntry);
  localStorage.setItem('emailActivityLogs', JSON.stringify(existingLogs));
  
  return logEntry;
};

/**
 * Função para obter o email do usuário logado
 * Em um sistema real, isso viria do contexto de autenticação
 */
export const getCurrentUserEmail = (): string => {
  // Tentar obter o email do usuário do contexto de autenticação
  try {
    // Em uma implementação real, isso viria do contexto de autenticação
    const authData = localStorage.getItem('authUser');
    if (authData) {
      const userData = JSON.parse(authData);
      if (userData && userData.email) {
        return userData.email;
      }
    }
    
    // Se não encontrou na auth, tentar diretamente do localStorage
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      return userEmail;
    }
  } catch (error) {
    console.error("Erro ao obter email do usuário:", error);
  }
  
  // Se não conseguir obter, retornar um email padrão
  return "usuario@empresa.com";
};

/**
 * Função para formatar o email do usuário para uso como remetente
 */
export const formatUserEmailAsSender = (name: string): string => {
  const email = getCurrentUserEmail();
  return email.toLowerCase();
};

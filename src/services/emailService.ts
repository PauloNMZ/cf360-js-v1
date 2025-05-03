
import { toast } from "@/components/ui/sonner";
import { saveAs } from 'file-saver';
import { useAuth } from '@/hooks/use-auth'; // Esta importação será usada apenas para exemplificar o tipo

interface EmailData {
  recipientEmail: string;
  senderName: string;
  senderEmail: string; // Adicionado campo para email do remetente
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
  // Log email data for debugging/demo purposes
  console.log("Sending email:", {
    to: emailData.recipientEmail,
    from: `${emailData.senderName} <${emailData.senderEmail}>`,
    subject: emailData.subject,
    messagePreview: emailData.message.substring(0, 100) + '...',
    attachmentName: emailData.attachmentFileName,
    attachmentSize: `${(emailData.attachmentFile.size / 1024).toFixed(2)} KB`
  });
  
  try {
    // In a real application, this would be an API call to an email service
    // For now, we'll simulate a successful email send after a short delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // For demonstration purposes, save the file locally
    saveAs(emailData.attachmentFile, emailData.attachmentFileName);
    
    // Log the success
    console.log("Email sent successfully (simulated)");
    
    // Return a successful response
    return {
      success: true,
      messageId: `mock-email-${Date.now()}`
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
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
  
  // In a real application, this would be stored in a database
  // For now, we'll just log to console
  console.log("Email Activity Log:", logEntry);
  
  // In a production environment, you would store this in a database table
  // e.g., supabase.from('email_logs').insert(logEntry)
  
  // For demonstration purposes, store in localStorage
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
  // Em uma implementação real, isso viria do contexto de autenticação
  // Por exemplo: return useAuth().user?.email || '';
  
  // Recuperar do localStorage (simulando um usuário logado)
  const userEmail = localStorage.getItem('userEmail') || '';
  
  // Se não houver email salvo, usar um email padrão
  return userEmail || 'usuario@empresa.com';
};

/**
 * Função para formatar o email do usuário para uso como remetente
 */
export const formatUserEmailAsSender = (name: string): string => {
  const email = getCurrentUserEmail();
  return email.toLowerCase();
};

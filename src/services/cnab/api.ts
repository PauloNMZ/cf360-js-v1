
import { CNABJsonOutput, APIResponse } from './types';
import { generateRandomId } from './utils';

/**
 * Send converted JSON to API
 */
export const sendToAPI = async (jsonData: CNABJsonOutput): Promise<APIResponse> => {
  // This is a placeholder for the actual API call
  // In a real implementation, you would replace this with an actual API call
  
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, we'll randomly succeed or fail
      const success = Math.random() > 0.2;
      
      if (success) {
        resolve({
          success: true,
          message: 'Dados recebidos e processados com sucesso',
          transactionId: generateRandomId(),
          timestamp: new Date().toISOString()
        });
      } else {
        reject(new Error('Falha na comunicação com o servidor. Tente novamente.'));
      }
    }, 1500);
  });
};

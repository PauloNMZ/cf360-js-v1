import { ParsedCNABData } from './types';

/**
 * Parse the CNAB file content
 */
export const parseCNABFile = async (file: File): Promise<ParsedCNABData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          reject(new Error('Falha ao ler o arquivo.'));
          return;
        }
        
        const content = event.target.result as string;
        const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
        
        // Basic validation - CNAB file should have header, details, and trailer
        if (lines.length < 3) {
          reject(new Error('Arquivo CNAB inválido. Número insuficiente de linhas.'));
          return;
        }
        
        // Check if it's a CNAB240 file (each line should be 240 characters)
        const isCNAB240 = lines.every(line => line.length === 240);
        if (!isCNAB240) {
          reject(new Error('Arquivo não está no formato CNAB240. Cada linha deve ter exatamente 240 caracteres.'));
          return;
        }
        
        // Parse CNAB structure
        const headerArquivo = lines[0];
        const trailerArquivo = lines[lines.length - 1];
        
        // Extract header information
        const banco = headerArquivo.substring(0, 3);
        const lote = headerArquivo.substring(3, 7);
        const tipo = headerArquivo.substring(7, 8);
        
        // Process segments
        const lotes = [];
        let currentLote: any = null;
        let segmentos: any[] = [];
        
        for (let i = 1; i < lines.length - 1; i++) {
          const line = lines[i];
          
          // Check if line is a lot header
          if (line.substring(7, 8) === '1') {
            // If we already have a lot, add it to lots array
            if (currentLote) {
              currentLote.segmentos = segmentos;
              lotes.push(currentLote);
            }
            
            // Start a new lot
            currentLote = {
              header: line,
              segmentos: []
            };
            segmentos = [];
          } 
          // Check if line is a lot trailer
          else if (line.substring(7, 8) === '5') {
            if (currentLote) {
              currentLote.trailer = line;
              currentLote.segmentos = segmentos;
              lotes.push(currentLote);
              currentLote = null;
              segmentos = [];
            }
          } 
          // Otherwise it's a segment
          else {
            segmentos.push(line);
          }
        }
        
        // Add the last lot if there is one
        if (currentLote) {
          currentLote.segmentos = segmentos;
          lotes.push(currentLote);
        }
        
        const result: ParsedCNABData = {
          headerArquivo,
          lotes,
          trailerArquivo,
          banco,
          tipoArquivo: 'CNAB240'
        };
        
        resolve(result);
      } catch (error) {
        console.error('Erro ao processar arquivo CNAB:', error);
        reject(new Error('Erro ao processar o arquivo CNAB.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler o arquivo.'));
    };
    
    reader.readAsText(file);
  });
};

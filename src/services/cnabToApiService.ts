
import { toast } from '@/components/ui/sonner';

/**
 * Parse the CNAB file content
 */
export const parseCNABFile = async (file: File): Promise<any> => {
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
        
        const result = {
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

// Define interfaces for better type safety
interface PagamentoData {
  tipoRegistro: string;
  segmento: string;
  tipoMovimento: string;
  codMovimento: string;
  camara: string;
  bancoFavorecido: string;
  agenciaFavorecido: string;
  digitoAgencia: string;
  contaFavorecido: string;
  digitoConta: string;
  nomeFavorecido: string;
  numeroDocumento: string;
  dataPagamento: string;
  moeda: string;
  valorPagamento: number;
  nossoNumero: string;
  dataEfetiva: string;
  valorEfetivo: number;
  inscricaoFavorecido?: {
    tipo: string;
    numero: string;
  };
  enderecoFavorecido?: {
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    cep: string;
    estado: string;
  };
}

/**
 * Convert CNAB data to JSON for API
 */
export const convertCNABToJSON = (cnabData: any): any => {
  try {
    // Extract company information from header
    const headerInfo = {
      banco: cnabData.banco,
      tipoArquivo: cnabData.tipoArquivo,
      dataGeracao: extractDate(cnabData.headerArquivo, 144, 152),
      horaGeracao: extractTime(cnabData.headerArquivo, 152, 158),
      sequencialArquivo: cnabData.headerArquivo.substring(158, 163),
    };
    
    // Process payment details
    const pagamentos: PagamentoData[] = [];
    
    // Loop through each batch
    for (const lote of cnabData.lotes) {
      // Extract payments from segments
      for (let i = 0; i < lote.segmentos.length; i += 2) {
        // Segmento A contains payment information
        const segmentoA = lote.segmentos[i];
        
        // Segmento B contains recipient details (if available)
        const segmentoB = i + 1 < lote.segmentos.length ? lote.segmentos[i + 1] : null;
        
        if (segmentoA && segmentoA.substring(13, 14) === 'A') {
          const pagamento: PagamentoData = {
            tipoRegistro: segmentoA.substring(7, 8),
            segmento: segmentoA.substring(13, 14),
            tipoMovimento: segmentoA.substring(14, 15),
            codMovimento: segmentoA.substring(15, 17),
            camara: segmentoA.substring(17, 20),
            bancoFavorecido: segmentoA.substring(20, 23),
            agenciaFavorecido: segmentoA.substring(23, 28).trim(),
            digitoAgencia: segmentoA.substring(28, 29),
            contaFavorecido: segmentoA.substring(29, 41).trim(),
            digitoConta: segmentoA.substring(41, 42),
            nomeFavorecido: segmentoA.substring(43, 73).trim(),
            numeroDocumento: segmentoA.substring(73, 93).trim(),
            dataPagamento: formatDate(segmentoA.substring(93, 101)),
            moeda: segmentoA.substring(101, 104),
            valorPagamento: parseFloat(segmentoA.substring(119, 134)) / 100,
            nossoNumero: segmentoA.substring(134, 154).trim(),
            dataEfetiva: formatDate(segmentoA.substring(154, 162)),
            valorEfetivo: parseFloat(segmentoA.substring(162, 177)) / 100,
          };
          
          // Add recipient details if available
          if (segmentoB && segmentoB.substring(13, 14) === 'B') {
            pagamento.inscricaoFavorecido = {
              tipo: segmentoB.substring(17, 18),
              numero: segmentoB.substring(18, 32).trim()
            };
            pagamento.enderecoFavorecido = {
              logradouro: segmentoB.substring(32, 62).trim(),
              numero: segmentoB.substring(62, 67).trim(),
              complemento: segmentoB.substring(67, 82).trim(),
              bairro: segmentoB.substring(82, 97).trim(),
              cidade: segmentoB.substring(97, 117).trim(),
              cep: segmentoB.substring(117, 125).trim(),
              estado: segmentoB.substring(125, 127)
            };
          }
          
          pagamentos.push(pagamento);
        }
      }
    }
    
    // Build final JSON structure
    return {
      header: headerInfo,
      pagamentos,
      totalPagamentos: pagamentos.length,
      valorTotal: pagamentos.reduce((sum, p) => sum + p.valorPagamento, 0)
    };
  } catch (error) {
    console.error('Erro ao converter CNAB para JSON:', error);
    throw new Error('Erro ao converter os dados CNAB para formato JSON.');
  }
};

/**
 * Send converted JSON to API
 */
export const sendToAPI = async (jsonData: any): Promise<any> => {
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

// Helper functions
function extractDate(line: string, start: number, end: number): string {
  const dateStr = line.substring(start, end);
  const day = dateStr.substring(0, 2);
  const month = dateStr.substring(2, 4);
  const year = dateStr.substring(4);
  return `${day}/${month}/${year}`;
}

function extractTime(line: string, start: number, end: number): string {
  const timeStr = line.substring(start, end);
  const hour = timeStr.substring(0, 2);
  const minute = timeStr.substring(2, 4);
  const second = timeStr.substring(4);
  return `${hour}:${minute}:${second}`;
}

function formatDate(dateStr: string): string {
  if (!dateStr || dateStr.trim() === '00000000') return '';
  const day = dateStr.substring(0, 2);
  const month = dateStr.substring(2, 4);
  const year = dateStr.substring(4);
  return `${day}/${month}/${year}`;
}

function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

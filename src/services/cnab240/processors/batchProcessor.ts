
import { Favorecido } from '@/types/cnab240';
import { filtrarFavorecidosPorTipo, TIPO_LANCAMENTO } from './tipoFavorecidoFilter';
import { processarLote } from './loteGenerator';

// Re-export the filter functions and constants for backward compatibility
export { filtrarFavorecidosPorTipo, TIPO_LANCAMENTO } from './tipoFavorecidoFilter';
export { processarLote } from './loteGenerator';

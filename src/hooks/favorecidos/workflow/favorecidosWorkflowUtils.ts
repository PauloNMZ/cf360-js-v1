
import { FavorecidoData } from '@/types/favorecido';

export const getStepTitle = (step: number): string => {
  switch (step) {
    case 1:
      return "Selecionar Convenente";
    case 2:
      return "Data de Pagamento";
    case 3:
      return "Revisar Dados";
    case 4:
      return "Finalizar";
    default:
      return "Passo";
  }
};

export const getTotalSteps = (): number => {
  return 4;
};

export const getDisplayStepNumber = (currentStep: number): number => {
  return currentStep;
};

export const mapFavorecidoToRowData = (favorecido: FavorecidoData & { id: string }, index: number) => {
  return {
    id: index, // Convert string id to numeric index for RowData compatibility
    nome: favorecido.nome,
    inscricao: favorecido.inscricao,
    tipoInscricao: favorecido.tipoInscricao,
    banco: favorecido.banco,
    agencia: favorecido.agencia,
    conta: favorecido.conta,
    tipoConta: favorecido.tipoConta,
    valor: (favorecido as any).valor || 0, // Add valor with type assertion
    index,
    originalId: favorecido.id // Keep original string id for reference
  };
};

export const validateFavorecidos = (favorecidos: any[]) => {
  return favorecidos.every(fav => 
    fav.nome && 
    fav.inscricao && 
    fav.banco && 
    fav.agencia && 
    fav.conta
  );
};

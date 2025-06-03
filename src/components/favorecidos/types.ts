
import { FavorecidoData } from "@/types/favorecido";

export interface FavorecidosTableProps {
  favorecidos: Array<FavorecidoData & {
    id: string;
  }>;
  onEdit: (favorecido: FavorecidoData & {
    id: string;
  }) => void;
  onDelete: (id: string) => void;
  onSelectFavorecido?: (favorecido: FavorecidoData & {
    id: string;
  }) => void;
  showActions?: boolean;
  selectedFavorecidos?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  itemsPerPage?: number;
  hidePixColumn?: boolean;
  hideBankColumn?: boolean;
  hideTipoColumn?: boolean;
}

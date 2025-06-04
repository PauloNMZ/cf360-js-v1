
export enum ReportSortType {
  BY_NAME = 'BY_NAME',
  BY_BANK_NAME = 'BY_BANK_NAME',
  BY_BANK_VALUE = 'BY_BANK_VALUE',
  BY_VALUE_DESC = 'BY_VALUE_DESC'
}

export interface ReportSortOption {
  value: ReportSortType;
  label: string;
  description: string;
}

export const REPORT_SORT_OPTIONS: ReportSortOption[] = [
  {
    value: ReportSortType.BY_NAME,
    label: 'Por Nome do Favorecido',
    description: 'Ordena alfabeticamente pelo nome do favorecido'
  },
  {
    value: ReportSortType.BY_BANK_NAME,
    label: 'Por Banco + Nome',
    description: 'Ordena por banco, depois por nome do favorecido'
  },
  {
    value: ReportSortType.BY_BANK_VALUE,
    label: 'Por Banco + Valor',
    description: 'Ordena por banco, depois por valor (maior para menor)'
  },
  {
    value: ReportSortType.BY_VALUE_DESC,
    label: 'Por Valor (Maior → Menor)',
    description: 'Ordena do maior para o menor valor'
  }
];

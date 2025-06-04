
import { useState, useMemo } from 'react';
import { RowData } from '@/types/importacao';

export const useImportacaoSearch = (tableData: RowData[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return tableData;
    }

    const term = searchTerm.toLowerCase().trim();
    return tableData.filter(row => {
      const nome = row.NOME?.toLowerCase() || '';
      const inscricao = row.INSCRICAO?.toString().toLowerCase() || '';
      return nome.includes(term) || inscricao.includes(term);
    });
  }, [tableData, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return {
    searchTerm,
    filteredData,
    handleSearchChange,
    hasResults: filteredData.length > 0
  };
};

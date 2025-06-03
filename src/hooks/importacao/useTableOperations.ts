
import { useState, useEffect } from 'react';
import { RowData } from '@/types/importacao';
import { useNotificationModalContext } from '@/components/ui/NotificationModalProvider';

export const useTableOperations = (initialData: RowData[] = []) => {
  const [tableData, setTableData] = useState<RowData[]>(initialData);
  const [selectAll, setSelectAll] = useState(false);
  const [total, setTotal] = useState<number>(0);
  const { showSuccess } = useNotificationModalContext();

  // Sync tableData when initialData changes
  useEffect(() => {
    if (initialData.length > 0) {
      setTableData(initialData);
    }
  }, [initialData]);

  // Calculate total of "VALOR" column for selected rows
  useEffect(() => {
    if (tableData.length > 0) {
      const selectedRows = tableData.filter(row => row.selected);
      let sum = 0;
      
      for (const row of selectedRows) {
        // Convert string value to number, handle currency format
        if (row.VALOR) {
          const valueStr = row.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.');
          const value = parseFloat(valueStr);
          if (!isNaN(value)) {
            sum += value;
          }
        }
      }
      
      setTotal(sum);
    } else {
      setTotal(0);
    }
  }, [tableData]);

  // Handle selection of all rows
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setTableData(prevData => 
      prevData.map(row => ({ ...row, selected: checked }))
    );
  };

  // Handle selection of a single row
  const handleSelectRow = (id: number, checked: boolean) => {
    setTableData(prevData => {
      const newData = prevData.map(row => 
        row.id === id ? { ...row, selected: checked } : row
      );
      
      // Check if all rows are now selected
      const allSelected = newData.every(row => row.selected);
      setSelectAll(allSelected);
      
      return newData;
    });
  };

  // Handle deletion of a row
  const handleDeleteRow = (id: number) => {
    setTableData(prevData => {
      const newData = prevData.filter(row => row.id !== id);
      return newData;
    });
    
    showSuccess("Sucesso!", "Linha removida com sucesso!");
  };

  const getSelectedRows = () => tableData.filter(row => row.selected);

  return {
    tableData,
    setTableData,
    selectAll,
    total,
    handleSelectAll,
    handleSelectRow,
    handleDeleteRow,
    getSelectedRows
  };
};

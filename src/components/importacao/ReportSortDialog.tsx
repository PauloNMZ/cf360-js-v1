
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ReportSortType, REPORT_SORT_OPTIONS } from '@/types/reportSorting';

interface ReportSortDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (sortType: ReportSortType) => void;
}

export const ReportSortDialog: React.FC<ReportSortDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm
}) => {
  const [selectedSortType, setSelectedSortType] = React.useState<ReportSortType>(ReportSortType.BY_NAME);

  console.log("=== 📋 ReportSortDialog RENDER ===");
  console.log("isOpen:", isOpen);
  console.log("selectedSortType:", selectedSortType);

  const handleConfirm = () => {
    console.log("=== 🎯 ReportSortDialog - CONFIRM CLICKED ===");
    console.log("selectedSortType:", selectedSortType);
    console.log("selectedSortType type:", typeof selectedSortType);
    console.log("About to call onConfirm with:", selectedSortType);
    
    onConfirm(selectedSortType);
    console.log("onConfirm called successfully");
  };

  const handleCancel = () => {
    console.log("=== ❌ ReportSortDialog - CANCEL CLICKED ===");
    onOpenChange(false);
  };

  const handleSortTypeChange = (value: string) => {
    console.log("=== 🔄 ReportSortDialog - Sort Type Changed ===");
    console.log("new value:", value);
    console.log("new value type:", typeof value);
    setSelectedSortType(value as ReportSortType);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Escolher Ordenação do Relatório</DialogTitle>
          <DialogDescription>
            Selecione como deseja ordenar os favorecidos no relatório.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup 
            value={selectedSortType} 
            onValueChange={handleSortTypeChange}
            className="space-y-3"
          >
            {REPORT_SORT_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-start space-x-3">
                <RadioGroupItem 
                  value={option.value} 
                  id={option.value}
                  className="mt-1"
                />
                <div className="space-y-1 flex-1">
                  <Label 
                    htmlFor={option.value}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            Gerar Relatório
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileText, ArrowUpDown } from "lucide-react";
import { ReportSortType, REPORT_SORT_OPTIONS } from "@/types/reportSorting";

interface ReportSortDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (sortType: ReportSortType) => void;
  defaultSortType?: ReportSortType;
}

export function ReportSortDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  defaultSortType = ReportSortType.BY_NAME
}: ReportSortDialogProps) {
  const [selectedSort, setSelectedSort] = useState<ReportSortType>(defaultSortType);

  const handleConfirm = () => {
    console.log("=== DEBUG ReportSortDialog - handleConfirm ===");
    console.log("selectedSort:", selectedSort);
    console.log("Calling onConfirm with sortType:", selectedSort);
    onConfirm(selectedSort);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5" />
            Ordenação do Relatório
          </DialogTitle>
          <DialogDescription>
            Escolha como deseja ordenar os favorecidos no relatório PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup
            value={selectedSort}
            onValueChange={(value) => {
              console.log("=== DEBUG ReportSortDialog - onValueChange ===");
              console.log("New value selected:", value);
              setSelectedSort(value as ReportSortType);
            }}
            className="space-y-4"
          >
            {REPORT_SORT_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-start space-x-3">
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor={option.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Gerar Relatório
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

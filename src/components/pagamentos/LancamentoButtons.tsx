
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  User,
  Users,
  FileSpreadsheet,
  FileCode,
} from "lucide-react";

interface LancamentoButtonsProps {
  activeLancamentoTab: 'favorecidos' | 'grupos' | 'planilha' | 'cnab' | null;
  setActiveLancamentoTab: (tab: 'favorecidos' | 'grupos' | 'planilha' | 'cnab') => void;
}

const LancamentoButtons: React.FC<LancamentoButtonsProps> = ({
  activeLancamentoTab,
  setActiveLancamentoTab
}) => {
  return (
    <div className="flex space-x-4">
      <Button
        variant="outline"
        onClick={() => setActiveLancamentoTab('favorecidos')}
        className={cn(
          "flex items-center gap-2",
          activeLancamentoTab === 'favorecidos' 
            ? "bg-[#ECF2FF] text-primary dark:bg-secondary dark:text-primary shadow border border-[#3986FF] hover:bg-[#ECF2FF] dark:hover:bg-secondary"
            : "hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <User className="mr-2 h-4 w-4" /> Por Favorecidos
      </Button>
      <Button
        variant="outline"
        onClick={() => setActiveLancamentoTab('grupos')}
        className={cn(
          "flex items-center gap-2",
          activeLancamentoTab === 'grupos' 
            ? "bg-[#ECF2FF] text-primary dark:bg-secondary dark:text-primary shadow border border-[#3986FF] hover:bg-[#ECF2FF] dark:hover:bg-secondary"
            : "hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Users className="mr-2 h-4 w-4" /> Por Grupos
      </Button>
      <Button
        variant="outline"
        onClick={() => setActiveLancamentoTab('planilha')}
        className={cn(
          "flex items-center gap-2",
          activeLancamentoTab === 'planilha' 
            ? "bg-[#ECF2FF] text-primary dark:bg-secondary dark:text-primary shadow border border-[#3986FF] hover:bg-[#ECF2FF] dark:hover:bg-secondary"
            : "hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <FileSpreadsheet className="mr-2 h-4 w-4" /> Importar Planilha
      </Button>
      <Button
        variant="outline"
        onClick={() => setActiveLancamentoTab('cnab')}
        className={cn(
          "flex items-center gap-2",
          activeLancamentoTab === 'cnab' 
            ? "bg-[#ECF2FF] text-primary dark:bg-secondary dark:text-primary shadow border border-[#3986FF] hover:bg-[#ECF2FF] dark:hover:bg-secondary"
            : "hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <FileCode className="mr-2 h-4 w-4" /> Importar CNAB
      </Button>
    </div>
  );
};

export default LancamentoButtons;


import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import {
  User,
  Users,
  FileSpreadsheet,
} from "lucide-react";

interface PixButtonsProps {
  activePixTab: 'favorecidos' | 'planilha' | null;
  setActivePixTab: (tab: 'favorecidos' | 'planilha') => void;
}

const PixButtons: React.FC<PixButtonsProps> = ({
  activePixTab,
  setActivePixTab
}) => {
  const navigate = useNavigate();

  const handleGruposClick = () => {
    navigate('/grupos');
  };

  return (
    <div className="flex space-x-4">
      <Button
        variant="outline"
        onClick={() => setActivePixTab('favorecidos')}
        className={cn(
          "flex items-center gap-2",
          activePixTab === 'favorecidos' 
            ? "bg-[#ECF2FF] text-primary dark:bg-secondary dark:text-primary shadow border border-[#3986FF] hover:bg-[#ECF2FF] dark:hover:bg-secondary"
            : "hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <User className="mr-2 h-4 w-4" /> Por Favorecidos
      </Button>
      <Button
        variant="outline"
        onClick={handleGruposClick}
        className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground"
      >
        <Users className="mr-2 h-4 w-4" /> Por Grupos
      </Button>
      <Button
        variant="outline"
        onClick={() => setActivePixTab('planilha')}
        className={cn(
          "flex items-center gap-2",
          activePixTab === 'planilha' 
            ? "bg-[#ECF2FF] text-primary dark:bg-secondary dark:text-primary shadow border border-[#3986FF] hover:bg-[#ECF2FF] dark:hover:bg-secondary"
            : "hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <FileSpreadsheet className="mr-2 h-4 w-4" /> Importar Planilha
      </Button>
    </div>
  );
};

export default PixButtons;

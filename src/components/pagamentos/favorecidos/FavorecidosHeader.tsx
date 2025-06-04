
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FavorecidosHeaderProps {
  onCreateNew: () => void;
}

const FavorecidosHeader: React.FC<FavorecidosHeaderProps> = ({ onCreateNew }) => {
  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-muted/30 rounded-lg border">
      <div>
        <h2 className="text-xl font-semibold">Gerenciar Favorecidos</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Selecione favorecidos para processar pagamentos ou gerar relatórios
        </p>
      </div>
      <Button onClick={onCreateNew} className="flex items-center gap-2">
        <Plus size={16} />
        Novo Favorecido
      </Button>
    </div>
  );
};

export default FavorecidosHeader;

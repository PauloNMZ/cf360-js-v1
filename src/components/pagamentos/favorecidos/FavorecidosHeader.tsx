
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FavorecidosHeaderProps {
  onCreateNew: () => void;
}

const FavorecidosHeader: React.FC<FavorecidosHeaderProps> = ({ onCreateNew }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Favorecidos</h2>
      <Button onClick={onCreateNew} className="flex items-center gap-2">
        <Plus size={16} />
        Novo Favorecido
      </Button>
    </div>
  );
};

export default FavorecidosHeader;

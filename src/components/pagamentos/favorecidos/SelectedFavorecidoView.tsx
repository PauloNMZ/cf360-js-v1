
import React from 'react';
import { Button } from "@/components/ui/button";

interface SelectedFavorecidoViewProps {
  selectedFavorecido: any;
  onCancel: () => void;
}

const SelectedFavorecidoView: React.FC<SelectedFavorecidoViewProps> = ({
  selectedFavorecido,
  onCancel
}) => {
  return (
    <div className="p-4 border rounded-md bg-background">
      <h3 className="text-lg font-semibold mb-4">Favorecido Selecionado</h3>
      <p><strong>Nome:</strong> {selectedFavorecido?.nome}</p>
      <p><strong>Inscrição:</strong> {selectedFavorecido?.inscricao}</p>
      <div className="mt-4">
        <Button variant="outline" onClick={onCancel}>
          Voltar à Lista
        </Button>
      </div>
    </div>
  );
};

export default SelectedFavorecidoView;

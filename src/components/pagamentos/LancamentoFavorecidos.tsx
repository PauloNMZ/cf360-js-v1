import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, FileOutput } from "lucide-react";
import FavorecidoFormModal from '@/components/favorecidos/FavorecidoFormModal';
import DeleteFavorecidoDialog from '@/components/favorecidos/DeleteFavorecidoDialog';
import { useFavorecidos } from '@/hooks/favorecidos/useFavorecidos';
import FavorecidoSearchBar, { EmptyState } from '@/components/favorecidos/FavorecidoSearchBar';
import FavorecidosTable from '@/components/favorecidos/FavorecidosTable';
import { Loader2 } from 'lucide-react';
import SuccessModal from '@/components/ui/SuccessModal';
import { toast } from "sonner";

interface LancamentoFavorecidosProps {
  hidePixColumn?: boolean;
  hideBankColumn?: boolean;
  hideTipoColumn?: boolean;
}

const LancamentoFavorecidos: React.FC<LancamentoFavorecidosProps> = ({
  hidePixColumn = false,
  hideBankColumn = false,
  hideTipoColumn = false
}) => {
  const {
    modalOpen,
    setModalOpen,
    handleCreateNew,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleInputChange,
    handleSelectChange,
    handleSave,
    formMode,
    currentFavorecido,
    isLoading,
    filteredFavorecidos,
    searchTerm,
    handleSearchChange,
    successModalOpen,
    setSuccessModalOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    grupos,
  } = useFavorecidos();

  const [selectedFavorecido, setSelectedFavorecido] = useState<any>(null);
  const [selectedFavorecidos, setSelectedFavorecidos] = useState<string[]>([]);

  const handleSelectFavorecido = (favorecido: any) => {
    setSelectedFavorecido(favorecido);
  };

  const handleCancelSelection = () => {
    setSelectedFavorecido(null);
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedFavorecidos(selectedIds);
  };

  const handleProcessSelected = () => {
    if (selectedFavorecidos.length === 0) {
      toast.error("Nenhum favorecido selecionado para processar.");
      return;
    }
    
    console.log("Processando favorecidos selecionados:", selectedFavorecidos);
    toast.success(`${selectedFavorecidos.length} favorecido(s) sendo processado(s)...`);
    
    // Aqui será implementada a lógica de processamento dos favorecidos selecionados
    // Por exemplo: abrir modal de lançamento em lote, redirecionar para tela de pagamento, etc.
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Lançamento para Favorecido</h3>
        <Button onClick={() => handleCreateNew()} className="flex items-center gap-2">
          <Plus size={16} /> Cadastrar Novo Favorecido
        </Button>
      </div>

      {selectedFavorecido ? (
        <div className="space-y-4 p-4 border rounded-md bg-background">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">Favorecido Selecionado:</h4>
            <Button variant="outline" size="sm" onClick={handleCancelSelection}>Selecionar Outro</Button>
          </div>
          <div className="border p-4 rounded-md space-y-2 bg-secondary/20">
            <p><strong>Nome:</strong> {selectedFavorecido.nome}</p>
            <p><strong>Inscrição:</strong> {selectedFavorecido.inscricao}</p>
            <p><strong>Banco/Agência/Conta:</strong> {selectedFavorecido.dadosBancarios}</p>
            <p><strong>Chave PIX:</strong> {selectedFavorecido.chavePix}</p>
          </div>

          <div className="mt-4 space-y-3">
            <h4 className="text-lg font-semibold">Detalhes do Lançamento</h4>
            <p className="text-muted-foreground">Formulário de lançamento para {selectedFavorecido.nome} aqui...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-4">
          <FavorecidoSearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            hasResults={filteredFavorecidos.length > 0}
          />

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
            </div>
          ) : filteredFavorecidos.length > 0 ? (
            <FavorecidosTable
              favorecidos={filteredFavorecidos}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelectFavorecido={handleSelectFavorecido}
              selectedFavorecidos={selectedFavorecidos}
              onSelectionChange={handleSelectionChange}
              itemsPerPage={5}
              hidePixColumn={hidePixColumn}
              hideBankColumn={hideBankColumn}
              hideTipoColumn={hideTipoColumn}
            />
          ) : (
            <EmptyState searchTerm={searchTerm} />
          )}

          {selectedFavorecidos.length > 0 && (
            <div className="mt-4 p-4 border rounded-md bg-background">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold">
                  {selectedFavorecidos.length} favorecido(s) selecionado(s)
                </h4>
                <div className="flex gap-2">
                  <Button
                    onClick={handleProcessSelected}
                    className="flex items-center gap-2"
                  >
                    <FileOutput size={16} />
                    Processar Selecionados
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedFavorecidos([])}>
                    Limpar Seleção
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-muted-foreground">
                  Formulário de lançamento em lote para os favorecidos selecionados aqui...
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <FavorecidoFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        currentFavorecido={currentFavorecido}
        grupos={grupos}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleSave={handleSave}
        formMode={formMode}
        isLoading={isLoading}
      />

      <DeleteFavorecidoDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isDeleting={isLoading}
      />

      <SuccessModal
        open={successModalOpen}
        onOpenChange={setSuccessModalOpen}
        title="Sucesso!"
        message="Favorecido cadastrado com sucesso."
        buttonText="OK"
        onButtonClick={handleCloseSuccessModal}
      />
    </div>
  );
};

export default LancamentoFavorecidos;

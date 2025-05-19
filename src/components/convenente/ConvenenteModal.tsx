
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConvenenteData } from "@/types/convenente";
import ConvenenteList from "./modal/ConvenenteList";
import ActionButtons from "./modal/ActionButtons";
import ConvenenteForm from "./modal/ConvenenteForm";

type ConvenenteModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  convenentes: Array<ConvenenteData & { id: string }>;
  filteredConvenentes: Array<ConvenenteData & { id: string }>;
  currentConvenenteId: string | null;
  formData: ConvenenteData;
  formMode: 'view' | 'create' | 'edit';
  formValid: boolean;
  isLoading: boolean;
  isSearching?: boolean;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectConvenente: (convenente: ConvenenteData & { id: string }) => void;
  onCreateNew: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onFormDataChange: (data: ConvenenteData) => void;
};

const ConvenenteModal = ({
  isOpen,
  onOpenChange,
  convenentes,
  filteredConvenentes,
  currentConvenenteId,
  formData,
  formMode,
  formValid,
  isLoading,
  isSearching = false,
  searchTerm,
  onSearchChange,
  onSelectConvenente,
  onCreateNew,
  onEdit,
  onDelete,
  onSave,
  onFormDataChange,
}: ConvenenteModalProps) => {
  
  const [activeTab, setActiveTab] = useState<string>("dados");
  
  const handleCreateNewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCreateNew();
    setActiveTab("dados");
  };

  const handleSaveClick = () => {
    onSave();
  };

  const isSaveDisabled = !(formMode === 'create' || formMode === 'edit') || 
                        isLoading || 
                        (!formData.cnpj || !formData.razaoSocial);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6">Cadastro de Convenente</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Lista de convenentes */}
          <ConvenenteList
            convenentes={convenentes}
            filteredConvenentes={filteredConvenentes}
            currentConvenenteId={currentConvenenteId}
            isLoading={isLoading}
            isSearching={isSearching}
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            onSelectConvenente={onSelectConvenente}
          />
          
          {/* Formulário */}
          <div className="lg:col-span-2">
            <ActionButtons
              formMode={formMode}
              currentConvenenteId={currentConvenenteId}
              isLoading={isLoading}
              isSaveDisabled={isSaveDisabled}
              onCreateNew={handleCreateNewClick}
              onEdit={onEdit}
              onDelete={onDelete}
              onSave={handleSaveClick}
            />
            
            <ConvenenteForm
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              formMode={formMode}
              currentConvenenteId={currentConvenenteId}
              initialData={formData}
              onFormDataChange={onFormDataChange}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConvenenteModal;


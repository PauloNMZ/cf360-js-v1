
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Edit, Loader2, Plus, Save, Search, TrashIcon } from "lucide-react";
import FormularioModerno from "@/components/FormularioModerno";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";
import { formatCNPJ } from "@/utils/formValidation";

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
  
  // Add debug logging for formMode changes
  useEffect(() => {
    console.log("ConvenenteModal - formMode changed to:", formMode);
  }, [formMode]);
  
  // Handle create new click with improved debugging
  const handleCreateNewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Create New button clicked in ConvenenteModal");
    onCreateNew();
    
    // Add a timeout to check the mode after the click
    setTimeout(() => {
      console.log("Verifying form mode after Create New clicked...");
    }, 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6">Cadastro de Convenente</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Lista de convenentes */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Buscar convenentes..." 
                  className="pl-10 border-blue-200 focus:border-blue-500"
                  value={searchTerm}
                  onChange={onSearchChange}
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-blue-500" size={18} />
                )}
              </div>
            </div>
            
            <div className="h-[500px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  Carregando...
                </div>
              ) : filteredConvenentes.length > 0 ? (
                <ul className="space-y-2">
                  {filteredConvenentes.map((convenente) => (
                    <li 
                      key={convenente.id}
                      onClick={() => onSelectConvenente(convenente)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        currentConvenenteId === convenente.id 
                          ? 'bg-blue-100 border border-blue-300' 
                          : 'hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <h3 className="font-medium text-blue-800">{convenente.razaoSocial}</h3>
                      <p className="text-sm text-gray-500">
                        CNPJ: {formatCNPJ(convenente.cnpj)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <AlertCircle size={40} className="mb-2 text-blue-400" />
                  {searchTerm ? (
                    <p>Nenhum resultado para "{searchTerm}"</p>
                  ) : (
                    <p>Nenhum convenente cadastrado</p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Formulário */}
          <div className="lg:col-span-2">
            <div className="flex justify-between mb-4">
              <div className="flex space-x-2">
                <Button
                  onClick={handleCreateNewClick}
                  variant="outline"
                  className={`flex items-center gap-1 ${formMode === 'create' ? 'bg-blue-100 border-blue-300' : ''}`}
                  disabled={formMode === 'create'}
                >
                  <Plus size={16} /> Novo
                </Button>
                <Button
                  onClick={onEdit}
                  variant="outline"
                  className={`flex items-center gap-1 ${formMode === 'edit' ? 'bg-blue-100 border-blue-300' : ''}`}
                  disabled={formMode === 'edit' || !currentConvenenteId}
                >
                  <Edit size={16} /> Editar
                </Button>
                <Button
                  onClick={onDelete}
                  variant="outline"
                  className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                  disabled={!currentConvenenteId}
                >
                  <TrashIcon size={16} /> Excluir
                </Button>
              </div>
              {(formMode === 'create' || formMode === 'edit') && (
                <Button
                  onClick={onSave}
                  variant="default"
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                  disabled={!formValid}
                >
                  <Save size={16} /> Salvar
                </Button>
              )}
            </div>
            
            <ScrollArea className="h-[500px] pr-4">
              <div className="py-4">
                <FormularioModerno 
                  onFormDataChange={onFormDataChange} 
                  formMode={formMode}
                  initialData={formData} 
                />
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConvenenteModal;

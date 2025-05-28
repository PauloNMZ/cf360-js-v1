import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, List, Grid2X2 } from "lucide-react";
import ConvenenteForm from "@/components/convenente/modal/ConvenenteForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertMessage } from "@/components/ui/AlertMessage";
import { useEmpresaPage } from "@/hooks/empresa/useEmpresaPage";
import EmpresaList from "@/components/empresa/EmpresaList";
import EmpresaCards from "@/components/empresa/EmpresaCards";
import EmpresaDetails from "@/components/empresa/EmpresaDetails";

const EmpresaPage = () => {
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  
  const {
    activeTab,
    setActiveTab,
    modalOpen,
    setModalOpen,
    formMode,
    setFormMode,
    currentConvenenteId,
    formData,
    showDeleteDialog,
    setShowDeleteDialog,
    convenentes,
    isLoading,
    alert,
    setAlert,
    alertTimeoutRef,
    handleSearchChange,
    handleNewConvenente,
    handleEditConvenente,
    handleDeleteClick,
    handleDeleteConfirm,
    handleSaveConvenente,
    handleViewDetails,
    handleSelectConvenente,
    handleFormDataChange,
    handleGetById
  } = useEmpresaPage();

  return (
    <div className="container mx-auto py-6">
      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <div className="bg-secondary text-foreground p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Cadastro da Empresa</h1>
          
          {/* Toggle de visualização */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Visualização:</span>
            <div className="flex bg-background rounded-lg p-1 border">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-3 py-1.5 h-8"
              >
                <List size={16} className="mr-1" />
                Lista
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="px-3 py-1.5 h-8"
              >
                <Grid2X2 size={16} className="mr-1" />
                Cards
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-background">
          {viewMode === 'list' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <EmpresaList
                convenentes={convenentes}
                currentConvenenteId={currentConvenenteId}
                isLoading={isLoading}
                onSearchChange={handleSearchChange}
                onSelectConvenente={handleSelectConvenente}
                onNewConvenente={handleNewConvenente}
              />
              
              <EmpresaDetails
                currentConvenenteId={currentConvenenteId}
                formData={formData}
                formMode={formMode}
                isLoading={isLoading}
                onEdit={handleEditConvenente}
                onDelete={handleDeleteClick}
                onViewDetails={handleViewDetails}
                onNewConvenente={handleNewConvenente}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Barra de busca e novo convenente para modo cards */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Buscar empresas..."
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground focus:border-primary focus:outline-none"
                    onChange={handleSearchChange}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                  </div>
                </div>
                <Button onClick={handleNewConvenente} className="bg-primary-blue hover:bg-primary-blue/90">
                  Nova Empresa
                </Button>
              </div>
              
              <EmpresaCards
                convenentes={convenentes}
                currentConvenenteId={currentConvenenteId}
                isLoading={isLoading}
                onSelectConvenente={handleSelectConvenente}
              />
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-6xl p-0">
          {alert && (
            <AlertMessage 
              type={alert.type as any} 
              message={alert.message} 
              onClose={() => {
                if (alertTimeoutRef.current) window.clearTimeout(alertTimeoutRef.current);
                setAlert(null);
                console.log('Alerta limpo manualmente pelo usuário');
              }} 
            />
          )}
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-center text-xl">
              {formMode === 'create' ? 'Novo Convenente' : formMode === 'edit' ? 'Editar Convenente' : 'Detalhes do Convenente'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6">
            <ConvenenteForm 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              formMode={formMode} 
              currentConvenenteId={currentConvenenteId} 
              initialData={formData} 
              onSave={handleSaveConvenente} 
              onChange={handleFormDataChange} 
            />
            
            <div className="flex justify-end gap-4 mt-6">
              {formMode !== 'view' && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (formMode === 'create') {
                      setModalOpen(false);
                    } else {
                      setFormMode('view');
                      if (currentConvenenteId) {
                        handleGetById(currentConvenenteId).then(data => {
                          if (data) handleFormDataChange(data);
                        });
                      }
                    }
                  }} 
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              )}
              
              {formMode === 'view' ? (
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Fechar
                </Button>
              ) : (
                <Button 
                  onClick={handleSaveConvenente} 
                  disabled={isLoading || !formData.cnpj || !formData.razaoSocial} 
                  className="bg-primary-blue hover:bg-primary-blue/90"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este convenente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              disabled={isLoading} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmpresaPage;

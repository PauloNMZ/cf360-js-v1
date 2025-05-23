
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ConvenenteForm from "@/components/convenente/modal/ConvenenteForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertMessage } from "@/components/ui/AlertMessage";
import { useEmpresaPage } from "@/hooks/empresa/useEmpresaPage";
import EmpresaList from "@/components/empresa/EmpresaList";
import EmpresaDetails from "@/components/empresa/EmpresaDetails";

const EmpresaPage = () => {
  const {
    // State
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
    
    // Handlers
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
        <div className="bg-secondary text-foreground p-4">
          <h1 className="text-xl font-bold text-center">Cadastro da Empresa</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-background">
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

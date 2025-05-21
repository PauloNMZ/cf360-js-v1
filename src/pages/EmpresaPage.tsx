import React, { useState, useEffect, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Plus, Pencil, Trash2, X } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";
import ConvenenteForm from "@/components/convenente/modal/ConvenenteForm";
import { formatCNPJ } from "@/utils/formValidation";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useConvenentes } from "@/hooks/useConvenentes";
import { AlertMessage } from "@/components/ui/AlertMessage";

const EmpresaPage = () => {
  // Estado para controle do formulário e operações
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'view' | 'create' | 'edit'>('view');
  const [activeTab, setActiveTab] = useState('dados');
  const [currentConvenenteId, setCurrentConvenenteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ConvenenteData>(emptyConvenente);
  const alertTimeoutRef = useRef<number | null>(null);
  
  // Hook para gerenciar convenentes
  const {
    convenentes,
    isLoading,
    handleSearch,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleGetById,
    alert,
    setAlert
  } = useConvenentes();
  
  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  };
  
  const handleFormDataChange = (data: ConvenenteData) => {
    setFormData(data);
  };
  
  const handleNewConvenente = () => {
    setFormData(emptyConvenente);
    setCurrentConvenenteId(null);
    setFormMode('create');
    setFormOpen(true);
    setActiveTab('dadosCadastrais');
  };
  
  const handleSelectConvenente = async (convenente: ConvenenteData & { id: string }) => {
    try {
      const fullConvenente = await handleGetById(convenente.id);
      if (fullConvenente) {
        setCurrentConvenenteId(convenente.id);
        setFormData(fullConvenente);
        setFormMode('view');
        setFormOpen(true);
        setActiveTab('dadosCadastrais');
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do convenente:', error);
    }
  };
  
  const handleEditConvenente = () => {
    setFormMode('edit');
  };
  
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (currentConvenenteId) {
      try {
        await handleDelete(currentConvenenteId);
        setFormOpen(false);
        setCurrentConvenenteId(null);
      } catch (error) {
        console.error('Erro ao excluir convenente:', error);
      }
    }
    setDeleteDialogOpen(false);
  };
  
  const handleSaveConvenente = async () => {
    try {
      if (formMode === 'create') {
        const newConvenente = await handleCreate(formData);
        if (newConvenente) {
          setFormOpen(false);
          setCurrentConvenenteId(null);
          setFormData(emptyConvenente);
          setAlert({ type: 'success', message: 'Convenente criado com sucesso' });
        }
      } else if (formMode === 'edit' && currentConvenenteId) {
        await handleUpdate(currentConvenenteId, formData);
        setFormOpen(false);
        setCurrentConvenenteId(null);
        setFormData(emptyConvenente);
        setAlert({ type: 'success', message: 'Convenente atualizado com sucesso' });
      }
    } catch (error) {
      // O alerta de erro já é tratado no hook useConvenentes
    }
  };

  useEffect(() => {
    if (alert && alert.type === 'success') {
      if (alertTimeoutRef.current) window.clearTimeout(alertTimeoutRef.current);
      console.log('Alerta de sucesso exibido, será limpo em 5s. Tipo atual:', alert.type);
      alertTimeoutRef.current = window.setTimeout(() => {
        setAlert(null);
        setCurrentConvenenteId(null);
        setFormData(emptyConvenente);
        console.log('Alerta de sucesso limpo automaticamente após 5s');
      }, 5000);
    } else if (alert && alert.type !== 'success') {
      if (alertTimeoutRef.current) window.clearTimeout(alertTimeoutRef.current);
      console.log('Alerta mudou para tipo não-sucesso. Limpando timeout de sucesso pendente.');
    }

    return () => {
      if (alertTimeoutRef.current) {
        console.log('Cleanup do useEffect disparado. Limpando timeout:', alertTimeoutRef.current);
        window.clearTimeout(alertTimeoutRef.current);
      }
    };
  }, [alert]);

  return (
    <div className="container mx-auto py-6">
      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <div className="bg-secondary text-foreground p-4">
          <h1 className="text-xl font-bold text-center">Cadastro da Empresa</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-background">
          {/* Coluna de Listagem de Convenentes */}
          <div className="md:col-span-1">
            <div className="mb-4 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  placeholder="Buscar convenentes..." 
                  className="pl-10 border-border focus:border-primary bg-input text-foreground"
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            
            <div className="max-h-[500px] overflow-y-auto border border-border rounded-lg bg-background">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : convenentes.length > 0 ? (
                <ul className="space-y-2 p-2">
                  {convenentes.map((convenente) => (
                    <li 
                      key={convenente.id}
                      onClick={() => handleSelectConvenente(convenente)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border ${currentConvenenteId === convenente.id 
                          ? 'bg-accent border-primary text-primary-foreground' 
                          : 'hover:bg-accent/50 border-border text-foreground'
                      }`}
                    >
                      <h3 className="font-medium">{convenente.razaoSocial}</h3>
                      <p className="text-sm text-muted-foreground">
                        CNPJ: {formatCNPJ(convenente.cnpj)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-10 rounded-lg border border-dashed text-foreground bg-muted border-border">
                  <h3 className="text-lg font-medium text-foreground mb-2">Nenhum convenente encontrado</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Crie um novo convenente para começar
                  </p>
                  <Button onClick={handleNewConvenente} className="bg-primary-blue hover:bg-primary-blue/90">
                    <Plus size={16} className="mr-2" />
                    Criar Novo Convenente
                  </Button>
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleNewConvenente}
              className="w-full mt-4"
            >
              <Plus size={16} className="mr-2" /> 
              Novo Convenente
            </Button>
          </div>
          
          {/* Coluna do Formulário ou Informações */}
          <div className="md:col-span-2">
            {currentConvenenteId ? (
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-foreground">
                    {formData.razaoSocial}
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditConvenente}
                      disabled={formMode === 'edit' || isLoading}
                    >
                      <Pencil size={16} className="mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteClick}
                      disabled={isLoading}
                    >
                      <Trash2 size={16} className="mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-foreground">
                  <div>
                    <strong>CNPJ:</strong> {formatCNPJ(formData.cnpj)}
                  </div>
                  <div>
                    <strong>Cidade/UF:</strong> {formData.cidade}/{formData.uf}
                  </div>
                  <div>
                    <strong>Contato:</strong> {formData.contato}
                  </div>
                  <div>
                    <strong>Email:</strong> {formData.email}
                  </div>
                  <div>
                    <strong>Telefone:</strong> {formData.fone}
                  </div>
                  <div>
                    <strong>Celular:</strong> {formData.celular}
                  </div>
                </div>
                
                {/* Botão para exibir mais detalhes / formulário completo */}
                <Button 
                  variant="outline" 
                  className="mt-4 w-full border-border text-foreground"
                  onClick={() => setFormOpen(true)}
                >
                  Ver detalhes completos
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-10 rounded-lg border border-dashed text-foreground bg-muted border-border">
                <h3 className="text-lg font-medium text-foreground mb-2">Nenhum convenente selecionado</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Selecione um convenente da lista ou crie um novo para visualizar os detalhes
                </p>
                <Button onClick={handleNewConvenente} className="bg-primary-blue hover:bg-primary-blue/90">
                  <Plus size={16} className="mr-2" />
                  Criar Novo Convenente
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Diálogo de Formulário Completo */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-6xl p-0">
          {alert && (
            <AlertMessage
              type={alert.type as any}
              message={alert.message}
              onClose={() => {
                if (alertTimeoutRef.current) window.clearTimeout(alertTimeoutRef.current);
                setAlert(null);
                setCurrentConvenenteId(null);
                setFormData(emptyConvenente);
                console.log('Alerta limpo manualmente pelo usuário');
              }}
            />
          )}
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-center text-xl">
              {formMode === 'create' ? 'Novo Convenente' : 
               formMode === 'edit' ? 'Editar Convenente' : 
               'Detalhes do Convenente'}
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
              onChange={setFormData}
            />
            
            {/* Botões de Ação */}
            <div className="flex justify-end gap-4 mt-6">
              {formMode !== 'view' && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (formMode === 'create') {
                      setFormOpen(false);
                    } else {
                      setFormMode('view');
                      // Recarregar dados originais
                      if (currentConvenenteId) {
                        handleGetById(currentConvenenteId).then(data => {
                          if (data) setFormData(data);
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
                <Button variant="outline" onClick={() => setFormOpen(false)}>
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
      
      {/* Diálogo de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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


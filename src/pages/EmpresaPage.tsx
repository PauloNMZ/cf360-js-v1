import React, { useState, useEffect } from "react";
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
import { fetchEmpresas, createEmpresa, updateEmpresa, deleteEmpresa } from "@/services/empresa/empresaService";
import { EmpresaData, emptyEmpresa } from "@/types/empresa";
import { useToast } from "@/hooks/use-toast";

const EmpresaPage = () => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'view' | 'create' | 'edit'>('view');
  const [activeTab, setActiveTab] = useState('dados');
  const [currentEmpresaId, setCurrentEmpresaId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [empresas, setEmpresas] = useState<Array<EmpresaData & { id?: string }>>([]);
  const [formData, setFormData] = useState<EmpresaData>(emptyEmpresa);

  // Buscar empresas do backend
  useEffect(() => {
    setIsLoading(true);
    fetchEmpresas().then(list => setEmpresas(list)).finally(() => setIsLoading(false));
  }, []);

  // Filtragem de empresas
  const filteredEmpresas = empresas.filter(emp => 
    emp.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.cnpj.includes(searchTerm.replace(/\D/g, ''))
  );
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  const handleFormDataChange = (data: EmpresaData) => setFormData(data);

  const handleNewEmpresa = () => {
    setFormData(emptyEmpresa);
    setCurrentEmpresaId(null);
    setFormMode('create');
    setFormOpen(true);
    setActiveTab('dadosCadastrais');
  };

  const handleSelectEmpresa = (empresa: EmpresaData & { id?: string }) => {
    setCurrentEmpresaId(empresa.id ?? null);
    setFormData(empresa);
    setFormMode('view');
    setFormOpen(true);
    setActiveTab('dadosCadastrais');
  };

  const handleEditEmpresa = () => setFormMode('edit');

  const handleDeleteClick = () => setDeleteDialogOpen(true);

  const handleDeleteConfirm = async () => {
    if (!currentEmpresaId) return;
    setIsLoading(true);
    try {
      await deleteEmpresa(currentEmpresaId);
      setEmpresas(empresas.filter(e => e.id !== currentEmpresaId));
      setFormOpen(false);
      setCurrentEmpresaId(null);
      toast({ title: "Empresa deletada com sucesso" });
    } catch (err: any) {
      toast({ title: "Erro ao deletar empresa", description: err?.message || "Falha ao deletar.", variant: "destructive" });
    }
    setIsLoading(false);
    setDeleteDialogOpen(false);
  };

  const handleSaveEmpresa = async () => {
    setIsLoading(true);
    try {
      let saved: EmpresaData | null = null;
      if (formMode === "create") {
        saved = await createEmpresa(formData);
        if (saved) setEmpresas([...empresas, saved]);
        toast({ title: "Empresa criada!", description: "Empresa cadastrada e convenente associado." });
      } else if (formMode === "edit" && currentEmpresaId) {
        saved = await updateEmpresa(currentEmpresaId, formData);
        if (saved) setEmpresas(empresas.map(e => (e.id === saved!.id ? saved! : e)));
        toast({ title: "Empresa atualizada!", description: "Empresa editada e convenente atualizado." });
      }
      if (saved?.id) setCurrentEmpresaId(saved.id);
      setFormData(saved || formData);
      setFormMode("view");
    } catch (err: any) {
      toast({ title: "Erro ao salvar empresa", description: err?.message || "Falha ao salvar.", variant: "destructive" });
    }
    setIsLoading(false);
  };

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
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            
            <div className="max-h-[500px] overflow-y-auto border border-border rounded-lg bg-background">
              {filteredEmpresas.length > 0 ? (
                <ul className="space-y-2 p-2">
                  {filteredEmpresas.map((empresa) => (
                    <li 
                      key={empresa.id}
                      onClick={() => handleSelectEmpresa(empresa)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border ${currentEmpresaId === empresa.id 
                          ? 'bg-accent border-primary text-primary-foreground' 
                          : 'hover:bg-accent/50 border-border text-foreground'
                      }`}
                    >
                      <h3 className="font-medium">{empresa.razaoSocial}</h3>
                      <p className="text-sm text-muted-foreground">
                        CNPJ: {formatCNPJ(empresa.cnpj)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-10 rounded-lg border border-dashed text-foreground bg-muted border-border">
                  <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma empresa selecionada</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Selecione uma empresa da lista ou crie uma nova para visualizar os detalhes
                  </p>
                  <Button onClick={handleNewEmpresa} className="bg-primary-blue hover:bg-primary-blue/90">
                    <Plus size={16} className="mr-2" />
                    Criar Nova Empresa
                  </Button>
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleNewEmpresa}
              className="w-full mt-4"
            >
              <Plus size={16} className="mr-2" /> 
              Nova Empresa
            </Button>
          </div>
          
          {/* Coluna do Formulário ou Informações */}
          <div className="md:col-span-2">
            {currentEmpresaId ? (
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-foreground">
                    {formData.razaoSocial}
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditEmpresa}
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
                <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma empresa selecionada</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Selecione uma empresa da lista ou crie uma nova para visualizar os detalhes
                </p>
                <Button onClick={handleNewEmpresa} className="bg-primary-blue hover:bg-primary-blue/90">
                  <Plus size={16} className="mr-2" />
                  Criar Nova Empresa
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Diálogo de Formulário Completo */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-6xl p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-center text-xl">
              {'Cadastro da Empresa'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6">
            <ConvenenteForm
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              formMode={formMode}
              currentConvenenteId={currentEmpresaId}
              initialData={formData}
              onSave={handleSaveEmpresa}
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
                      const original = empresas.find(c => c.id === currentEmpresaId);
                      if (original) setFormData(original);
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
                  onClick={handleSaveEmpresa}
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

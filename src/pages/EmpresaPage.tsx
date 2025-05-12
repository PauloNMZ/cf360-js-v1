
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

const EmpresaPage = () => {
  // Estado para controle do formulário e operações
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'view' | 'create' | 'edit'>('view');
  const [activeTab, setActiveTab] = useState('dados');
  const [currentConvenenteId, setCurrentConvenenteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Mock de dados para demonstração
  const [convenentes, setConvenentes] = useState<Array<ConvenenteData & { id: string }>>([
    {
      id: "1",
      cnpj: "23665071000109",
      razaoSocial: "PADILHA RIBEIRO NEGOCIOS E SERVICOS LTDA",
      endereco: "Rua Exemplo",
      numero: "123",
      complemento: "Sala 45",
      uf: "SP",
      cidade: "São Paulo",
      contato: "João Silva",
      fone: "1133334444",
      celular: "11999998888",
      email: "contato@padilharibeiro.com.br",
      agencia: "1234",
      conta: "56789-0",
      chavePix: "23665071000109",
      convenioPag: "12345"
    }
  ]);
  
  // Convenente selecionado para edição/visualização
  const [formData, setFormData] = useState<ConvenenteData>(emptyConvenente);
  
  // Filtragem de convenentes baseada no termo de busca
  const filteredConvenentes = convenentes.filter(convenente => 
    convenente.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    convenente.cnpj.includes(searchTerm.replace(/\D/g, ''))
  );
  
  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFormDataChange = (data: ConvenenteData) => {
    setFormData(data);
  };
  
  const handleNewConvenente = () => {
    setFormData(emptyConvenente);
    setCurrentConvenenteId(null);
    setFormMode('create');
    setFormOpen(true);
    setActiveTab('dados');
  };
  
  const handleSelectConvenente = (convenente: ConvenenteData & { id: string }) => {
    setCurrentConvenenteId(convenente.id);
    setFormData(convenente);
    setFormMode('view');
    setFormOpen(true);
    setActiveTab('dados');
  };
  
  const handleEditConvenente = () => {
    setFormMode('edit');
  };
  
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    setIsLoading(true);
    
    // Simulando operação de deleção
    setTimeout(() => {
      if (currentConvenenteId) {
        setConvenentes(prev => prev.filter(c => c.id !== currentConvenenteId));
        setFormOpen(false);
        setCurrentConvenenteId(null);
        toast.success("Convenente excluído com sucesso");
      }
      setIsLoading(false);
      setDeleteDialogOpen(false);
    }, 1000);
  };
  
  const handleSaveConvenente = () => {
    setIsLoading(true);
    
    // Simulando operação de salvamento
    setTimeout(() => {
      if (formMode === 'create') {
        const newConvenente = {
          ...formData,
          id: Date.now().toString(), // Geração simples de ID para demo
          dataCriacao: new Date().toISOString()
        };
        
        setConvenentes(prev => [...prev, newConvenente]);
        setCurrentConvenenteId(newConvenente.id);
        toast.success("Convenente criado com sucesso");
      } else {
        setConvenentes(prev => 
          prev.map(c => c.id === currentConvenenteId ? { ...formData, id: c.id } : c)
        );
        toast.success("Convenente atualizado com sucesso");
      }
      
      setFormMode('view');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-primary-blue/90 dark:bg-primary-blue/80 text-white p-4">
          <h1 className="text-xl font-bold text-center">CADASTRO DE CONVENENTE</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          {/* Coluna de Listagem de Convenentes */}
          <div className="md:col-span-1">
            <div className="mb-4 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Buscar convenentes..." 
                  className="pl-10 border-blue-200 focus:border-blue-500"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            
            <div className="max-h-[500px] overflow-y-auto border border-gray-200 rounded-lg">
              {filteredConvenentes.length > 0 ? (
                <ul className="space-y-2 p-2">
                  {filteredConvenentes.map((convenente) => (
                    <li 
                      key={convenente.id}
                      onClick={() => handleSelectConvenente(convenente)}
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
                <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
                  <p>Nenhum resultado encontrado</p>
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleNewConvenente}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
            >
              <Plus size={16} className="mr-2" /> 
              Novo Convenente
            </Button>
          </div>
          
          {/* Coluna do Formulário ou Informações */}
          <div className="md:col-span-2">
            {currentConvenenteId ? (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-primary-blue">
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
                
                <div className="grid grid-cols-2 gap-4">
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
                  className="mt-4 w-full"
                  onClick={() => setFormOpen(true)}
                >
                  Ver detalhes completos
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhum convenente selecionado</h3>
                <p className="text-gray-500 text-center mb-4">
                  Selecione um convenente da lista ou crie um novo para visualizar os detalhes
                </p>
                <Button onClick={handleNewConvenente} className="bg-blue-600 hover:bg-blue-700">
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              {formMode === 'create' ? 'CADASTRO DE CONVENENTE' : 'EDITAR CONVENENTE'}
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </DialogClose>
          </DialogHeader>
          
          <div className="mt-4">
            <ConvenenteForm
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              formData={formData}
              formMode={formMode}
              currentConvenenteId={currentConvenenteId}
              onFormDataChange={handleFormDataChange}
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
                      const original = convenentes.find(c => c.id === currentConvenenteId);
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


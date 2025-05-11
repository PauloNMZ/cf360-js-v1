
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FavorecidoData, emptyFavorecido } from "@/types/favorecido";
import { getFavorecidos, saveFavorecido, updateFavorecido, deleteFavorecido } from "@/services/favorecido/favorecidoService";
import { 
  Pencil, 
  Trash, 
  Plus, 
  Search, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/utils/formatting/currencyUtils";

const FavorecidosPage = () => {
  const [favorecidos, setFavorecidos] = useState<Array<FavorecidoData & { id: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFavorecidos, setFilteredFavorecidos] = useState<Array<FavorecidoData & { id: string }>>([]);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFavorecido, setCurrentFavorecido] = useState<FavorecidoData>({...emptyFavorecido});
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [favorecidoToDelete, setFavorecidoToDelete] = useState<string | null>(null);

  // Load favorecidos on mount
  useEffect(() => {
    loadFavorecidos();
  }, []);

  // Filter favorecidos when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFavorecidos(favorecidos);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredFavorecidos(favorecidos.filter(f => 
        f.nome.toLowerCase().includes(term) || 
        f.inscricao.toLowerCase().includes(term)
      ));
    }
  }, [searchTerm, favorecidos]);

  const loadFavorecidos = async () => {
    setIsLoading(true);
    try {
      const data = await getFavorecidos();
      setFavorecidos(data);
      setFilteredFavorecidos(data);
    } catch (error) {
      console.error("Erro ao carregar favorecidos:", error);
      toast.error("Erro ao carregar favorecidos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setCurrentFavorecido({...emptyFavorecido});
    setFormMode('create');
    setModalOpen(true);
  };

  const handleEdit = (favorecido: FavorecidoData & { id: string }) => {
    setCurrentFavorecido({...favorecido});
    setFormMode('edit');
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setFavorecidoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!favorecidoToDelete) return;
    
    setIsLoading(true);
    try {
      await deleteFavorecido(favorecidoToDelete);
      toast.success("Favorecido excluído com sucesso");
      loadFavorecidos();
    } catch (error) {
      console.error("Erro ao excluir favorecido:", error);
      toast.error("Erro ao excluir favorecido");
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      setFavorecidoToDelete(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentFavorecido(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCurrentFavorecido(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Basic validation
    if (!currentFavorecido.nome.trim() || !currentFavorecido.inscricao.trim()) {
      toast.error("Nome e Inscrição são campos obrigatórios");
      return;
    }

    setIsLoading(true);
    try {
      if (formMode === 'create') {
        await saveFavorecido(currentFavorecido);
        toast.success("Favorecido criado com sucesso");
      } else {
        if (!currentFavorecido.id) return;
        await updateFavorecido(currentFavorecido.id, currentFavorecido);
        toast.success("Favorecido atualizado com sucesso");
      }
      
      loadFavorecidos();
      setModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar favorecido:", error);
      toast.error(`Erro ao ${formMode === 'create' ? 'criar' : 'atualizar'} favorecido`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Favorecidos</h1>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus size={16} />
          Novo Favorecido
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Buscar por nome ou inscrição..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
          </div>
        ) : filteredFavorecidos.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Inscrição</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Banco/Agência/Conta</TableHead>
                  <TableHead>Chave PIX</TableHead>
                  <TableHead>Valor Padrão</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFavorecidos.map((favorecido) => (
                  <TableRow key={favorecido.id}>
                    <TableCell className="font-medium">{favorecido.nome}</TableCell>
                    <TableCell>{favorecido.inscricao}</TableCell>
                    <TableCell>{favorecido.tipoInscricao}</TableCell>
                    <TableCell>
                      {favorecido.banco && favorecido.agencia && favorecido.conta
                        ? `${favorecido.banco} / ${favorecido.agencia} / ${favorecido.conta}`
                        : "-"
                      }
                    </TableCell>
                    <TableCell>
                      {favorecido.chavePix 
                        ? `${favorecido.tipoChavePix}: ${favorecido.chavePix}` 
                        : "-"
                      }
                    </TableCell>
                    <TableCell>{formatCurrency(favorecido.valorPadrao)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(favorecido)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(favorecido.id!)}
                          title="Excluir"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <AlertCircle size={40} className="mb-2 text-gray-400" />
            {searchTerm ? (
              <p>Nenhum resultado para "{searchTerm}"</p>
            ) : (
              <p>Nenhum favorecido cadastrado</p>
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create' ? 'Novo Favorecido' : 'Editar Favorecido'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome*</label>
              <Input 
                name="nome"
                value={currentFavorecido.nome}
                onChange={handleInputChange}
                placeholder="Nome completo"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Inscrição*</label>
                <Input 
                  name="inscricao"
                  value={currentFavorecido.inscricao}
                  onChange={handleInputChange}
                  placeholder="CPF ou CNPJ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <Select 
                  value={currentFavorecido.tipoInscricao}
                  onValueChange={(value) => handleSelectChange("tipoInscricao", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CPF">CPF</SelectItem>
                    <SelectItem value="CNPJ">CNPJ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banco</label>
              <Input 
                name="banco"
                value={currentFavorecido.banco}
                onChange={handleInputChange}
                placeholder="Nome do banco"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agência</label>
              <Input 
                name="agencia"
                value={currentFavorecido.agencia}
                onChange={handleInputChange}
                placeholder="0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Conta</label>
              <Input 
                name="conta"
                value={currentFavorecido.conta}
                onChange={handleInputChange}
                placeholder="00000-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Chave PIX</label>
              <Select 
                value={currentFavorecido.tipoChavePix}
                onValueChange={(value) => handleSelectChange("tipoChavePix", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CPF">CPF</SelectItem>
                  <SelectItem value="CNPJ">CNPJ</SelectItem>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="TELEFONE">Telefone</SelectItem>
                  <SelectItem value="ALEATORIA">Aleatória</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Chave PIX</label>
              <Input 
                name="chavePix"
                value={currentFavorecido.chavePix}
                onChange={handleInputChange}
                placeholder="Informe a chave PIX"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Padrão (R$)</label>
              <Input 
                name="valorPadrao"
                type="number"
                step="0.01"
                value={currentFavorecido.valorPadrao}
                onChange={handleInputChange}
                placeholder="0,00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
              <Select 
                value={currentFavorecido.grupoId || ""}
                onValueChange={(value) => handleSelectChange("grupoId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {/* Grupos seriam listados aqui */}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-4">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || !currentFavorecido.nome || !currentFavorecido.inscricao}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {formMode === 'create' ? 'Criar' : 'Salvar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este favorecido? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FavorecidosPage;

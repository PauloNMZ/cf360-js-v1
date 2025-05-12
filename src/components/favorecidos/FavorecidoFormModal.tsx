
import React from "react";
import { FavorecidoData } from "@/types/favorecido";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface FavorecidoFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFavorecido: FavorecidoData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSave: () => void;
  formMode: 'create' | 'edit';
  isLoading: boolean;
}

const FavorecidoFormModal: React.FC<FavorecidoFormModalProps> = ({
  open,
  onOpenChange,
  currentFavorecido,
  handleInputChange,
  handleSelectChange,
  handleSave,
  formMode,
  isLoading
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
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
  );
};

export default FavorecidoFormModal;

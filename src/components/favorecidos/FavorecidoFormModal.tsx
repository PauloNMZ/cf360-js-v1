
import React from "react";
import { FavorecidoData } from "@/types/favorecido";
import { Group } from "@/types/group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { FormField } from "@/components/ui/form-field";

interface FavorecidoFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFavorecido: FavorecidoData;
  grupos: Group[];
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
  grupos,
  handleInputChange,
  handleSelectChange,
  handleSave,
  formMode,
  isLoading
}) => {
  // Debug logs for modal rendering
  console.log("FavorecidoFormModal - Rendering with props:", {
    open,
    formMode,
    currentFavorecidoId: currentFavorecido.id,
    currentFavorecidoNome: currentFavorecido.nome,
    gruposCount: grupos.length,
    isLoading
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {formMode === 'create' ? 'Cadastro de Favorecido' : 'Editar Favorecido'}
          </DialogTitle>
        </DialogHeader>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField name="nome" label="Nome" required className="w-full">
            <Input 
              id="nome"
              name="nome"
              value={currentFavorecido.nome}
              onChange={handleInputChange}
              placeholder="Nome completo"
            />
          </FormField>

          <div className="grid grid-cols-3 gap-3">
            <FormField name="inscricao" label="Inscrição" required className="col-span-2">
              <Input 
                id="inscricao"
                name="inscricao"
                value={currentFavorecido.inscricao}
                onChange={handleInputChange}
                placeholder="CPF ou CNPJ"
              />
            </FormField>
            <FormField name="tipoInscricao" label="Tipo" className="w-full">
              <Select 
                value={currentFavorecido.tipoInscricao}
                onValueChange={(value) => handleSelectChange("tipoInscricao", value)}
              >
                <SelectTrigger id="tipoInscricao">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CPF">CPF</SelectItem>
                  <SelectItem value="CNPJ">CNPJ</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4">
          <FormField name="banco" label="Banco" className="w-full">
            <Input 
              id="banco"
              name="banco"
              value={currentFavorecido.banco}
              onChange={handleInputChange}
              placeholder="Nome do banco"
            />
          </FormField>
          <FormField name="agencia" label="Agência" className="w-full">
            <Input 
              id="agencia"
              name="agencia"
              value={currentFavorecido.agencia}
              onChange={handleInputChange}
              placeholder="0000"
            />
          </FormField>
          <FormField name="conta" label="Conta" className="w-full">
            <Input 
              id="conta"
              name="conta"
              value={currentFavorecido.conta}
              onChange={handleInputChange}
              placeholder="00000-0"
            />
          </FormField>
          <FormField name="tipoConta" label="Tipo" className="w-full">
            <Select 
              value={currentFavorecido.tipoConta}
              onValueChange={(value) => handleSelectChange("tipoConta", value)}
            >
              <SelectTrigger id="tipoConta">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CC">Conta Corrente</SelectItem>
                <SelectItem value="PP">Conta Poupança</SelectItem>
                <SelectItem value="TD">Ted</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <FormField name="tipoChavePix" label="Tipo Chave Pix" className="w-full">
            <Select 
              value={currentFavorecido.tipoChavePix}
              onValueChange={(value) => handleSelectChange("tipoChavePix", value as any)}
            >
              <SelectTrigger id="tipoChavePix">
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
          </FormField>
          <FormField name="chavePix" label="Chave Pix" className="col-span-2">
            <Input 
              id="chavePix"
              name="chavePix"
              value={currentFavorecido.chavePix}
              onChange={handleInputChange}
              placeholder="Informe a chave Pix"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <FormField name="valorPadrao" label="Valor Padrão (R$)" className="w-full">
            <Input 
              id="valorPadrao"
              name="valorPadrao"
              type="number"
              step="0.01"
              value={currentFavorecido.valorPadrao}
              onChange={handleInputChange}
              placeholder="0,00"
            />
          </FormField>
          <FormField name="grupoId" label="Grupo" className="w-full">
            <Select 
              value={currentFavorecido.grupoId || "none"}
              onValueChange={(value) => handleSelectChange("grupoId", value === "none" ? "" : value)}
            >
              <SelectTrigger id="grupoId">
                <SelectValue placeholder="Selecione um grupo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {grupos.map((grupo) => (
                  <SelectItem key={grupo.id} value={grupo.id}>
                    {grupo.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
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

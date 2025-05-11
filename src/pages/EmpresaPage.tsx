
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const EmpresaPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cnpj: "",
    razaoSocial: "",
    endereco: "",
    numero: "",
    complemento: "",
    uf: "",
    cidade: "",
    contato: "",
    fone: "",
    celular: "",
    email: "",
    agencia: "",
    conta: "",
    chavePix: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setIsLoading(true);
    // Simulação de busca
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleSave = () => {
    setIsLoading(true);
    // Simulação de salvamento
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-primary-blue/90 dark:bg-primary-blue/80 text-white p-4">
          <h1 className="text-xl font-bold text-center">CADASTRO DE CONVENENTE</h1>
        </div>

        <div className="p-6">
          {/* Informações Cadastrais da Empresa */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary-blue text-center">
              Informações Cadastrais da Empresa
            </h2>
            <div className="h-1 w-20 bg-primary-blue/50 mx-auto mt-2 mb-6"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ*</label>
                <div className="flex">
                  <Input 
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    placeholder="00.000.000/0000-00" 
                    className="rounded-r-none"
                  />
                  <Button 
                    onClick={handleSearch} 
                    disabled={isLoading}
                    className="rounded-l-none"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social*</label>
                <Input 
                  name="razaoSocial"
                  value={formData.razaoSocial}
                  onChange={handleInputChange}
                  placeholder="Nome da empresa" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Rua, Av, Pça, Travessa, etc.</label>
                <Input 
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  placeholder="Endereço" 
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nr</label>
                  <Input 
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                    placeholder="000" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Compl./Bairro</label>
                  <Input 
                    name="complemento"
                    value={formData.complemento}
                    onChange={handleInputChange}
                    placeholder="Bairro" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UF</label>
                  <Input 
                    name="uf"
                    value={formData.uf}
                    onChange={handleInputChange}
                    placeholder="UF" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome de Contato</label>
                <Input 
                  name="contato"
                  value={formData.contato}
                  onChange={handleInputChange}
                  placeholder="Nome" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <Input 
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  placeholder="Cidade" 
                />
              </div>
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-primary-blue mb-4">
              Informações de Contato
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fone</label>
                <Input 
                  name="fone"
                  value={formData.fone}
                  onChange={handleInputChange}
                  placeholder="(00) 0000-0000" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Celular/WhatsApp</label>
                <Input 
                  name="celular"
                  value={formData.celular}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <Input 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="exemplo@email.com" 
                  type="email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Convênio Pag</label>
                <Input placeholder="Convênio" />
              </div>
            </div>
          </div>

          {/* Dados Bancários */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-primary-blue mb-4">
              Dados Bancários
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agência</label>
                <Input 
                  name="agencia"
                  value={formData.agencia}
                  onChange={handleInputChange}
                  placeholder="0000" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conta</label>
                <Input 
                  name="conta"
                  value={formData.conta}
                  onChange={handleInputChange}
                  placeholder="00000-0" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chave Pix</label>
                <Input 
                  name="chavePix"
                  value={formData.chavePix}
                  onChange={handleInputChange}
                  placeholder="Chave Pix" 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline">Cancelar</Button>
            <Button 
              onClick={handleSave}
              disabled={isLoading}
              className="bg-primary-blue hover:bg-primary-blue/90"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpresaPage;

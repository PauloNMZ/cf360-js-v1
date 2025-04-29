
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FormularioCorporativo = () => {
  return (
    <div>
      {/* Header with dark blue background */}
      <div className="bg-[#1a365d] text-white p-5">
        <h2 className="text-lg font-medium">CADASTRO DE CONVENENTE</h2>
      </div>
      
      {/* Form container */}
      <div className="bg-[#f8fafc] p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1a365d]">Informações Cadastrais da Empresa</h1>
          <div className="h-1 w-20 bg-[#90cdf4] mx-auto mt-4"></div>
        </div>
        
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#334e68]">CNPJ</label>
              <Input placeholder="00.000.000/0000-00" className="border-gray-200 focus:border-[#3182ce] bg-gray-50" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#334e68]">Razão Social</label>
              <Input placeholder="Nome da empresa" className="border-gray-200 focus:border-[#3182ce] bg-gray-50" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#334e68]">Nome da Rua, Av, Pça, Travessa, etc.</label>
              <Input placeholder="Endereço" className="border-gray-200 focus:border-[#3182ce] bg-gray-50" />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#334e68]">Nr</label>
                <Input placeholder="000" className="border-gray-200 focus:border-[#3182ce] bg-gray-50" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#334e68]">Compl./Bairro</label>
                <Input placeholder="Bairro" className="border-gray-200 focus:border-[#3182ce] bg-gray-50" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#334e68]">UF</label>
                <Input placeholder="UF" className="border-gray-200 focus:border-[#3182ce] bg-gray-50" />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#334e68]">Nome de Contato</label>
              <Input placeholder="Nome" className="border-gray-200 focus:border-[#3182ce] bg-gray-50" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#334e68]">Cidade</label>
              <Input placeholder="Cidade" className="border-gray-200 focus:border-[#3182ce] bg-gray-50" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 mt-6">
          <h3 className="text-lg font-medium text-[#1a365d] mb-4">Informações de Contato</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#334e68]">Fone</label>
              <Input placeholder="(00) 0000-0000" className="border-gray-200 focus:border-[#3182ce] bg-gray-50" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#334e68]">Celular/WhatsApp</label>
              <Input placeholder="(00) 00000-0000" className="border-gray-200 focus:border-[#3182ce] bg-gray-50" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#334e68]">E-mail</label>
              <Input placeholder="exemplo@email.com" className="border-gray-200 focus:border-[#3182ce] bg-gray-50" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#334e68]">Convênio Pag</label>
              <Input placeholder="Convênio" className="border-gray-200 focus:border-[#3182ce] bg-gray-50" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 mt-6">
          <h3 className="text-lg font-medium text-[#1a365d] mb-4">Dados Bancários</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#334e68]">Agência</label>
              <Input placeholder="0000" className="border-gray-200 focus:border-[#3182ce] bg-gray-50" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#334e68]">Conta</label>
              <Input placeholder="00000-0" className="border-gray-200 focus:border-[#3182ce] bg-gray-50" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#334e68]">Usuário BBsia</label>
              <Input placeholder="Usuário" className="border-gray-200 focus:border-[#3182ce] bg-gray-50" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#334e68]">Senha</label>
              <Input type="password" placeholder="******" className="border-gray-200 focus:border-[#3182ce] bg-gray-50" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#334e68]">Chave Pix</label>
              <Input placeholder="Chave Pix" className="border-gray-200 focus:border-[#3182ce] bg-gray-50" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 mt-6">
          <h3 className="text-lg font-medium text-[#1a365d] mb-4">Outros Dados</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#334e68]">dev app key</label>
              <Input placeholder="dev app key" className="border-gray-200 focus:border-[#3182ce] bg-gray-50" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#334e68]">Basic</label>
              <Input placeholder="Basic" className="border-gray-200 focus:border-[#3182ce] bg-gray-50" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 mt-8">
          <Button variant="outline" className="border-gray-300 text-[#334e68] hover:bg-gray-50">Cancelar</Button>
          <Button className="bg-[#3182ce] hover:bg-[#2b6cb0]">Salvar</Button>
        </div>
      </div>
    </div>
  );
};

export default FormularioCorporativo;


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const FormularioElegante = () => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-white p-8">
      <div className="text-center mb-8">
        <h2 className="text-sm font-medium tracking-wider text-purple-700 mb-2">CADASTRO DE CONVENENTE</h2>
        <h1 className="text-2xl font-bold text-gray-800">Informações Cadastrais da Empresa</h1>
        <Separator className="mt-4 mx-auto w-24 bg-purple-300" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">CNPJ</label>
          <Input placeholder="00.000.000/0000-00" className="border-purple-200 focus:border-purple-500 bg-white shadow-sm" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Razão Social</label>
          <Input placeholder="Nome da empresa" className="border-purple-200 focus:border-purple-500 bg-white shadow-sm" />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">Nome da Rua, Av, Pça, Travessa, etc.</label>
          <Input placeholder="Endereço" className="border-purple-200 focus:border-purple-500 bg-white shadow-sm" />
        </div>
        
        <div className="grid grid-cols-3 gap-4 md:col-span-2">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nr</label>
            <Input placeholder="000" className="border-purple-200 focus:border-purple-500 bg-white shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Compl./Bairro</label>
            <Input placeholder="Bairro" className="border-purple-200 focus:border-purple-500 bg-white shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">UF</label>
            <Input placeholder="UF" className="border-purple-200 focus:border-purple-500 bg-white shadow-sm" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Cidade</label>
          <Input placeholder="Cidade" className="border-purple-200 focus:border-purple-500 bg-white shadow-sm" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Nome de Contato</label>
          <Input placeholder="Nome" className="border-purple-200 focus:border-purple-500 bg-white shadow-sm" />
        </div>
        
        <Separator className="md:col-span-2 my-2 bg-purple-100" />
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Fone</label>
          <Input placeholder="(00) 0000-0000" className="border-purple-200 focus:border-purple-500 bg-white shadow-sm" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Celular/WhatsApp</label>
          <Input placeholder="(00) 00000-0000" className="border-purple-200 focus:border-purple-500 bg-white shadow-sm" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">E-mail</label>
          <Input placeholder="exemplo@email.com" className="border-purple-200 focus:border-purple-500 bg-white shadow-sm" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Convênio Pag</label>
          <Input placeholder="Convênio" className="border-purple-200 focus:border-purple-500 bg-white shadow-sm" />
        </div>
        
        <Separator className="md:col-span-2 my-2 bg-purple-100" />
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Agência</label>
          <Input placeholder="0000" className="border-purple-200 focus:border-purple-500 bg-white shadow-sm" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Conta</label>
          <Input placeholder="00000-0" className="border-purple-200 focus:border-purple-500 bg-white shadow-sm" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Usuário BBsia</label>
          <Input placeholder="Usuário" className="border-purple-200 focus:border-purple-500 bg-white shadow-sm" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Senha</label>
          <Input type="password" placeholder="******" className="border-purple-200 focus:border-purple-500 bg-white shadow-sm" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Chave Pix</label>
          <Input placeholder="Chave Pix" className="border-purple-200 focus:border-purple-500 bg-white shadow-sm" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">dev app key</label>
          <Input placeholder="dev app key" className="border-purple-200 focus:border-purple-500 bg-white shadow-sm" />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">Basic</label>
          <Input placeholder="Basic" className="border-purple-200 focus:border-purple-500 bg-white shadow-sm" />
        </div>
      </div>
      
      <div className="flex justify-center space-x-8 mt-10">
        <Button variant="outline" className="border-purple-200 text-gray-600 hover:bg-purple-50 px-8">Cancelar</Button>
        <Button className="bg-purple-600 hover:bg-purple-700 px-8">Salvar</Button>
      </div>
    </div>
  );
};

export default FormularioElegante;

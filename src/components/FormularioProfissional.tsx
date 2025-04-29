
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FormularioProfissional = () => {
  return (
    <div className="bg-slate-50">
      <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
        <h2 className="font-semibold tracking-wide">CADASTRO DE CONVENENTE</h2>
        <button className="text-slate-300 hover:text-white">✕</button>
      </div>
      
      <div className="p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Informações Cadastrais da Empresa</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase text-slate-500 tracking-wider">CNPJ</label>
            <Input placeholder="00.000.000/0000-00" className="bg-white border-slate-300 focus:border-slate-500" />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase text-slate-500 tracking-wider">Razão Social</label>
            <Input placeholder="Nome da empresa" className="bg-white border-slate-300 focus:border-slate-500" />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase text-slate-500 tracking-wider">Nome da Rua, Av, Pça, Travessa, etc.</label>
            <Input placeholder="Endereço" className="bg-white border-slate-300 focus:border-slate-500" />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase text-slate-500 tracking-wider">Nr</label>
              <Input placeholder="000" className="bg-white border-slate-300 focus:border-slate-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase text-slate-500 tracking-wider">Compl./Bairro</label>
              <Input placeholder="Bairro" className="bg-white border-slate-300 focus:border-slate-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase text-slate-500 tracking-wider">UF</label>
              <Input placeholder="UF" className="bg-white border-slate-300 focus:border-slate-500" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase text-slate-500 tracking-wider">Nome de Contato</label>
            <Input placeholder="Nome" className="bg-white border-slate-300 focus:border-slate-500" />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase text-slate-500 tracking-wider">Cidade</label>
            <Input placeholder="Cidade" className="bg-white border-slate-300 focus:border-slate-500" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase text-slate-500 tracking-wider">Fone</label>
              <Input placeholder="(00) 0000-0000" className="bg-white border-slate-300 focus:border-slate-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase text-slate-500 tracking-wider">Celular/WhatsApp</label>
              <Input placeholder="(00) 00000-0000" className="bg-white border-slate-300 focus:border-slate-500" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase text-slate-500 tracking-wider">E-mail</label>
            <Input placeholder="exemplo@email.com" className="bg-white border-slate-300 focus:border-slate-500" />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase text-slate-500 tracking-wider">Convênio Pag</label>
            <Input placeholder="Convênio" className="bg-white border-slate-300 focus:border-slate-500" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase text-slate-500 tracking-wider">Agência</label>
              <Input placeholder="0000" className="bg-white border-slate-300 focus:border-slate-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase text-slate-500 tracking-wider">Conta</label>
              <Input placeholder="00000-0" className="bg-white border-slate-300 focus:border-slate-500" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase text-slate-500 tracking-wider">Usuário BBsia</label>
              <Input placeholder="Usuário" className="bg-white border-slate-300 focus:border-slate-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase text-slate-500 tracking-wider">Senha</label>
              <Input type="password" placeholder="******" className="bg-white border-slate-300 focus:border-slate-500" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase text-slate-500 tracking-wider">Chave Pix</label>
            <Input placeholder="Chave Pix" className="bg-white border-slate-300 focus:border-slate-500" />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase text-slate-500 tracking-wider">dev app key</label>
            <Input placeholder="dev app key" className="bg-white border-slate-300 focus:border-slate-500" />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase text-slate-500 tracking-wider">Basic</label>
            <Input placeholder="Basic" className="bg-white border-slate-300 focus:border-slate-500" />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 mt-8">
          <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">Cancelar</Button>
          <Button className="bg-slate-800 hover:bg-slate-700 text-white">Salvar</Button>
        </div>
      </div>
    </div>
  );
};

export default FormularioProfissional;

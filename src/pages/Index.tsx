
import { useState } from "react";
import FormularioModerno from "@/components/FormularioModerno";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Home, 
  Folder, 
  FileSearch, 
  Database, 
  Radio, 
  Repeat, 
  FileText, 
  Search, 
  Settings, 
  LogOut 
} from "lucide-react";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Header com gradiente azul */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">GERADOR DE PAGAMENTOS V1.01</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex-grow">
        {/* Ícones de navegação */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4 mb-12">
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <div>
                <NavButton icon={<Home size={24} />} label="Convenente" />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center mb-6">Cadastro de Convenente</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <FormularioModerno />
              </div>
            </DialogContent>
          </Dialog>
          <NavButton icon={<Folder size={24} />} label="Importar Arquivo" />
          <NavButton icon={<FileSearch size={24} />} label="Verificar Erros" />
          <NavButton icon={<Database size={24} />} label="Processar Arquivos" />
          <NavButton icon={<Radio size={24} />} label="Transmissões" />
          <NavButton icon={<Repeat size={24} />} label="Processar Retornos" />
          <NavButton icon={<FileText size={24} />} label="Relatórios" />
          <NavButton icon={<Search size={24} />} label="Consultas" />
          <NavButton icon={<Settings size={24} />} label="Configurações" />
          <NavButton icon={<LogOut size={24} />} label="Sair" />
        </div>
      </div>
      
      {/* Status bar - Now at the bottom of the page */}
      <div className="mt-auto p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Terça-Feira</h2>
            <p>29 de Abril de 2025</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Sistema Online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para os botões de navegação
const NavButton = ({ icon, label }) => {
  return (
    <button className="flex flex-col items-center justify-center bg-white hover:bg-blue-50 p-4 rounded-lg shadow-md transition-all hover:shadow-lg border border-blue-100">
      <div className="p-2 bg-blue-100 rounded-full text-blue-700 mb-2">
        {icon}
      </div>
      <span className="text-sm text-gray-800 text-center">{label}</span>
    </button>
  );
};

export default Index;

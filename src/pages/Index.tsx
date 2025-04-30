
import { useState } from "react";
import FormularioModerno from "@/components/FormularioModerno";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Home, 
  FileUp, 
  FileSearch, 
  Package, 
  Send, 
  RefreshCw, 
  FileText, 
  Search, 
  Settings, 
  LogOut 
} from "lucide-react";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleConvenenteClick = () => {
    console.log("Convenente button clicked");
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Header com gradiente azul */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">GERADOR DE PAGAMENTOS V1.01</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex-grow">
        {/* Ícones de navegação em uma única linha */}
        <div className="flex overflow-x-auto pb-4 mb-12 gap-2">
          <NavButton 
            icon={<Home size={24} />} 
            label="Convenente" 
            onClick={handleConvenenteClick} 
          />
          <NavButton 
            icon={<FileUp size={24} />} 
            label="Importar Planilha" 
            onClick={() => {}} 
          />
          <NavButton 
            icon={<FileSearch size={24} />} 
            label="Verificar Erros" 
            onClick={() => {}} 
          />
          <NavButton 
            icon={<Package size={24} />} 
            label="Gerar Remessa" 
            onClick={() => {}} 
          />
          <NavButton 
            icon={<Send size={24} />} 
            label="Enviar ao Banco" 
            onClick={() => {}} 
          />
          <NavButton 
            icon={<RefreshCw size={24} />} 
            label="Processar Retornos" 
            onClick={() => {}} 
          />
          <NavButton 
            icon={<FileText size={24} />} 
            label="Comprovantes" 
            onClick={() => {}} 
          />
          <NavButton 
            icon={<Search size={24} />} 
            label="Consultas" 
            onClick={() => {}} 
          />
          <NavButton 
            icon={<Settings size={24} />} 
            label="Configurações" 
            onClick={() => {}} 
          />
          <NavButton 
            icon={<LogOut size={24} />} 
            label="Sair" 
            onClick={() => {}} 
          />
        </div>
      </div>
      
      {/* Modal de Cadastro de Convenente */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-6">Cadastro de Convenente</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <FormularioModerno />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Status bar - Fixed at the bottom */}
      <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Terça-Feira</h2>
            <p className="text-sm">29 de Abril de 2025</p>
          </div>
          <div className="text-right">
            <p className="text-sm">Sistema Online</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Componente auxiliar para os botões de navegação
const NavButton = ({ icon, label, onClick }) => {
  return (
    <button 
      className="flex-shrink-0 w-24 h-24 bg-white hover:bg-blue-50 rounded-lg shadow-md transition-all hover:shadow-lg border border-blue-100 flex flex-col items-center justify-center p-3"
      onClick={onClick}
    >
      <div className="p-2 bg-blue-100 rounded-full text-blue-700 mb-1">
        {icon}
      </div>
      <span className="text-xs text-gray-800 text-center mt-1">{label}</span>
    </button>
  );
};

export default Index;

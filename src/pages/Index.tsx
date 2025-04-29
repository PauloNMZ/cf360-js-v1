
import { useState } from "react";
import FormularioModerno from "@/components/FormularioModerno";
import FormularioProfissional from "@/components/FormularioProfissional";
import FormularioElegante from "@/components/FormularioElegante";
import FormularioCorporativo from "@/components/FormularioCorporativo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { 
  Home, 
  Folder, 
  FileSearch, 
  Database, 
  Transmit, 
  Repeat, 
  FileText, 
  Search, 
  Settings, 
  LogOut 
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header com gradiente azul */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">GERADOR DE PAGAMENTOS V1.01</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Ícones de navegação */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4 mb-12">
          <NavButton icon={<Home size={24} />} label="Convenente" />
          <NavButton icon={<Folder size={24} />} label="Importar Arquivo" />
          <NavButton icon={<FileSearch size={24} />} label="Verificar Erros" />
          <NavButton icon={<Database size={24} />} label="Processar Arquivos" />
          <NavButton icon={<Transmit size={24} />} label="Transmissões" />
          <NavButton icon={<Repeat size={24} />} label="Processar Retornos" />
          <NavButton icon={<FileText size={24} />} label="Relatórios" />
          <NavButton icon={<Search size={24} />} label="Consultas" />
          <NavButton icon={<Settings size={24} />} label="Configurações" />
          <NavButton icon={<LogOut size={24} />} label="Sair" />
        </div>
        
        {/* Componentes de formulário dentro do card */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Variações de Design para Formulário de Cadastro</h2>
          <p className="text-lg text-gray-600">
            Diferentes estilos visuais para o formulário de cadastro de convenentes
          </p>
        </div>
        
        <Tabs defaultValue="moderno" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-blue-100">
              <TabsTrigger value="moderno" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Moderno</TabsTrigger>
              <TabsTrigger value="profissional" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Profissional</TabsTrigger>
              <TabsTrigger value="elegante" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Elegante</TabsTrigger>
              <TabsTrigger value="corporativo" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Corporativo</TabsTrigger>
            </TabsList>
          </div>
          
          <Card className="border border-blue-200 shadow-lg overflow-hidden">
            <TabsContent value="moderno">
              <FormularioModerno />
            </TabsContent>
            
            <TabsContent value="profissional">
              <FormularioProfissional />
            </TabsContent>
            
            <TabsContent value="elegante">
              <FormularioElegante />
            </TabsContent>
            
            <TabsContent value="corporativo">
              <FormularioCorporativo />
            </TabsContent>
          </Card>
        </Tabs>
        
        {/* Status bar */}
        <div className="mt-12 p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-md shadow-md">
          <div className="flex justify-between items-center">
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

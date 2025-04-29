
import { useState } from "react";
import FormularioModerno from "@/components/FormularioModerno";
import FormularioProfissional from "@/components/FormularioProfissional";
import FormularioElegante from "@/components/FormularioElegante";
import FormularioCorporativo from "@/components/FormularioCorporativo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Variações de Design para Formulário de Cadastro</h1>
          <p className="text-lg text-gray-600">
            Diferentes estilos visuais para o formulário de cadastro de convenentes
          </p>
        </div>
        
        <Tabs defaultValue="moderno" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="moderno">Moderno</TabsTrigger>
              <TabsTrigger value="profissional">Profissional</TabsTrigger>
              <TabsTrigger value="elegante">Elegante</TabsTrigger>
              <TabsTrigger value="corporativo">Corporativo</TabsTrigger>
            </TabsList>
          </div>
          
          <Card className="border shadow-lg overflow-hidden">
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
        
        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Selecione uma das abas acima para visualizar diferentes estilos de formulário.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;

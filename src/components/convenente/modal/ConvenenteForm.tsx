
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormularioModerno from "@/components/FormularioModerno";
import ConvenenteCredentialsSection from "@/components/convenente/ConvenenteCredentialsSection";
import { ConvenenteData } from "@/types/convenente";

interface ConvenenteFormProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: ConvenenteData;
  formMode: 'view' | 'create' | 'edit';
  currentConvenenteId: string | null;
  onFormDataChange: (data: ConvenenteData) => void;
}

const ConvenenteForm: React.FC<ConvenenteFormProps> = ({
  activeTab,
  setActiveTab,
  formData,
  formMode,
  currentConvenenteId,
  onFormDataChange
}) => {
  // Somente mostrar a aba de credenciais se houver um convenente selecionado
  const showCredentialsTab = formMode === 'view' && currentConvenenteId !== null;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="dados">Dados Cadastrais</TabsTrigger>
        {showCredentialsTab && (
          <TabsTrigger value="credenciais">Credenciais de API</TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="dados" className="mt-0">
        <ScrollArea className="h-[500px] pr-4">
          <div className="py-4">
            <FormularioModerno 
              onFormDataChange={onFormDataChange} 
              formMode={formMode}
              initialData={formData} 
            />
          </div>
        </ScrollArea>
      </TabsContent>
      
      {showCredentialsTab && (
        <TabsContent value="credenciais" className="mt-0">
          <ScrollArea className="h-[500px] pr-4">
            <div className="py-4">
              <ConvenenteCredentialsSection 
                convenenteId={currentConvenenteId}
              />
            </div>
          </ScrollArea>
        </TabsContent>
      )}
    </Tabs>
  );
};

export default ConvenenteForm;

import React, { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConvenenteCredentialsSection from "@/components/convenente/ConvenenteCredentialsSection";
import { ConvenenteData } from "@/types/convenente";
import CompanyInfoSection from "@/components/ConvenenteForm/CompanyInfoSection";
import ContactInfoSection, { ContactInfoSectionRef } from "@/components/ConvenenteForm/ContactInfoSection";
import BankInfoSection from "@/components/ConvenenteForm/BankInfoSection";
import { useConvenenteForm } from "@/hooks/useConvenenteForm";

interface ConvenenteFormProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formMode: 'view' | 'create' | 'edit';
  currentConvenenteId: string | null;
  onSave: (data: ConvenenteData) => void;
  initialData?: Partial<ConvenenteData>;
}

const ConvenenteForm: React.FC<ConvenenteFormProps> = ({
  activeTab,
  setActiveTab,
  formMode,
  currentConvenenteId,
  onSave,
  initialData = {}
}) => {
  const contactInfoRef = useRef<ContactInfoSectionRef>(null);

  const {
    cnpjInput,
    formData,
    errors,
    isLoading: formLoading,
    pixKeyType,
    handleCNPJSearch,
    handleCNPJChange,
    handleInputChange,
    handleBlur,
    handlePixKeyTypeChange,
    getPixKeyPlaceholder,
  } = useConvenenteForm({ 
    formMode, 
    initialData,
    contactInfoRef,
    onFormDataChange: () => {}
  });

  const showCredentialsTab = formMode === 'view' && currentConvenenteId !== null;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="dadosCadastrais">Dados Cadastrais</TabsTrigger>
        <TabsTrigger value="contato">Relacionamentos</TabsTrigger>
        <TabsTrigger value="dadosBancarios">Dados Bancários</TabsTrigger>
        {showCredentialsTab && (
          <TabsTrigger value="credenciais">Credenciais de API</TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="dadosCadastrais" className="mt-0">
        <ScrollArea className="h-[400px] pr-4">
          <div className="pt-2 pb-0">
            <CompanyInfoSection 
              cnpjInput={cnpjInput}
              formData={formData}
              errors={errors}
              handleCNPJChange={handleCNPJChange}
              handleInputChange={handleInputChange}
              handleBlur={handleBlur}
              handleCNPJSearch={handleCNPJSearch}
              isLoading={formLoading}
              formMode={formMode}
            />
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="contato" className="mt-0">
        <ScrollArea className="h-[400px] pr-4">
          <div className="pt-2 pb-0">
            <ContactInfoSection 
              ref={contactInfoRef}
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              handleBlur={handleBlur}
              formMode={formMode}
            />
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="dadosBancarios" className="mt-0">
        <ScrollArea className="h-[400px] pr-4">
          <div className="pt-2 pb-0">
            <BankInfoSection 
              formData={formData}
              handleInputChange={handleInputChange}
              formMode={formMode}
              pixKeyType={pixKeyType}
              handlePixKeyTypeChange={handlePixKeyTypeChange}
              getPixKeyPlaceholder={getPixKeyPlaceholder}
            />
          </div>
        </ScrollArea>
      </TabsContent>

      {showCredentialsTab && (
        <TabsContent value="credenciais" className="mt-0">
          <ScrollArea className="h-[400px] pr-4">
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

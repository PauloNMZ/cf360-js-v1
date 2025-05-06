
import React, { useRef } from "react";
import { useConvenenteForm } from "@/hooks/useConvenenteForm";
import { ConvenenteData } from "@/types/convenente";
import FormHeader from "./ConvenenteForm/FormHeader";
import CompanyInfoSection from "./ConvenenteForm/CompanyInfoSection";
import ContactInfoSection, { ContactInfoSectionRef } from "./ConvenenteForm/ContactInfoSection";
import BankInfoSection from "./ConvenenteForm/BankInfoSection";
import FormFooter from "./ConvenenteForm/FormFooter";

type FormularioModernoProps = {
  onFormDataChange: (data: ConvenenteData) => void;
  formMode: 'view' | 'create' | 'edit';
  initialData?: Partial<ConvenenteData>;
};

const FormularioModerno = ({ onFormDataChange, formMode, initialData = {} }: FormularioModernoProps) => {
  const contactInfoRef = useRef<ContactInfoSectionRef>(null);

  const {
    cnpjInput,
    formData,
    errors,
    isLoading,
    pixKeyType,
    handleCNPJSearch,
    handleCNPJChange,
    handleInputChange,
    handleBlur,
    handlePixKeyTypeChange,
    getPixKeyPlaceholder,
    setContactInfoRef
  } = useConvenenteForm({ 
    onFormDataChange, 
    formMode, 
    initialData,
  });

  // Pass the ref to the hook so it can be used for focus management
  React.useEffect(() => {
    setContactInfoRef(contactInfoRef);
  }, [setContactInfoRef]);

  return (
    <div className="bg-white p-6 rounded-lg dark:bg-background dark:text-foreground">
      <FormHeader />

      {/* Informações Cadastrais da Empresa */}
      <CompanyInfoSection 
        cnpjInput={cnpjInput}
        formData={formData}
        errors={errors}
        handleCNPJChange={handleCNPJChange}
        handleInputChange={handleInputChange}
        handleBlur={handleBlur}
        handleCNPJSearch={handleCNPJSearch}
        isLoading={isLoading}
        formMode={formMode}
      />
      
      {/* Informações de Contato */}
      <ContactInfoSection 
        ref={contactInfoRef}
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
        handleBlur={handleBlur}
        formMode={formMode}
      />

      {/* Dados Bancários */}
      <BankInfoSection 
        formData={formData}
        handleInputChange={handleInputChange}
        formMode={formMode}
        pixKeyType={pixKeyType}
        handlePixKeyTypeChange={handlePixKeyTypeChange}
        getPixKeyPlaceholder={getPixKeyPlaceholder}
      />

      <FormFooter />
    </div>
  );
};

export default FormularioModerno;

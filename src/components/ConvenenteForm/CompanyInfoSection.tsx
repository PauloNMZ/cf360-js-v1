import React from 'react';
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";
import { ConvenenteData } from "@/types/convenente";
import CNPJSearchField from './CNPJSearchField';

type CompanyInfoSectionProps = {
  cnpjInput: string;
  formData: ConvenenteData;
  errors: Record<string, string | undefined>;
  handleCNPJChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleCNPJSearch: () => void;
  isLoading: boolean;
  formMode: 'view' | 'create' | 'edit';
  inputRef?: React.RefObject<HTMLInputElement>;
};

const CompanyInfoSection = ({
  cnpjInput,
  formData,
  errors,
  handleCNPJChange,
  handleInputChange,
  handleBlur,
  handleCNPJSearch,
  isLoading,
  formMode,
  inputRef
}: CompanyInfoSectionProps) => {
  const isViewOnly = formMode === 'view';

  return (
    <div className="mb-8 px-4 md:px-0">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-700 border-b-2 border-border pb-2 text-left dark:text-blue-400">
          Informações Cadastrais da Empresa
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-4">
        <CNPJSearchField 
          cnpjInput={cnpjInput}
          handleCNPJChange={handleCNPJChange}
          handleBlur={handleBlur}
          handleCNPJSearch={handleCNPJSearch}
          isLoading={isLoading}
          error={errors.cnpj}
          disabled={isViewOnly}
          inputRef={inputRef}
        />
        
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <span className="p-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </span>
            Razão Social*
          </label>
          <div className="flex flex-col">
            <Input 
              placeholder="Nome da empresa" 
              className={`border-input dark:border-input focus:border-blue-500 bg-background dark:bg-background text-foreground ${errors.razaoSocial ? 'border-destructive' : ''}`}
              name="razaoSocial"
              value={formData.razaoSocial}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={isViewOnly}
              required
            />
            {errors.razaoSocial && <FormError message={errors.razaoSocial} />}
          </div>
        </div>

        {/* Endereço e Cidade juntos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:col-span-2">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <span className="p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </span>
              Nome da Rua, Av, Pça, Travessa, etc.
            </label>
            <div className="flex flex-col">
              <Input 
                placeholder="Endereço" 
                className={`border-input dark:border-input focus:border-blue-500 bg-background dark:bg-background text-foreground ${errors.endereco ? 'border-destructive' : ''}`}
                name="endereco"
                value={formData.endereco}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={isViewOnly}
              />
              {errors.endereco && <FormError message={errors.endereco} />}
            </div>
          </div>
          
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-foreground">Cidade</label>
            <Input 
              placeholder="Cidade" 
              className="border-input dark:border-input focus:border-blue-500 bg-background dark:bg-background text-foreground" 
              name="cidade"
              value={formData.cidade}
              onChange={handleInputChange}
              disabled={isViewOnly}
            />
          </div>
        </div>

        {/* Número, Complemento/Bairro e UF juntos */}
        <div className="grid grid-cols-3 gap-3 md:col-span-2">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-foreground">Nr</label>
            <Input 
              placeholder="000" 
              className="border-input dark:border-input focus:border-blue-500 bg-background dark:bg-background text-foreground" 
              name="numero"
              value={formData.numero}
              onChange={handleInputChange}
              disabled={isViewOnly}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-foreground">Compl./Bairro</label>
            <Input 
              placeholder="Bairro" 
              className="border-input dark:border-input focus:border-blue-500 bg-background dark:bg-background text-foreground" 
              name="complemento"
              value={formData.complemento}
              onChange={handleInputChange}
              disabled={isViewOnly}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-foreground">UF</label>
            <Input 
              placeholder="UF" 
              className="border-input dark:border-input focus:border-blue-500 bg-background dark:bg-background text-foreground" 
              name="uf"
              value={formData.uf}
              onChange={handleInputChange}
              disabled={isViewOnly}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoSection;

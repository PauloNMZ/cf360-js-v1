
import React from 'react';
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConvenenteData } from "@/types/convenente";
import { PixKeyType } from '@/hooks/useConvenenteForm';

type BankInfoSectionProps = {
  formData: ConvenenteData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formMode: 'view' | 'create' | 'edit';
  pixKeyType: PixKeyType;
  handlePixKeyTypeChange: (value: PixKeyType) => void;
  getPixKeyPlaceholder: () => string;
};

const BankInfoSection = ({
  formData,
  handleInputChange,
  formMode,
  pixKeyType,
  handlePixKeyTypeChange,
  getPixKeyPlaceholder
}: BankInfoSectionProps) => {
  const isViewOnly = formMode === 'view';

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-700 border-b-2 border-blue-200 pb-2 text-left dark:text-blue-400 dark:border-blue-800">
          Dados Bancários
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 dark:text-gray-300">
              <span className="bg-blue-100 p-1 rounded dark:bg-blue-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </span>
              Agência
            </label>
            <Input 
              placeholder="0000" 
              className="border-blue-200 focus:border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-800" 
              name="agencia"
              value={formData.agencia}
              onChange={handleInputChange}
              disabled={isViewOnly}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 dark:text-gray-300">
              <span className="bg-blue-100 p-1 rounded dark:bg-blue-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </span>
              Conta
            </label>
            <Input 
              placeholder="00000-0" 
              className="border-blue-200 focus:border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-800" 
              name="conta"
              value={formData.conta}
              onChange={handleInputChange}
              disabled={isViewOnly}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2 dark:text-gray-300">
            <span className="bg-blue-100 p-1 rounded dark:bg-blue-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </span>
            Chave Pix
          </label>
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-1">
              <Select 
                value={pixKeyType} 
                onValueChange={(value) => handlePixKeyTypeChange(value as PixKeyType)}
                disabled={isViewOnly}
              >
                <SelectTrigger className="border-blue-200 focus:border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="CNPJ">CNPJ</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="telefone">Telefone</SelectItem>
                  <SelectItem value="aleatoria">Aleatória</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-3">
              <Input 
                placeholder={getPixKeyPlaceholder()}
                className="border-blue-200 focus:border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-800" 
                name="chavePix"
                value={formData.chavePix}
                onChange={handleInputChange}
                disabled={isViewOnly}
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2 dark:text-gray-300">
            <span className="bg-blue-100 p-1 rounded dark:bg-blue-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
            Convênio Pag
          </label>
          <Input 
            placeholder="Convênio" 
            className="border-blue-200 focus:border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-800" 
            name="convenioPag"
            value={formData.convenioPag}
            onChange={handleInputChange}
            disabled={isViewOnly}
          />
        </div>
      </div>
    </div>
  );
};

export default BankInfoSection;

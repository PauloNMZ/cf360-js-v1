
import React from 'react';
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";
import { ConvenenteData } from "@/types/convenente";

type ContactInfoSectionProps = {
  formData: ConvenenteData;
  errors: Record<string, string | undefined>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  formMode: 'view' | 'create' | 'edit';
};

const ContactInfoSection = ({
  formData,
  errors,
  handleInputChange,
  handleBlur,
  formMode
}: ContactInfoSectionProps) => {
  const isViewOnly = formMode === 'view';

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-700 border-b-2 border-blue-200 pb-2 text-left dark:text-blue-400 dark:border-blue-800">
          Informações de Contato
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2 dark:text-gray-300">
            <span className="bg-blue-100 p-1 rounded dark:bg-blue-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            Nome de Contato
          </label>
          <Input 
            placeholder="Nome" 
            className="border-blue-200 focus:border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-800" 
            name="contato"
            value={formData.contato}
            onChange={handleInputChange}
            disabled={isViewOnly}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 dark:text-gray-300">
              <span className="bg-blue-100 p-1 rounded dark:bg-blue-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              Fone
            </label>
            <div className="flex flex-col">
              <Input 
                placeholder="(00) 0000-0000" 
                className={`border-blue-200 focus:border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 ${errors.fone ? 'border-red-500' : ''}`}
                name="fone"
                value={formData.fone}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={isViewOnly}
              />
              {errors.fone && <FormError message={errors.fone} />}
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 dark:text-gray-300">
              <span className="bg-blue-100 p-1 rounded dark:bg-blue-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </span>
              Celular/WhatsApp
            </label>
            <div className="flex flex-col">
              <Input 
                placeholder="(00) 00000-0000" 
                className={`border-blue-200 focus:border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 ${errors.celular ? 'border-red-500' : ''}`}
                name="celular"
                value={formData.celular}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={isViewOnly}
              />
              {errors.celular && <FormError message={errors.celular} />}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2 dark:text-gray-300">
            <span className="bg-blue-100 p-1 rounded dark:bg-blue-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            E-mail
          </label>
          <div className="flex flex-col">
            <Input 
              placeholder="exemplo@email.com" 
              className={`border-blue-200 focus:border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 ${errors.email ? 'border-red-500' : ''}`}
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={isViewOnly}
            />
            {errors.email && <FormError message={errors.email} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSection;

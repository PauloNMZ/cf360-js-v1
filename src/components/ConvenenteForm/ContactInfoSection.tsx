import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
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

export interface ContactInfoSectionRef {
  focusCelularField: () => void;
}

const ContactInfoSection = forwardRef<ContactInfoSectionRef, ContactInfoSectionProps>(({
  formData,
  errors,
  handleInputChange,
  handleBlur,
  formMode
}, ref) => {
  const isViewOnly = formMode === 'view';
  const celularInputRef = useRef<HTMLInputElement>(null);
  const [focusAttempts, setFocusAttempts] = useState(0);

  // Improved focus method with retry mechanism
  const focusCelularField = () => {
    console.log("focusCelularField called, ref exists:", !!celularInputRef.current);
    
    if (celularInputRef.current) {
      try {
        celularInputRef.current.focus();
        celularInputRef.current.select();
        console.log("Focus set successfully on first attempt");
      } catch (e) {
        console.log("Focus failed on first attempt, scheduling retries");
        setFocusAttempts(prev => prev + 1);
      }
    } else {
      console.log("Ref not available, scheduling retry");
      setFocusAttempts(prev => prev + 1);
    }
  };

  // Retry focus when attempts counter changes
  useEffect(() => {
    if (focusAttempts > 0) {
      const timeoutId = setTimeout(() => {
        if (celularInputRef.current) {
          try {
            console.log(`Focus retry attempt ${focusAttempts}`);
            celularInputRef.current.focus();
            celularInputRef.current.select();
            console.log("Focus retry succeeded");
          } catch (e) {
            if (focusAttempts < 5) {
              console.log("Focus retry failed, scheduling another");
              setFocusAttempts(prev => prev + 1);
            } else {
              console.log("Max focus retries reached, giving up");
            }
          }
        }
      }, 200 * focusAttempts); // Increase delay with each attempt
      
      return () => clearTimeout(timeoutId);
    }
  }, [focusAttempts]);

  // Expose methods through the ref with better implementation
  useImperativeHandle(ref, () => ({
    focusCelularField
  }), []);

  return (
    <div className="mb-8 px-4 md:px-0">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-700 border-b-2 border-blue-200 pb-2 text-left dark:text-blue-400 dark:border-blue-800">
          Informações de Contato
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-4">
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <span className="p-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            Nome de Contato
          </label>
          <Input 
            placeholder="Nome" 
            className="border-input dark:border-input focus:border-blue-500 bg-input dark:bg-input text-foreground" 
            name="contato"
            value={formData.contato}
            onChange={handleInputChange}
            disabled={isViewOnly}
          />
        </div>

        {/* Fone e Celular/WhatsApp juntos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <span className="p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              Fone
            </label>
            <div className="flex flex-col">
              <Input 
                placeholder="(00) 0000-0000" 
                className={`border-input dark:border-input focus:border-blue-500 bg-input dark:bg-input text-foreground ${errors.fone ? 'border-destructive' : ''}`}
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
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <span className="p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </span>
              Celular/WhatsApp
            </label>
            <div className="flex flex-col">
              <Input 
                ref={celularInputRef} 
                placeholder="(00) 00000-0000" 
                className={`border-input dark:border-input focus:border-blue-500 bg-input dark:bg-input text-foreground ${errors.celular ? 'border-destructive' : ''}`}
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
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <span className="p-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            E-mail
          </label>
          <div className="flex flex-col">
            <Input 
              placeholder="exemplo@email.com" 
              className={`border-input dark:border-input focus:border-blue-500 bg-input dark:bg-input text-foreground ${errors.email ? 'border-destructive' : ''}`}
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
});

ContactInfoSection.displayName = 'ContactInfoSection';

export default ContactInfoSection;

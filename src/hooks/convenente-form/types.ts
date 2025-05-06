
import { ConvenenteData } from "@/types/convenente";
import { ContactInfoSectionRef } from "@/components/ConvenenteForm/ContactInfoSection";

export type FormErrors = {
  cnpj?: string;
  razaoSocial?: string;
  endereco?: string;
  email?: string;
  fone?: string;
  celular?: string;
  [key: string]: string | undefined;
};

export type PixKeyType = 'CNPJ' | 'email' | 'telefone' | 'aleatoria';

export type UseConvenenteFormProps = {
  onFormDataChange: (data: ConvenenteData) => void;
  formMode: 'view' | 'create' | 'edit';
  initialData?: Partial<ConvenenteData>;
};

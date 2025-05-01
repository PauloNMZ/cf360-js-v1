
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useCNPJQuery } from "@/hooks/useCNPJQuery";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";
import { formatCNPJ, formatPhone, validateCNPJ, validateEmail, validatePhone } from "@/utils/formValidation";

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

type UseConvenenteFormProps = {
  onFormDataChange: (data: ConvenenteData) => void;
  formMode: 'view' | 'create' | 'edit';
  initialData?: Partial<ConvenenteData>;
};

export const useConvenenteForm = ({ 
  onFormDataChange, 
  formMode, 
  initialData = {} 
}: UseConvenenteFormProps) => {
  const { toast } = useToast();
  const [cnpjInput, setCnpjInput] = useState("");
  const [formData, setFormData] = useState<ConvenenteData>({...emptyConvenente});
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [pixKeyType, setPixKeyType] = useState<PixKeyType>('CNPJ');

  // Initialize form with provided data
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
      
      if (initialData.cnpj) {
        setCnpjInput(formatCNPJ(initialData.cnpj));
      }
      
      // Mark fields as touched when there's initial data
      if (initialData.razaoSocial) {
        setTouched(prev => ({
          ...prev,
          razaoSocial: true
        }));
      }
    }
  }, [initialData]);

  // Reset form if formMode is 'create'
  useEffect(() => {
    if (formMode === 'create') {
      setFormData({...emptyConvenente});
      setCnpjInput("");
      setErrors({});
      setTouched({});
      setDataLoaded(false);
    }
  }, [formMode]);

  // Validate fields and notify parent component
  useEffect(() => {
    validateForm();
    
    if (onFormDataChange && (dataLoaded || Object.keys(touched).length > 0)) {
      onFormDataChange(formData);
    }
  }, [formData, dataLoaded, onFormDataChange]);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    // Validate CNPJ
    if (touched.cnpj && formData.cnpj && !validateCNPJ(formData.cnpj)) {
      newErrors.cnpj = "CNPJ inválido";
    }
    
    // Validate required fields
    if (touched.razaoSocial && (!formData.razaoSocial || formData.razaoSocial.trim() === '')) {
      newErrors.razaoSocial = "Razão social é obrigatória";
    }
    
    // Validate email
    if (touched.email && formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Email inválido";
    }
    
    // Validate phone
    if (touched.fone && formData.fone && !validatePhone(formData.fone)) {
      newErrors.fone = "Telefone inválido";
    }
    
    // Validate cell phone
    if (touched.celular && formData.celular && !validatePhone(formData.celular)) {
      newErrors.celular = "Celular inválido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { fetchCNPJ, isLoading } = useCNPJQuery({
    onSuccess: (data) => {
      // Make sure a valid business name was received
      if (!data.razao_social || data.razao_social.trim() === '') {
        toast({
          title: "Dados incompletos",
          description: "A consulta não retornou uma razão social válida.",
          variant: "destructive",
        });
        return;
      }
      
      const formattedData = {
        cnpj: data.cnpj || "",
        razaoSocial: data.razao_social || "",
        endereco: data.logradouro || "",
        numero: data.numero || "",
        complemento: data.complemento || "",
        uf: data.uf || "",
        cidade: data.municipio || "",
        contato: data.qsa && data.qsa.length > 0 ? data.qsa[0].nome_socio || "" : "",
        fone: data.ddd_telefone_1 ? formatPhone(data.ddd_telefone_1) : "",
        celular: data.ddd_telefone_2 ? formatPhone(data.ddd_telefone_2) : "",
        email: data.email || "",
        agencia: formData.agencia || "",  // Preserve fields not from API
        conta: formData.conta || "",
        chavePix: formData.chavePix || "",
        convenioPag: formData.convenioPag || ""
      };
      
      console.log("Dados formatados da API:", formattedData);
      
      setFormData(formattedData);
      setDataLoaded(true);
      
      // Mark fields as touched based on their values
      setTouched({
        cnpj: true,
        razaoSocial: true,
        endereco: Boolean(formattedData.endereco),
        email: Boolean(formattedData.email),
        fone: Boolean(formattedData.fone),
        celular: Boolean(formattedData.celular)
      });
      
      toast({
        title: "Dados encontrados",
        description: `CNPJ ${data.cnpj} carregado com sucesso.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao consultar CNPJ",
        description: `${error}`,
        variant: "destructive",
      });
    }
  });

  const handleCNPJSearch = () => {
    // Remove non-numeric characters
    const cnpjClean = cnpjInput.replace(/\D/g, '');
    
    // Check if there's input before querying
    if (!cnpjClean) {
      toast({
        title: "Campo vazio",
        description: "Digite um CNPJ para pesquisar.",
        variant: "destructive",
      });
      return;
    }
    
    fetchCNPJ(cnpjClean);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Apply specific formatting depending on the field
    if (name === 'fone' || name === 'celular') {
      setFormData(prev => ({
        ...prev,
        [name]: formatPhone(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Debug log
    console.log(`Campo ${name} alterado para: ${value}`);
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCnpjInput(formatCNPJ(value));
    setFormData(prev => ({
      ...prev,
      cnpj: value.replace(/\D/g, '')
    }));
    setTouched(prev => ({ ...prev, cnpj: true }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm();
  };

  const handlePixKeyTypeChange = (value: PixKeyType) => {
    setPixKeyType(value);
    // Clear the PIX key field when changing type
    setFormData(prev => ({
      ...prev,
      chavePix: ""
    }));
  };

  const getPixKeyPlaceholder = () => {
    switch (pixKeyType) {
      case 'CNPJ':
        return "00.000.000/0000-00";
      case 'email':
        return "exemplo@email.com";
      case 'telefone':
        return "+55 (00) 00000-0000";
      case 'aleatoria':
        return "Chave aleatória";
      default:
        return "Chave Pix";
    }
  };

  return {
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
    getPixKeyPlaceholder
  };
};

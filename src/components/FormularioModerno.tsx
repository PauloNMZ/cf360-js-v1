import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCNPJQuery } from "@/hooks/useCNPJQuery";
import { useToast } from "@/components/ui/use-toast";
import { FormError } from "@/components/ui/form-error";
import { 
  formatCNPJ, 
  formatPhone, 
  validateCNPJ, 
  validateEmail, 
  validatePhone 
} from "@/utils/formValidation";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";

type FormErrors = {
  cnpj?: string;
  razaoSocial?: string;
  endereco?: string;
  email?: string;
  fone?: string;
  celular?: string;
  [key: string]: string | undefined;
};

type FormularioModernoProps = {
  onFormDataChange: (data: ConvenenteData) => void;
  formMode: 'view' | 'create' | 'edit';
  initialData?: Partial<ConvenenteData>;
};

const FormularioModerno = ({ onFormDataChange, formMode, initialData = {} }: FormularioModernoProps) => {
  const { toast } = useToast();
  const [cnpjInput, setCnpjInput] = useState("");
  const [formData, setFormData] = useState<ConvenenteData>({...emptyConvenente});
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    // Initialize form with provided data, if any
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
      
      if (initialData.cnpj) {
        setCnpjInput(formatCNPJ(initialData.cnpj));
      }
    }
  }, [initialData]);

  useEffect(() => {
    // Reset form if formMode is 'create'
    if (formMode === 'create') {
      setFormData({...emptyConvenente});
      setCnpjInput("");
      setErrors({});
      setTouched({});
      setDataLoaded(false); // Reset the dataLoaded flag
    }
  }, [formMode]);

  useEffect(() => {
    // Validate fields when they change
    validateForm();
    
    // Notify parent component about form data changes only if we're not in the middle of loading data
    // This prevents infinite loops by ensuring we only notify when the user changes data or initial data is loaded
    if (onFormDataChange && (dataLoaded || Object.keys(touched).length > 0)) {
      onFormDataChange(formData);
    }
  }, [formData, dataLoaded]);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    // Validate CNPJ
    if (touched.cnpj && formData.cnpj && !validateCNPJ(formData.cnpj)) {
      newErrors.cnpj = "CNPJ inválido";
    }
    
    // Validate required fields
    if (touched.razaoSocial && !formData.razaoSocial) {
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
        agencia: "",  // API doesn't provide banking data
        conta: "",
        chavePix: "",
        convenioPag: ""
      };
      
      setFormData(formattedData);
      setDataLoaded(true);
      
      setTouched({
        cnpj: true,
        razaoSocial: true,
        endereco: true,
        email: true,
        fone: true,
        celular: true
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
    
    // Removed CNPJ validation check, passing directly to the API
    // Just check if the CNPJ has some input
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

  const handleInputChange = (e) => {
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
  };

  const handleCNPJChange = (e) => {
    const value = e.target.value;
    setCnpjInput(formatCNPJ(value));
    setFormData(prev => ({
      ...prev,
      cnpj: value.replace(/\D/g, '')
    }));
    setTouched(prev => ({ ...prev, cnpj: true }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm();
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-lg mb-6">
        <h2 className="text-xl text-white font-medium">CADASTRO DE CONVENENTE</h2>
        <button className="text-white opacity-80 hover:opacity-100">✕</button>
      </div>

      {/* Informações Cadastrais da Empresa */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-700 border-b-2 border-blue-200 pb-2 text-left">Informações Cadastrais da Empresa</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="bg-blue-100 p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
              CNPJ*
            </label>
            <div className="flex flex-col">
              <div className="flex">
                <Input 
                  placeholder="00.000.000/0000-00" 
                  className={`border-blue-200 focus:border-blue-500 bg-blue-50 rounded-r-none ${errors.cnpj ? 'border-red-500' : ''}`}
                  value={cnpjInput}
                  onChange={handleCNPJChange}
                  onBlur={handleBlur}
                  name="cnpj"
                  disabled={formMode === 'view'}
                  required
                />
                <Button 
                  onClick={handleCNPJSearch} 
                  disabled={isLoading || formMode === 'view'} 
                  className="rounded-l-none bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.cnpj && <FormError message={errors.cnpj} />}
            </div>
          </div>
          
          <div className="flex flex-col space-y-1 md:col-span-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="bg-blue-100 p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              Razão Social*
            </label>
            <div className="flex flex-col">
              <Input 
                placeholder="Nome da empresa" 
                className={`border-blue-200 focus:border-blue-500 bg-blue-50 ${errors.razaoSocial ? 'border-red-500' : ''}`}
                name="razaoSocial"
                value={formData.razaoSocial}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={formMode === 'view'}
                required
              />
              {errors.razaoSocial && <FormError message={errors.razaoSocial} />}
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="bg-blue-100 p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </span>
              Nome da Rua, Av, Pça, Travessa, etc.
            </label>
            <div className="flex flex-col">
              <Input 
                placeholder="Endereço" 
                className={`border-blue-200 focus:border-blue-500 bg-blue-50 ${errors.endereco ? 'border-red-500' : ''}`}
                name="endereco"
                value={formData.endereco}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={formMode === 'view'}
              />
              {errors.endereco && <FormError message={errors.endereco} />}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Nr</label>
              <Input 
                placeholder="000" 
                className="border-blue-200 focus:border-blue-500 bg-blue-50" 
                name="numero"
                value={formData.numero}
                onChange={handleInputChange}
                disabled={formMode === 'view'}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Compl./Bairro</label>
              <Input 
                placeholder="Bairro" 
                className="border-blue-200 focus:border-blue-500 bg-blue-50" 
                name="complemento"
                value={formData.complemento}
                onChange={handleInputChange}
                disabled={formMode === 'view'}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">UF</label>
              <Input 
                placeholder="UF" 
                className="border-blue-200 focus:border-blue-500 bg-blue-50" 
                name="uf"
                value={formData.uf}
                onChange={handleInputChange}
                disabled={formMode === 'view'}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">Cidade</label>
            <Input 
              placeholder="Cidade" 
              className="border-blue-200 focus:border-blue-500 bg-blue-50" 
              name="cidade"
              value={formData.cidade}
              onChange={handleInputChange}
              disabled={formMode === 'view'}
            />
          </div>
        </div>
      </div>
      
      {/* Informações de Contato */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-700 border-b-2 border-blue-200 pb-2 text-left">Informações de Contato</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="bg-blue-100 p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              Nome de Contato
            </label>
            <Input 
              placeholder="Nome" 
              className="border-blue-200 focus:border-blue-500 bg-blue-50" 
              name="contato"
              value={formData.contato}
              onChange={handleInputChange}
              disabled={formMode === 'view'}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span className="bg-blue-100 p-1 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                Fone
              </label>
              <div className="flex flex-col">
                <Input 
                  placeholder="(00) 0000-0000" 
                  className={`border-blue-200 focus:border-blue-500 bg-blue-50 ${errors.fone ? 'border-red-500' : ''}`}
                  name="fone"
                  value={formData.fone}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={formMode === 'view'}
                />
                {errors.fone && <FormError message={errors.fone} />}
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span className="bg-blue-100 p-1 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </span>
                Celular/WhatsApp
              </label>
              <div className="flex flex-col">
                <Input 
                  placeholder="(00) 00000-0000" 
                  className={`border-blue-200 focus:border-blue-500 bg-blue-50 ${errors.celular ? 'border-red-500' : ''}`}
                  name="celular"
                  value={formData.celular}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={formMode === 'view'}
                />
                {errors.celular && <FormError message={errors.celular} />}
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="bg-blue-100 p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              E-mail
            </label>
            <div className="flex flex-col">
              <Input 
                placeholder="exemplo@email.com" 
                className={`border-blue-200 focus:border-blue-500 bg-blue-50 ${errors.email ? 'border-red-500' : ''}`}
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={formMode === 'view'}
              />
              {errors.email && <FormError message={errors.email} />}
            </div>
          </div>
        </div>
      </div>

      {/* Dados Bancários */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-700 border-b-2 border-blue-200 pb-2 text-left">Dados Bancários</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span className="bg-blue-100 p-1 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </span>
                Agência
              </label>
              <Input 
                placeholder="0000" 
                className="border-blue-200 focus:border-blue-500 bg-blue-50" 
                name="agencia"
                value={formData.agencia}
                onChange={handleInputChange}
                disabled={formMode === 'view'}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span className="bg-blue-100 p-1 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </span>
                Conta
              </label>
              <Input 
                placeholder="00000-0" 
                className="border-blue-200 focus:border-blue-500 bg-blue-50" 
                name="conta"
                value={formData.conta}
                onChange={handleInputChange}
                disabled={formMode === 'view'}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="bg-blue-100 p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </span>
              Chave Pix
            </label>
            <Input 
              placeholder="Chave Pix" 
              className="border-blue-200 focus:border-blue-500 bg-blue-50" 
              name="chavePix"
              value={formData.chavePix}
              onChange={handleInputChange}
              disabled={formMode === 'view'}
            />
          </div>
          
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="bg-blue-100 p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
              Convênio Pag
            </label>
            <Input 
              placeholder="Convênio" 
              className="border-blue-200 focus:border-blue-500 bg-blue-50" 
              name="convenioPag"
              value={formData.convenioPag}
              onChange={handleInputChange}
              disabled={formMode === 'view'}
            />
          </div>
        </div>
      </div>

      <div className="text-right text-sm text-gray-500 italic">
        * Campos obrigatórios
      </div>
    </div>
  );
};

export default FormularioModerno;

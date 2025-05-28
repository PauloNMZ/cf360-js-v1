
import React, { useState } from 'react';
import { StyledForm, StyledFormFieldProps } from '@/components/ui/styled-form';
import { toast } from 'sonner';

const StyledFormDemoPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    amount: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Empresa é obrigatória';
    }
    
    if (!formData.amount.trim()) {
      newErrors.amount = 'Valor é obrigatório';
    } else if (isNaN(Number(formData.amount))) {
      newErrors.amount = 'Valor deve ser numérico';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Formulário enviado com sucesso!');
      console.log('Form data:', formData);
    }, 2000);
  };

  const formFields: StyledFormFieldProps[] = [
    {
      name: 'name',
      label: 'Nome Completo',
      value: formData.name,
      placeholder: 'Digite seu nome completo',
      required: true,
      error: errors.name,
      onChange: handleInputChange
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      value: formData.email,
      placeholder: 'seu@email.com',
      required: true,
      error: errors.email,
      onChange: handleInputChange
    },
    {
      name: 'phone',
      label: 'Telefone',
      type: 'tel',
      value: formData.phone,
      placeholder: '(11) 99999-9999',
      error: errors.phone,
      onChange: handleInputChange
    },
    {
      name: 'company',
      label: 'Empresa',
      value: formData.company,
      placeholder: 'Nome da empresa',
      required: true,
      error: errors.company,
      onChange: handleInputChange
    },
    {
      name: 'amount',
      label: 'Valor Padrão',
      type: 'number',
      value: formData.amount,
      placeholder: '0.00',
      required: true,
      error: errors.amount,
      onChange: handleInputChange
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto">
        <StyledForm
          title="Formulário Estilizado"
          fields={formFields}
          onSubmit={handleSubmit}
          submitText="Enviar Dados"
          isLoading={isLoading}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default StyledFormDemoPage;

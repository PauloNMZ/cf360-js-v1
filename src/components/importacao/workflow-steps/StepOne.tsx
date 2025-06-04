
import React from 'react';
import { format, parse, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CNABWorkflowData } from '@/types/cnab240';

interface StepOneProps {
  workflow: CNABWorkflowData;
  updateWorkflow: (field: keyof CNABWorkflowData, value: any) => void;
}

const StepOne: React.FC<StepOneProps> = ({ workflow, updateWorkflow }) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  // Função para normalizar datas (remover horário para comparação)
  const normalizeDate = (date: Date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  // Sincronizar o valor do input com a data selecionada
  React.useEffect(() => {
    if (workflow.paymentDate) {
      setInputValue(format(workflow.paymentDate, "dd/MM/yyyy", { locale: ptBR }));
    } else {
      setInputValue('');
    }
  }, [workflow.paymentDate]);

  // Function to handle date selection from calendar
  const handleSelectDate = (date: Date | undefined) => {
    console.log("StepOne - handleSelectDate chamado com:", date);
    updateWorkflow("paymentDate", date);
    setOpen(false);
  };

  // Function to handle manual input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Tentar parsear a data quando o usuário digitar no formato DD/MM/YYYY
    if (value.length === 10) {
      try {
        const parsedDate = parse(value, "dd/MM/yyyy", new Date());
        if (isValid(parsedDate)) {
          console.log("StepOne - Data válida digitada:", parsedDate);
          updateWorkflow("paymentDate", parsedDate);
        }
      } catch (error) {
        console.log("StepOne - Erro ao parsear data:", error);
      }
    }
  };

  // Function to format input as user types
  const formatInputValue = (value: string) => {
    // Remove tudo que não for número
    const numbers = value.replace(/\D/g, '');
    
    // Aplicar máscara DD/MM/YYYY
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const handleInputKeyPress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInputValue(e.target.value);
    setInputValue(formatted);
    
    // Se tiver 10 caracteres (DD/MM/YYYY), tentar parsear
    if (formatted.length === 10) {
      try {
        const parsedDate = parse(formatted, "dd/MM/yyyy", new Date());
        if (isValid(parsedDate)) {
          updateWorkflow("paymentDate", parsedDate);
        }
      } catch (error) {
        // Ignorar erros de parsing
      }
    }
  };

  // Obter data de hoje normalizada
  const today = normalizeDate(new Date());

  return (
    <div className="py-6 space-y-4">
      <p className="text-sm text-gray-500">
        Selecione a data em que os pagamentos serão processados. A data não pode ser inferior a data atual.
      </p>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full relative">
          <div className="flex border border-input rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 has-[:focus]:ring-2 has-[:focus]:ring-ring has-[:focus]:ring-offset-2">
            <Input
              type="text"
              placeholder="DD/MM/AAAA"
              value={inputValue}
              onChange={handleInputKeyPress}
              className="flex-1 border-0 rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
              maxLength={10}
            />
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-l-none border-0 px-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                  onClick={() => setOpen(true)}
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-0 z-[9999]" 
                align="end"
                side="bottom"
                sideOffset={5}
              >
                <Calendar
                  mode="single"
                  selected={workflow.paymentDate}
                  onSelect={handleSelectDate}
                  disabled={(date) => {
                    const normalizedDate = normalizeDate(date);
                    const isDisabled = normalizedDate < today;
                    return isDisabled;
                  }}
                  initialFocus
                  locale={ptBR}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Mensagem de validação */}
          {inputValue && inputValue.length === 10 && workflow.paymentDate && (
            <p className="text-xs text-green-600 mt-1">
              ✓ Data válida: {format(workflow.paymentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          )}
          
          {inputValue && inputValue.length === 10 && !workflow.paymentDate && (
            <p className="text-xs text-red-600 mt-1">
              ✗ Data inválida. Use o formato DD/MM/AAAA
            </p>
          )}
          
          {!inputValue && (
            <p className="text-xs text-gray-400 mt-1">
              Digite a data ou clique no ícone para usar o calendário
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepOne;

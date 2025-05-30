
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CNABWorkflowData } from '@/types/cnab240';

interface StepOneProps {
  workflow: CNABWorkflowData;
  updateWorkflow: (field: keyof CNABWorkflowData, value: any) => void;
}

const StepOne: React.FC<StepOneProps> = ({ workflow, updateWorkflow }) => {
  // Add state for controlling the popover
  const [open, setOpen] = React.useState(false);

  // Function to handle date selection with debugging
  const handleSelectDate = (date: Date | undefined) => {
    console.log("StepOne - handleSelectDate chamado com:", date);
    console.log("StepOne - workflow.paymentDate antes da atualização:", workflow.paymentDate);
    
    updateWorkflow("paymentDate", date);
    
    // Log após a atualização para verificar se foi chamada
    console.log("StepOne - updateWorkflow chamado para paymentDate");
    
    // Close the popover after selecting a date
    setOpen(false);
    console.log("StepOne - Popover fechado");
  };

  // Debug logging for component state
  React.useEffect(() => {
    console.log("StepOne - workflow.paymentDate atualizado para:", workflow.paymentDate);
  }, [workflow.paymentDate]);

  return (
    <div className="py-6 space-y-4">
      <p className="text-sm text-gray-500">
        Selecione a data em que os pagamentos serão processados.
      </p>
      <div className="flex flex-col items-center space-y-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !workflow.paymentDate && "text-muted-foreground"
              )}
              onClick={() => {
                console.log("StepOne - Botão do calendário clicado, abrindo popover");
                setOpen(true);
              }}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {workflow.paymentDate ? (
                format(workflow.paymentDate, "dd/MM/yyyy", { locale: ptBR })
              ) : (
                <span>Selecione uma data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={workflow.paymentDate}
              onSelect={(date) => {
                console.log("StepOne - Calendar onSelect chamado com:", date);
                handleSelectDate(date);
              }}
              disabled={(date) => {
                const isDisabled = date < new Date();
                console.log("StepOne - Data", date, "está desabilitada?", isDisabled);
                return isDisabled;
              }}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default StepOne;

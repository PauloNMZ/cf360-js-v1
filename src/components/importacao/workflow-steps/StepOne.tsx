
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

  // Function to handle date selection
  const handleSelectDate = (date: Date | undefined) => {
    updateWorkflow("paymentDate", date);
    // Close the popover after selecting a date
    setOpen(false);
  };

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
              onSelect={handleSelectDate}
              disabled={(date) => date < new Date()}
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

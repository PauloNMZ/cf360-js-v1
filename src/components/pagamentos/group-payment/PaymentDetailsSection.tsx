
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, DollarSign, FileText } from "lucide-react";

interface PaymentDetailsSectionProps {
  paymentDate: string;
  onPaymentDateChange: (date: string) => void;
  paymentValue: string;
  onPaymentValueChange: (value: string) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
}

const PaymentDetailsSection = ({
  paymentDate,
  onPaymentDateChange,
  paymentValue,
  onPaymentValueChange,
  description,
  onDescriptionChange
}: PaymentDetailsSectionProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Data de Pagamento */}
        <div className="space-y-2">
          <Label htmlFor="payment-date" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Data de Pagamento
          </Label>
          <Input
            id="payment-date"
            type="date"
            value={paymentDate}
            onChange={(e) => onPaymentDateChange(e.target.value)}
            required
          />
        </div>

        {/* Valor (Opcional) */}
        <div className="space-y-2">
          <Label htmlFor="payment-value" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Valor por Favorecido (Opcional)
          </Label>
          <Input
            id="payment-value"
            type="number"
            step="0.01"
            placeholder="0,00"
            value={paymentValue}
            onChange={(e) => onPaymentValueChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Se não informado, será usado o valor individual de cada favorecido no grupo
          </p>
        </div>
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Descrição/Observações
        </Label>
        <Textarea
          id="description"
          placeholder="Descrição do lançamento por grupo..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
        />
      </div>
    </>
  );
};

export default PaymentDetailsSection;

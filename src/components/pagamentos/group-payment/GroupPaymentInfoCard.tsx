
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, DollarSign, Send } from "lucide-react";

const GroupPaymentInfoCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Como funciona o Lançamento por Grupos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2">
          <Users className="h-4 w-4 mt-1 text-blue-500" />
          <div>
            <p className="text-sm font-medium">Seleção de Grupo</p>
            <p className="text-xs text-muted-foreground">Escolha um grupo de favorecidos previamente cadastrado</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <DollarSign className="h-4 w-4 mt-1 text-green-500" />
          <div>
            <p className="text-sm font-medium">Valor por Favorecido</p>
            <p className="text-xs text-muted-foreground">Pode ser informado um valor único ou usar os valores individuais já cadastrados</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Send className="h-4 w-4 mt-1 text-purple-500" />
          <div>
            <p className="text-sm font-medium">Processamento</p>
            <p className="text-xs text-muted-foreground">Serão criados lançamentos individuais para cada favorecido do grupo</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupPaymentInfoCard;

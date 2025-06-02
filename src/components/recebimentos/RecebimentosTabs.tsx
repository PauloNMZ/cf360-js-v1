
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Receipt, CreditCard, Smartphone, Building } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPix } from '@fortawesome/free-brands-svg-icons';
import { cn } from "@/lib/utils";

interface RecebimentosTabsProps {
  children: React.ReactNode;
}

const RecebimentosTabs: React.FC<RecebimentosTabsProps> = ({ children }) => {
  return (
    <Tabs defaultValue="boletos">
      <TabsList className={cn(
        "mb-4",
        "flex justify-center",
        "h-auto items-center",
        "space-x-2"
      )}>
        <TabsTrigger value="boletos" className="flex-1">
          <Receipt className="w-4 h-4 mr-2" />
          Boletos
        </TabsTrigger>
        <TabsTrigger value="cartao" className="flex-1">
          <CreditCard className="w-4 h-4 mr-2" />
          Cartão
        </TabsTrigger>
        <TabsTrigger value="pix" className="flex-1">
          <FontAwesomeIcon icon={faPix} className="w-4 h-4 mr-2" />
          PIX
        </TabsTrigger>
        <TabsTrigger value="bbpay" className="flex-1">
          <Building className="w-4 h-4 mr-2" />
          BB Pay
        </TabsTrigger>
      </TabsList>

      <TabsContent value="boletos" className="space-y-4">
        {children}
      </TabsContent>

      <TabsContent value="cartao">
        <h2>Conteúdo de Cartão</h2>
      </TabsContent>

      <TabsContent value="pix">
        <h2>Conteúdo de PIX</h2>
      </TabsContent>

      <TabsContent value="bbpay">
        <h2>Conteúdo de BB Pay</h2>
      </TabsContent>
    </Tabs>
  );
};

export default RecebimentosTabs;

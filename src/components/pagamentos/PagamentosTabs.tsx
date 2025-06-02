
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowRightLeft, Barcode, Receipt } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPix } from '@fortawesome/free-brands-svg-icons';
import { cn } from "@/lib/utils";
import PixContent from './PixContent';

interface PagamentosTabsProps {
  children: React.ReactNode;
}

const PagamentosTabs: React.FC<PagamentosTabsProps> = ({ children }) => {
  return (
    <Tabs defaultValue="transferencias">
      <TabsList className={cn(
        "mb-4",
        "flex justify-center",
        "h-auto items-center",
        "space-x-2"
      )}>
        <TabsTrigger value="transferencias" className="flex-1">
          <ArrowRightLeft className="w-4 h-4 mr-2" />
          Transferências
        </TabsTrigger>
        <TabsTrigger value="titulos" className="flex-1">
          <Barcode className="w-4 h-4 mr-2" />
          Títulos
        </TabsTrigger>
        <TabsTrigger value="guias" className="flex-1">
          <Receipt className="w-4 h-4 mr-2" />
          Guias
        </TabsTrigger>
        <TabsTrigger value="pix" className="flex-1">
          <FontAwesomeIcon icon={faPix} className="w-4 h-4 mr-2" />
          PIX
        </TabsTrigger>
      </TabsList>

      <TabsContent value="transferencias" className="space-y-4">
        {children}
      </TabsContent>

      <TabsContent value="titulos">
        <h2>Conteúdo de Títulos</h2>
      </TabsContent>

      <TabsContent value="guias">
        <h2>Conteúdo de Guias</h2>
      </TabsContent>

      <TabsContent value="pix">
        <PixContent />
      </TabsContent>
    </Tabs>
  );
};

export default PagamentosTabs;

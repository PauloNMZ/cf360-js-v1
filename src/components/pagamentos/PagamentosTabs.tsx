
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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
          Transferências
        </TabsTrigger>
        <TabsTrigger value="titulos" className="flex-1">
          Títulos
        </TabsTrigger>
        <TabsTrigger value="guias" className="flex-1">
          Guias
        </TabsTrigger>
        <TabsTrigger value="pix" className="flex-1">
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
        <h2>Conteúdo de PIX</h2>
      </TabsContent>
    </Tabs>
  );
};

export default PagamentosTabs;

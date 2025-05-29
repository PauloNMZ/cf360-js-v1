
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowRightLeft, FileText, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

// Custom PIX Icon Component
const PixIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM8 9.5l1.5 1.5L8 12.5 6.5 11 8 9.5zm8 0L17.5 11 16 12.5l-1.5-1.5L16 9.5zm-4 2.5L15.5 16 12 18.5 8.5 16 12 12z"/>
  </svg>
);

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
          <FileText className="w-4 h-4 mr-2" />
          Títulos
        </TabsTrigger>
        <TabsTrigger value="guias" className="flex-1">
          <Receipt className="w-4 h-4 mr-2" />
          Guias
        </TabsTrigger>
        <TabsTrigger value="pix" className="flex-1">
          <PixIcon className="w-4 h-4 mr-2" />
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

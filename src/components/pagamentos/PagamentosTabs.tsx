
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowRightLeft, FileText, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

// Custom PIX Icon Component - Based on official PIX logo design
const PixIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L8 6H4v4l-2 2 2 2v4h4l4 4 4-4h4v-4l2-2-2-2V6h-4l-4-4zm0 3.17L14.83 8H16v1.17L17.17 10.5 16 11.83V13h-1.17L12 15.83 9.17 13H8v-1.17L6.83 10.5 8 9.17V8h1.17L12 5.17zm0 3.66L10.83 10H10v.83l-.83.67.83.67V13h.83L12 14.17 13.17 13H14v-.83l.83-.67-.83-.67V10h-.83L12 8.83z"/>
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

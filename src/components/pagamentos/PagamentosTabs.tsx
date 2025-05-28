
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
        "space-x-2",
        "bg-background dark:bg-card"
      )}>
        <TabsTrigger
          value="transferencias"
          className={cn(
            "flex-1",
            "rounded-md px-3 py-2 text-sm font-medium",
            "bg-background text-muted-foreground dark:bg-card dark:text-muted-foreground",
            "data-[state=active]:bg-[#ECF2FF] data-[state=active]:text-primary",
            "dark:data-[state=active]:bg-card dark:data-[state=active]:text-primary",
            "dark:data-[state=active]:border-2 dark:data-[state=active]:border-red-500",
            "data-[state=active]:shadow",
            "hover:bg-muted hover:text-foreground dark:hover:bg-muted"
          )}
        >
          Transferências
        </TabsTrigger>
        <TabsTrigger
          value="titulos"
          className={cn(
            "flex-1",
            "rounded-md px-3 py-2 text-sm font-medium",
            "bg-background text-muted-foreground dark:bg-card dark:text-muted-foreground",
            "data-[state=active]:bg-[#ECF2FF] data-[state=active]:text-primary",
            "dark:data-[state=active]:bg-card dark:data-[state=active]:text-primary",
            "dark:data-[state=active]:border-2 dark:data-[state=active]:border-red-500",
            "data-[state=active]:shadow",
            "hover:bg-muted hover:text-foreground dark:hover:bg-muted"
          )}
        >
          Títulos
        </TabsTrigger>
        <TabsTrigger
          value="guias"
          className={cn(
            "flex-1",
            "rounded-md px-3 py-2 text-sm font-medium",
            "bg-background text-muted-foreground dark:bg-card dark:text-muted-foreground",
            "data-[state=active]:bg-[#ECF2FF] data-[state=active]:text-primary",
            "dark:data-[state=active]:bg-card dark:data-[state=active]:text-primary",
            "dark:data-[state=active]:border-2 dark:data-[state=active]:border-red-500",
            "data-[state=active]:shadow",
            "hover:bg-muted hover:text-foreground dark:hover:bg-muted"
          )}
        >
          Guias
        </TabsTrigger>
        <TabsTrigger
          value="pix"
          className={cn(
            "flex-1",
            "rounded-md px-3 py-2 text-sm font-medium",
            "bg-background text-muted-foreground dark:bg-card dark:text-muted-foreground",
            "data-[state=active]:bg-[#ECF2FF] data-[state=active]:text-primary",
            "dark:data-[state=active]:bg-card dark:data-[state=active]:text-primary",
            "dark:data-[state=active]:border-2 dark:data-[state=active]:border-red-500",
            "data-[state=active]:shadow",
            "hover:bg-muted hover:text-foreground dark:hover:bg-muted"
          )}
        >
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

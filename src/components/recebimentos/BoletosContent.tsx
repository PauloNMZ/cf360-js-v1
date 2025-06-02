
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FileText,
  Search,
  Download,
  AlertTriangle,
  Edit,
  Activity,
  FileDown,
  BarChart3
} from "lucide-react";

const BoletosContent = () => {
  const handleButtonClick = (action: string) => {
    console.log(`Ação: ${action}`);
  };

  const boletosButtons = [
    { label: "Registrar", icon: FileText, action: "registrar" },
    { label: "Consultar", icon: Search, action: "consultar" },
    { label: "Baixar", icon: Download, action: "baixar" },
    { label: "Protestar/Negativar", icon: AlertTriangle, action: "protestar" },
    { label: "Alterar", icon: Edit, action: "alterar" },
    { label: "Movimento", icon: Activity, action: "movimento" },
    { label: "Baixar Retornos", icon: FileDown, action: "baixar-retornos" },
    { label: "Dashboard", icon: BarChart3, action: "dashboard" }
  ];

  return (
    <>
      <h2 className="text-xl font-semibold">Opções de Boletos</h2>
      
      <div className="space-y-6">
        {/* Botões de Ações */}
        <div className="flex flex-wrap gap-4">
          {boletosButtons.map((button) => {
            const IconComponent = button.icon;
            return (
              <Button
                key={button.action}
                variant="outline"
                onClick={() => handleButtonClick(button.action)}
                className={cn(
                  "flex items-center gap-2 h-12 px-4",
                  "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <IconComponent className="h-4 w-4" />
                <span className="text-sm font-medium">{button.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Área de Conteúdo */}
        <div className="mt-6 p-4 border rounded-md bg-background">
          <p className="text-center text-muted-foreground">
            Selecione uma ação acima para continuar.
          </p>
        </div>
      </div>
    </>
  );
};

export default BoletosContent;

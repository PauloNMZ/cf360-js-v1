
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
  BarChart3,
  ArrowRightLeft,
  FileCode,
  FileImage
} from "lucide-react";

const BoletosContent = () => {
  const handleButtonClick = (action: string) => {
    console.log(`Ação: ${action}`);
  };

  const mainButtons = [
    { label: "Registrar", icon: FileText, action: "registrar" },
    { label: "Consultar", icon: Search, action: "consultar" },
    { label: "Baixar", icon: Download, action: "baixar" },
    { label: "Protestar/Negativar", icon: AlertTriangle, action: "protestar" },
    { label: "Alterar", icon: Edit, action: "alterar" },
    { label: "Movimento", icon: Activity, action: "movimento" },
    { label: "Baixar Retornos", icon: FileDown, action: "baixar-retornos" },
    { label: "Dashboard", icon: BarChart3, action: "dashboard" }
  ];

  const conversionButtons = [
    { label: "CNAB → API", icon: ArrowRightLeft, action: "cnab-api" },
    { label: "XML da NFe → API", icon: FileCode, action: "xml-api" },
    { label: "PDF do Boleto → API", icon: FileImage, action: "pdf-api" }
  ];

  return (
    <>
      <h2 className="text-xl font-semibold">Opções de Boletos</h2>
      
      <div className="space-y-6">
        {/* Botões Principais */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Ações Principais</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mainButtons.map((button) => {
              const IconComponent = button.icon;
              return (
                <Button
                  key={button.action}
                  variant="outline"
                  onClick={() => handleButtonClick(button.action)}
                  className={cn(
                    "flex flex-col items-center gap-2 h-20 p-4",
                    "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <IconComponent className="h-6 w-6" />
                  <span className="text-sm text-center leading-tight">{button.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Botões de Conversão */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Conversões e Integrações</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {conversionButtons.map((button) => {
              const IconComponent = button.icon;
              return (
                <Button
                  key={button.action}
                  variant="outline"
                  onClick={() => handleButtonClick(button.action)}
                  className={cn(
                    "flex items-center gap-3 h-16 p-4",
                    "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-sm font-medium">{button.label}</span>
                </Button>
              );
            })}
          </div>
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

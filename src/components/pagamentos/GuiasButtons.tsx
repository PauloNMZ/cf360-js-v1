
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FileText,
  Calculator,
  MapPin,
  Building2,
  Briefcase,
  Receipt,
  Scale
} from "lucide-react";

interface GuiasButtonsProps {
  activeGuiaTab: string | null;
  setActiveGuiaTab: (tab: string) => void;
}

const GuiasButtons: React.FC<GuiasButtonsProps> = ({
  activeGuiaTab,
  setActiveGuiaTab
}) => {
  const guiasOptions = [
    { id: 'darf', label: 'DARF', icon: FileText },
    { id: 'gare-sp', label: 'GARE SP', icon: Calculator },
    { id: 'gps', label: 'GPS', icon: MapPin },
    { id: 'gnre', label: 'GNRE', icon: Building2 },
    { id: 'fgts-digital', label: 'FGTS DIGITAL', icon: Briefcase },
    { id: 'contas-impostos', label: 'CONTAS/IMPOSTOS', icon: Receipt },
    { id: 'deposito-judicial', label: 'DEPÓSITO JUDICIAL', icon: Scale }
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {guiasOptions.map((option) => {
        const IconComponent = option.icon;
        return (
          <Button
            key={option.id}
            variant="outline"
            onClick={() => setActiveGuiaTab(option.id)}
            className={cn(
              "flex items-center gap-2",
              activeGuiaTab === option.id 
                ? "bg-[#ECF2FF] text-primary dark:bg-secondary dark:text-primary shadow border border-[#3986FF] hover:bg-[#ECF2FF] dark:hover:bg-secondary"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <IconComponent className="mr-2 h-4 w-4" />
            {option.label}
          </Button>
        );
      })}
    </div>
  );
};

export default GuiasButtons;

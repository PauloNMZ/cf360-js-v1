
import React from "react";
import { NavButton } from "@/components/ui/NavButton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type NavigationItemProps = {
  icon: React.ReactNode;
  label: string;
  tooltipText: string;
  onClick: () => void;
  disabled: boolean;
  className?: string;
  tooltipClassName?: string;
};

const NavigationItem = ({
  icon,
  label,
  tooltipText,
  onClick,
  disabled,
  className = "",
  tooltipClassName = "bg-blue-50 dark:bg-blue-900/80 border border-blue-200 dark:border-blue-800"
}: NavigationItemProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <NavButton 
              icon={icon} 
              label={label} 
              onClick={onClick}
              disabled={disabled}
              className={className}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent className={tooltipClassName}>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NavigationItem;


import React from "react";
import { Button } from "@/components/ui/button";

interface MenuSectionProps {
  title: string;
  description: string;
  primaryAction: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const MenuSection: React.FC<MenuSectionProps> = ({
  title,
  description,
  primaryAction,
  secondaryAction,
}) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
      <h3 className="text-lg font-medium text-blue-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          onClick={primaryAction.onClick}
        >
          {primaryAction.label}
        </button>
        {secondaryAction && (
          <button
            className="px-3 py-1 bg-white border border-blue-300 text-blue-600 text-sm rounded hover:bg-blue-50"
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuSection;

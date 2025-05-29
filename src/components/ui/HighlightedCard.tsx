
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface HighlightedCardProps {
  companyName: string;
  children?: React.ReactNode;
}

const HighlightedCard: React.FC<HighlightedCardProps> = ({ companyName, children }) => {
  return (
    <Card className="bg-[#E2E8F0] dark:bg-[#0E1629] border-2 border-primary-blue/30 shadow-lg rounded-xl p-6 flex flex-col gap-3 max-w-md w-full mx-auto">
      <span
        style={{ color: "#5A8AF0" }}
        className="font-poppins text-xl font-bold tracking-tight mb-2"
        data-testid="company-name"
      >
        {companyName}
      </span>
      <CardContent className="p-0">
        {children}
      </CardContent>
    </Card>
  );
};

export default HighlightedCard;


import React from "react";
import { Button } from "@/components/ui/button";

interface PageSizeSelectorProps {
  pageSize: number;
  onPageSizeChange: (newPageSize: number) => void;
}

const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
  pageSize,
  onPageSizeChange
}) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground">Mostrar:</span>
      <Button
        variant={pageSize === 10 ? "default" : "outline"}
        size="sm"
        onClick={() => onPageSizeChange(10)}
      >
        10
      </Button>
      <Button
        variant={pageSize === 25 ? "default" : "outline"}
        size="sm"
        onClick={() => onPageSizeChange(25)}
      >
        25
      </Button>
      <Button
        variant={pageSize === 50 ? "default" : "outline"}
        size="sm"
        onClick={() => onPageSizeChange(50)}
      >
        50
      </Button>
      <Button
        variant={pageSize === -1 ? "default" : "outline"}
        size="sm"
        onClick={() => onPageSizeChange(-1)}
      >
        Todos
      </Button>
    </div>
  );
};

export default PageSizeSelector;

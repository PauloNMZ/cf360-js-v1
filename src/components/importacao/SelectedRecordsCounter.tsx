
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckSquare } from 'lucide-react';

interface SelectedRecordsCounterProps {
  selectedCount: number;
}

export function SelectedRecordsCounter({ selectedCount }: SelectedRecordsCounterProps) {
  if (selectedCount === 0) return null;

  return (
    <Badge 
      variant="secondary" 
      className="
        bg-gradient-to-r from-blue-500 to-blue-600 
        text-white 
        px-4 py-2 
        rounded-lg 
        shadow-sm 
        border-0
        animate-fade-in
        hover:from-blue-600 hover:to-blue-700
        transition-all duration-200
        flex items-center gap-2
        text-sm font-medium
      "
    >
      <CheckSquare className="h-4 w-4" />
      <span>
        {selectedCount} registro{selectedCount !== 1 ? 's' : ''} selecionado{selectedCount !== 1 ? 's' : ''}
      </span>
    </Badge>
  );
}

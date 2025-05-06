
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { FormError } from "@/components/ui/form-error";

type CNPJSearchFieldProps = {
  cnpjInput: string;
  handleCNPJChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleCNPJSearch: () => void;
  isLoading: boolean;
  error?: string;
  disabled?: boolean;
};

const CNPJSearchField = ({
  cnpjInput,
  handleCNPJChange,
  handleBlur,
  handleCNPJSearch,
  isLoading,
  error,
  disabled = false
}: CNPJSearchFieldProps) => {
  // Improved event handlers with better stopPropagation and preventDefault
  const onSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoading && !disabled) {
      console.log("Search button clicked, triggering search");
      handleCNPJSearch();
    } else {
      console.log("Search button clicked but disabled or loading");
    }
  };

  // Handle keyboard events in the input with better controls
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      
      if (!isLoading && !disabled) {
        console.log("Enter key pressed in CNPJ field, triggering search");
        handleCNPJSearch();
      }
    }
  };

  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <span className="bg-blue-100 p-1 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </span>
        CNPJ*
      </label>
      <div className="flex flex-col">
        <div className="flex">
          <Input 
            placeholder="00.000.000/0000-00" 
            className={`border-blue-200 focus:border-blue-500 bg-blue-50 rounded-r-none ${error ? 'border-red-500' : ''}`}
            value={cnpjInput}
            onChange={handleCNPJChange}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            name="cnpj"
            disabled={disabled}
            required
            autoComplete="off" // Prevent autocomplete interference
          />
          <Button 
            onClick={onSearchClick}
            disabled={isLoading || disabled} 
            className="rounded-l-none bg-blue-600 hover:bg-blue-700"
            type="button"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
        {error && <FormError message={error} />}
      </div>
    </div>
  );
};

export default CNPJSearchField;

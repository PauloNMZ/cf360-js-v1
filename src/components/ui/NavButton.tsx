
import React from 'react';

interface NavButtonProps {
  icon: React.ReactNode;
  label: React.ReactNode | string;
  onClick: () => void;
  className?: string;
}

export const NavButton = ({ icon, label, onClick, className = "" }: NavButtonProps) => {
  return (
    <button 
      className={`flex-shrink-0 w-24 h-24 bg-white/90 dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-slate-700 
      rounded-lg shadow-md transition-all hover:shadow-lg border border-blue-100 dark:border-slate-700 
      flex flex-col items-center justify-center p-2 mx-1 ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-12 h-12 aspect-square bg-blue-100 dark:bg-blue-900/50 rounded-full text-blue-700 dark:text-blue-300 shadow-sm">
        {React.cloneElement(icon as React.ReactElement, { size: 22, strokeWidth: 1.5 })}
      </div>
      <div className="text-sm text-gray-800 dark:text-gray-200 text-center mt-3 font-medium tracking-wide overflow-hidden px-1 w-full">
        {label}
      </div>
    </button>
  );
};

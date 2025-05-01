
import React from 'react';

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

export const NavButton = ({ icon, label, onClick, className = "" }: NavButtonProps) => {
  return (
    <button 
      className={`flex-shrink-0 w-20 h-20 bg-white/90 dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-slate-700 
      rounded-lg shadow-md transition-all hover:shadow-lg border border-blue-100 dark:border-slate-700 
      flex flex-col items-center justify-center p-2 ${className}`}
      onClick={onClick}
    >
      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-full text-blue-700 dark:text-blue-300 mb-1">
        {icon}
      </div>
      <span className="text-xs text-gray-800 dark:text-gray-200 text-center mt-1">{label}</span>
    </button>
  );
};

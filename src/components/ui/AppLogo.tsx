
import React from 'react';
import { WalletCards } from 'lucide-react';

interface AppLogoProps {
  size?: number;
  customLogoUrl?: string;
  companyName?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ 
  size = 32, 
  customLogoUrl,
  companyName 
}) => {
  return (
    <div className="flex items-center">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-600 rounded-full blur-sm opacity-30"></div>
        <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 rounded-full text-white flex items-center justify-center shadow-lg">
          {customLogoUrl ? (
            <img 
              src={customLogoUrl} 
              alt="Company Logo" 
              className="w-full h-full object-contain" 
              style={{ width: size, height: size }}
            />
          ) : (
            <WalletCards size={size} strokeWidth={1.5} className="drop-shadow-sm" />
          )}
        </div>
      </div>
      {companyName && (
        <span className="ml-2 font-medium">{companyName}</span>
      )}
    </div>
  );
};

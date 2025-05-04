
import React from 'react';
import { WalletCards } from 'lucide-react';

interface AppLogoProps {
  size?: number;
  customLogoUrl?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 32, customLogoUrl }) => {
  return (
    <div className="flex items-center">
      <div className="relative">
        {/* Fundo transparente */}
        <div className="relative bg-transparent p-1.5 rounded-full text-white flex items-center justify-center shadow-lg">
          {customLogoUrl ? (
            <img 
              src={customLogoUrl} 
              alt="Company Logo" 
              className="w-full h-full object-contain" 
              style={{ width: size, height: size }}
            />
          ) : (
            <WalletCards size={size} strokeWidth={1.5} className="text-blue-600 drop-shadow-sm" />
          )}
        </div>
      </div>
    </div>
  );
};

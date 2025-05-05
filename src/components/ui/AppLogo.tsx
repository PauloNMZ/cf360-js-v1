
import React from 'react';
import { WalletCards } from 'lucide-react';

interface AppLogoProps {
  size?: number;
  customLogoUrl?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 64, customLogoUrl }) => {
  return (
    <div className="flex items-center">
      <div className="relative">
        {customLogoUrl ? (
          <img 
            src={customLogoUrl} 
            alt="Company Logo" 
            className="w-full h-full object-contain" 
            style={{ width: size, height: size }}
          />
        ) : (
          <WalletCards 
            size={size} 
            strokeWidth={1.5} 
            className="text-blue-600 drop-shadow-md"
          />
        )}
      </div>
    </div>
  );
};

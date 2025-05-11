
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
            className="w-full h-full object-contain rounded-md" 
            style={{ width: size, height: size }}
          />
        ) : (
          <div className="p-1.5 bg-gradient-to-br from-primary-blue to-primary-magenta rounded-xl shadow-md">
            <WalletCards 
              size={size - 6} 
              strokeWidth={1.5} 
              className="text-white"
            />
          </div>
        )}
      </div>
    </div>
  );
};

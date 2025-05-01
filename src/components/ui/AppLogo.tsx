
import React from 'react';
import { WalletCards } from 'lucide-react';

interface AppLogoProps {
  size?: number;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 32 }) => {
  return (
    <div className="flex items-center">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-600 rounded-full blur-sm opacity-30"></div>
        <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 rounded-full text-white flex items-center justify-center shadow-lg">
          <WalletCards size={size} strokeWidth={1.5} className="drop-shadow-sm" />
        </div>
      </div>
    </div>
  );
};

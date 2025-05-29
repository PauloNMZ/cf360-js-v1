
import React from "react";
import { 
  Home, 
  Building2, 
  FileText, 
  BarChart2, 
  DollarSign, 
  Settings,
  CreditCard,
  Users,
  Upload,
  Receipt,
  Zap,
  Webhook,
  Bell,
  Shield,
  Key,
  Banknote
} from "lucide-react";

// Helper function to get icon component by name
export const getIconComponent = (iconName: string, size: number = 20) => {
  const iconMap: Record<string, React.ReactElement> = {
    Home: <Home size={size} />,
    Building2: <Building2 size={size} />,
    FileText: <FileText size={size} />,
    BarChart2: <BarChart2 size={size} />,
    DollarSign: <DollarSign size={size} />,
    Settings: <Settings size={size} />,
    CreditCard: <CreditCard size={size} />,
    Users: <Users size={size} />,
    Upload: <Upload size={size} />,
    Receipt: <Receipt size={size} />,
    Zap: <Zap size={size} />,
    Webhook: <Webhook size={size} />,
    Bell: <Bell size={size} />,
    Shield: <Shield size={size} />,
    Key: <Key size={size} />,
    Banknote: <Banknote size={size} />
  };

  return iconMap[iconName] || <Settings size={size} />;
};

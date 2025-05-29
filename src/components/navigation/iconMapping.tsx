
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPix } from '@fortawesome/free-brands-svg-icons';

// Helper function to get icon component by name
export const getIconComponent = (iconName: string, size: number = 20) => {
  console.log(`🔍 Getting icon: ${iconName} with size: ${size}`);
  console.log('📦 FontAwesome faPix icon object:', faPix);
  console.log('📦 FontAwesome component available:', typeof FontAwesomeIcon);
  
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
    Banknote: <Banknote size={size} />,
    FaPix: <FontAwesomeIcon icon={faPix} style={{ width: size, height: size }} />
  };

  console.log('🗂️ Available icons in map:', Object.keys(iconMap));
  
  const selectedIcon = iconMap[iconName] || <Settings size={size} />;
  
  if (!iconMap[iconName]) {
    console.warn(`⚠️ Icon not found: ${iconName}, using Settings as fallback`);
    console.warn('🔍 Available icons:', Object.keys(iconMap).join(', '));
  } else {
    console.log(`✅ Icon found: ${iconName}`);
    if (iconName === 'FaPix') {
      console.log('🎯 PIX icon specifically found and returned');
    }
  }

  return selectedIcon;
};

// Test function to verify FontAwesome is working
export const testFontAwesome = () => {
  console.log('🧪 Testing FontAwesome PIX icon directly...');
  try {
    const testIcon = <FontAwesomeIcon icon={faPix} style={{ width: 24, height: 24 }} />;
    console.log('✅ FontAwesome PIX icon test successful:', testIcon);
    return testIcon;
  } catch (error) {
    console.error('❌ FontAwesome PIX icon test failed:', error);
    return null;
  }
};

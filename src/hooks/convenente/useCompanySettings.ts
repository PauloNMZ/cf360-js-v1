
import { useState, useEffect } from "react";
import { getCompanySettings } from "@/services/companySettings";

export const useCompanySettings = () => {
  const [companySettings, setCompanySettings] = useState({
    logoUrl: '',
    companyName: 'Gerador de Pagamentos'
  });
  
  // Load company settings
  useEffect(() => {
    const settings = getCompanySettings();
    setCompanySettings(settings);
  }, []);

  // Function to reload settings
  const reloadSettings = (adminPanelOpen: boolean) => {
    if (!adminPanelOpen) {
      const settings = getCompanySettings();
      setCompanySettings(settings);
    }
  };

  return {
    companySettings,
    reloadSettings
  };
};

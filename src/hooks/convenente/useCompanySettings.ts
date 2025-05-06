
import { useState, useEffect } from "react";
import { getCompanySettings, saveCompanySettings } from "@/services/companySettings";
import { CompanySettings } from "@/types/companySettings";

export const useCompanySettings = () => {
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);

  // Load company settings on mount
  useEffect(() => {
    const loadSettings = () => {
      const settings = getCompanySettings();
      setCompanySettings(settings);
    };
    
    loadSettings();
  }, []);

  // Reload company settings when admin panel is closed
  const reloadSettings = (adminPanelOpen: boolean) => {
    if (!adminPanelOpen) {
      const settings = getCompanySettings();
      setCompanySettings(settings);
    }
  };

  return {
    companySettings,
    setCompanySettings,
    reloadSettings
  };
};

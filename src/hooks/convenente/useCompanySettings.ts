import { useState, useEffect } from "react";
import { getCompanySettings } from "@/services/companySettings";

export interface CompanySettings {
  logoUrl: string;
  companyName: string;
}

// Default company settings as a constant
const DEFAULT_SETTINGS: CompanySettings = {
  logoUrl: '',
  companyName: 'Gerador de Pagamentos'
};

export const useCompanySettings = () => {
  // Initialize with default settings to ensure we always have a value
  const [companySettings, setCompanySettings] = useState<CompanySettings>(DEFAULT_SETTINGS);
  
  // Load company settings
  useEffect(() => {
    try {
      const settings = getCompanySettings();
      // Only update state if we got valid settings
      if (settings && typeof settings === 'object') {
        setCompanySettings(settings);
      }
    } catch (error) {
      console.error("Error loading company settings:", error);
      // On error, fall back to defaults (state is already initialized with defaults)
    }
  }, []);

  // Function to reload settings
  const reloadSettings = (adminPanelOpen: boolean) => {
    if (!adminPanelOpen) {
      try {
        const settings = getCompanySettings();
        // Only update state if we got valid settings
        if (settings && typeof settings === 'object') {
          setCompanySettings(settings);
        }
      } catch (error) {
        console.error("Error reloading company settings:", error);
        // On error, keep current settings
      }
    }
  };

  return {
    companySettings,
    reloadSettings
  };
};


import { CompanySettings } from "@/types/companySettings";

const COMPANY_SETTINGS_KEY = 'gerapag_company_settings';

// Default company settings
export const DEFAULT_SETTINGS: CompanySettings = { 
  logoUrl: '', 
  companyName: 'Gerador de Pagamentos' 
};

// Get company settings from localStorage
export const getCompanySettings = (): CompanySettings => {
  try {
    const settingsStr = localStorage.getItem(COMPANY_SETTINGS_KEY);
    if (settingsStr) {
      const parsedSettings = JSON.parse(settingsStr);
      // Ensure the parsed settings has the expected shape
      if (parsedSettings && typeof parsedSettings === 'object') {
        return {
          logoUrl: parsedSettings.logoUrl || DEFAULT_SETTINGS.logoUrl,
          companyName: parsedSettings.companyName || DEFAULT_SETTINGS.companyName
        };
      }
    }
  } catch (e) {
    console.error('Error parsing company settings:', e);
  }
  // Return default settings if anything goes wrong
  return { ...DEFAULT_SETTINGS };
};

// Save company settings to localStorage
export const saveCompanySettings = (settings: CompanySettings): void => {
  try {
    // Ensure we're saving a proper object
    const safeSettings = {
      logoUrl: settings?.logoUrl || DEFAULT_SETTINGS.logoUrl,
      companyName: settings?.companyName || DEFAULT_SETTINGS.companyName
    };
    localStorage.setItem(COMPANY_SETTINGS_KEY, JSON.stringify(safeSettings));
  } catch (e) {
    console.error('Error saving company settings:', e);
  }
};

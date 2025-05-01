
interface CompanySettings {
  logoUrl: string;
  companyName: string;
}

const COMPANY_SETTINGS_KEY = 'gerapag_company_settings';

// Get company settings from localStorage
export const getCompanySettings = (): CompanySettings => {
  const settingsStr = localStorage.getItem(COMPANY_SETTINGS_KEY);
  if (settingsStr) {
    try {
      return JSON.parse(settingsStr);
    } catch (e) {
      console.error('Error parsing company settings:', e);
    }
  }
  return { logoUrl: '', companyName: 'Gerador de Pagamentos' };
};

// Save company settings to localStorage
export const saveCompanySettings = (settings: CompanySettings): void => {
  try {
    localStorage.setItem(COMPANY_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving company settings:', e);
  }
};

import { useState, useEffect } from "react";
import { getCompanySettings, saveCompanySettings } from "@/services/companySettings";
import { CompanySettings } from "@/types/companySettings";

export const useCompanySettings = (adminPanelOpen?: boolean) => {
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);

  // Load company settings on mount
  useEffect(() => {
    const loadSettings = () => {
      const settings = getCompanySettings(); // Isso lê do localStorage
      console.log("useCompanySettings: Carregando configurações", settings);
      setCompanySettings(settings);
    };
    
    loadSettings();
  }, []); // Carrega apenas no mount inicial

  // Recarrega as configurações quando o painel do admin fechar
  useEffect(() => {
    // Verifica se adminPanelOpen foi definido (ou seja, o hook está sendo usado com o estado do modal)
    // E se o painel acabou de fechar (passou de true para false)
    if (adminPanelOpen !== undefined && !adminPanelOpen) {
      const settings = getCompanySettings();
        console.log("useCompanySettings: Painel fechado, recarregando configurações", settings);
      setCompanySettings(settings);
    }
  }, [adminPanelOpen]); // Depende do estado do painel do admin

  // Função de recarga (mantida por compatibilidade, mas a lógica principal está no useEffect)
  const reloadSettings = () => {
    console.log("useCompanySettings: reloadSettings chamado (via função)");
    const settings = getCompanySettings();
    console.log("useCompanySettings: Recarregando configurações via função", settings);
    setCompanySettings(settings);
  };

  return {
    companySettings,
    reloadSettings
  };
};

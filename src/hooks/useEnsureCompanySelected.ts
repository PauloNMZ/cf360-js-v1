
import { useEffect, useState } from 'react';
import { useIndexPageContext } from './useIndexPageContext';

/**
 * Hook para garantir que sempre haja uma empresa selecionada
 * antes de acessar funcionalidades de pagamentos e recebimentos
 */
export const useEnsureCompanySelected = () => {
  const { 
    selectedHeaderCompany, 
    setModalOpen,
    convenentes,
    handleSelectConvenente,
    setFormMode 
  } = useIndexPageContext();
  
  const [isEnsuring, setIsEnsuring] = useState(false);
  const [hasCompanyGuaranteed, setHasCompanyGuaranteed] = useState(false);

  console.log("=== DEBUG useEnsureCompanySelected ===");
  console.log("selectedHeaderCompany:", selectedHeaderCompany);
  console.log("convenentes:", convenentes);

  // Função para verificar e garantir que há empresa selecionada
  const ensureCompanySelected = () => {
    console.log("ensureCompanySelected called - selectedHeaderCompany:", selectedHeaderCompany);
    
    // Se já há empresa selecionada, não precisa fazer nada
    if (selectedHeaderCompany && selectedHeaderCompany.razaoSocial) {
      console.log("✅ Company already selected:", selectedHeaderCompany.razaoSocial);
      setHasCompanyGuaranteed(true);
      setIsEnsuring(false);
      return true;
    }

    // Se há apenas uma empresa cadastrada, seleciona automaticamente
    if (convenentes && convenentes.length === 1) {
      console.log("🔄 Auto-selecting single company:", convenentes[0].razaoSocial);
      handleSelectConvenente(convenentes[0], 'view');
      setHasCompanyGuaranteed(true);
      setIsEnsuring(false);
      return true;
    }

    // Se há múltiplas empresas ou nenhuma, abre modal de seleção
    if (convenentes && convenentes.length > 1) {
      console.log("📋 Multiple companies found, opening selection modal");
      setIsEnsuring(true);
      setFormMode('view');
      setModalOpen(true);
      return false;
    }

    // Se não há empresas cadastradas, abre modal para criar nova
    console.log("➕ No companies found, opening modal to create new");
    setIsEnsuring(true);
    setFormMode('create');
    setModalOpen(true);
    return false;
  };

  // Efeito para verificar automaticamente quando o hook é usado
  useEffect(() => {
    if (convenentes && convenentes.length >= 0) {
      ensureCompanySelected();
    }
  }, [convenentes, selectedHeaderCompany]);

  // Efeito para detectar quando uma empresa foi selecionada após abrir o modal
  useEffect(() => {
    if (isEnsuring && selectedHeaderCompany && selectedHeaderCompany.razaoSocial) {
      console.log("✅ Company selected after modal:", selectedHeaderCompany.razaoSocial);
      setHasCompanyGuaranteed(true);
      setIsEnsuring(false);
    }
  }, [selectedHeaderCompany, isEnsuring]);

  return {
    hasCompanySelected: !!(selectedHeaderCompany && selectedHeaderCompany.razaoSocial),
    hasCompanyGuaranteed,
    isEnsuring,
    ensureCompanySelected,
    selectedCompany: selectedHeaderCompany
  };
};

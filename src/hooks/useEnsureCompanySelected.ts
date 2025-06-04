
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
    setFormMode,
    currentConvenenteId,
    formData
  } = useIndexPageContext();
  
  const [isEnsuring, setIsEnsuring] = useState(false);
  const [hasCompanyGuaranteed, setHasCompanyGuaranteed] = useState(false);

  console.log("=== DEBUG useEnsureCompanySelected ===");
  console.log("selectedHeaderCompany:", selectedHeaderCompany);
  console.log("currentConvenenteId:", currentConvenenteId);
  console.log("formData:", formData);
  console.log("convenentes:", convenentes);

  // Função para verificar se há empresa selecionada (verificando ambas as fontes)
  const hasActiveCompany = () => {
    // Verifica se há empresa no header
    if (selectedHeaderCompany && selectedHeaderCompany.razaoSocial) {
      console.log("✅ Company found in header:", selectedHeaderCompany.razaoSocial);
      return true;
    }

    // Verifica se há empresa via currentConvenenteId + formData
    if (currentConvenenteId && formData && formData.razaoSocial) {
      console.log("✅ Company found via currentConvenenteId + formData:", formData.razaoSocial);
      return true;
    }

    console.log("❌ No active company found");
    return false;
  };

  // Função para verificar e garantir que há empresa selecionada
  const ensureCompanySelected = () => {
    console.log("ensureCompanySelected called");
    
    // Se já há empresa selecionada, não precisa fazer nada
    if (hasActiveCompany()) {
      console.log("✅ Company already active");
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
  }, [convenentes, selectedHeaderCompany, currentConvenenteId, formData]);

  // Efeito para detectar quando uma empresa foi selecionada após abrir o modal
  useEffect(() => {
    if (isEnsuring && hasActiveCompany()) {
      console.log("✅ Company selected after modal");
      setHasCompanyGuaranteed(true);
      setIsEnsuring(false);
    }
  }, [selectedHeaderCompany, currentConvenenteId, formData, isEnsuring]);

  return {
    hasCompanySelected: hasActiveCompany(),
    hasCompanyGuaranteed,
    isEnsuring,
    ensureCompanySelected,
    selectedCompany: selectedHeaderCompany || (currentConvenenteId && formData ? { ...formData, id: currentConvenenteId } : null)
  };
};

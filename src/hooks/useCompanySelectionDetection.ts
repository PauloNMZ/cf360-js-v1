
import { useState, useEffect, useCallback } from 'react';
import { useIndexPageContext } from './useIndexPageContext';

interface CompanyData {
  id: string;
  razaoSocial: string;
  cnpj: string;
}

interface CompanyDetectionResult {
  company: CompanyData | null;
  source: string;
  isLoading: boolean;
  hasCompany: boolean;
  error: string | null;
}

export const useCompanySelectionDetection = () => {
  const { 
    selectedHeaderCompany, 
    currentConvenenteId, 
    formData,
    convenentes 
  } = useIndexPageContext();

  const [detectionResult, setDetectionResult] = useState<CompanyDetectionResult>({
    company: null,
    source: 'none',
    isLoading: true,
    hasCompany: false,
    error: null
  });

  const detectCompany = useCallback(() => {
    console.log("=== Company Detection Started ===");
    
    try {
      // Strategy 1: Header-selected company (highest priority)
      if (selectedHeaderCompany && selectedHeaderCompany.razaoSocial) {
        console.log("✅ Company detected from header:", selectedHeaderCompany);
        const company: CompanyData = {
          id: selectedHeaderCompany.cnpj || 'header',
          razaoSocial: selectedHeaderCompany.razaoSocial,
          cnpj: selectedHeaderCompany.cnpj || ''
        };
        
        setDetectionResult({
          company,
          source: 'header',
          isLoading: false,
          hasCompany: true,
          error: null
        });
        return;
      }

      // Strategy 2: Current convenente form data
      if (currentConvenenteId && formData && formData.razaoSocial) {
        console.log("✅ Company detected from form data:", formData);
        const company: CompanyData = {
          id: currentConvenenteId,
          razaoSocial: formData.razaoSocial,
          cnpj: formData.cnpj || ''
        };
        
        setDetectionResult({
          company,
          source: 'form',
          isLoading: false,
          hasCompany: true,
          error: null
        });
        return;
      }

      // Strategy 3: LocalStorage cached selection
      const cachedCompany = localStorage.getItem('selected_company');
      if (cachedCompany) {
        try {
          const parsed = JSON.parse(cachedCompany);
          if (parsed.razaoSocial) {
            console.log("✅ Company detected from localStorage:", parsed);
            setDetectionResult({
              company: parsed,
              source: 'localStorage',
              isLoading: false,
              hasCompany: true,
              error: null
            });
            return;
          }
        } catch (e) {
          console.warn("Failed to parse cached company:", e);
        }
      }

      // Strategy 4: Single company auto-selection
      if (convenentes && convenentes.length === 1) {
        console.log("✅ Auto-selecting single company:", convenentes[0]);
        const company: CompanyData = {
          id: convenentes[0].id,
          razaoSocial: convenentes[0].razaoSocial,
          cnpj: convenentes[0].cnpj || ''
        };
        
        setDetectionResult({
          company,
          source: 'auto-single',
          isLoading: false,
          hasCompany: true,
          error: null
        });
        return;
      }

      // No company detected
      console.log("❌ No company detected");
      setDetectionResult({
        company: null,
        source: 'none',
        isLoading: false,
        hasCompany: false,
        error: null
      });

    } catch (error) {
      console.error("Company detection error:", error);
      setDetectionResult({
        company: null,
        source: 'error',
        isLoading: false,
        hasCompany: false,
        error: error instanceof Error ? error.message : 'Detection failed'
      });
    }
  }, [selectedHeaderCompany, currentConvenenteId, formData, convenentes]);

  // Cache company selection
  const cacheCompanySelection = useCallback((company: CompanyData) => {
    try {
      localStorage.setItem('selected_company', JSON.stringify(company));
      console.log("Company selection cached:", company);
    } catch (error) {
      console.warn("Failed to cache company selection:", error);
    }
  }, []);

  // Clear cached selection
  const clearCachedSelection = useCallback(() => {
    localStorage.removeItem('selected_company');
    setDetectionResult(prev => ({
      ...prev,
      company: null,
      hasCompany: false,
      source: 'cleared'
    }));
  }, []);

  // Run detection when dependencies change
  useEffect(() => {
    setDetectionResult(prev => ({ ...prev, isLoading: true }));
    const timeoutId = setTimeout(detectCompany, 100); // Small delay to batch updates
    return () => clearTimeout(timeoutId);
  }, [detectCompany]);

  // Cache company when detected
  useEffect(() => {
    if (detectionResult.company && detectionResult.source !== 'localStorage') {
      cacheCompanySelection(detectionResult.company);
    }
  }, [detectionResult.company, detectionResult.source, cacheCompanySelection]);

  return {
    ...detectionResult,
    detectCompany,
    clearCachedSelection,
    cacheCompanySelection
  };
};

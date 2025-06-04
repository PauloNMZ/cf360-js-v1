
import { useIndexPageContext } from '@/hooks/useIndexPageContext';

export const useFavorecidosWorkflowCompany = () => {
  const { selectedHeaderCompany, formData, currentConvenenteId } = useIndexPageContext();

  const getSelectedCompany = () => {
    console.log("=== DEBUG useFavorecidosWorkflowCompany ===");
    console.log("selectedHeaderCompany:", selectedHeaderCompany);
    console.log("formData:", formData);
    console.log("currentConvenenteId:", currentConvenenteId);

    // Priority 1: Header-selected company (from context)
    if (selectedHeaderCompany && selectedHeaderCompany.razaoSocial) {
      console.log("✅ Using selectedHeaderCompany:", selectedHeaderCompany);
      return selectedHeaderCompany;
    }
    
    // Priority 2: Current convenente data from form
    if (currentConvenenteId && formData && formData.razaoSocial) {
      console.log("✅ Using formData:", formData);
      return {
        id: currentConvenenteId,
        ...formData
      };
    }

    console.log("❌ No company selected");
    return null;
  };

  const hasSelectedCompany = () => {
    const company = getSelectedCompany();
    const result = !!(company && company.razaoSocial);
    console.log("hasSelectedCompany result:", result, "company:", company);
    return result;
  };

  return {
    getSelectedCompany,
    hasSelectedCompany,
    selectedCompany: getSelectedCompany()
  };
};

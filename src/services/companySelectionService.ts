
interface CompanyData {
  id: string;
  razaoSocial: string;
  cnpj: string;
}

type CompanySelectionListener = (company: CompanyData | null) => void;

class CompanySelectionService {
  private listeners: Set<CompanySelectionListener> = new Set();
  private currentCompany: CompanyData | null = null;

  // Subscribe to company selection changes
  subscribe(listener: CompanySelectionListener): () => void {
    this.listeners.add(listener);
    // Call immediately with current value
    listener(this.currentCompany);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Set the selected company
  setSelectedCompany(company: CompanyData | null): void {
    this.currentCompany = company;
    
    // Persist to localStorage
    if (company) {
      try {
        localStorage.setItem('selected_company', JSON.stringify(company));
        console.log("Company selection persisted:", company);
      } catch (error) {
        console.warn("Failed to persist company selection:", error);
      }
    } else {
      localStorage.removeItem('selected_company');
      console.log("Company selection cleared");
    }

    // Notify all listeners
    this.listeners.forEach(listener => {
      try {
        listener(company);
      } catch (error) {
        console.error("Error in company selection listener:", error);
      }
    });

    // Emit custom event for global listening
    window.dispatchEvent(new CustomEvent('company-selection-changed', {
      detail: { company }
    }));
  }

  // Get current selected company
  getSelectedCompany(): CompanyData | null {
    return this.currentCompany;
  }

  // Initialize from localStorage
  initialize(): void {
    try {
      const cached = localStorage.getItem('selected_company');
      if (cached) {
        const company = JSON.parse(cached);
        if (this.isValidCompany(company)) {
          this.currentCompany = company;
          console.log("Company selection restored from cache:", company);
        }
      }
    } catch (error) {
      console.warn("Failed to restore company selection from cache:", error);
    }
  }

  // Clear selection
  clearSelection(): void {
    this.setSelectedCompany(null);
  }

  // Validate company data
  private isValidCompany(company: any): company is CompanyData {
    return (
      company &&
      typeof company === 'object' &&
      typeof company.id === 'string' &&
      typeof company.razaoSocial === 'string' &&
      typeof company.cnpj === 'string'
    );
  }

  // Get selection status
  hasSelectedCompany(): boolean {
    return this.currentCompany !== null;
  }
}

// Create singleton instance
export const companySelectionService = new CompanySelectionService();

// Initialize on service creation
companySelectionService.initialize();

// Export the service and types
export type { CompanyData, CompanySelectionListener };


import { ConvenenteData } from "@/types/convenente";

// Store data in localStorage
const STORAGE_KEY = 'convenentes';

// Save a new convenente
export const saveConvenente = (convenente: ConvenenteData): ConvenenteData & { id: string } => {
  // Get existing convenentes
  const convenentes = getConvenentes();

  // Generate a unique ID
  const id = Date.now().toString();

  // Add metadata and ID
  const newConvenente = {
    ...convenente,
    id,
    dataCriacao: new Date().toISOString(),
    dataAtualizacao: new Date().toISOString()
  };

  // Add to the list
  convenentes.push(newConvenente);

  // Save back to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convenentes));

  return newConvenente;
};

// Get all convenentes
export const getConvenentes = (): Array<ConvenenteData & { id: string }> => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Get a single convenente by ID
export const getConvenenteById = (id: string): (ConvenenteData & { id: string }) | null => {
  const convenentes = getConvenentes();
  return convenentes.find(c => c.id === id) || null;
};

// Update an existing convenente
export const updateConvenente = (id: string, updates: Partial<ConvenenteData>): (ConvenenteData & { id: string }) | null => {
  const convenentes = getConvenentes();
  const index = convenentes.findIndex(c => c.id === id);

  if (index === -1) {
    return null;
  }

  // Update the convenente
  convenentes[index] = {
    ...convenentes[index],
    ...updates,
    dataAtualizacao: new Date().toISOString()
  };

  // Save back to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convenentes));

  return convenentes[index];
};

// Delete a convenente
export const deleteConvenente = (id: string): boolean => {
  const convenentes = getConvenentes();
  const newConvenentes = convenentes.filter(c => c.id !== id);
  
  if (newConvenentes.length === convenentes.length) {
    return false; // Nothing was deleted
  }
  
  // Save back to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newConvenentes));
  
  return true;
};

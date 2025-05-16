
import { EmpresaData } from "@/types/empresa";
import {
  saveEmpresa as apiSaveEmpresa,
  updateEmpresa as apiUpdateEmpresa,
  deleteEmpresa as apiDeleteEmpresa,
  getEmpresas as apiGetEmpresas
} from "./empresaApi";

export const createEmpresa = async (formData: EmpresaData): Promise<EmpresaData & { id: string }> => {
  return await apiSaveEmpresa(formData);
};

export const updateEmpresaData = async (id: string, formData: EmpresaData): Promise<(EmpresaData & { id: string }) | null> => {
  return await apiUpdateEmpresa(id, formData);
};

export const removeEmpresa = async (id: string): Promise<boolean> => {
  return await apiDeleteEmpresa(id);
};

export const fetchEmpresas = async (): Promise<Array<EmpresaData & { id: string }>> => {
  return await apiGetEmpresas();
};

export {
  searchEmpresasByTerm,
  getEmpresas,
  getEmpresaById,
  saveEmpresa,
  updateEmpresa,
  deleteEmpresa
} from "./empresaApi";

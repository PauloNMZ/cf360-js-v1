
import { supabase } from "@/integrations/supabase/client";
import { ServiceType, NewServiceType } from "@/types/serviceType";
import { useToast } from "@/hooks/use-toast";

// Get all service types for current user
export const getServiceTypes = async (): Promise<ServiceType[]> => {
  try {
    const { data, error } = await supabase
      .from('tipos_servico')
      .select('*')
      .order('codigo', { ascending: true });
      
    if (error) {
      console.error('Error fetching service types:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getServiceTypes:', error);
    throw error;
  }
};

// Get a specific service type by ID
export const getServiceTypeById = async (id: string): Promise<ServiceType | null> => {
  try {
    const { data, error } = await supabase
      .from('tipos_servico')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      console.error('Error fetching service type:', error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error in getServiceTypeById:', error);
    throw error;
  }
};

// Create a new service type
export const createServiceType = async (serviceType: NewServiceType): Promise<ServiceType> => {
  try {
    const { data, error } = await supabase
      .from('tipos_servico')
      .insert(serviceType)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating service type:', error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error in createServiceType:', error);
    throw error;
  }
};

// Update a service type
export const updateServiceType = async (id: string, serviceType: Partial<NewServiceType>): Promise<ServiceType> => {
  try {
    const { data, error } = await supabase
      .from('tipos_servico')
      .update(serviceType)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating service type:', error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateServiceType:', error);
    throw error;
  }
};

// Delete a service type
export const deleteServiceType = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('tipos_servico')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting service type:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error in deleteServiceType:', error);
    throw error;
  }
};

// Hook for service type operations with toast notifications
export const useServiceTypeOperations = () => {
  const { toast } = useToast();
  
  const fetchServiceTypes = async () => {
    try {
      return await getServiceTypes();
    } catch (error: any) {
      toast({
        title: "Erro ao carregar tipos de serviço",
        description: error.message || "Falha ao buscar dados",
        variant: "destructive",
      });
      return [];
    }
  };
  
  const addServiceType = async (serviceType: NewServiceType) => {
    try {
      const result = await createServiceType(serviceType);
      toast({
        title: "Tipo de serviço criado",
        description: `${serviceType.nome} foi adicionado com sucesso`,
      });
      return result;
    } catch (error: any) {
      toast({
        title: "Erro ao criar tipo de serviço",
        description: error.message || "Falha ao criar tipo de serviço",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const editServiceType = async (id: string, serviceType: Partial<NewServiceType>) => {
    try {
      const result = await updateServiceType(id, serviceType);
      toast({
        title: "Tipo de serviço atualizado",
        description: "Alterações salvas com sucesso",
      });
      return result;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar tipo de serviço",
        description: error.message || "Falha ao atualizar dados",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const removeServiceType = async (id: string) => {
    try {
      await deleteServiceType(id);
      toast({
        title: "Tipo de serviço removido",
        description: "Item excluído com sucesso",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao remover tipo de serviço",
        description: error.message || "Falha ao excluir item",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return {
    fetchServiceTypes,
    addServiceType,
    editServiceType,
    removeServiceType
  };
};

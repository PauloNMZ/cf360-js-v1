
import { supabase } from "@/integrations/supabase/client";
import { Group, NewGroup } from "@/types/group";

// Get all groups for current user
export const getGroups = async (): Promise<Group[]> => {
  try {
    const { data, error } = await supabase
      .from('grupos_favorecidos')
      .select('*')
      .order('nome', { ascending: true });
      
    if (error) {
      console.error('Error fetching groups:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getGroups:', error);
    throw error;
  }
};

// Get a specific group by ID with service type details
export const getGroupById = async (id: string): Promise<Group | null> => {
  try {
    const { data, error } = await supabase
      .from('grupos_favorecidos')
      .select(`
        *,
        tipos_servico:tipo_servico_id(id, codigo, nome)
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      console.error('Error fetching group:', error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error in getGroupById:', error);
    throw error;
  }
};

// Create a new group
export const createGroup = async (group: NewGroup): Promise<Group> => {
  try {
    // user_id is now included in NewGroup interface
    const { data, error } = await supabase
      .from('grupos_favorecidos')
      .insert(group)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating group:', error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error in createGroup:', error);
    throw error;
  }
};

// Update a group
export const updateGroup = async (id: string, group: Partial<NewGroup>): Promise<Group> => {
  try {
    // We're not updating user_id, so we don't need to worry about it here
    const { data, error } = await supabase
      .from('grupos_favorecidos')
      .update(group)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating group:', error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateGroup:', error);
    throw error;
  }
};

// Delete a group
export const deleteGroup = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('grupos_favorecidos')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting group:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error in deleteGroup:', error);
    throw error;
  }
};

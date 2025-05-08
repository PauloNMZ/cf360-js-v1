
import { supabase } from "@/integrations/supabase/client";
import { GroupMember, NewGroupMember } from "@/types/group";

// Get all members of a group
export const getGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
  try {
    const { data, error } = await supabase
      .from('favorecidos_grupos')
      .select('*')
      .eq('grupo_id', groupId);
      
    if (error) {
      console.error('Error fetching group members:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getGroupMembers:', error);
    throw error;
  }
};

// Add a member to a group
export const addGroupMember = async (member: NewGroupMember): Promise<GroupMember> => {
  try {
    const { data, error } = await supabase
      .from('favorecidos_grupos')
      .insert(member)
      .select()
      .single();
      
    if (error) {
      console.error('Error adding group member:', error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error in addGroupMember:', error);
    throw error;
  }
};

// Remove a member from a group
export const removeGroupMember = async (memberId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('favorecidos_grupos')
      .delete()
      .eq('id', memberId);
      
    if (error) {
      console.error('Error removing group member:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error in removeGroupMember:', error);
    throw error;
  }
};

// Get a specific member by ID
export const getGroupMemberById = async (memberId: string): Promise<GroupMember | null> => {
  try {
    const { data, error } = await supabase
      .from('favorecidos_grupos')
      .select('*')
      .eq('id', memberId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      console.error('Error fetching group member:', error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error in getGroupMemberById:', error);
    throw error;
  }
};

// Update a group member
export const updateGroupMember = async (memberId: string, updates: Partial<NewGroupMember>): Promise<GroupMember> => {
  try {
    const { data, error } = await supabase
      .from('favorecidos_grupos')
      .update(updates)
      .eq('id', memberId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating group member:', error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateGroupMember:', error);
    throw error;
  }
};

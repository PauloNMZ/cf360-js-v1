
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

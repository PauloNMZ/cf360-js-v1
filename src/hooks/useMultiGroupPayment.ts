
import { useState } from 'react';
import { toast } from 'sonner';
import { Group } from "@/types/group";
import { CNABWorkflowData } from "@/types/cnab240";
import { useGroupOperations } from '@/services/group/hooks';

export const useMultiGroupPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [fileOption, setFileOption] = useState<'single' | 'multiple'>('single');
  const { fetchGroupDetails, fetchGroupMembers } = useGroupOperations();
  
  const handleSelectGroup = (groupId: string) => {
    if (selectedGroups.includes(groupId)) {
      setSelectedGroups(selectedGroups.filter(id => id !== groupId));
    } else {
      setSelectedGroups([...selectedGroups, groupId]);
    }
  };

  const handleSelectAllGroups = (groups: Group[]) => {
    if (selectedGroups.length === groups.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(groups.map(g => g.id));
    }
  };

  const generatePayments = async () => {
    if (selectedGroups.length === 0) {
      toast.error("Selecione pelo menos um grupo para pagamento");
      return false;
    }

    setIsProcessing(true);
    try {
      // For each selected group
      const groupPromises = selectedGroups.map(async (groupId) => {
        // Get group details
        const groupDetails = await fetchGroupDetails(groupId);
        if (!groupDetails) {
          throw new Error(`Grupo com ID ${groupId} não encontrado`);
        }
        
        // Get group members
        const members = await fetchGroupMembers(groupId);
        
        // Create workflow data
        const workflowData: CNABWorkflowData = {
          paymentDate: groupDetails.data_pagamento ? new Date(groupDetails.data_pagamento) : new Date(),
          serviceType: groupDetails.tipo_servico_id || '20',
          convenente: { convenioPag: '123456' }, // This should come from user settings
          sendMethod: 'download'
        };
        
        return {
          group: groupDetails,
          members,
          workflowData
        };
      });
      
      // Wait for all promises to resolve
      const groupsData = await Promise.all(groupPromises);
      
      // Here you would implement the actual file generation logic
      if (fileOption === 'single') {
        // Generate a single consolidated CNAB file
        console.log("Generating single CNAB file for groups:", groupsData.map(g => g.group.nome));
        toast.success("Arquivo CNAB consolidado gerado com sucesso", {
          description: `Incluindo ${selectedGroups.length} grupos de pagamento`
        });
      } else {
        // Generate multiple CNAB files (one per group)
        console.log("Generating multiple CNAB files for groups:", groupsData.map(g => g.group.nome));
        toast.success(`${selectedGroups.length} arquivos CNAB gerados com sucesso`);
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao gerar pagamentos:", error);
      toast.error("Erro ao gerar pagamentos");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    selectedGroups,
    fileOption,
    isProcessing,
    handleSelectGroup,
    handleSelectAllGroups,
    setFileOption,
    generatePayments
  };
};

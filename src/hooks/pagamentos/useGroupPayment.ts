
import { useState, useEffect } from 'react';
import { Group } from "@/types/group";
import { useGroupOperations } from "@/services/group/hooks";
import { toast } from "sonner";

export const useGroupPayment = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [paymentValue, setPaymentValue] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const { fetchGroups, fetchGroupMembers } = useGroupOperations();

  useEffect(() => {
    console.log("useGroupPayment hook initialized");
    loadGroups();
  }, []);

  const loadGroups = async () => {
    console.log("Loading groups...");
    setIsLoadingGroups(true);
    setHasError(false);
    try {
      const data = await fetchGroups();
      console.log("Groups loaded:", data);
      setGroups(data);
    } catch (error) {
      console.error("Erro ao carregar grupos:", error);
      setHasError(true);
      toast.error("Erro ao carregar grupos");
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    
    if (!selectedGroupId) {
      toast.error("Selecione um grupo");
      return;
    }
    
    if (!paymentDate) {
      toast.error("Informe a data de pagamento");
      return;
    }

    setIsLoading(true);
    try {
      // Buscar membros do grupo
      const members = await fetchGroupMembers(selectedGroupId);
      const selectedGroup = groups.find(g => g.id === selectedGroupId);
      
      if (members.length === 0) {
        toast.error("O grupo selecionado não possui membros");
        return;
      }

      // Aqui você implementaria a lógica de criação dos lançamentos
      // Por enquanto, vamos simular o processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Lançamento criado para o grupo "${selectedGroup?.nome}"`, {
        description: `${members.length} favorecidos processados`
      });
      
      // Limpar formulário
      setSelectedGroupId("");
      setPaymentDate("");
      setPaymentValue("");
      setDescription("");
      
    } catch (error) {
      console.error("Erro ao processar lançamento:", error);
      toast.error("Erro ao processar lançamento por grupo");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  return {
    groups,
    selectedGroupId,
    setSelectedGroupId,
    paymentDate,
    setPaymentDate,
    paymentValue,
    setPaymentValue,
    description,
    setDescription,
    isLoading,
    isLoadingGroups,
    hasError,
    selectedGroup,
    loadGroups,
    handleSubmit
  };
};

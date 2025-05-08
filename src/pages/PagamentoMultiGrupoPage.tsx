import React, { useState, useEffect } from "react";
import { Group } from "@/types/group";
import { useGroupOperations } from "@/services/group/hooks";
import { toast } from "sonner";
import { useMultiGroupPayment } from "@/hooks/useMultiGroupPayment";
import GroupSelectionCard from "@/components/payment/multi-group/GroupSelectionCard";
import FileOptionsCard from "@/components/payment/multi-group/FileOptionsCard";

const PagamentoMultiGrupoPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const { fetchGroups } = useGroupOperations();
  const {
    selectedGroups,
    fileOption,
    isProcessing,
    handleSelectGroup,
    handleSelectAllGroups,
    setFileOption,
    generatePayments
  } = useMultiGroupPayment();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setIsLoadingGroups(true);
    try {
      const data = await fetchGroups();
      setGroups(data);
    } catch (error) {
      console.error("Erro ao carregar grupos:", error);
      toast.error("Erro ao carregar grupos");
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const handleToggleAllGroups = () => {
    handleSelectAllGroups(groups);
  };

  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold mb-6">Pagamento Multi-Grupos</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <GroupSelectionCard 
          groups={groups}
          selectedGroups={selectedGroups}
          isLoading={isLoadingGroups}
          onSelectGroup={handleSelectGroup}
          onSelectAll={handleToggleAllGroups}
        />

        <FileOptionsCard 
          fileOption={fileOption}
          isProcessing={isProcessing}
          selectedGroups={selectedGroups}
          onFileOptionChange={setFileOption}
          onGeneratePayments={generatePayments}
        />
      </div>
    </div>
  );
};

export default PagamentoMultiGrupoPage;

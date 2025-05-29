
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";
import { Group } from "@/types/group";

interface GroupSelectionSectionProps {
  groups: Group[];
  selectedGroupId: string;
  onGroupChange: (groupId: string) => void;
  isLoadingGroups: boolean;
  selectedGroup?: Group;
}

const GroupSelectionSection = ({
  groups,
  selectedGroupId,
  onGroupChange,
  isLoadingGroups,
  selectedGroup
}: GroupSelectionSectionProps) => {
  return (
    <>
      {/* Seleção do Grupo */}
      <div className="space-y-2">
        <Label htmlFor="group-select" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Grupo de Favorecidos
        </Label>
        <Select 
          value={selectedGroupId} 
          onValueChange={onGroupChange}
          disabled={isLoadingGroups}
        >
          <SelectTrigger id="group-select">
            <SelectValue placeholder={isLoadingGroups ? "Carregando grupos..." : "Selecione um grupo"} />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{group.nome}</span>
                  {group.descricao && (
                    <span className="text-sm text-muted-foreground">{group.descricao}</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Informações do Grupo Selecionado */}
      {selectedGroup && (
        <div className="p-3 bg-muted rounded-md">
          <h4 className="font-medium mb-2">Grupo Selecionado:</h4>
          <p className="text-sm"><strong>Nome:</strong> {selectedGroup.nome}</p>
          {selectedGroup.descricao && (
            <p className="text-sm"><strong>Descrição:</strong> {selectedGroup.descricao}</p>
          )}
          {selectedGroup.data_pagamento && (
            <p className="text-sm"><strong>Data Padrão:</strong> {new Date(selectedGroup.data_pagamento).toLocaleDateString('pt-BR')}</p>
          )}
        </div>
      )}
    </>
  );
};

export default GroupSelectionSection;

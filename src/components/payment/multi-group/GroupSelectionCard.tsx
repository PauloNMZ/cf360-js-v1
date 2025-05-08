
import React from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Group } from "@/types/group";

interface GroupSelectionCardProps {
  groups: Group[];
  selectedGroups: string[];
  isLoading: boolean;
  onSelectGroup: (groupId: string) => void;
  onSelectAll: () => void;
}

const GroupSelectionCard = ({
  groups,
  selectedGroups,
  isLoading,
  onSelectGroup,
  onSelectAll,
}: GroupSelectionCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecione os Grupos para Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum grupo encontrado</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="selectAll"
                checked={selectedGroups.length === groups.length && groups.length > 0}
                onCheckedChange={onSelectAll}
              />
              <Label htmlFor="selectAll">Selecionar todos os grupos</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {groups.map((group) => (
                <div 
                  key={group.id} 
                  className={`p-4 border rounded-md ${selectedGroups.includes(group.id) ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'}`}
                >
                  <div className="flex items-start">
                    <Checkbox 
                      id={`group-${group.id}`}
                      checked={selectedGroups.includes(group.id)}
                      onCheckedChange={() => onSelectGroup(group.id)}
                      className="mt-1"
                    />
                    <div className="ml-3">
                      <Label 
                        htmlFor={`group-${group.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {group.nome}
                      </Label>
                      <p className="text-sm text-muted-foreground">{group.descricao || "Sem descrição"}</p>
                      {group.data_pagamento && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Data de pagamento: {format(new Date(group.data_pagamento), 'dd/MM/yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupSelectionCard;

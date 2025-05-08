
import React, { useState, useEffect } from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Group, GroupMember } from "@/types/group";
import { useGroupOperations } from "@/services/group/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { FileText, Download, Check } from "lucide-react";
import { toast } from "sonner";
import { CNABWorkflowData } from "@/types/cnab240";
import { processSelectedRows } from "@/services/cnab240/cnab240Service";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

const PagamentoGrupoPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { fetchGroups, fetchGroupDetails, fetchGroupMembers } = useGroupOperations();

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      loadGroupMembers(selectedGroup.id);
    } else {
      setMembers([]);
    }
  }, [selectedGroup]);

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

  const loadGroupMembers = async (groupId: string) => {
    setIsLoadingMembers(true);
    try {
      // Get group details with service type information
      const groupDetails = await fetchGroupDetails(groupId);
      if (groupDetails) {
        setSelectedGroup(groupDetails);
      }
      
      // Get group members
      const membersData = await fetchGroupMembers(groupId);
      setMembers(membersData);
      // Auto-select all members
      setSelectedMembers(membersData.map(member => member.id));
    } catch (error) {
      console.error("Erro ao carregar membros do grupo:", error);
      toast.error("Erro ao carregar membros do grupo");
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleGroupSelection = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    setSelectedGroup(group || null);
  };

  const handleToggleMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const handleToggleAll = () => {
    if (selectedMembers.length === members.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(members.map(member => member.id));
    }
  };

  const handleGeneratePayment = async () => {
    if (!selectedGroup) {
      toast.error("Selecione um grupo para pagamento");
      return;
    }

    if (selectedMembers.length === 0) {
      toast.error("Selecione pelo menos um favorecido para pagamento");
      return;
    }

    setIsProcessing(true);
    try {
      // Create workflow data from selected group
      const workflowData: CNABWorkflowData = {
        paymentDate: selectedGroup.data_pagamento ? new Date(selectedGroup.data_pagamento) : new Date(),
        serviceType: selectedGroup.tipo_servico_id || '20', // Default to '20' if not set
        convenente: { convenioPag: '123456' }, // This should come from user settings or selected convenente
        sendMethod: 'download'
      };

      // Convert selected members to row data format expected by CNAB service
      const selectedMemberData = members
        .filter(member => selectedMembers.includes(member.id))
        .map(member => ({
          id: parseInt(member.id.substring(0, 8), 16), // Generate an ID from UUID
          favorecido: {
            nome: `Favorecido ${member.favorecido_id}`, // This should come from a proper favorecido lookup
            inscricao: '12345678901',
            banco: '001',
            agencia: '1234',
            conta: '12345',
            tipo: 'CC',
            valor: member.valor || 0,
            isValid: true
          }
        }));

      // Process the payment
      const result = await processSelectedRows(workflowData, selectedMemberData);
      
      if (result.success) {
        toast.success("Arquivo de pagamento gerado com sucesso", {
          description: `O arquivo ${result.fileName} foi gerado`
        });
      }
    } catch (error) {
      console.error("Erro ao gerar pagamento:", error);
      toast.error("Erro ao gerar pagamento");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="h-full">
        <h1 className="text-2xl font-bold mb-6">Pagamento por Grupo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Grupos */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Selecione um Grupo</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingGroups ? (
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
                <div className="space-y-2">
                  {groups.map((group) => (
                    <div 
                      key={group.id} 
                      onClick={() => handleGroupSelection(group.id)}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedGroup?.id === group.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'}`}
                    >
                      <h3 className="font-medium">{group.nome}</h3>
                      <p className="text-sm text-muted-foreground">{group.descricao || "Sem descrição"}</p>
                      {group.data_pagamento && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Data de pagamento: {format(new Date(group.data_pagamento), 'dd/MM/yyyy')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Membros do Grupo */}
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {selectedGroup 
                  ? `Favorecidos do Grupo: ${selectedGroup.nome}` 
                  : "Selecione um grupo para ver os favorecidos"}
              </CardTitle>
              {selectedGroup && (
                <Button 
                  onClick={handleGeneratePayment}
                  disabled={isProcessing || selectedMembers.length === 0}
                >
                  {isProcessing ? (
                    <>Processando...</>
                  ) : (
                    <>
                      <FileText size={16} className="mr-2" />
                      Gerar Pagamento
                    </>
                  )}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {!selectedGroup ? (
                <div className="text-center py-16">
                  <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Selecione um grupo para ver os favorecidos</p>
                </div>
              ) : isLoadingMembers ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">Este grupo não possui favorecidos</p>
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox 
                              checked={selectedMembers.length === members.length}
                              onCheckedChange={handleToggleAll}
                            />
                          </TableHead>
                          <TableHead>Favorecido</TableHead>
                          <TableHead>Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {members.map(member => (
                          <TableRow key={member.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedMembers.includes(member.id)}
                                onCheckedChange={() => handleToggleMember(member.id)}
                              />
                            </TableCell>
                            <TableCell>{member.favorecido_id}</TableCell>
                            <TableCell>{member.valor ? `R$ ${member.valor.toFixed(2)}` : "Não definido"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4">
                    <Button 
                      onClick={handleGeneratePayment} 
                      className="w-full"
                      disabled={isProcessing || selectedMembers.length === 0}
                    >
                      {isProcessing ? (
                        <>Processando...</>
                      ) : (
                        <>
                          <Download size={16} className="mr-2" />
                          Gerar Arquivo de Pagamento
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default PagamentoGrupoPage;

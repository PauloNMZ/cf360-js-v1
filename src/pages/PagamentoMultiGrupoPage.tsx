
import React, { useState, useEffect } from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Group, GroupMember } from "@/types/group";
import { useGroupOperations } from "@/services/group/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

const PagamentoMultiGrupoPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [fileOption, setFileOption] = useState<'single' | 'multiple'>('single');
  const [isProcessing, setIsProcessing] = useState(false);
  const { fetchGroups } = useGroupOperations();

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

  const handleToggleGroup = (groupId: string) => {
    if (selectedGroups.includes(groupId)) {
      setSelectedGroups(selectedGroups.filter(id => id !== groupId));
    } else {
      setSelectedGroups([...selectedGroups, groupId]);
    }
  };

  const handleToggleAll = () => {
    if (selectedGroups.length === groups.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(groups.map(group => group.id));
    }
  };

  const handleGeneratePayments = () => {
    if (selectedGroups.length === 0) {
      toast.error("Selecione pelo menos um grupo para pagamento");
      return;
    }

    setIsProcessing(true);
    try {
      // Implement generation of CNAB files based on selected groups
      // and fileOption (single or multiple files)
      
      setTimeout(() => {
        toast.success(
          fileOption === 'single' 
            ? "Arquivo de pagamento consolidado gerado com sucesso" 
            : `${selectedGroups.length} arquivos de pagamento gerados com sucesso`
        );
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao gerar pagamentos:", error);
      toast.error("Erro ao gerar pagamentos");
      setIsProcessing(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="h-full">
        <h1 className="text-2xl font-bold mb-6">Pagamento Multi-Grupos</h1>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Selecione os Grupos para Pagamento</CardTitle>
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
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="selectAll"
                      checked={selectedGroups.length === groups.length && groups.length > 0}
                      onCheckedChange={handleToggleAll}
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
                            onCheckedChange={() => handleToggleGroup(group.id)}
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

          <Card>
            <CardHeader>
              <CardTitle>Opções de Geração</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="fileOptions" className="w-full">
                <TabsList className="grid w-full grid-cols-1 max-w-md mx-auto">
                  <TabsTrigger value="fileOptions">Opções de Arquivo</TabsTrigger>
                </TabsList>
                <TabsContent value="fileOptions" className="py-4">
                  <RadioGroup 
                    defaultValue="single" 
                    value={fileOption} 
                    onValueChange={(value) => setFileOption(value as 'single' | 'multiple')}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 rounded-md border p-4">
                      <RadioGroupItem value="single" id="single" />
                      <Label htmlFor="single" className="flex flex-col">
                        <span className="font-medium">Arquivo único consolidado</span>
                        <span className="text-sm text-muted-foreground">Gerar um único arquivo CNAB com todos os pagamentos</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-4">
                      <RadioGroupItem value="multiple" id="multiple" />
                      <Label htmlFor="multiple" className="flex flex-col">
                        <span className="font-medium">Múltiplos arquivos</span>
                        <span className="text-sm text-muted-foreground">Gerar um arquivo CNAB separado para cada grupo</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <Button 
                  onClick={handleGeneratePayments} 
                  disabled={isProcessing || selectedGroups.length === 0}
                  size="lg"
                  className="w-full"
                >
                  {isProcessing ? (
                    <>Processando...</>
                  ) : (
                    <>
                      <FileText size={16} className="mr-2" />
                      Gerar {fileOption === 'single' ? "Arquivo de Pagamento" : "Arquivos de Pagamento"}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default PagamentoMultiGrupoPage;


import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGroupOperations } from "@/services/group/hooks";
import { Group } from "@/types/group";
import { toast } from "sonner";
import { Calendar, Users, DollarSign, FileText, Send } from "lucide-react";

const LancamentoGrupos = () => {
  console.log("LancamentoGrupos component is rendering");
  
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
    console.log("LancamentoGrupos useEffect triggered");
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

  // Renderizar estado de erro
  if (hasError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-destructive mb-4">Erro ao carregar a interface de lançamento por grupos</p>
            <Button onClick={loadGroups}>Tentar Novamente</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  console.log("LancamentoGrupos rendering main content");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lançamento por Grupos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Seleção do Grupo */}
            <div className="space-y-2">
              <Label htmlFor="group-select" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Grupo de Favorecidos
              </Label>
              <Select 
                value={selectedGroupId} 
                onValueChange={setSelectedGroupId}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data de Pagamento */}
              <div className="space-y-2">
                <Label htmlFor="payment-date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data de Pagamento
                </Label>
                <Input
                  id="payment-date"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                />
              </div>

              {/* Valor (Opcional) */}
              <div className="space-y-2">
                <Label htmlFor="payment-value" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Valor por Favorecido (Opcional)
                </Label>
                <Input
                  id="payment-value"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={paymentValue}
                  onChange={(e) => setPaymentValue(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Se não informado, será usado o valor individual de cada favorecido no grupo
                </p>
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Descrição/Observações
              </Label>
              <Textarea
                id="description"
                placeholder="Descrição do lançamento por grupo..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Botão de Submissão */}
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={isLoading || !selectedGroupId}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Criar Lançamento por Grupo
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Card de Informações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Como funciona o Lançamento por Grupos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <Users className="h-4 w-4 mt-1 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Seleção de Grupo</p>
              <p className="text-xs text-muted-foreground">Escolha um grupo de favorecidos previamente cadastrado</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <DollarSign className="h-4 w-4 mt-1 text-green-500" />
            <div>
              <p className="text-sm font-medium">Valor por Favorecido</p>
              <p className="text-xs text-muted-foreground">Pode ser informado um valor único ou usar os valores individuais já cadastrados</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Send className="h-4 w-4 mt-1 text-purple-500" />
            <div>
              <p className="text-sm font-medium">Processamento</p>
              <p className="text-xs text-muted-foreground">Serão criados lançamentos individuais para cada favorecido do grupo</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LancamentoGrupos;

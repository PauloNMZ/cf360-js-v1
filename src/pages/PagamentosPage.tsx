import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  User,
  Users,
  FileSpreadsheet,
  FileCode,
  Search,
  Plus
} from "lucide-react";
import FavorecidoFormModal from '@/components/favorecidos/FavorecidoFormModal';
import { useFavorecidos } from '@/hooks/favorecidos/useFavorecidos';
import FavorecidoSearchBar, { EmptyState } from '@/components/favorecidos/FavorecidoSearchBar';
import FavorecidosTable from '@/components/favorecidos/FavorecidosTable';
import { Loader2 } from 'lucide-react';
import SuccessModal from '@/components/ui/SuccessModal';

// Componentes placeholder para outros tipos de lançamento
const LancamentoGrupos = () => <div>Formulário/Interface para Lançamento por Grupos</div>;
const ImportarPlanilha = () => <div>Interface para Importar Planilha</div>;
const ImportarCNAB = () => <div>Interface para Importar CNAB</div>;

// Componente para Lançamento por Favorecidos
const LancamentoFavorecidos = () => {
  const {
    modalOpen,
    setModalOpen,
    handleCreateNew,
    handleInputChange,
    handleSelectChange,
    handleSave,
    formMode,
    currentFavorecido,
    isLoading,
    filteredFavorecidos,
    searchTerm,
    handleSearchChange,
    successModalOpen,
    setSuccessModalOpen,
  } = useFavorecidos();

  const [selectedFavorecido, setSelectedFavorecido] = useState<any>(null);
  const [selectedFavorecidos, setSelectedFavorecidos] = useState<string[]>([]);

  const handleSelectFavorecido = (favorecido: any) => {
    setSelectedFavorecido(favorecido);
  };

  const handleCancelSelection = () => {
    setSelectedFavorecido(null);
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedFavorecidos(selectedIds);
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Lançamento para Favorecido</h3>
        <Button onClick={() => handleCreateNew()} className="flex items-center gap-2">
          <Plus size={16} /> Cadastrar Novo Favorecido
        </Button>
      </div>

      {selectedFavorecido ? (
        <div className="space-y-4 p-4 border rounded-md bg-background">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">Favorecido Selecionado:</h4>
            <Button variant="outline" size="sm" onClick={handleCancelSelection}>Selecionar Outro</Button>
          </div>
          <div className="border p-4 rounded-md space-y-2 bg-secondary/20">
            <p><strong>Nome:</strong> {selectedFavorecido.nome}</p>
            <p><strong>Inscrição:</strong> {selectedFavorecido.inscricao}</p>
            <p><strong>Banco/Agência/Conta:</strong> {selectedFavorecido.dadosBancarios}</p>
            <p><strong>Chave PIX:</strong> {selectedFavorecido.chavePix}</p>
          </div>

          <div className="mt-4 space-y-3">
            <h4 className="text-lg font-semibold">Detalhes do Lançamento</h4>
            <p className="text-muted-foreground">Formulário de lançamento para {selectedFavorecido.nome} aqui...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-4">
          <FavorecidoSearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            hasResults={filteredFavorecidos.length > 0}
          />

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
            </div>
          ) : filteredFavorecidos.length > 0 ? (
            <FavorecidosTable
              favorecidos={filteredFavorecidos}
              onEdit={() => {}}
              onDelete={() => {}}
              onSelectFavorecido={handleSelectFavorecido}
              selectedFavorecidos={selectedFavorecidos}
              onSelectionChange={handleSelectionChange}
              itemsPerPage={5}
            />
          ) : (
            <EmptyState searchTerm={searchTerm} />
          )}

          {selectedFavorecidos.length > 0 && (
            <div className="mt-4 p-4 border rounded-md bg-background">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold">
                  {selectedFavorecidos.length} favorecido(s) selecionado(s)
                </h4>
                <Button variant="outline" size="sm" onClick={() => setSelectedFavorecidos([])}>
                  Limpar Seleção
                </Button>
              </div>
              <div className="mt-4">
                <p className="text-muted-foreground">
                  Formulário de lançamento em lote para os favorecidos selecionados aqui...
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <FavorecidoFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        currentFavorecido={currentFavorecido}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleSave={handleSave}
        formMode={formMode}
        isLoading={isLoading}
      />

      <SuccessModal
        open={successModalOpen}
        onOpenChange={setSuccessModalOpen}
        title="Sucesso!"
        message="Favorecido cadastrado com sucesso."
        buttonText="OK"
        onButtonClick={handleCloseSuccessModal}
      />
    </div>
  );
};

const PagamentosPage = () => {
  const [activeLancamentoTab, setActiveLancamentoTab] = useState<'favorecidos' | 'grupos' | 'planilha' | 'cnab' | null>(null);

  const renderLancamentoContent = () => {
    switch (activeLancamentoTab) {
      case 'favorecidos':
        return <LancamentoFavorecidos />;
      case 'grupos':
        return <div>Formulário/Interface para Lançamento por Grupos</div>;
      case 'planilha':
        return <div>Interface para Importar Planilha</div>;
      case 'cnab':
        return <div>Interface para Importar CNAB</div>;
      default:
        return (
          <p className="text-center text-muted-foreground">Selecione uma opção de lançamento acima.</p>
        );
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Página de Pagamentos</h1>

      <Tabs defaultValue="transferencias">
        <TabsList className={cn(
          "mb-4",
          "flex justify-center",
          "h-auto items-center",
          "space-x-2"
        )}>
          <TabsTrigger
            value="transferencias"
            className={cn(
              "flex-1",
              "rounded-md px-3 py-2 text-sm font-medium",
              "bg-background text-muted-foreground",
              "data-[state=active]:bg-accent data-[state=active]:text-accent-foreground",
              "hover:bg-muted hover:text-foreground"
            )}
          >
            Transferências
          </TabsTrigger>
          <TabsTrigger
            value="titulos"
            className={cn(
              "flex-1",
              "rounded-md px-3 py-2 text-sm font-medium",
              "bg-background text-muted-foreground",
              "data-[state=active]:bg-accent data-[state=active]:text-accent-foreground",
              "hover:bg-muted hover:text-foreground"
            )}
          >
            Títulos
          </TabsTrigger>
          <TabsTrigger
            value="guias"
            className={cn(
              "flex-1",
              "rounded-md px-3 py-2 text-sm font-medium",
              "bg-background text-muted-foreground",
              "data-[state=active]:bg-accent data-[state=active]:text-accent-foreground",
              "hover:bg-muted hover:text-foreground"
            )}
          >
            Guias
          </TabsTrigger>
          <TabsTrigger
            value="pix"
            className={cn(
              "flex-1",
              "rounded-md px-3 py-2 text-sm font-medium",
              "bg-background text-muted-foreground",
              "data-[state=active]:bg-accent data-[state=active]:text-accent-foreground",
              "hover:bg-muted hover:text-foreground"
            )}
          >
            PIX
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transferencias" className="space-y-4">
          <h2 className="text-xl font-semibold">Opções de Lançamento</h2>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => setActiveLancamentoTab('favorecidos')}>
              <User className="mr-2 h-4 w-4" /> Por Favorecidos
            </Button>
            <Button variant="outline" onClick={() => setActiveLancamentoTab('grupos')}>
              <Users className="mr-2 h-4 w-4" /> Por Grupos
            </Button>
            <Button variant="outline" onClick={() => setActiveLancamentoTab('planilha')}>
              <FileSpreadsheet className="mr-2 h-4 w-4" /> Importar Planilha
            </Button>
            <Button variant="outline" onClick={() => setActiveLancamentoTab('cnab')}>
              <FileCode className="mr-2 h-4 w-4" /> Importar CNAB
            </Button>
          </div>

          <div className="mt-6 p-4 border rounded-md bg-background">
             {renderLancamentoContent()}
          </div>
        </TabsContent>

        <TabsContent value="titulos">
          <h2>Conteúdo de Títulos</h2>
        </TabsContent>

        <TabsContent value="guias">
          <h2>Conteúdo de Guias</h2>
        </TabsContent>

        <TabsContent value="pix">
          <h2>Conteúdo de PIX</h2>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PagamentosPage; 

import React from 'react';
import DataTable from '@/components/ui/data-table';

const DataTableDemoPage = () => {
  // Sample data with some invalid entries for testing
  const sampleData = [
    {
      id: "1",
      title: "João Silva",
      type: "Pessoa Física",
      bank: "Banco do Brasil",
      pixKey: "joao@email.com",
      defaultAmount: 1500.50,
      actions: "Editar | Excluir"
    },
    {
      id: "2",
      title: "Maria Santos",
      type: "Pessoa Física",
      bank: "Caixa Econômica",
      pixKey: "(11) 99999-9999",
      defaultAmount: 2300.75,
      actions: "Editar | Excluir"
    },
    {
      id: "3",
      title: "Empresa ABC Ltda",
      type: "Pessoa Jurídica",
      bank: "Itaú",
      pixKey: "12.345.678/0001-90",
      defaultAmount: 5000.00,
      actions: "Editar | Excluir"
    },
    {
      id: "invalid", // Invalid: id should be numerical
      title: "",      // Invalid: empty title
      type: "Pessoa Física",
      bank: "Santander",
      pixKey: "chave@pix.com",
      defaultAmount: "invalid" as any, // Invalid: should be number
      actions: "Editar | Excluir"
    },
    {
      id: "4",
      title: "Pedro Costa",
      type: "Pessoa Física",
      bank: "Bradesco",
      pixKey: "+55 11 98765-4321",
      defaultAmount: 850.25,
      actions: "Editar | Excluir"
    },
    // Add more sample data to test pagination
    ...Array.from({ length: 25 }, (_, i) => ({
      id: String(i + 5),
      title: `Favorecido ${i + 5}`,
      type: i % 2 === 0 ? "Pessoa Física" : "Pessoa Jurídica",
      bank: `Banco ${i + 5}`,
      pixKey: `favorecido${i + 5}@email.com`,
      defaultAmount: Math.random() * 10000,
      actions: "Editar | Excluir"
    }))
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Demonstração da Tabela de Dados</h1>
          <p className="text-muted-foreground mt-2">
            Tabela com validação de dados, paginação e cabeçalhos destacados
          </p>
        </div>

        <DataTable 
          data={sampleData}
          itemsPerPage={10}
          showAllOption={true}
        />
      </div>
    </div>
  );
};

export default DataTableDemoPage;

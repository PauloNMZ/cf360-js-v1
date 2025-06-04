
import React, { useState } from 'react';
import CompanyDropdown from './CompanyDropdown';
import { Card, CardContent, CardHeader, CardTitle } from './card';

const CompanyDropdownExample: React.FC = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>();

  // Example companies data
  const companies = [
    { id: 1, name: "Empresa ABC Ltda" },
    { id: 2, name: "Corporação XYZ S.A." },
    { id: 3, name: "Indústria 123 Eireli" },
    { id: 4, name: "Comércio Alpha Beta Gama Ltda" },
  ];

  const handleSelectCompany = (company: { id: number; name: string }) => {
    setSelectedCompanyId(company.id);
    console.log('Selected company:', company);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Company Dropdown Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Selecione uma empresa:
            </label>
            <CompanyDropdown
              companies={companies}
              selectedCompanyId={selectedCompanyId}
              onSelectCompany={handleSelectCompany}
              placeholder="Escolha uma empresa..."
            />
          </div>
          
          {selectedCompanyId && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm">
                <strong>Empresa selecionada:</strong>{' '}
                {companies.find(c => c.id === selectedCompanyId)?.name}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Dropdown desabilitado:
            </label>
            <CompanyDropdown
              companies={companies}
              selectedCompanyId={1}
              onSelectCompany={handleSelectCompany}
              disabled={true}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Sem empresas disponíveis:
            </label>
            <CompanyDropdown
              companies={[]}
              onSelectCompany={handleSelectCompany}
              placeholder="Nenhuma empresa..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDropdownExample;

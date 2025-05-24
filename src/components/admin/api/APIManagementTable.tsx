
import React, { useState } from 'react';
import { Edit, Trash2, Plus, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { APICredentials } from '@/types/api';
import AddAPIModal from './AddAPIModal';
import EditAPIModal from './EditAPIModal';
import CredentialRotationModal from './CredentialRotationModal';
import DeleteAPIDialog from './DeleteAPIDialog';

interface APIManagementTableProps {
  apis: APICredentials[];
  onAddAPI: (api: APICredentials) => void;
  onEditAPI: (api: APICredentials) => void;
  onDeleteAPI: (apiId: string) => void;
  onRotateCredentials: (apiId: string, newCredentials: any) => void;
  onToggleStatus: (apiId: string) => void;
}

const APIManagementTable: React.FC<APIManagementTableProps> = ({
  apis,
  onAddAPI,
  onEditAPI,
  onDeleteAPI,
  onRotateCredentials,
  onToggleStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRotationModal, setShowRotationModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAPI, setSelectedAPI] = useState<APICredentials | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const filteredAPIs = apis.filter(api =>
    api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    api.clientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const maskSecret = (secret: string) => {
    if (secret.length <= 8) return '*'.repeat(secret.length);
    return secret.substring(0, 4) + '*'.repeat(secret.length - 8) + secret.substring(secret.length - 4);
  };

  const toggleSecretVisibility = (apiId: string, field: string) => {
    const key = `${apiId}-${field}`;
    setShowSecrets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isSecretVisible = (apiId: string, field: string) => {
    const key = `${apiId}-${field}`;
    return showSecrets[key] || false;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de APIs</h2>
          <p className="text-muted-foreground">
            Gerencie credenciais e configurações de APIs bancárias
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova API
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Buscar por nome ou Client ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Client ID</TableHead>
              <TableHead>Client Secret</TableHead>
              <TableHead>App Key</TableHead>
              <TableHead>Auth Rules</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>URLs</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAPIs.map((api) => (
              <TableRow key={api.id}>
                <TableCell className="font-medium">{api.name}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">
                      {isSecretVisible(api.id, 'clientId') ? api.clientId : maskSecret(api.clientId)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSecretVisibility(api.id, 'clientId')}
                    >
                      {isSecretVisible(api.id, 'clientId') ? 
                        <EyeOff className="h-3 w-3" /> : 
                        <Eye className="h-3 w-3" />
                      }
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">
                      {isSecretVisible(api.id, 'clientSecret') ? api.clientSecret : maskSecret(api.clientSecret)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSecretVisibility(api.id, 'clientSecret')}
                    >
                      {isSecretVisible(api.id, 'clientSecret') ? 
                        <EyeOff className="h-3 w-3" /> : 
                        <Eye className="h-3 w-3" />
                      }
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">
                      {isSecretVisible(api.id, 'appKey') ? api.appKey : maskSecret(api.appKey)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSecretVisibility(api.id, 'appKey')}
                    >
                      {isSecretVisible(api.id, 'appKey') ? 
                        <EyeOff className="h-3 w-3" /> : 
                        <Eye className="h-3 w-3" />
                      }
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={api.authRules === 'OAuth' ? 'default' : 'secondary'}>
                    {api.authRules}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={api.isActive ? 'default' : 'secondary'}>
                    {api.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Prod: {api.productionUrl}</div>
                    <div className="text-xs text-muted-foreground">Sand: {api.sandboxUrl}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAPI(api);
                        setShowEditModal(true);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAPI(api);
                        setShowRotationModal(true);
                      }}
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleStatus(api.id)}
                    >
                      {api.isActive ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedAPI(api);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddAPIModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={onAddAPI}
      />

      {selectedAPI && (
        <>
          <EditAPIModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedAPI(null);
            }}
            api={selectedAPI}
            onEdit={onEditAPI}
          />

          <CredentialRotationModal
            isOpen={showRotationModal}
            onClose={() => {
              setShowRotationModal(false);
              setSelectedAPI(null);
            }}
            apiId={selectedAPI.id}
            apiName={selectedAPI.name}
            onRotate={onRotateCredentials}
          />

          <DeleteAPIDialog
            isOpen={showDeleteDialog}
            onClose={() => {
              setShowDeleteDialog(false);
              setSelectedAPI(null);
            }}
            api={selectedAPI}
            onDelete={onDeleteAPI}
          />
        </>
      )}
    </div>
  );
};

export default APIManagementTable;

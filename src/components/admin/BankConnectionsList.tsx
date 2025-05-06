
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, TrashIcon } from "lucide-react";

interface BankConnection {
  id: number;
  appKey: string;
  clientId: string;
  clientSecret: string;
  registrarToken: string;
  basic: string;
  userBBsia: string;
  passwordBBsia: string;
}

interface BankConnectionsListProps {
  bankConnections: BankConnection[];
  onEdit: (connection: BankConnection) => void;
  onDelete: (connection: BankConnection) => void;
  onCreateNew: () => void;
  onBack: () => void;
}

const BankConnectionsList: React.FC<BankConnectionsListProps> = ({
  bankConnections,
  onEdit,
  onDelete,
  onCreateNew,
  onBack,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-blue-800">Conexões Bancárias</h3>
        <div className="flex space-x-2">
          <Button onClick={onBack} variant="outline" className="text-sm">
            Voltar
          </Button>
          <Button onClick={onCreateNew} className="bg-green-600 hover:bg-green-700">
            Nova Conexão
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>App Key</TableHead>
              <TableHead>Client ID</TableHead>
              <TableHead>Usuário BBSIA</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bankConnections.map((connection) => (
              <TableRow key={connection.id}>
                <TableCell className="font-medium">{connection.id}</TableCell>
                <TableCell>{connection.appKey.substring(0, 8)}...</TableCell>
                <TableCell>{connection.clientId.substring(0, 8)}...</TableCell>
                <TableCell>{connection.userBBsia || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(connection)}
                    >
                      <Edit size={14} className="mr-1" /> Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => onDelete(connection)}
                    >
                      <TrashIcon size={14} className="mr-1" /> Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BankConnectionsList;

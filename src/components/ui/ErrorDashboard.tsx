
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bug, Code, Zap, Trash2 } from 'lucide-react';
import { LovableError } from '@/types/error';
import ErrorDisplay from './ErrorDisplay';

interface ErrorDashboardProps {
  errors: LovableError[];
  onClearError?: (errorId: string) => void;
  onClearAllErrors?: () => void;
}

const ErrorDashboard: React.FC<ErrorDashboardProps> = ({
  errors,
  onClearError,
  onClearAllErrors
}) => {
  const [selectedError, setSelectedError] = useState<LovableError | null>(null);

  const getErrorCounts = () => {
    return {
      total: errors.length,
      critical: errors.filter(e => e.severity === 'critical').length,
      high: errors.filter(e => e.severity === 'high').length,
      medium: errors.filter(e => e.severity === 'medium').length,
      low: errors.filter(e => e.severity === 'low').length,
      typescript: errors.filter(e => e.category === 'typescript').length,
      runtime: errors.filter(e => e.category === 'runtime').length,
      build: errors.filter(e => e.category === 'build').length,
      validation: errors.filter(e => e.category === 'validation').length
    };
  };

  const counts = getErrorCounts();

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Bug className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Code className="h-4 w-4 text-blue-500" />;
      default: return <Zap className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedError(null)}
          >
            ← Voltar ao Dashboard
          </Button>
          {onClearError && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onClearError(selectedError.id);
                setSelectedError(null);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remover Erro
            </Button>
          )}
        </div>
        <ErrorDisplay error={selectedError} showDetails={true} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard de Erros</h2>
        {onClearAllErrors && errors.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onClearAllErrors}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar Todos
          </Button>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{counts.total}</p>
                <p className="text-xs text-muted-foreground">Total de Erros</p>
              </div>
              <Bug className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{counts.critical}</p>
                <p className="text-xs text-muted-foreground">Críticos</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">{counts.high}</p>
                <p className="text-xs text-muted-foreground">Altos</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{counts.typescript}</p>
                <p className="text-xs text-muted-foreground">TypeScript</p>
              </div>
              <Code className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Lists */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todos ({counts.total})</TabsTrigger>
          <TabsTrigger value="critical">Críticos ({counts.critical})</TabsTrigger>
          <TabsTrigger value="typescript">TypeScript ({counts.typescript})</TabsTrigger>
          <TabsTrigger value="runtime">Runtime ({counts.runtime})</TabsTrigger>
          <TabsTrigger value="recent">Recentes</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {errors.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Nenhum erro encontrado 🎉</p>
              </CardContent>
            </Card>
          ) : (
            errors.map((error) => (
              <Card key={error.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6" onClick={() => setSelectedError(error)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getSeverityIcon(error.severity)}
                        <span className="font-medium">{error.message}</span>
                        <Badge className={getSeverityColor(error.severity)}>
                          {error.severity}
                        </Badge>
                        <Badge variant="outline">
                          {error.category}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {error.context.component} • {error.context.file} • {error.timestamp.toLocaleString()}
                      </div>
                      {error.suggestedFixes.length > 0 && (
                        <div className="mt-2">
                          <Badge variant="secondary">
                            {error.suggestedFixes.length} correção(ões) sugerida(s)
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="critical">
          {errors.filter(e => e.severity === 'critical').map((error) => (
            <Card key={error.id} className="cursor-pointer hover:shadow-md transition-shadow border-red-200">
              <CardContent className="pt-6" onClick={() => setSelectedError(error)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getSeverityIcon(error.severity)}
                      <span className="font-medium">{error.message}</span>
                      <Badge className={getSeverityColor(error.severity)}>
                        CRÍTICO
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {error.context.component} • {error.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="typescript">
          {errors.filter(e => e.category === 'typescript').map((error) => (
            <Card key={error.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6" onClick={() => setSelectedError(error)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{error.message}</span>
                      <Badge className={getSeverityColor(error.severity)}>
                        {error.severity}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {error.context.file} • Linha {error.context.line || 'N/A'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="runtime">
          {errors.filter(e => e.category === 'runtime').map((error) => (
            <Card key={error.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6" onClick={() => setSelectedError(error)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{error.message}</span>
                      <Badge className={getSeverityColor(error.severity)}>
                        {error.severity}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {error.context.component} • {error.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recent">
          {errors.slice(0, 10).map((error) => (
            <Card key={error.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6" onClick={() => setSelectedError(error)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getSeverityIcon(error.severity)}
                      <span className="font-medium">{error.message}</span>
                      <Badge className={getSeverityColor(error.severity)}>
                        {error.severity}
                      </Badge>
                      <Badge variant="outline">
                        {error.category}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {error.context.component} • {error.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ErrorDashboard;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, RefreshCw, Copy, Bug } from 'lucide-react';
import { LovableError } from '@/types/error';

interface ErrorDisplayProps {
  error: LovableError;
  onRetry?: () => void;
  showDetails?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  onRetry, 
  showDetails = true 
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const copyErrorToClipboard = () => {
    const errorText = `
Erro: ${error.message}
Código: ${error.code}
Componente: ${error.context.component}
Arquivo: ${error.context.file}
Timestamp: ${error.timestamp.toISOString()}
${error.stackTrace ? `Stack Trace: ${error.stackTrace}` : ''}
    `.trim();
    
    navigator.clipboard.writeText(errorText);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-lg">Erro Detectado</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getSeverityColor(error.severity)}>
              {error.severity.toUpperCase()}
            </Badge>
            <Badge variant="outline">
              {error.category.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert>
          <Bug className="h-4 w-4" />
          <AlertDescription className="font-medium">
            {error.message}
          </AlertDescription>
        </Alert>

        {showDetails && (
          <>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Código:</span> {error.code}
              </div>
              <div>
                <span className="font-medium">Componente:</span> {error.context.component}
              </div>
              <div>
                <span className="font-medium">Arquivo:</span> {error.context.file}
              </div>
              <div>
                <span className="font-medium">Timestamp:</span> {error.timestamp.toLocaleString()}
              </div>
            </div>

            {error.suggestedFixes.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Correções Sugeridas:</h4>
                  <div className="space-y-2">
                    {error.suggestedFixes.map((fix, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <div className="font-medium text-sm">{fix.description}</div>
                        {fix.code && (
                          <pre className="mt-2 text-xs bg-background p-2 rounded border overflow-x-auto">
                            <code>{fix.code}</code>
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        <Separator />
        
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={copyErrorToClipboard}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar Detalhes
          </Button>
          {onRetry && (
            <Button
              variant="default"
              size="sm"
              onClick={onRetry}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorDisplay;

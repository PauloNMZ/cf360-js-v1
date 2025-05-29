
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-8">
          <p className="text-destructive mb-4">Erro ao carregar a interface de lançamento por grupos</p>
          <Button onClick={onRetry}>Tentar Novamente</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorState;

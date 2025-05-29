
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useGroupPayment } from "@/hooks/pagamentos/useGroupPayment";
import GroupSelectionSection from "./group-payment/GroupSelectionSection";
import PaymentDetailsSection from "./group-payment/PaymentDetailsSection";
import SubmitButton from "./group-payment/SubmitButton";
import GroupPaymentInfoCard from "./group-payment/GroupPaymentInfoCard";
import ErrorState from "./group-payment/ErrorState";

const LancamentoGrupos = () => {
  console.log("LancamentoGrupos component is rendering");
  
  const {
    groups,
    selectedGroupId,
    setSelectedGroupId,
    paymentDate,
    setPaymentDate,
    paymentValue,
    setPaymentValue,
    description,
    setDescription,
    isLoading,
    isLoadingGroups,
    hasError,
    selectedGroup,
    loadGroups,
    handleSubmit
  } = useGroupPayment();

  // Renderizar estado de erro
  if (hasError) {
    return <ErrorState onRetry={loadGroups} />;
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
            <GroupSelectionSection
              groups={groups}
              selectedGroupId={selectedGroupId}
              onGroupChange={setSelectedGroupId}
              isLoadingGroups={isLoadingGroups}
              selectedGroup={selectedGroup}
            />

            <PaymentDetailsSection
              paymentDate={paymentDate}
              onPaymentDateChange={setPaymentDate}
              paymentValue={paymentValue}
              onPaymentValueChange={setPaymentValue}
              description={description}
              onDescriptionChange={setDescription}
            />

            <SubmitButton 
              isLoading={isLoading}
              disabled={isLoading || !selectedGroupId}
            />
          </form>
        </CardContent>
      </Card>

      <GroupPaymentInfoCard />
    </div>
  );
};

export default LancamentoGrupos;

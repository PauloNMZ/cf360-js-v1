
import React, { useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useImportacao } from '@/hooks/useImportacao';

// Import refactored components - fixing the TableView import to use named import
import FileUploadView from '@/components/importacao/FileUploadView';
import { TableView } from '@/components/importacao/TableView';
import WorkflowDialog from '@/components/importacao/WorkflowDialog';
import DirectoryDialog from '@/components/importacao/DirectoryDialog';
import { ValidationErrorsDialog } from '@/components/importacao/ValidationErrorsDialog';
import { EmailConfigDialog } from '@/components/importacao/EmailConfigDialog';
import { PDFPreviewDialog } from '@/components/importacao/PDFPreviewDialog';

const ImportarPlanilha = () => {
  const {
    file,
    loading,
    planilhaData,
    errorMessage,
    tableData,
    selectAll,
    showTable,
    setShowTable,
    total,
    showWorkflowDialog,
    setShowWorkflowDialog,
    showDirectoryDialog,
    setShowDirectoryDialog,
    showValidationDialog,
    setShowValidationDialog,
    validationErrors,
    validationPerformed,
    hasValidationErrors,
    cnabFileGenerated,
    showPDFPreviewDialog,
    setShowPDFPreviewDialog,
    reportData,
    showEmailConfigDialog,
    setShowEmailConfigDialog,
    defaultEmailMessage,
    reportDate,
    currentStep,
    workflow,
    convenentes,
    carregandoConvenentes,
    handleFileChange,
    handleSelectAll,
    handleSelectRow,
    handleDeleteRow,
    handleProcessar,
    handleProcessSelected,
    handleVerifyErrors,
    handleExportErrors,
    handleGenerateReport,
    handleSendEmailReport,
    handleEmailSubmit,
    goToNextStep,
    goToPreviousStep,
    handleOpenDirectorySettings,
    handleSaveDirectorySettings,
    handleSubmitWorkflow,
    updateWorkflow,
    isCurrentStepValid,
    getTotalSteps,
    getDisplayStepNumber,
    getStepTitle,
    hasSelectedConvenente
  } = useImportacao();

  // Listen for custom events from the StepFour component
  useEffect(() => {
    const handleOpenSettings = () => {
      handleOpenDirectorySettings();
    };

    document.addEventListener('openDirectorySettings', handleOpenSettings);
    
    return () => {
      document.removeEventListener('openDirectorySettings', handleOpenSettings);
    };
  }, [handleOpenDirectorySettings]);

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-6 pr-4">
        {!showTable ? (
          <FileUploadView
            file={file}
            handleFileChange={handleFileChange}
            errorMessage={errorMessage}
            planilhaData={planilhaData}
            loading={loading}
            handleProcessar={handleProcessar}
          />
        ) : (
          <TableView
            handleSelectAll={handleSelectAll}
            selectAll={selectAll}
            tableData={tableData}
            handleSelectRow={handleSelectRow}
            handleDeleteRow={handleDeleteRow}
            handleProcessSelected={handleProcessSelected}
            handleVerifyErrors={handleVerifyErrors}
            handleExportErrors={handleExportErrors}
            handleGenerateReport={handleGenerateReport}
            total={total}
            setShowTable={setShowTable}
            validationPerformed={validationPerformed}
            hasValidationErrors={hasValidationErrors}
            cnabFileGenerated={cnabFileGenerated}
          />
        )}
      </div>

      {/* Multi-step workflow dialog */}
      <WorkflowDialog 
        isOpen={showWorkflowDialog}
        onOpenChange={setShowWorkflowDialog}
        workflow={workflow}
        updateWorkflow={updateWorkflow}
        currentStep={currentStep}
        totalSteps={5}
        goToNextStep={goToNextStep}
        goToPreviousStep={goToPreviousStep}
        handleSubmit={handleSubmitWorkflow}
        isCurrentStepValid={isCurrentStepValid()}
        convenentes={convenentes}
        carregandoConvenentes={carregandoConvenentes}
        getTotalSteps={getTotalSteps}
        getDisplayStepNumber={getDisplayStepNumber}
        getStepTitle={getStepTitle}
        hasSelectedCompany={hasSelectedConvenente}
      />

      {/* Directory configuration dialog */}
      <DirectoryDialog 
        isOpen={showDirectoryDialog}
        onOpenChange={setShowDirectoryDialog}
        workflow={workflow}
        updateWorkflow={updateWorkflow}
        handleSaveSettings={handleSaveDirectorySettings}
      />

      {/* Validation errors dialog */}
      <ValidationErrorsDialog
        isOpen={showValidationDialog}
        onOpenChange={setShowValidationDialog}
        errors={validationErrors}
      />
      
      {/* Email configuration dialog */}
      <EmailConfigDialog
        isOpen={showEmailConfigDialog}
        onOpenChange={setShowEmailConfigDialog}
        defaultMessage={defaultEmailMessage}
        onSubmit={handleEmailSubmit}
        reportDate={reportDate}
      />
      
      {/* PDF Preview dialog - using no-parameter version of the handler */}
      <PDFPreviewDialog
        isOpen={showPDFPreviewDialog}
        onOpenChange={setShowPDFPreviewDialog}
        reportData={reportData}
        onSendEmail={handleSendEmailReport}
      />
    </ScrollArea>
  );
};

export default ImportarPlanilha;

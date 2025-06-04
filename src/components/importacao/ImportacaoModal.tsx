
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FileUploadView from "./FileUploadView";
import { TableView } from "./TableView";
import { useImportacao } from "@/hooks/useImportacao";
import WorkflowDialog from "./WorkflowDialog";
import DirectoryDialog from "./DirectoryDialog";
import { ValidationErrorsDialog } from "./ValidationErrorsDialog";
import { EmailConfigDialog } from "./EmailConfigDialog";
import { PDFPreviewDialog } from "./PDFPreviewDialog";

interface ImportacaoModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ImportacaoModal({ isOpen, onOpenChange }: ImportacaoModalProps) {
  const {
    // File props
    file,
    loading,
    planilhaData,
    errorMessage,
    handleFileChange,
    
    // Table props
    tableData,
    selectAll,
    total,
    handleSelectAll,
    handleSelectRow,
    handleDeleteRow,
    
    // UI state
    showTable,
    setShowTable,
    showValidationDialog,
    setShowValidationDialog,
    validationErrors,
    validationPerformed,
    hasValidationErrors,
    
    // CNAB file state
    cnabFileGenerated,
    
    // PDF preview state
    showPDFPreviewDialog,
    setShowPDFPreviewDialog,
    reportData,
    
    // Email and report dialog states
    showEmailConfigDialog,
    setShowEmailConfigDialog,
    defaultEmailMessage,
    reportDate,
    
    // Process handlers
    handleProcessar,
    handleProcessSelected,
    handleVerifyErrors,
    handleExportErrors,
    handleGenerateReport,
    handleSendEmailReport, // This now uses the no-parameter version
    handleEmailSubmit,
    
    // Directory dialog props
    showDirectoryDialog,
    setShowDirectoryDialog,
    handleOpenDirectorySettings,
    handleSaveDirectorySettings,
    
    // Workflow dialog props
    showWorkflowDialog,
    setShowWorkflowDialog,
    currentStep,
    workflow,
    goToNextStep,
    goToPreviousStep,
    updateWorkflow,
    isCurrentStepValid,
    handleSubmitWorkflow,
    getTotalSteps,
    getDisplayStepNumber,
    getStepTitle,
    hasSelectedConvenente,
    
    // Convenentes data
    convenentes,
    carregandoConvenentes
  } = useImportacao();

  // CORRIGIDO: Criar wrapper function para não passar parâmetros
  const getDisplayStepNumberWrapper = () => getDisplayStepNumber(currentStep);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Importação de Planilha</DialogTitle>
            <DialogDescription>
              {showTable 
                ? "Gerencie os registros importados da planilha."
                : "Selecione uma planilha CSV ou Excel para importar dados de pagamento."}
            </DialogDescription>
          </DialogHeader>

          {showTable ? (
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
          ) : (
            <FileUploadView
              file={file}
              handleFileChange={handleFileChange}
              errorMessage={errorMessage}
              planilhaData={planilhaData}
              loading={loading}
              handleProcessar={handleProcessar}
            />
          )}
        </DialogContent>
      </Dialog>

      <WorkflowDialog
        isOpen={showWorkflowDialog}
        onOpenChange={setShowWorkflowDialog}
        workflow={workflow}
        updateWorkflow={updateWorkflow}
        currentStep={currentStep}
        totalSteps={getTotalSteps()}
        goToNextStep={goToNextStep}
        goToPreviousStep={goToPreviousStep}
        handleSubmit={handleSubmitWorkflow}
        isCurrentStepValid={isCurrentStepValid()}
        convenentes={convenentes}
        carregandoConvenentes={carregandoConvenentes}
        getTotalSteps={getTotalSteps}
        getDisplayStepNumber={getDisplayStepNumberWrapper}
        getStepTitle={getStepTitle}
        hasSelectedCompany={hasSelectedConvenente}
      />

      <DirectoryDialog
        isOpen={showDirectoryDialog}
        onOpenChange={setShowDirectoryDialog}
        workflow={workflow}
        updateWorkflow={updateWorkflow}
        handleSaveSettings={handleSaveDirectorySettings}
      />

      <ValidationErrorsDialog
        isOpen={showValidationDialog}
        onOpenChange={setShowValidationDialog}
        errors={validationErrors}
      />

      <EmailConfigDialog
        isOpen={showEmailConfigDialog}
        onOpenChange={setShowEmailConfigDialog}
        defaultMessage={defaultEmailMessage}
        onSubmit={handleEmailSubmit}
        reportDate={reportDate}
      />
      
      <PDFPreviewDialog
        isOpen={showPDFPreviewDialog}
        onOpenChange={setShowPDFPreviewDialog}
        reportData={reportData}
        onSendEmail={handleSendEmailReport}
      />
    </>
  );
}

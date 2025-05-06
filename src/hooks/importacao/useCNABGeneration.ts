
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { CNABWorkflowData } from '@/types/cnab240';
import { processSelectedRows } from '@/services/cnab240/cnab240Service';

export const useCNABGeneration = () => {
  const [cnabFileGenerated, setCnabFileGenerated] = useState(false);
  const [cnabFileName, setCnabFileName] = useState<string>('');
  
  // Function for submitting workflow and generating CNAB file
  const handleSubmitWorkflow = async (
    selectedRows: any[],
    workflow: CNABWorkflowData,
    setShowWorkflowDialog: (show: boolean) => void
  ) => {
    setShowWorkflowDialog(false);
    
    try {
      console.log("Submitting workflow with service type:", workflow.serviceType);
      
      // Pass the service type from workflow to the processing function
      const result = await processSelectedRows(workflow, selectedRows);
      
      // If the file was successfully generated, set the filename
      if (result && result.fileName) {
        setCnabFileGenerated(true);
        setCnabFileName(result.fileName);
      }
      
      return result;
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      // Error handling is already done in processSelectedRows
      return { success: false };
    }
  };

  return {
    cnabFileGenerated,
    setCnabFileGenerated,
    cnabFileName,
    setCnabFileName,
    handleSubmitWorkflow
  };
};

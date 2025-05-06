
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import CNABToAPIView from './CNABToAPIView';
import { useCNABToAPI } from '@/hooks/useCNABToAPI';

interface CNABToAPIModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const CNABToAPIModal: React.FC<CNABToAPIModalProps> = ({ isOpen, onOpenChange }) => {
  const {
    file,
    loading,
    cnabData,
    errorMessage,
    jsonOutput,
    handleFileChange,
    handleProcessCNAB,
    handleCopyToClipboard,
    handleSendToAPI
  } = useCNABToAPI();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">CNAB to API</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 mt-4">
          <CNABToAPIView 
            file={file}
            loading={loading}
            cnabData={cnabData}
            errorMessage={errorMessage}
            jsonOutput={jsonOutput}
            handleFileChange={handleFileChange}
            handleProcessCNAB={handleProcessCNAB}
            handleCopyToClipboard={handleCopyToClipboard}
            handleSendToAPI={handleSendToAPI}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CNABToAPIModal;

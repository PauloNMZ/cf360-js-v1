
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PDFPreviewDialogProps } from "@/types/importacao";
import { Button } from "@/components/ui/button";
import { Mail, Download, Loader2 } from "lucide-react";
import { generatePDFReport } from "@/services/reports/pdfReportService";
import { ReportSortType } from "@/types/reportSorting";
import { toast } from "@/components/ui/sonner";

interface ExtendedPDFPreviewDialogProps extends PDFPreviewDialogProps {
  sortType?: ReportSortType;
}

export function PDFPreviewDialog({
  isOpen,
  onOpenChange,
  reportData,
  onSendEmail,
  sortType = ReportSortType.BY_NAME,
}: ExtendedPDFPreviewDialogProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [iframeKey, setIframeKey] = useState<number>(0);

  useEffect(() => {
    let url: string | null = null;
    
    const generatePreview = async () => {
      if (reportData) {
        console.log("=== DEBUG PDFPreviewDialog - generatePreview ===");
        console.log("reportData:", reportData);
        console.log("sortType:", sortType);
        
        setLoading(true);
        try {
          console.log("=== Calling generatePDFReport with sortType:", sortType, "===");
          const pdfBlob = await generatePDFReport(reportData, sortType);
          
          // Create a URL for the blob - FIXED: Add #page=1 to always start at first page
          url = URL.createObjectURL(pdfBlob) + "#page=1";
          setPdfUrl(url);
          
          // Force iframe reload when data changes
          setIframeKey(prev => prev + 1);
          
          console.log("=== PDF preview generated successfully ===");
        } catch (error) {
          console.error("Error generating PDF preview:", error);
          toast.error("Erro ao gerar visualização do PDF", {
            position: "bottom-right",
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    generatePreview();
    
    // Cleanup function to revoke object URL
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [reportData, sortType]);

  // REMOVED: The problematic iframe manipulation code that was causing SecurityError

  const handleDownload = async () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl.replace('#page=1', ''); // Remove the page parameter for download
      link.download = `Remessa_Bancaria_${reportData?.referencia || new Date().toISOString().slice(0, 10).replace(/-/g, '')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Relatório PDF baixado com sucesso!", {
        position: "bottom-right",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] p-6 overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Visualização do Relatório PDF</DialogTitle>
          <DialogDescription>
            Confira o relatório antes de enviá-lo por e-mail ao diretor financeiro.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 border rounded-md overflow-hidden bg-gray-100 mt-2">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
              <span className="ml-2 text-gray-500">Gerando PDF...</span>
            </div>
          ) : pdfUrl ? (
            <iframe 
              key={iframeKey}
              src={pdfUrl} 
              className="w-full h-full" 
              title="Relatório de Remessa Bancária"
              sandbox="allow-same-origin allow-scripts"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-red-500">Erro ao gerar o PDF. Por favor, tente novamente.</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 mt-4">
          <Button variant="outline" onClick={handleDownload} disabled={loading || !pdfUrl}>
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
          <Button onClick={onSendEmail} disabled={loading || !pdfUrl}>
            <Mail className="h-4 w-4 mr-2" />
            Enviar por E-mail
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

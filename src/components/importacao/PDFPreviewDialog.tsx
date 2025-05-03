
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
import { Mail, Download, Loader2, X } from "lucide-react";
import { generatePDFReport } from "@/services/reports/pdfReportService";
import { toast } from "@/components/ui/sonner";

export function PDFPreviewDialog({
  isOpen,
  onOpenChange,
  reportData,
  onSendEmail,
}: PDFPreviewDialogProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [iframeKey, setIframeKey] = useState<number>(0); // Estado para forçar recarregamento do iframe

  useEffect(() => {
    let url: string | null = null;
    
    const generatePreview = async () => {
      if (reportData) {
        setLoading(true);
        try {
          // Generate PDF blob
          const pdfBlob = await generatePDFReport(reportData);
          
          // Create a URL for the blob
          url = URL.createObjectURL(pdfBlob);
          setPdfUrl(url);
          
          // Forçar o recarregamento do iframe quando os dados mudarem
          setIframeKey(prev => prev + 1);
        } catch (error) {
          console.error("Error generating PDF preview:", error);
          toast.error("Erro ao gerar visualização do PDF");
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
  }, [reportData]);

  // Efeito para garantir que o iframe sempre comece na primeira página
  useEffect(() => {
    if (isOpen && pdfUrl && !loading) {
      // Pequeno atraso para garantir que o iframe esteja pronto
      const timer = setTimeout(() => {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          // Tentar rolar para o topo
          try {
            iframe.contentWindow?.scrollTo(0, 0);
            
            // Se o iframe tiver um body, também rolamos ele para o topo
            const iframeBody = iframe.contentDocument?.body;
            if (iframeBody) {
              iframeBody.scrollTop = 0;
            }
          } catch (e) {
            console.log("Não foi possível rolar o iframe para o topo:", e);
          }
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, pdfUrl, loading, iframeKey]);

  const handleDownload = async () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `Remessa_Bancaria_${reportData?.referencia || new Date().toISOString().slice(0, 10).replace(/-/g, '')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Relatório PDF baixado com sucesso!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] p-6 overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row justify-between items-center">
          <div>
            <DialogTitle className="text-xl">Visualização do Relatório PDF</DialogTitle>
            <DialogDescription>
              Confira o relatório antes de enviá-lo por e-mail ao diretor financeiro.
            </DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
          </Button>
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

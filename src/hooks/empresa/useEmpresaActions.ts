
import { useToast } from "@/hooks/use-toast";
import { EmpresaData } from "@/types/empresa";
import { createEmpresa } from "@/services/empresa/empresaService";

export const useEmpresaActions = ({
  setEmpresas,
  setFormMode,
  setIsLoading,
  setFormData,
  setCurrentEmpresaId
}: {
  setEmpresas: (empresas: EmpresaData[]) => void;
  setFormMode: (mode: 'view' | 'create' | 'edit') => void;
  setIsLoading: (b: boolean) => void;
  setFormData: (fd: EmpresaData) => void;
  setCurrentEmpresaId: (id: string | null) => void;
}) => {
  const { toast } = useToast();

  const handleSave = async (formData: EmpresaData) => {
    setIsLoading(true);
    try {
      const saved = await createEmpresa(formData);
      if (saved) {
        setCurrentEmpresaId(saved.id);
        setFormData(saved);
        setFormMode("view");
        toast({ title: "Empresa criada!", description: "Empresa cadastrada com sucesso." });
        // opcional: recarregar lista
        // fetchEmpresas e setEmpresas se necessário
      }
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar empresa",
        description: error?.message || "Falha ao cadastrar.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return { handleSave };
};

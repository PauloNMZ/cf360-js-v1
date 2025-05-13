
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Group, NewGroup } from "@/types/group";
import { ServiceType } from "@/types/serviceType";
import { getServiceTypes } from "@/services/serviceType";

interface GrupoFormProps {
  initialData?: Group;
  onSubmit: (data: Partial<NewGroup>) => void;
  onCancel: () => void;
}

const GrupoForm: React.FC<GrupoFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<NewGroup>>({
    nome: "",
    descricao: "",
    tipo_servico_id: null,
    data_pagamento: null,
  });
  const [formValid, setFormValid] = useState(false);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [date, setDate] = useState<Date | undefined>(
    initialData?.data_pagamento ? new Date(initialData.data_pagamento) : undefined
  );

  useEffect(() => {
    // Initialize form with initial data if provided
    if (initialData) {
      setFormData({
        nome: initialData.nome,
        descricao: initialData.descricao,
        tipo_servico_id: initialData.tipo_servico_id || null,
        data_pagamento: initialData.data_pagamento || null,
      });
    }

    // Load service types
    loadServiceTypes();
  }, [initialData]);

  useEffect(() => {
    // Validate form - only the name field is required
    setFormValid(Boolean(formData.nome && formData.nome.trim()));
  }, [formData]);

  const loadServiceTypes = async () => {
    try {
      const types = await getServiceTypes();
      setServiceTypes(types);
    } catch (error) {
      console.error("Erro ao carregar tipos de serviço:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value || null }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      setFormData((prev) => ({ ...prev, data_pagamento: format(date, 'yyyy-MM-dd') }));
    } else {
      setFormData((prev) => ({ ...prev, data_pagamento: null }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formValid) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome do Grupo *</Label>
        <Input
          id="nome"
          name="nome"
          value={formData.nome || ""}
          onChange={handleChange}
          placeholder="Nome do grupo"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          name="descricao"
          value={formData.descricao || ""}
          onChange={handleChange}
          placeholder="Descrição do grupo"
          rows={3}
        />
      </div>

      {/* Optional fields */}
      <div className="space-y-2">
        <Label htmlFor="tipo_servico_id">Tipo de Serviço (opcional)</Label>
        <select
          id="tipo_servico_id"
          name="tipo_servico_id"
          value={formData.tipo_servico_id || ""}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Selecione um tipo</option>
          {serviceTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.codigo} - {type.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="data_pagamento">Data de Pagamento (opcional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              initialFocus
              locale={ptBR}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!formValid}>
          {initialData ? "Atualizar" : "Criar"} Grupo
        </Button>
      </div>
    </form>
  );
};

export default GrupoForm;

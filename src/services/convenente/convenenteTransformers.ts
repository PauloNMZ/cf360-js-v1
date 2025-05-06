
import { ConvenenteData } from "@/types/convenente";

// Função para converter de camelCase para snake_case
export const mapToSnakeCase = (convenente: ConvenenteData): any => {
  return {
    cnpj: convenente.cnpj,
    razao_social: convenente.razaoSocial,
    endereco: convenente.endereco,
    numero: convenente.numero,
    complemento: convenente.complemento,
    uf: convenente.uf,
    cidade: convenente.cidade,
    contato: convenente.contato,
    fone: convenente.fone,
    celular: convenente.celular,
    email: convenente.email,
    agencia: convenente.agencia,
    conta: convenente.conta,
    chave_pix: convenente.chavePix,
    convenio_pag: convenente.convenioPag
  };
};

// Função para converter de snake_case para camelCase
export const mapToCamelCase = (data: any): ConvenenteData & { id: string } => {
  return {
    id: data.id,
    cnpj: data.cnpj,
    razaoSocial: data.razao_social,
    endereco: data.endereco || "",
    numero: data.numero || "",
    complemento: data.complemento || "",
    uf: data.uf || "",
    cidade: data.cidade || "",
    contato: data.contato || "",
    fone: data.fone || "",
    celular: data.celular || "",
    email: data.email || "",
    agencia: data.agencia || "",
    conta: data.conta || "",
    chavePix: data.chave_pix || "",
    convenioPag: data.convenio_pag || "",
    dataCriacao: data.data_criacao,
    dataAtualizacao: data.data_atualizacao
  };
};

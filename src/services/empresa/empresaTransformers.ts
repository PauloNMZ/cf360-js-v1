
import { EmpresaData } from "@/types/empresa";

export const mapToSnakeCase = (empresa: EmpresaData): any => ({
  cnpj: empresa.cnpj,
  razao_social: empresa.razaoSocial,
  endereco: empresa.endereco,
  numero: empresa.numero,
  complemento: empresa.complemento,
  uf: empresa.uf,
  cidade: empresa.cidade,
  contato: empresa.contato,
  fone: empresa.fone,
  celular: empresa.celular,
  email: empresa.email,
  agencia: empresa.agencia,
  conta: empresa.conta,
  chave_pix: empresa.chavePix,
  convenio_pag: empresa.convenioPag
});

export const mapToCamelCase = (data: any): EmpresaData & { id: string } => ({
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
});

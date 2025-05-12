
import { FavorecidoData } from "@/types/favorecido";

// Object with database column names mapping to our model property names
const dbToModelMapping = {
  nome: "nome",
  inscricao: "inscricao",
  tipoinscricao: "tipoInscricao",
  banco: "banco",
  agencia: "agencia",
  conta: "conta",
  chavepix: "chavePix",
  tipochavepix: "tipoChavePix",
  valorpadrao: "valorPadrao",
  grupoid: "grupoId",
  datacriacao: "dataCriacao",
  dataatualizacao: "dataAtualizacao",
  id: "id",
  user_id: "user_id"
};

// Convert a row from the database to our model
export const dbRowToModel = (row: any): FavorecidoData & { id: string } => {
  const model: any = {};
  
  // Iterate through the mapping and convert properties
  Object.entries(dbToModelMapping).forEach(([dbField, modelField]) => {
    if (dbField in row) {
      model[modelField] = row[dbField];
    }
  });
  
  return model as FavorecidoData & { id: string };
};

// Convert our model to a format suitable for database insertion/update
export const modelToDbRow = (model: FavorecidoData): any => {
  const row: any = {};
  
  // Reverse mapping
  const modelToDbMapping = Object.entries(dbToModelMapping).reduce(
    (acc, [dbField, modelField]) => ({
      ...acc,
      [modelField]: dbField
    }),
    {}
  );
  
  // Iterate through the model properties and convert to db column names
  Object.entries(model).forEach(([modelField, value]) => {
    const dbField = modelToDbMapping[modelField];
    if (dbField) {
      row[dbField] = value;
    }
  });
  
  return row;
};

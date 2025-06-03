
import { TipoContaType } from "@/types/favorecido";

export const getTipoContaLabel = (tipo: TipoContaType): string => {
  switch (tipo) {
    case "CC":
      return "Conta Corrente";
    case "PP":
      return "Conta Poupança";
    case "TD":
      return "Ted";
    default:
      return tipo;
  }
};

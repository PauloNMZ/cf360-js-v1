
import { useState } from "react";
import { PixKeyType } from "./types";

export const usePixKeyType = () => {
  const [pixKeyType, setPixKeyType] = useState<PixKeyType>('CNPJ');

  const handlePixKeyTypeChange = (value: PixKeyType) => {
    setPixKeyType(value);
  };

  const getPixKeyPlaceholder = () => {
    switch (pixKeyType) {
      case 'CNPJ':
        return "00.000.000/0000-00";
      case 'email':
        return "exemplo@email.com";
      case 'telefone':
        return "+55 (00) 00000-0000";
      case 'aleatoria':
        return "Chave aleatória";
      default:
        return "Chave Pix";
    }
  };

  return {
    pixKeyType,
    handlePixKeyTypeChange,
    getPixKeyPlaceholder
  };
};

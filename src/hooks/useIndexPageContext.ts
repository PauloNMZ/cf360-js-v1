
import { useContext } from "react";
import { IndexPageContext, IndexPageContextType } from "@/contexts/IndexPageContext";

export const useIndexPageContext = (): IndexPageContextType => {
  const context = useContext(IndexPageContext);
  if (!context) {
    throw new Error("useIndexPageContext must be used within an IndexPageProvider");
  }
  return context;
};

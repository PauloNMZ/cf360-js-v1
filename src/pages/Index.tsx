
import React from "react";
import { IndexPageProvider } from "@/providers/IndexPageProvider";
import IndexPageContent from "@/components/index/IndexPageContent";

const Index = () => {
  return (
    <IndexPageProvider>
      <IndexPageContent />
    </IndexPageProvider>
  );
};

export default Index;

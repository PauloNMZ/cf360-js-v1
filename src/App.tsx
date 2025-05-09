
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import GruposPage from "./pages/GruposPage";
import PagamentoGrupoPage from "./pages/PagamentoGrupoPage";
import PagamentoMultiGrupoPage from "./pages/PagamentoMultiGrupoPage";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { IndexPageProvider } from "@/providers/IndexPageProvider";
import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route element={<ProtectedRoute />}>
              <Route element={
                <IndexPageProvider>
                  <SidebarLayout />
                </IndexPageProvider>
              }>
                <Route path="/" element={<Index />} />
                <Route path="/grupos" element={<GruposPage />} />
                <Route path="/pagamentos/grupo" element={<PagamentoGrupoPage />} />
                <Route path="/pagamentos/multi-grupo" element={<PagamentoMultiGrupoPage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <SonnerToaster position="top-right" />
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

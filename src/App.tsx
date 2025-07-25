
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import GruposPage from "./pages/GruposPage";
import PagamentoGrupoPage from "./pages/PagamentoGrupoPage";
import PagamentoMultiGrupoPage from "./pages/PagamentoMultiGrupoPage";
import FavorecidosPage from "./pages/FavorecidosPage";
import EmpresaPage from "./pages/EmpresaPage";
import PagamentosPage from "./pages/PagamentosPage";
import RecebimentosPage from "./pages/RecebimentosPage";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { IndexPageProvider } from "@/providers/IndexPageProvider";
import { NotificationModalProvider } from "@/components/ui/NotificationModalProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <BrowserRouter>
          <AuthProvider>
            <NotificationModalProvider>
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
                    <Route path="/pagamentos/individual" element={<Index />} /> {/* Placeholder */}
                    <Route path="/pagamentos/multi-grupo" element={<PagamentoMultiGrupoPage />} />
                    <Route path="/favorecidos" element={<FavorecidosPage />} />
                    <Route path="/empresa" element={<EmpresaPage />} />
                    <Route path="/financeiro/pagamentos" element={<PagamentosPage />} />
                    <Route path="/financeiro/recebimentos" element={<RecebimentosPage />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </NotificationModalProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

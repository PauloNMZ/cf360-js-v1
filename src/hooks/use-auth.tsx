import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContextType, AuthSession, AuthUser } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const initialLoadRef = useRef(true);
  const lastEventRef = useRef<string>('');

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event, 'at location:', location.pathname);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Evitar redirecionamentos desnecessários durante o carregamento inicial
        if (initialLoadRef.current) {
          initialLoadRef.current = false;
          return;
        }

        // Evitar processar o mesmo evento múltiplas vezes
        const eventKey = `${event}-${session?.access_token?.slice(-10) || 'none'}`;
        if (lastEventRef.current === eventKey) {
          return;
        }
        lastEventRef.current = eventKey;

        if (event === 'SIGNED_IN') {
          // Só redirecionar para home se estivermos na página de auth
          // Caso contrário, manter na página atual
          if (location.pathname === '/auth') {
            setTimeout(() => {
              navigate('/');
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          setTimeout(() => {
            navigate('/auth');
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      initialLoadRef.current = false;
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Falha no Login",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Login Realizado",
        description: "Você foi conectado com sucesso.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Falha no Login",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Falha no Cadastro",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Cadastro Realizado",
        description: "Verifique seu email para confirmar o cadastro.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Falha no Cadastro",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Desconectado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

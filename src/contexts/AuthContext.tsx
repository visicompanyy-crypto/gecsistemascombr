import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionData {
  subscribed: boolean;
  product_id: string | null;
  subscription_end: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  subscription: SubscriptionData | null;
  loading: boolean;
  subscriptionLoading: boolean;
  signOut: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PLAN_DETAILS = {
  "prod_TTyrsADHJ2kqDE": {
    name: "Plano Anual",
    priceId: "price_1SX0tMHBNcHovPNJRDUQnTd3",
  },
  "prod_TTysnvfLhDnz9L": {
    name: "Plano Trimestral",
    priceId: "price_1SX0uXHBNcHovPNJu11958UU",
  },
  "prod_TTyt9F1mm17zg6": {
    name: "Plano Mensal",
    priceId: "price_1SX0vxHBNcHovPNJcjAdKS7a",
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const { toast } = useToast();

  const checkSubscription = async (currentSession: Session | null) => {
    if (!currentSession) {
      setSubscription(null);
      setSubscriptionLoading(false);
      return;
    }

    setSubscriptionLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`,
        },
      });

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error("Error checking subscription:", error);
      setSubscription({ subscribed: false, product_id: null, subscription_end: null });
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const refreshSubscription = async () => {
    await checkSubscription(session);
  };

  useEffect(() => {
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          setTimeout(() => {
            checkSubscription(currentSession);
          }, 0);
        } else {
          setSubscription(null);
          setSubscriptionLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        await checkSubscription(currentSession);
      }
      
      setLoading(false);
    });

    return () => authSubscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      checkSubscription(session);
    }, 60000);

    return () => clearInterval(interval);
  }, [session]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setSubscription(null);
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Erro ao sair",
        description: "Não foi possível realizar o logout.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        subscription,
        loading,
        subscriptionLoading,
        signOut,
        refreshSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { PLAN_DETAILS };

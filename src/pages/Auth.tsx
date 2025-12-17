import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logo.png";

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Verificar se há redirect pendente (ex: plano selecionado antes do login)
  const redirectPath = searchParams.get("redirect");
  const planId = searchParams.get("plan");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Clear any cached data from previous users (security)
      queryClient.clear();

      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao sistema financeiro.",
      });

      // Se houver redirect pendente (ex: plano selecionado), vai para lá
      if (redirectPath && planId) {
        navigate(`${redirectPath}?plan=${planId}`);
        return;
      }

      // Verificar assinatura e redirecionar
      const { data: session } = await supabase.auth.getSession();
      if (session?.session) {
        try {
          const { data: subData, error: subError } = await supabase.functions.invoke('check-subscription', {
            headers: {
              Authorization: `Bearer ${session.session.access_token}`,
            },
          });
          
          if (subError) {
            console.error('Erro ao verificar assinatura:', subError);
            // Em caso de erro, vai para dashboard e deixa o ProtectedRoute verificar
            navigate("/dashboard");
            return;
          }
          
          if (subData?.subscribed) {
            navigate("/dashboard");
          } else {
            navigate("/pricing");
          }
        } catch (checkError) {
          console.error('Erro ao verificar assinatura:', checkError);
          // Em caso de erro, vai para dashboard
          navigate("/dashboard");
        }
      } else {
        // Se não conseguiu obter sessão, vai para dashboard (será redirecionado se necessário)
        navigate("/dashboard");
      }
    } catch (error: any) {
      let errorMessage = error.message;
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email ou senha incorretos.";
      }
      
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f1f3f4] via-[#eef1f3] to-[#e4e8eb] p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-md border border-white/40 shadow-[0_20px_80px_rgba(0,0,0,0.08)] rounded-[28px] p-10">
        {/* Logo Premium */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <img 
              src={logo} 
              alt="Saldar Logo" 
              className="w-20 h-20 object-contain"
            />
          </div>
          
          <h1 className="text-2xl font-bold text-[#252F1D] text-center mb-2 tracking-tight">
            Entrar no Saldar
          </h1>
          <p className="text-center text-[#6b7280] text-sm font-medium">
            Controle financeiro inteligente e sem complicações
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="login-email" className="text-[#252F1D] font-semibold text-sm">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#a7a392]" />
              <Input
                id="login-email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-12 h-12 bg-[#f1f3f4]/50 border-[#e4e8eb] rounded-2xl hover:border-[#3c9247]/40 focus:border-[#3c9247] transition-colors"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="login-password" className="text-[#252F1D] font-semibold text-sm">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#a7a392]" />
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-12 pr-12 h-12 bg-[#f1f3f4]/50 border-[#e4e8eb] rounded-2xl hover:border-[#3c9247]/40 focus:border-[#3c9247] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a7a392] hover:text-[#3c9247] transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-[#3c9247] hover:text-[#2e6b38] font-medium transition-colors"
              >
                Esqueceu sua senha?
              </Link>
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-gradient-to-b from-[#3c9247] to-[#2e6b38] hover:from-[#45a352] hover:to-[#357042] text-white font-semibold rounded-full shadow-[0_6px_25px_rgba(60,146,71,0.3)] hover:shadow-[0_8px_30px_rgba(60,146,71,0.4)] transition-all duration-300"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        {/* Link para Cadastro */}
        <div className="text-center mt-6">
          <p className="text-sm text-[#6b7280]">
            Não tem uma conta?{" "}
            <Link
              to="/signup"
              className="text-[#3c9247] hover:text-[#2e6b38] font-semibold transition-colors"
            >
              Cadastre-se
            </Link>
          </p>
        </div>

        {/* Link Voltar */}
        <div className="text-center mt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#a7a392] hover:text-[#3c9247] transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para página inicial
          </Link>
        </div>
      </Card>
    </div>
  );
}
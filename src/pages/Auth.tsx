import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logo.png";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast({
        title: "Cadastro realizado!",
        description: "Fazendo login...",
      });
      
      // Fazer login automático após cadastro
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Se falhar o login automático, redireciona para pricing
        navigate("/pricing");
        return;
      }

      // Verificar assinatura e redirecionar
      const { data: session } = await supabase.auth.getSession();
      if (session?.session) {
        const { data: subData } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${session.session.access_token}`,
          },
        });
        
        if (subData?.subscribed) {
          navigate("/dashboard");
        } else {
          navigate("/pricing");
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

      // Verificar assinatura e redirecionar
      const { data: session } = await supabase.auth.getSession();
      if (session?.session) {
        const { data: subData } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${session.session.access_token}`,
          },
        });
        
        if (subData?.subscribed) {
          navigate("/dashboard");
        } else {
          navigate("/pricing");
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f1f3f4] via-[#eef1f3] to-[#e4e8eb] p-4">
      {/* Premium Card com Glassmorphism */}
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
            Saldar — Sistema Financeiro Profissional
          </h1>
          <p className="text-center text-[#6b7280] text-sm font-medium">
            Controle financeiro inteligente e sem complicações
          </p>
        </div>

        {/* Tabs Premium */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#f1f3f4] p-1.5 rounded-full mb-8 h-12">
            <TabsTrigger 
              value="login"
              className="rounded-full data-[state=active]:bg-[#3c9247] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_15px_rgba(60,146,71,0.3)] text-[#a7a392] font-semibold transition-all duration-300"
            >
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="signup"
              className="rounded-full data-[state=active]:bg-[#3c9247] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_15px_rgba(60,146,71,0.3)] text-[#a7a392] font-semibold transition-all duration-300"
            >
              Cadastro
            </TabsTrigger>
          </TabsList>

          {/* Login Form */}
          <TabsContent value="login">
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
              </div>
              
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-gradient-to-b from-[#3c9247] to-[#2e6b38] hover:from-[#45a352] hover:to-[#357042] text-white font-semibold rounded-full shadow-[0_6px_25px_rgba(60,146,71,0.3)] hover:shadow-[0_8px_30px_rgba(60,146,71,0.4)] transition-all duration-300"
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </TabsContent>

          {/* Signup Form */}
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-[#252F1D] font-semibold text-sm">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#a7a392]" />
                  <Input
                    id="signup-email"
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
                <Label htmlFor="signup-password" className="text-[#252F1D] font-semibold text-sm">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#a7a392]" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
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
                <p className="text-xs text-[#a7a392] mt-1.5">Mínimo de 6 caracteres</p>
              </div>
              
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-gradient-to-b from-[#3c9247] to-[#2e6b38] hover:from-[#45a352] hover:to-[#357042] text-white font-semibold rounded-full shadow-[0_6px_25px_rgba(60,146,71,0.3)] hover:shadow-[0_8px_30px_rgba(60,146,71,0.4)] transition-all duration-300"
              >
                {loading ? "Cadastrando..." : "Criar Conta"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Link Voltar */}
        <div className="text-center mt-8">
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

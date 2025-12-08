import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import logo from "@/assets/logo.png";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event);
        
        if (event === "PASSWORD_RECOVERY") {
          setIsValidSession(true);
          setCheckingSession(false);
        } else if (event === "SIGNED_IN" && session) {
          // User might already be in a recovery session
          setIsValidSession(true);
          setCheckingSession(false);
        }
      }
    );

    // Check if there's already a session (user came from email link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsValidSession(true);
      }
      setCheckingSession(false);
    };

    // Give time for the auth event to fire
    setTimeout(checkSession, 1000);

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "As senhas digitadas não são iguais.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setResetSuccess(true);
      toast({
        title: "Senha redefinida!",
        description: "Sua senha foi alterada com sucesso.",
      });

      // Sign out and redirect to login after 3 seconds
      setTimeout(async () => {
        await supabase.auth.signOut();
        navigate("/auth");
      }, 3000);
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast({
        title: "Erro ao redefinir senha",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f1f3f4] via-[#eef1f3] to-[#e4e8eb] p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-md border border-white/40 shadow-[0_20px_80px_rgba(0,0,0,0.08)] rounded-[28px] p-10">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#3c9247] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[#6b7280]">Verificando link...</p>
          </div>
        </Card>
      </div>
    );
  }

  // Invalid or expired link
  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f1f3f4] via-[#eef1f3] to-[#e4e8eb] p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-md border border-white/40 shadow-[0_20px_80px_rgba(0,0,0,0.08)] rounded-[28px] p-10">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-[#252F1D] text-center mb-3">
              Link inválido ou expirado
            </h1>
            
            <p className="text-center text-[#6b7280] text-sm mb-6">
              Este link de redefinição de senha não é mais válido. 
              Por favor, solicite um novo link.
            </p>

            <Link
              to="/forgot-password"
              className="w-full"
            >
              <Button 
                className="w-full h-12 bg-gradient-to-b from-[#3c9247] to-[#2e6b38] hover:from-[#45a352] hover:to-[#357042] text-white font-semibold rounded-full shadow-[0_6px_25px_rgba(60,146,71,0.3)] transition-all"
              >
                Solicitar novo link
              </Button>
            </Link>

            <Link
              to="/auth"
              className="inline-flex items-center gap-2 text-sm text-[#a7a392] hover:text-[#3c9247] transition-colors font-medium mt-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para login
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Success state
  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f1f3f4] via-[#eef1f3] to-[#e4e8eb] p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-md border border-white/40 shadow-[0_20px_80px_rgba(0,0,0,0.08)] rounded-[28px] p-10">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#3c9247] to-[#2e6b38] rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-[#252F1D] text-center mb-3">
              Senha redefinida!
            </h1>
            
            <p className="text-center text-[#6b7280] text-sm mb-6">
              Sua senha foi alterada com sucesso.
              <br />
              Você será redirecionado para o login em instantes...
            </p>

            <div className="w-8 h-8 border-4 border-[#3c9247] border-t-transparent rounded-full animate-spin" />
          </div>
        </Card>
      </div>
    );
  }

  // Reset form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f1f3f4] via-[#eef1f3] to-[#e4e8eb] p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-md border border-white/40 shadow-[0_20px_80px_rgba(0,0,0,0.08)] rounded-[28px] p-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <img 
              src={logo} 
              alt="Saldar Logo" 
              className="w-20 h-20 object-contain"
            />
          </div>
          
          <h1 className="text-2xl font-bold text-[#252F1D] text-center mb-2 tracking-tight">
            Criar nova senha
          </h1>
          <p className="text-center text-[#6b7280] text-sm font-medium">
            Digite sua nova senha abaixo
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#252F1D] font-semibold text-sm">
              Nova senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#a7a392]" />
              <Input
                id="password"
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
            <p className="text-xs text-[#9ca3af]">Mínimo de 6 caracteres</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-[#252F1D] font-semibold text-sm">
              Confirmar nova senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#a7a392]" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pl-12 pr-12 h-12 bg-[#f1f3f4]/50 border-[#e4e8eb] rounded-2xl hover:border-[#3c9247]/40 focus:border-[#3c9247] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a7a392] hover:text-[#3c9247] transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-gradient-to-b from-[#3c9247] to-[#2e6b38] hover:from-[#45a352] hover:to-[#357042] text-white font-semibold rounded-full shadow-[0_6px_25px_rgba(60,146,71,0.3)] hover:shadow-[0_8px_30px_rgba(60,146,71,0.4)] transition-all duration-300"
          >
            {loading ? "Redefinindo..." : "Redefinir senha"}
          </Button>
        </form>

        {/* Link Voltar */}
        <div className="text-center mt-6">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 text-sm text-[#a7a392] hover:text-[#3c9247] transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para login
          </Link>
        </div>
      </Card>
    </div>
  );
}

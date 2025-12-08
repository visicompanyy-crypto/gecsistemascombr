import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import logo from "@/assets/logo.png";

export default function ForgotPassword() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, informe seu email.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error: any) {
      console.error("Error sending reset email:", error);
      toast({
        title: "Erro ao enviar email",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f1f3f4] via-[#eef1f3] to-[#e4e8eb] p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-md border border-white/40 shadow-[0_20px_80px_rgba(0,0,0,0.08)] rounded-[28px] p-10">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#3c9247] to-[#2e6b38] rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-[#252F1D] text-center mb-3">
              Email enviado!
            </h1>
            
            <p className="text-center text-[#6b7280] text-sm mb-6">
              Enviamos um link de redefinição de senha para{" "}
              <strong className="text-[#252F1D]">{email}</strong>.
              <br /><br />
              Verifique sua caixa de entrada e spam. O link expira em 1 hora.
            </p>

            <Button
              onClick={() => setEmailSent(false)}
              variant="outline"
              className="w-full h-12 rounded-full border-[#e4e8eb] hover:border-[#3c9247] hover:bg-[#3c9247]/5 transition-all"
            >
              Enviar novamente
            </Button>

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
            Esqueceu sua senha?
          </h1>
          <p className="text-center text-[#6b7280] text-sm font-medium">
            Digite seu email e enviaremos um link para redefinir sua senha
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#252F1D] font-semibold text-sm">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#a7a392]" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-12 h-12 bg-[#f1f3f4]/50 border-[#e4e8eb] rounded-2xl hover:border-[#3c9247]/40 focus:border-[#3c9247] transition-colors"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-gradient-to-b from-[#3c9247] to-[#2e6b38] hover:from-[#45a352] hover:to-[#357042] text-white font-semibold rounded-full shadow-[0_6px_25px_rgba(60,146,71,0.3)] hover:shadow-[0_8px_30px_rgba(60,146,71,0.4)] transition-all duration-300"
          >
            {loading ? "Enviando..." : "Enviar link de recuperação"}
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

import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, ArrowLeft, Eye, EyeOff, User } from "lucide-react";
import logo from "@/assets/logo.png";

// Função para formatar CPF
const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

// Função para validar CPF
const validateCPF = (cpf: string) => {
  const numbers = cpf.replace(/\D/g, '');
  if (numbers.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers[9])) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers[10])) return false;
  
  return true;
};

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Verificar se há redirect pendente (ex: plano selecionado antes do cadastro)
  const redirectPath = searchParams.get("redirect");
  const planId = searchParams.get("plan");

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    if (formatted.length <= 14) {
      setCpf(formatted);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!validateCPF(cpf)) {
      toast({
        title: "CPF inválido",
        description: "Por favor, insira um CPF válido.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "A senha e a confirmação devem ser iguais.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter no mínimo 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Limpar CPF para salvar apenas números
      const cleanCPF = cpf.replace(/\D/g, '');

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            cpf: cleanCPF, // Salvar CPF nos metadados do usuário para usar com Asaas
          },
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

      // Se houver redirect pendente (ex: plano selecionado), vai para lá
      if (redirectPath && planId) {
        navigate(`${redirectPath}?plan=${planId}`);
        return;
      }

      // Redirecionar para pricing após cadastro (usuário novo precisa escolher plano)
      navigate("/pricing");
    } catch (error: any) {
      let errorMessage = error.message;
      
      if (error.message.includes("User already registered")) {
        errorMessage = "Este email já está cadastrado. Faça login ou use outro email.";
      }
      
      toast({
        title: "Erro no cadastro",
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
            Crie sua conta
          </h1>
          <p className="text-center text-[#6b7280] text-sm font-medium">
            Preencha os dados abaixo para começar
          </p>
        </div>

        {/* Signup Form */}
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
            <Label htmlFor="signup-cpf" className="text-[#252F1D] font-semibold text-sm">
              CPF
            </Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#a7a392]" />
              <Input
                id="signup-cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCPFChange}
                required
                className="pl-12 h-12 bg-[#f1f3f4]/50 border-[#e4e8eb] rounded-2xl hover:border-[#3c9247]/40 focus:border-[#3c9247] transition-colors"
              />
            </div>
            <p className="text-xs text-[#a7a392] mt-1">Necessário para integração com pagamentos</p>
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
            <p className="text-xs text-[#a7a392] mt-1">Mínimo de 6 caracteres</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-confirm-password" className="text-[#252F1D] font-semibold text-sm">
              Confirmar Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#a7a392]" />
              <Input
                id="signup-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
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
            {loading ? "Cadastrando..." : "Criar Conta"}
          </Button>
        </form>

        {/* Link para Login */}
        <div className="text-center mt-6">
          <p className="text-sm text-[#6b7280]">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="text-[#3c9247] hover:text-[#2e6b38] font-semibold transition-colors"
            >
              Faça login
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

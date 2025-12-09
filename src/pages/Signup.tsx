import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, ArrowLeft, Eye, EyeOff, User, Loader2, CheckCircle, Phone } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import logo from "@/assets/logo.png";

// Função para formatar CPF
const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

// Função para formatar telefone
const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

// Função para validar telefone
const validatePhone = (phone: string) => {
  const numbers = phone.replace(/\D/g, '');
  return numbers.length >= 10 && numbers.length <= 11;
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

type SignupStep = 'email' | 'verification' | 'registration';

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { refreshSubscription } = useAuth();
  
  // Step control
  const [step, setStep] = useState<SignupStep>('email');
  
  // Form fields
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Loading states
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Resend timer
  const [resendTimer, setResendTimer] = useState(0);

  // Verificar se há redirect pendente
  const redirectPath = searchParams.get("redirect");
  const planId = searchParams.get("plan");

  // Timer countdown effect
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    if (formatted.length <= 14) {
      setCpf(formatted);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    if (formatted.length <= 15) {
      setPhone(formatted);
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, insira seu email.",
        variant: "destructive",
      });
      return;
    }

    setSendingCode(true);

    try {
      const response = await supabase.functions.invoke('send-verification-code', {
        body: { email }
      });

      // Extrair mensagem de erro do response
      let errorMessage: string | null = null;
      
      if (response.error) {
        // Tentar extrair do context (quando Edge Function retorna non-2xx)
        if (response.error.context) {
          try {
            const contextText = typeof response.error.context === 'string' 
              ? response.error.context 
              : await response.error.context.text?.();
            if (contextText) {
              const errorData = JSON.parse(contextText);
              errorMessage = errorData.error;
            }
          } catch {
            // Se não conseguir parsear, usar mensagem padrão
          }
        }
        throw new Error(errorMessage || response.error.message || 'Erro ao enviar código');
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast({
        title: "Código enviado!",
        description: "Verifique sua caixa de entrada e spam.",
      });

      setStep('verification');
      setResendTimer(60);
    } catch (error: any) {
      toast({
        title: "Erro ao enviar código",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      toast({
        title: "Código incompleto",
        description: "Digite o código de 6 dígitos.",
        variant: "destructive",
      });
      return;
    }

    setVerifyingCode(true);

    try {
      const response = await supabase.functions.invoke('verify-email-code', {
        body: { email, code: verificationCode }
      });

      // Extrair mensagem de erro do response
      let errorMessage: string | null = null;
      
      if (response.error) {
        if (response.error.context) {
          try {
            const contextText = typeof response.error.context === 'string' 
              ? response.error.context 
              : await response.error.context.text?.();
            if (contextText) {
              const errorData = JSON.parse(contextText);
              errorMessage = errorData.error;
            }
          } catch {
            // Se não conseguir parsear, usar mensagem padrão
          }
        }
        throw new Error(errorMessage || response.error.message || 'Erro ao verificar código');
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast({
        title: "Email verificado!",
        description: "Agora complete seu cadastro.",
      });

      setStep('registration');
    } catch (error: any) {
      toast({
        title: "Código inválido",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    
    setSendingCode(true);

    try {
      const response = await supabase.functions.invoke('send-verification-code', {
        body: { email }
      });

      // Extrair mensagem de erro do response
      let errorMessage: string | null = null;
      
      if (response.error) {
        if (response.error.context) {
          try {
            const contextText = typeof response.error.context === 'string' 
              ? response.error.context 
              : await response.error.context.text?.();
            if (contextText) {
              const errorData = JSON.parse(contextText);
              errorMessage = errorData.error;
            }
          } catch {
            // Se não conseguir parsear, usar mensagem padrão
          }
        }
        throw new Error(errorMessage || response.error.message || 'Erro ao reenviar código');
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast({
        title: "Código reenviado!",
        description: "Verifique sua caixa de entrada.",
      });

      setResendTimer(60);
    } catch (error: any) {
      toast({
        title: "Erro ao reenviar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSendingCode(false);
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

    if (!validatePhone(phone)) {
      toast({
        title: "Telefone inválido",
        description: "Por favor, insira um telefone válido com DDD.",
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
      const cleanCPF = cpf.replace(/\D/g, '');
      const cleanPhone = phone.replace(/\D/g, '');

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            cpf: cleanCPF,
            phone: cleanPhone,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Cadastro realizado!",
        description: "Fazendo login...",
      });
      
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        toast({
          title: "Erro no login",
          description: "Cadastro feito, mas houve erro no login automático. Por favor, faça login manualmente.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Create trial subscription after successful login
      try {
        const { error: trialError } = await supabase.functions.invoke('create-trial', {
          headers: {
            Authorization: `Bearer ${signInData.session?.access_token}`,
          },
        });

        if (trialError) {
          console.error("Error creating trial:", trialError);
        }

        // Retry loop to ensure subscription is properly loaded before navigating
        let attempts = 0;
        const maxAttempts = 5;
        let subscriptionVerified = false;

        while (attempts < maxAttempts && !subscriptionVerified) {
          await refreshSubscription();
          
          // Small delay to allow state to update
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Verify subscription directly
          const { data: subCheck } = await supabase.functions.invoke('check-subscription', {
            headers: {
              Authorization: `Bearer ${signInData.session?.access_token}`,
            },
          });
          
          if (subCheck?.subscribed) {
            subscriptionVerified = true;
            console.log("Subscription verified successfully after", attempts + 1, "attempts");
          }
          
          attempts++;
        }
        
      } catch (trialErr) {
        console.error("Failed to create trial:", trialErr);
      }

      toast({
        title: "Bem-vindo ao Saldar!",
        description: "Seu período de teste de 5 dias começou. Aproveite!",
      });

      // Redirect to welcome trial page for first-time users
      navigate("/welcome-trial");
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
            {step === 'email' && 'Crie sua conta'}
            {step === 'verification' && 'Verificar email'}
            {step === 'registration' && 'Complete seu cadastro'}
          </h1>
          <p className="text-center text-[#6b7280] text-sm font-medium">
            {step === 'email' && 'Digite seu email para começar'}
            {step === 'verification' && `Enviamos um código para ${email}`}
            {step === 'registration' && 'Preencha os dados restantes'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-8 h-1 rounded-full transition-colors ${step === 'email' ? 'bg-[#3c9247]' : 'bg-[#3c9247]'}`} />
          <div className={`w-8 h-1 rounded-full transition-colors ${step === 'verification' || step === 'registration' ? 'bg-[#3c9247]' : 'bg-[#e4e8eb]'}`} />
          <div className={`w-8 h-1 rounded-full transition-colors ${step === 'registration' ? 'bg-[#3c9247]' : 'bg-[#e4e8eb]'}`} />
        </div>

        {/* Step 1: Email Input */}
        {step === 'email' && (
          <form onSubmit={handleSendCode} className="space-y-5">
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
            
            <Button 
              type="submit" 
              disabled={sendingCode}
              className="w-full h-12 bg-gradient-to-b from-[#3c9247] to-[#2e6b38] hover:from-[#45a352] hover:to-[#357042] text-white font-semibold rounded-full shadow-[0_6px_25px_rgba(60,146,71,0.3)] hover:shadow-[0_8px_30px_rgba(60,146,71,0.4)] transition-all duration-300"
            >
              {sendingCode ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar código de verificação"
              )}
            </Button>
          </form>
        )}

        {/* Step 2: Verification Code */}
        {step === 'verification' && (
          <form onSubmit={handleVerifyCode} className="space-y-5">
            <div className="space-y-4">
              <Label className="text-[#252F1D] font-semibold text-sm block text-center">
                Digite o código de 6 dígitos
              </Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={verificationCode}
                  onChange={(value) => setVerificationCode(value)}
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="w-12 h-14 text-xl border-[#e4e8eb] rounded-xl" />
                    <InputOTPSlot index={1} className="w-12 h-14 text-xl border-[#e4e8eb] rounded-xl" />
                    <InputOTPSlot index={2} className="w-12 h-14 text-xl border-[#e4e8eb] rounded-xl" />
                    <InputOTPSlot index={3} className="w-12 h-14 text-xl border-[#e4e8eb] rounded-xl" />
                    <InputOTPSlot index={4} className="w-12 h-14 text-xl border-[#e4e8eb] rounded-xl" />
                    <InputOTPSlot index={5} className="w-12 h-14 text-xl border-[#e4e8eb] rounded-xl" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-[#a7a392]">
                    Reenviar código em <span className="font-semibold text-[#3c9247]">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={sendingCode}
                    className="text-sm text-[#3c9247] hover:text-[#2e6b38] font-semibold transition-colors"
                  >
                    {sendingCode ? "Reenviando..." : "Reenviar código"}
                  </button>
                )}
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={verifyingCode || verificationCode.length !== 6}
              className="w-full h-12 bg-gradient-to-b from-[#3c9247] to-[#2e6b38] hover:from-[#45a352] hover:to-[#357042] text-white font-semibold rounded-full shadow-[0_6px_25px_rgba(60,146,71,0.3)] hover:shadow-[0_8px_30px_rgba(60,146,71,0.4)] transition-all duration-300"
            >
              {verifyingCode ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar código"
              )}
            </Button>

            <button
              type="button"
              onClick={() => {
                setStep('email');
                setVerificationCode('');
              }}
              className="w-full text-sm text-[#a7a392] hover:text-[#3c9247] transition-colors font-medium"
            >
              Usar outro email
            </button>
          </form>
        )}

        {/* Step 3: Registration Form */}
        {step === 'registration' && (
          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Email verificado (readonly) */}
            <div className="space-y-2">
              <Label className="text-[#252F1D] font-semibold text-sm">
                Email verificado
              </Label>
              <div className="flex items-center gap-2 h-12 px-4 bg-[#f1f3f4]/50 border border-[#e4e8eb] rounded-2xl">
                <CheckCircle className="h-5 w-5 text-[#3c9247]" />
                <span className="text-[#252F1D] flex-1">{email}</span>
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
              <Label htmlFor="signup-phone" className="text-[#252F1D] font-semibold text-sm">
                Telefone
              </Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#a7a392]" />
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                  className="pl-12 h-12 bg-[#f1f3f4]/50 border-[#e4e8eb] rounded-2xl hover:border-[#3c9247]/40 focus:border-[#3c9247] transition-colors"
                />
              </div>
              <p className="text-xs text-[#a7a392] mt-1">Com DDD (será usado para contato)</p>
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
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>
        )}

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

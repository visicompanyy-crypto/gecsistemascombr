import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  console.log(`[TRIAL-EMAILS] ${step}`, details ? JSON.stringify(details) : "");
};

const getEmailTemplate = (daysRemaining: number, userName: string) => {
  const baseUrl = "https://gecsistemas.com.br";
  const pricingUrl = `${baseUrl}/pricing`;
  
  const templates: Record<number, { subject: string; content: string }> = {
    5: {
      subject: "🎉 Bem-vindo ao Saldar! Seu teste gratuito começou",
      content: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0f0b 0%, #1a1f1b 100%); padding: 40px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00ff88; font-size: 28px; margin: 0;">Saldar</h1>
            <p style="color: #888; font-size: 14px;">Gestão Financeira Inteligente</p>
          </div>
          
          <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 20px;">Olá, ${userName}! 👋</h2>
          
          <p style="color: #cccccc; font-size: 16px; line-height: 1.6;">
            Seja muito bem-vindo ao <strong style="color: #00ff88;">Saldar</strong>! Seu período de teste gratuito de <strong>5 dias</strong> começou agora.
          </p>
          
          <p style="color: #cccccc; font-size: 16px; line-height: 1.6;">
            Durante esse período, você tem acesso completo a todas as funcionalidades:
          </p>
          
          <ul style="color: #cccccc; font-size: 15px; line-height: 2;">
            <li>✅ Lançamentos de receitas e despesas ilimitados</li>
            <li>✅ Parcelamentos automáticos</li>
            <li>✅ Fluxo de caixa e relatórios completos</li>
            <li>✅ Alertas e lembretes de vencimento</li>
            <li>✅ Suporte via WhatsApp</li>
          </ul>
          
          <p style="color: #cccccc; font-size: 16px; line-height: 1.6;">
            Aproveite para explorar e organizar suas finanças! 🚀
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${baseUrl}" style="display: inline-block; background: linear-gradient(135deg, #00ff88, #00cc6f); color: #0a0f0b; padding: 16px 32px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 8px;">
              Acessar o Saldar
            </a>
          </div>
          
          <p style="color: #666; font-size: 12px; text-align: center; margin-top: 40px;">
            © 2024 Saldar - Gestão Financeira Inteligente
          </p>
        </div>
      `
    },
    3: {
      subject: "⏰ Faltam 3 dias para seu teste terminar - Aproveite!",
      content: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0f0b 0%, #1a1f1b 100%); padding: 40px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00ff88; font-size: 28px; margin: 0;">Saldar</h1>
          </div>
          
          <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 20px;">Olá, ${userName}! 👋</h2>
          
          <p style="color: #cccccc; font-size: 16px; line-height: 1.6;">
            Seu período de teste gratuito está passando rápido! Você ainda tem <strong style="color: #ffd700;">3 dias</strong> para aproveitar todas as funcionalidades do Saldar.
          </p>
          
          <div style="background: rgba(255, 215, 0, 0.1); border: 1px solid #ffd700; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="color: #ffd700; font-size: 18px; font-weight: bold; margin: 0;">
              ⏰ 3 dias restantes no seu teste
            </p>
          </div>
          
          <p style="color: #cccccc; font-size: 16px; line-height: 1.6;">
            Já experimentou todas as funcionalidades? Continue organizando suas finanças e veja como o Saldar pode transformar sua gestão financeira!
          </p>
          
          <p style="color: #cccccc; font-size: 16px; line-height: 1.6;">
            Quando estiver pronto, escolha o plano que melhor se adapta às suas necessidades e garanta o melhor preço:
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${pricingUrl}" style="display: inline-block; background: linear-gradient(135deg, #ffd700, #ffaa00); color: #0a0f0b; padding: 16px 32px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 8px;">
              Ver Planos e Preços
            </a>
          </div>
          
          <p style="color: #666; font-size: 12px; text-align: center; margin-top: 40px;">
            © 2024 Saldar - Gestão Financeira Inteligente
          </p>
        </div>
      `
    },
    1: {
      subject: "⚠️ ÚLTIMO DIA do seu teste gratuito!",
      content: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0f0b 0%, #1a1f1b 100%); padding: 40px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00ff88; font-size: 28px; margin: 0;">Saldar</h1>
          </div>
          
          <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 20px;">Olá, ${userName}! 👋</h2>
          
          <div style="background: rgba(255, 0, 85, 0.1); border: 2px solid #ff0055; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
            <p style="color: #ff0055; font-size: 24px; font-weight: bold; margin: 0;">
              ⚠️ ÚLTIMO DIA!
            </p>
            <p style="color: #ff6688; font-size: 16px; margin-top: 8px;">
              Seu teste gratuito termina hoje
            </p>
          </div>
          
          <p style="color: #cccccc; font-size: 16px; line-height: 1.6;">
            Não perca o acesso ao Saldar! Assine agora e continue organizando suas finanças com:
          </p>
          
          <ul style="color: #cccccc; font-size: 15px; line-height: 2;">
            <li>✅ Lançamentos ilimitados</li>
            <li>✅ Fluxo de caixa completo</li>
            <li>✅ Alertas de vencimento</li>
            <li>✅ Suporte prioritário</li>
          </ul>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${pricingUrl}" style="display: inline-block; background: linear-gradient(135deg, #ff0055, #cc0044); color: #ffffff; padding: 18px 40px; font-size: 18px; font-weight: bold; text-decoration: none; border-radius: 8px;">
              🔒 ASSINAR AGORA
            </a>
          </div>
          
          <p style="color: #888; font-size: 14px; text-align: center; margin-top: 20px;">
            A partir de apenas R$ 99,90/mês no plano anual
          </p>
          
          <p style="color: #666; font-size: 12px; text-align: center; margin-top: 40px;">
            © 2024 Saldar - Gestão Financeira Inteligente
          </p>
        </div>
      `
    },
    0: {
      subject: "😢 Seu teste expirou - Mas ainda dá tempo de voltar!",
      content: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0f0b 0%, #1a1f1b 100%); padding: 40px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00ff88; font-size: 28px; margin: 0;">Saldar</h1>
          </div>
          
          <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 20px;">Olá, ${userName}! 👋</h2>
          
          <p style="color: #cccccc; font-size: 16px; line-height: 1.6;">
            Sentimos sua falta! Seu período de teste gratuito terminou, mas seus dados ainda estão salvos e esperando por você.
          </p>
          
          <p style="color: #cccccc; font-size: 16px; line-height: 1.6;">
            <strong style="color: #00ff88;">A boa notícia?</strong> Você pode voltar a qualquer momento! Escolha um plano e retome de onde parou, com todos os seus lançamentos e configurações intactos.
          </p>
          
          <div style="background: rgba(0, 255, 136, 0.1); border: 1px solid #00ff88; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="color: #00ff88; font-size: 16px; font-weight: bold; margin: 0 0 8px 0;">
              💡 Economize até 30%
            </p>
            <p style="color: #cccccc; font-size: 14px; margin: 0;">
              Com o plano anual, você paga apenas R$ 99,90/mês
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${pricingUrl}" style="display: inline-block; background: linear-gradient(135deg, #00ff88, #00cc6f); color: #0a0f0b; padding: 18px 40px; font-size: 18px; font-weight: bold; text-decoration: none; border-radius: 8px;">
              Assinar e Voltar ao Saldar
            </a>
          </div>
          
          <p style="color: #666; font-size: 12px; text-align: center; margin-top: 40px;">
            © 2024 Saldar - Gestão Financeira Inteligente
          </p>
        </div>
      `
    }
  };
  
  // Return template based on days remaining
  if (daysRemaining >= 5) return templates[5];
  if (daysRemaining >= 3) return templates[3];
  if (daysRemaining >= 1) return templates[1];
  return templates[0]; // Expired
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Starting trial emails processing");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all trial subscriptions
    const { data: trialSubscriptions, error: fetchError } = await supabase
      .from("subscriptions")
      .select("user_id, next_due_date, status")
      .eq("status", "TRIAL");

    if (fetchError) {
      logStep("Error fetching trial subscriptions", fetchError);
      throw fetchError;
    }

    logStep("Found trial subscriptions", { count: trialSubscriptions?.length || 0 });

    if (!trialSubscriptions || trialSubscriptions.length === 0) {
      return new Response(JSON.stringify({ message: "No trial subscriptions found" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const emailsSent: string[] = [];
    const errors: string[] = [];

    for (const subscription of trialSubscriptions) {
      try {
        // Get user email from auth
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
          subscription.user_id
        );

        if (userError || !userData.user?.email) {
          logStep("Could not get user data", { userId: subscription.user_id, error: userError });
          continue;
        }

        const userEmail = userData.user.email;
        const userName = userData.user.user_metadata?.full_name || 
                        userEmail.split("@")[0] || 
                        "Cliente";

        // Calculate days remaining
        const trialEndDate = new Date(subscription.next_due_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        trialEndDate.setHours(0, 0, 0, 0);
        
        const diffTime = trialEndDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        logStep("Processing user", { 
          email: userEmail, 
          daysRemaining,
          trialEndDate: subscription.next_due_date 
        });

        // Only send emails on specific days: 5, 3, 1, 0 (expired)
        const shouldSendEmail = [5, 3, 1, 0].includes(daysRemaining) || daysRemaining < 0;

        if (!shouldSendEmail) {
          logStep("Skipping email - not a notification day", { daysRemaining });
          continue;
        }

        // For expired trials (negative days), treat as 0
        const templateDays = daysRemaining < 0 ? 0 : daysRemaining;
        const template = getEmailTemplate(templateDays, userName);

        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Saldar <comercial@gecsistemas.com.br>",
            to: [userEmail],
            subject: template.subject,
            html: template.content,
          }),
        });

        if (!emailResponse.ok) {
          const errorData = await emailResponse.text();
          throw new Error(`Resend error: ${errorData}`);
        }

        logStep("Email sent successfully", { email: userEmail, daysRemaining });
        emailsSent.push(userEmail);

      } catch (emailError: any) {
        logStep("Error sending email", { error: emailError.message });
        errors.push(emailError.message);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailsSent: emailsSent.length,
        emails: emailsSent,
        errors 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    logStep("Error in send-trial-emails", { error: error.message });
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

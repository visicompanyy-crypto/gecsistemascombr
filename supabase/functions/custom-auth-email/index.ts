import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthEmailPayload {
  user: {
    email: string;
    user_metadata?: {
      name?: string;
    };
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
  };
}

const getRecoveryEmailHtml = (resetLink: string, userEmail: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redefinir Senha - Saldar</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f3f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 500px; border-collapse: collapse; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px;">
              <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #3c9247 0%, #2e6b38 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                <span style="font-size: 28px; font-weight: bold; color: white;">S</span>
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #252F1D;">
                Redefinir sua senha
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 20px 40px;">
              <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #6b7280; text-align: center;">
                Recebemos uma solicitação para redefinir a senha da sua conta associada a <strong style="color: #252F1D;">${userEmail}</strong>.
              </p>
              <p style="margin: 0 0 28px; font-size: 15px; line-height: 1.6; color: #6b7280; text-align: center;">
                Clique no botão abaixo para criar uma nova senha:
              </p>
            </td>
          </tr>
          
          <!-- Button -->
          <tr>
            <td align="center" style="padding: 0 40px 28px;">
              <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 14px 40px; background: linear-gradient(180deg, #3c9247 0%, #2e6b38 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 50px; box-shadow: 0 6px 25px rgba(60,146,71,0.3);">
                Redefinir Senha
              </a>
            </td>
          </tr>
          
          <!-- Warning -->
          <tr>
            <td style="padding: 0 40px 28px;">
              <div style="background-color: #fef3c7; border-radius: 12px; padding: 16px;">
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #92400e; text-align: center;">
                  ⏰ Este link expira em <strong>1 hora</strong>. Se você não solicitou esta redefinição, ignore este email.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Alternative Link -->
          <tr>
            <td style="padding: 0 40px 28px;">
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #9ca3af; text-align: center;">
                Se o botão não funcionar, copie e cole este link no seu navegador:
              </p>
              <p style="margin: 8px 0 0; font-size: 11px; line-height: 1.4; color: #3c9247; text-align: center; word-break: break-all;">
                ${resetLink}
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 28px 40px; background-color: #f9fafb; border-radius: 0 0 24px 24px;">
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #9ca3af; text-align: center;">
                © 2024 Saldar - Gestão Financeira Inteligente<br>
                Este email foi enviado automaticamente, não responda.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: AuthEmailPayload = await req.json();
    
    console.log("Auth email hook received:", {
      email: payload.user?.email,
      action_type: payload.email_data?.email_action_type,
    });

    const { user, email_data } = payload;
    const { email_action_type, token_hash, redirect_to, site_url } = email_data;

    // Only handle recovery (password reset) emails
    if (email_action_type === "recovery") {
      // Construct the reset link
      const supabaseUrl = Deno.env.get("SUPABASE_URL") || site_url;
      const resetLink = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=recovery&redirect_to=${encodeURIComponent(redirect_to)}`;

      console.log("Sending recovery email to:", user.email);
      console.log("Reset link:", resetLink);

      const emailResponse = await resend.emails.send({
        from: "Saldar <comercial@gecsistemas.com.br>",
        to: [user.email],
        subject: "Redefinir sua senha - Saldar",
        html: getRecoveryEmailHtml(resetLink, user.email),
      });

      console.log("Resend response:", emailResponse);

      if (emailResponse.error) {
        console.error("Resend error:", emailResponse.error);
        throw new Error(emailResponse.error.message);
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // For other email types, let Supabase handle them
    console.log("Email type not handled by custom hook:", email_action_type);
    return new Response(
      JSON.stringify({ error: "Email type not handled" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in custom-auth-email function:", error);
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

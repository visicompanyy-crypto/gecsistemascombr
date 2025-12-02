import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending verification code to: ${email}`);

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if email is already registered
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const emailExists = existingUser?.users?.some(
      (user) => user.email?.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      return new Response(
        JSON.stringify({ error: "Este email já está cadastrado. Faça login ou use outro email." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate verification code
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate previous codes for this email
    await supabase
      .from("email_verifications")
      .update({ verified: true })
      .eq("email", email.toLowerCase())
      .eq("verified", false);

    // Insert new verification code
    const { error: insertError } = await supabase
      .from("email_verifications")
      .insert({
        email: email.toLowerCase(),
        code,
        expires_at: expiresAt.toISOString(),
        verified: false,
      });

    if (insertError) {
      console.error("Error inserting verification code:", insertError);
      return new Response(
        JSON.stringify({ error: "Erro ao gerar código de verificação" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "Saldar <onboarding@resend.dev>",
      to: [email],
      subject: "Código de Verificação - Saldar",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 12px 12px 0 0;">
                      <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">Saldar</h1>
                      <p style="margin: 8px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.9);">Gestão Financeira Inteligente</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px 0; font-size: 22px; font-weight: 600; color: #1f2937;">Verificação de Email</h2>
                      <p style="margin: 0 0 30px 0; font-size: 16px; color: #4b5563; line-height: 1.6;">
                        Use o código abaixo para verificar seu email e continuar com seu cadastro no Saldar:
                      </p>
                      
                      <!-- Code Box -->
                      <div style="background-color: #f3f4f6; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 30px;">
                        <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #22c55e; font-family: monospace;">${code}</span>
                      </div>
                      
                      <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
                        ⏱️ Este código expira em <strong>10 minutos</strong>.
                      </p>
                      <p style="margin: 0; font-size: 14px; color: #6b7280;">
                        Se você não solicitou este código, pode ignorar este email com segurança.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 40px; background-color: #f9fafb; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">
                        © 2024 Saldar. Todos os direitos reservados.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, message: "Código enviado com sucesso" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-verification-code:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro interno do servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

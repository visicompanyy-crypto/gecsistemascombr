import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Whitelist de emails com acesso gratuito ao sistema
const WHITELISTED_EMAILS: string[] = [
  "gec@gmail.com",
  "teste1@gmail.com",
  "teste3@gmail.com",
  "gustavogostoso@gmail.com",
  "eduardotndl@gmail.com",
  "marcelo@amarconstrutora.com.br",
  "visicompanyy@gmail.com",
  "exemplo@gecsistemas.com",
];

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

// Calculate days until a date
const calculateDaysUntil = (dateStr: string | null): number | null => {
  if (!dateStr) return null;
  const targetDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check if email is whitelisted
    if (WHITELISTED_EMAILS.includes(user.email.toLowerCase())) {
      logStep("Whitelisted email detected - granting free access", { email: user.email });
      return new Response(JSON.stringify({ 
        subscribed: true, 
        status: "ACTIVE",
        product_id: "whitelisted",
        subscription_end: null,
        days_until_renewal: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check subscription in local database
    const { data: subscription, error: subError } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (subError || !subscription) {
      logStep("No subscription found in database");
      return new Response(JSON.stringify({ 
        subscribed: false,
        status: null,
        product_id: null,
        subscription_end: null,
        days_until_renewal: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Subscription found", { 
      planId: subscription.plan_id, 
      status: subscription.status,
      nextDueDate: subscription.next_due_date
    });

    // Check if subscription is active (ACTIVE or TRIAL status)
    const isActive = subscription.status === "ACTIVE";
    const isTrial = subscription.status === "TRIAL";
    
    // Check if subscription is expired (next_due_date has passed)
    const daysUntilRenewal = calculateDaysUntil(subscription.next_due_date);
    const isExpired = daysUntilRenewal !== null && daysUntilRenewal < 0;
    
    // User is subscribed if status is ACTIVE/TRIAL and not expired
    const isSubscribed = (isActive || isTrial) && !isExpired;
    
    logStep("Subscription status calculated", { 
      isActive, 
      isTrial,
      isExpired, 
      isSubscribed,
      daysUntilRenewal
    });
    
    return new Response(JSON.stringify({
      subscribed: isSubscribed,
      status: subscription.status,
      product_id: subscription.plan_id,
      subscription_end: subscription.next_due_date,
      days_until_renewal: daysUntilRenewal
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-TRIAL] ${step}${detailsStr}`);
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
    if (!user?.id) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check if user already has a subscription
    const { data: existingSubscription, error: checkError } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (existingSubscription) {
      logStep("User already has subscription", { status: existingSubscription.status });
      
      // Se a subscription existente for PENDING, converter para TRIAL
      if (existingSubscription.status === "PENDING") {
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 90); // 3 meses grátis
        const formattedEndDate = trialEndDate.toISOString().split('T')[0];
        
        logStep("Converting PENDING subscription to TRIAL", { 
          subscriptionId: existingSubscription.id,
          newEndDate: formattedEndDate 
        });

        const { data: updatedSub, error: updateError } = await supabaseClient
          .from("subscriptions")
          .update({
            status: "TRIAL",
            plan_id: "trial",
            plan_name: "Período Gratuito (3 meses)",
            billing_cycle: "TRIAL",
            value: 0,
            next_due_date: formattedEndDate,
          })
          .eq("id", existingSubscription.id)
          .select()
          .single();

        if (updateError) {
          logStep("Error converting to trial", { error: updateError.message });
          throw new Error(`Failed to convert to trial: ${updateError.message}`);
        }

        logStep("Successfully converted PENDING to TRIAL", { subscriptionId: updatedSub.id });
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: "Subscription converted to trial",
          subscription: updatedSub
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
      
      // Se já tem ACTIVE ou TRIAL, manter como está
      return new Response(JSON.stringify({ 
        success: true, 
        message: "User already has subscription",
        subscription: existingSubscription
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Calculate trial end date (90 days / 3 months from now)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 90);
    const formattedEndDate = trialEndDate.toISOString().split('T')[0];

    logStep("Creating trial subscription", { 
      userId: user.id, 
      trialEndDate: formattedEndDate 
    });

    // Create trial subscription
    const { data: newSubscription, error: insertError } = await supabaseClient
      .from("subscriptions")
      .insert({
        user_id: user.id,
        status: "TRIAL",
        plan_id: "trial",
        plan_name: "Período Gratuito (3 meses)",
        billing_cycle: "TRIAL",
        value: 0,
        next_due_date: formattedEndDate,
      })
      .select()
      .single();

    if (insertError) {
      logStep("Error creating trial", { error: insertError.message });
      throw new Error(`Failed to create trial: ${insertError.message}`);
    }

    logStep("Trial created successfully", { subscriptionId: newSubscription.id });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Trial created successfully",
      subscription: newSubscription
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-trial", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

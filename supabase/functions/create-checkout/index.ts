import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ASAAS_API_URL = "https://api.asaas.com/v3";

const PLANS = {
  monthly: {
    id: "monthly",
    name: "Plano Mensal",
    value: 5.00, // TESTE - valor original: 139.90 (mínimo Asaas: R$ 5,00)
    cycle: "MONTHLY",
    description: "Assinatura mensal Saldar"
  },
  quarterly: {
    id: "quarterly",
    name: "Plano Trimestral",
    value: 359.00,
    cycle: "QUARTERLY",
    description: "Assinatura trimestral Saldar"
  },
  yearly: {
    id: "yearly",
    name: "Plano Anual",
    value: 1198.80,
    cycle: "YEARLY",
    description: "Assinatura anual Saldar"
  }
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

// Helper function to safely fetch and parse Asaas API response
async function asaasFetch(url: string, options: RequestInit, apiKey: string) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "access_token": apiKey,
      ...options.headers,
    },
  });

  const responseText = await response.text();
  logStep("Asaas API response", { 
    status: response.status, 
    statusText: response.statusText,
    url: url,
    bodyPreview: responseText.substring(0, 500)
  });

  if (!response.ok) {
    throw new Error(`Asaas API error (${response.status}): ${responseText.substring(0, 500)}`);
  }

  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error(`Invalid JSON response from Asaas: ${responseText.substring(0, 500)}`);
  }
}

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

    const asaasApiKey = Deno.env.get("ASAAS_API_KEY");
    if (!asaasApiKey) throw new Error("ASAAS_API_KEY is not set");
    logStep("Asaas API key verified", { keyLength: asaasApiKey.length, keyPrefix: asaasApiKey.substring(0, 10) });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { planId, cpfCnpj } = await req.json();
    if (!planId || !PLANS[planId as keyof typeof PLANS]) {
      throw new Error("Invalid plan ID. Valid options: monthly, quarterly, yearly");
    }
    if (!cpfCnpj) {
      throw new Error("CPF ou CNPJ é obrigatório");
    }
    const plan = PLANS[planId as keyof typeof PLANS];
    logStep("Plan selected", { planId, planName: plan.name, value: plan.value, cpfCnpj: cpfCnpj.substring(0, 3) + "***" });

    // Check if user already has a subscription
    const { data: existingSub } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    let asaasCustomerId = existingSub?.asaas_customer_id;

    // Create or get Asaas customer
    if (!asaasCustomerId) {
      logStep("Creating new Asaas customer");
      
      const customerData = await asaasFetch(
        `${ASAAS_API_URL}/customers`,
        {
          method: "POST",
          body: JSON.stringify({
            name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Cliente",
            email: user.email,
            cpfCnpj: cpfCnpj,
            notificationDisabled: false,
          }),
        },
        asaasApiKey
      );

      if (customerData.errors) {
        throw new Error(`Asaas customer error: ${JSON.stringify(customerData.errors)}`);
      }
      asaasCustomerId = customerData.id;
      logStep("Asaas customer created", { customerId: asaasCustomerId });
    } else {
      logStep("Updating existing Asaas customer with CPF/CNPJ", { customerId: asaasCustomerId });
      
      // Update existing customer with CPF/CNPJ
      await asaasFetch(
        `${ASAAS_API_URL}/customers/${asaasCustomerId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            cpfCnpj: cpfCnpj,
          }),
        },
        asaasApiKey
      );
      logStep("Existing Asaas customer updated", { customerId: asaasCustomerId });
    }

    // Create subscription in Asaas
    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + 1);
    const formattedDate = nextDueDate.toISOString().split("T")[0];

    logStep("Creating Asaas subscription", { 
      customerId: asaasCustomerId, 
      value: plan.value, 
      cycle: plan.cycle,
      nextDueDate: formattedDate
    });

    const subscriptionData = await asaasFetch(
      `${ASAAS_API_URL}/subscriptions`,
      {
        method: "POST",
        body: JSON.stringify({
          customer: asaasCustomerId,
          billingType: "UNDEFINED",
          value: plan.value,
          nextDueDate: formattedDate,
          cycle: plan.cycle,
          description: plan.description,
          externalReference: user.id,
        }),
      },
      asaasApiKey
    );

    if (subscriptionData.errors) {
      throw new Error(`Asaas subscription error: ${JSON.stringify(subscriptionData.errors)}`);
    }
    logStep("Asaas subscription created", { 
      subscriptionId: subscriptionData.id,
      status: subscriptionData.status 
    });

    // Get the first payment link
    const paymentsData = await asaasFetch(
      `${ASAAS_API_URL}/subscriptions/${subscriptionData.id}/payments`,
      { method: "GET" },
      asaasApiKey
    );

    let invoiceUrl = null;
    if (paymentsData.data && paymentsData.data.length > 0) {
      const firstPayment = paymentsData.data[0];
      invoiceUrl = firstPayment.invoiceUrl;
      logStep("Payment link obtained", { paymentId: firstPayment.id, invoiceUrl });
    }

    // Save or update subscription in database
    const subscriptionRecord = {
      user_id: user.id,
      asaas_customer_id: asaasCustomerId,
      asaas_subscription_id: subscriptionData.id,
      plan_id: plan.id,
      plan_name: plan.name,
      billing_cycle: plan.cycle,
      value: plan.value,
      status: "PENDING",
      next_due_date: formattedDate,
    };

    if (existingSub) {
      await supabaseClient
        .from("subscriptions")
        .update(subscriptionRecord)
        .eq("user_id", user.id);
      logStep("Subscription record updated in database");
    } else {
      await supabaseClient
        .from("subscriptions")
        .insert(subscriptionRecord);
      logStep("Subscription record created in database");
    }

    return new Response(JSON.stringify({ 
      url: invoiceUrl,
      subscriptionId: subscriptionData.id,
      status: subscriptionData.status
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

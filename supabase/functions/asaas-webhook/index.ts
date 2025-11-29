import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ASAAS-WEBHOOK] ${step}${detailsStr}`);
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
    logStep("Webhook received");

    const body = await req.json();
    logStep("Webhook payload", { event: body.event, payment: body.payment?.id });

    const event = body.event;
    const payment = body.payment;

    if (!payment) {
      logStep("No payment data in webhook");
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Get subscription ID from payment
    const subscriptionId = payment.subscription;
    if (!subscriptionId) {
      logStep("No subscription ID in payment, skipping");
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Processing event", { event, subscriptionId, paymentStatus: payment.status });

    // Find subscription in database
    const { data: subscription, error: findError } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("asaas_subscription_id", subscriptionId)
      .single();

    if (findError || !subscription) {
      logStep("Subscription not found in database", { subscriptionId });
      return new Response(JSON.stringify({ received: true, message: "Subscription not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Subscription found", { userId: subscription.user_id, currentStatus: subscription.status });

    let newStatus = subscription.status;
    let nextDueDate = subscription.next_due_date;

    // Map Asaas events to subscription status
    switch (event) {
      case "PAYMENT_CONFIRMED":
      case "PAYMENT_RECEIVED":
        newStatus = "ACTIVE";
        // Calculate next due date based on billing cycle
        const dueDate = new Date(payment.dueDate || payment.paymentDate);
        switch (subscription.billing_cycle) {
          case "MONTHLY":
            dueDate.setMonth(dueDate.getMonth() + 1);
            break;
          case "QUARTERLY":
            dueDate.setMonth(dueDate.getMonth() + 3);
            break;
          case "YEARLY":
            dueDate.setFullYear(dueDate.getFullYear() + 1);
            break;
        }
        nextDueDate = dueDate.toISOString().split("T")[0];
        logStep("Payment confirmed - activating subscription", { newStatus, nextDueDate });
        break;

      case "PAYMENT_OVERDUE":
        newStatus = "OVERDUE";
        logStep("Payment overdue", { newStatus });
        break;

      case "PAYMENT_DELETED":
      case "PAYMENT_REFUNDED":
        // Don't change status for deleted/refunded individual payments
        logStep("Payment deleted/refunded - no status change");
        break;

      case "SUBSCRIPTION_DELETED":
      case "SUBSCRIPTION_INACTIVATED":
        newStatus = "CANCELLED";
        logStep("Subscription cancelled", { newStatus });
        break;

      case "SUBSCRIPTION_RENEWED":
        newStatus = "ACTIVE";
        logStep("Subscription renewed", { newStatus });
        break;

      default:
        logStep("Unhandled event type", { event });
    }

    // Update subscription in database
    const { error: updateError } = await supabaseClient
      .from("subscriptions")
      .update({
        status: newStatus,
        next_due_date: nextDueDate,
        updated_at: new Date().toISOString(),
      })
      .eq("asaas_subscription_id", subscriptionId);

    if (updateError) {
      logStep("Error updating subscription", { error: updateError.message });
      throw new Error(`Failed to update subscription: ${updateError.message}`);
    }

    logStep("Subscription updated successfully", { 
      subscriptionId, 
      newStatus, 
      nextDueDate 
    });

    return new Response(JSON.stringify({ 
      received: true,
      processed: true,
      newStatus,
      nextDueDate
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in asaas-webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

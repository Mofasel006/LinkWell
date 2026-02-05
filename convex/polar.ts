import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

// Polar webhook handler
export const webhook = httpAction(async (ctx, request) => {
  const body = await request.text();
  
  // Get webhook secret from environment
  const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
  
  // Verify webhook signature if secret is configured
  if (webhookSecret) {
    const signature = request.headers.get("webhook-signature") || 
                      request.headers.get("x-polar-signature");
    
    // For production, you should verify the signature
    // Polar uses HMAC-SHA256 for webhook signatures
    if (!signature) {
      console.warn("No webhook signature found");
    }
  }

  let payload;
  try {
    payload = JSON.parse(body);
  } catch (e) {
    console.error("Failed to parse webhook body:", e);
    return new Response("Invalid JSON", { status: 400 });
  }

  console.log("Polar webhook received:", payload.type);

  const eventType = payload.type;
  const data = payload.data;

  try {
    switch (eventType) {
      case "checkout.created":
        console.log("Checkout created:", data.id);
        break;

      case "checkout.updated":
        console.log("Checkout updated:", data.id, data.status);
        
        if (data.status === "succeeded" && data.customer_email) {
          // Update subscription when checkout succeeds
          await ctx.runMutation(internal.polar.updateSubscriptionFromWebhook, {
            email: data.customer_email,
            polarCustomerId: data.customer_id || undefined,
            polarSubscriptionId: data.subscription_id || undefined,
            status: "active",
          });
        }
        break;

      case "subscription.created":
      case "subscription.updated":
        console.log("Subscription event:", eventType, data.id);
        
        if (data.user?.email) {
          const status = mapPolarStatus(data.status);
          await ctx.runMutation(internal.polar.updateSubscriptionFromWebhook, {
            email: data.user.email,
            polarCustomerId: data.user.id || undefined,
            polarSubscriptionId: data.id,
            status,
            currentPeriodEnd: data.current_period_end 
              ? new Date(data.current_period_end).getTime() 
              : undefined,
          });
        }
        break;

      case "subscription.canceled":
        console.log("Subscription canceled:", data.id);
        
        if (data.user?.email) {
          await ctx.runMutation(internal.polar.updateSubscriptionFromWebhook, {
            email: data.user.email,
            polarCustomerId: data.user.id || undefined,
            polarSubscriptionId: data.id,
            status: "canceled",
          });
        }
        break;

      case "order.created":
        console.log("Order created:", data.id);
        
        // Handle one-time purchases or initial subscription orders
        if (data.customer?.email) {
          await ctx.runMutation(internal.polar.updateSubscriptionFromWebhook, {
            email: data.customer.email,
            polarCustomerId: data.customer.id || undefined,
            polarSubscriptionId: data.subscription_id || undefined,
            status: "active",
          });
        }
        break;

      default:
        console.log("Unhandled webhook event:", eventType);
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response("Internal error", { status: 500 });
  }
});

function mapPolarStatus(polarStatus: string): "active" | "inactive" | "trialing" | "canceled" | "past_due" {
  switch (polarStatus) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "canceled":
    case "cancelled":
      return "canceled";
    case "past_due":
    case "unpaid":
      return "past_due";
    default:
      return "inactive";
  }
}

// Internal mutation to update subscription from webhook
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const updateSubscriptionFromWebhook = internalMutation({
  args: {
    email: v.string(),
    polarCustomerId: v.optional(v.string()),
    polarSubscriptionId: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("trialing"),
      v.literal("canceled"),
      v.literal("past_due")
    ),
    currentPeriodEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Find subscription by email
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        polarCustomerId: args.polarCustomerId,
        polarSubscriptionId: args.polarSubscriptionId,
        status: args.status,
        currentPeriodEnd: args.currentPeriodEnd,
        updatedAt: now,
      });
      console.log("Updated subscription for:", args.email);
      return existing._id;
    }

    // If no existing subscription, try to find user by email in auth
    // and create a subscription record
    console.log("No existing subscription found for email:", args.email);
    return null;
  },
});

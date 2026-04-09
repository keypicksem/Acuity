import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = headers().get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook verification failed: ${message}` },
      { status: 400 }
    );
  }

  const { prisma } = await import("@/lib/prisma");

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId) break;

      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: session.customer as string,
          subscriptionStatus: "PRO",
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.user.updateMany({
        where: { stripeCustomerId: sub.customer as string },
        data: { subscriptionStatus: "FREE" },
      });
      break;
    }

    default:
      // Unhandled event — return 200 so Stripe doesn't retry
      break;
  }

  return NextResponse.json({ received: true });
}

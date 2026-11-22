import { expireCheckoutSession, fulfillCheckoutSession } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    console.error("STRIPE_WEBHOOK_SIGNATURE_ERROR:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await fulfillCheckoutSession(event.data.object);
        break;
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed":
        await expireCheckoutSession(event.data.object);
        break;
      default:
        break;
    }
    revalidatePath("/orders");
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
  } catch (error) {
    console.error("STRIPE_WEBHOOK_HANDLER_ERROR:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

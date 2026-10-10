import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { markInvoiceAsPaid } from "@/lib/services/invoices";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!stripe || !webhookSecret || !signature) {
      // If Stripe or webhook secret is not configured, parse payload directly (for testing/development)
      event = JSON.parse(body) as Stripe.Event;
    } else {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", (err as Error).message);
    return NextResponse.json(
      { error: `Webhook Error: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  // Handle Stripe events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const invoiceId = session.metadata?.invoiceId;
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : undefined;

      if (invoiceId) {
        console.log(`[Stripe Webhook] Invoice ${invoiceId} marked as PAID via session ${session.id}`);
        await markInvoiceAsPaid(invoiceId, session.id, paymentIntentId);
      }
      break;
    }

    default:
      console.log(`[Stripe Webhook] Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

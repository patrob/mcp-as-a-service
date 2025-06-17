import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2025-05-28.basil'
});

export async function GET() {
  const customerId = process.env.STRIPE_CUSTOMER_ID;
  if (!customerId) {
    return NextResponse.json({ error: 'Missing customer id' }, { status: 400 });
  }

  try {
    const subs = await stripe.subscriptions.list({ customer: customerId, limit: 1 });
    const sub = subs.data[0];
    const plan = sub?.items.data[0].price.nickname ?? 'Unknown';
    const usage = sub?.items.data[0].quantity ?? 0;
    return NextResponse.json({ plan, usage });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}

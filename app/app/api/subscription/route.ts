export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  const customerId = process.env.STRIPE_CUSTOMER_ID;
  if (!customerId) {
    return NextResponse.json({ error: 'Missing customer id' }, { status: 400 });
  }
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  try {
    const stripe = new Stripe(apiKey, { apiVersion: '2025-05-28.basil' });
    const subs = await stripe.subscriptions.list({ customer: customerId, limit: 1 });
    const sub = subs.data[0];
    const plan = sub?.items.data[0].price.nickname ?? 'Unknown';
    const usage = sub?.items.data[0].quantity ?? 0;
    return NextResponse.json({ plan, usage });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}

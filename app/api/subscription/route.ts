export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { UserService } from "@/lib/user-service";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.STRIPE_SECRET_KEY;

  // Return mock data if Stripe is not configured
  if (!apiKey) {
    return NextResponse.json({
      plan: "Free",
      usage: 0,
      mock: true,
    });
  }

  try {
    // Get user's Stripe customer ID from database
    const userService = new UserService();
    const user = await userService.getUserByEmail(session.user.email);

    if (!user?.stripe_customer_id) {
      // User doesn't have a Stripe customer ID yet, return free plan
      return NextResponse.json({
        plan: "Free",
        usage: 0,
        mock: true,
      });
    }

    const stripe = new Stripe(apiKey, { apiVersion: "2025-05-28.basil" });
    const subs = await stripe.subscriptions.list({
      customer: user.stripe_customer_id,
      limit: 1,
    });

    const sub = subs.data[0];
    const plan = sub?.items.data[0].price.nickname ?? "Free";
    const usage = sub?.items.data[0].quantity ?? 0;

    return NextResponse.json({ plan, usage });
  } catch (error) {
    console.error("Stripe error:", error);
    // Return mock data on error
    return NextResponse.json({
      plan: "Free",
      usage: 0,
      mock: true,
    });
  }
}
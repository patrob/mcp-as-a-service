export interface Subscription {
  plan: string;
  usage: number;
  mock?: boolean;
}

export async function getSubscription(): Promise<Subscription> {
  const res = await fetch("/api/subscription");
  if (!res.ok) throw new Error("Failed to fetch subscription");
  return res.json();
}


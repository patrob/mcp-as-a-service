export function formatUsage(usage: number, limit: number): string {
  if (limit <= 0) return '0%';
  const ratio = Math.min(1, usage / limit);
  return `${Math.round(ratio * 100)}%`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function cn(...classes: (string | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string): string {
  const symbolMap: Record<string, string> = {
    INR: "₹",
    GBP: "£",
    USD: "$",
    CAD: "C$",
  };
  const symbol = symbolMap[currency.toUpperCase()] || currency;
  return `${symbol}${amount.toLocaleString()}`;
}

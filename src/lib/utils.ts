import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string, decimal: number = 2, useStyle: boolean = true): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  const formatter = new Intl.NumberFormat('en-IN', {
    style: useStyle ? 'currency' : 'decimal',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: decimal,
    currencyDisplay: 'symbol'
  });
  return formatter.format(numericPrice).replace('$', '$ ');
}

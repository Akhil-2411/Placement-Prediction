import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatLpa(value?: number): string {
  if (!value) return 'Competitive';
  return `₹${value.toFixed(1)} LPA`;
}

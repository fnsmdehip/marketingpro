import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | number) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getInitials(name: string) {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatNumber(number: number) {
  return new Intl.NumberFormat("en-US").format(number);
}

export function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function debounce<F extends (...args: any[]) => any>(
  func: F,
  wait: number
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<F>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function urlify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getRelativeTime(date: Date | string | number) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);
  
  if (diffSecs < 60) {
    return "just now";
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else {
    return formatDate(date);
  }
}
import { format, parseISO } from "date-fns";

export function formatDate(iso: string): string {
  if (!iso) return "—";
  try {
    return format(parseISO(iso), "MMM d, yyyy");
  } catch {
    return iso;
  }
}

export function formatPhone(phone: string): string {
  if (!phone) return "—";
  const digits = phone.replace(/\D/g, "");

  // If 12 digits starting with 91 (e.g. 919876543210)
  if (digits.length === 12 && digits.startsWith("91")) {
    const num = digits.slice(2);
    return `+91 ${num.slice(0, 5)} ${num.slice(5)}`;
  }

  // If 10 digits (e.g. 9876543210)
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  return phone;
}

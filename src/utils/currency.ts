import { Currency } from "../types/garage.types";

export function formatCurrency(amount: string | number, currency: Currency, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

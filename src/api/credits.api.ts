import { apiFetch } from './api';

export type CreditPurchaseStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED';

export type CreditPurchase = {
  paymentIntentId: string;
  status: CreditPurchaseStatus;
  credits: number;
  creditBalance: number;
};

export function purchaseCredits(credits: number, idempotencyKey: string): Promise<{ clientSecret: string; paymentIntentId: string }> {
  return apiFetch('/payments/credits/purchase', { method: 'POST', headers: { 'Idempotency-Key': idempotencyKey }, body: JSON.stringify({ credits }) });
}

export function getCreditPurchaseStatus(paymentIntentId: string): Promise<CreditPurchase> {
  return apiFetch(`/payments/credits/purchases/${encodeURIComponent(paymentIntentId)}`);
}

export function getReservationCreditQuote(parkingId: number, startDatetime: string, endDatetime: string): Promise<{ credits: number }> {
  const params = new URLSearchParams({ parkingId: String(parkingId), startDatetime, endDatetime });
  return apiFetch(`/payments/credits/quote?${params.toString()}`);
}

export function payReservationWithCredits(reservationId: number) {
  return apiFetch(`/payments/${reservationId}/credits`, {
    method: 'POST',
    body: JSON.stringify({ idempotencyKey: `${reservationId}-${Date.now()}` }),
  });
}

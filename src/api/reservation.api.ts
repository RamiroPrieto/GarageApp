import { apiFetch } from "./api";
import { Reservation } from "../types/reservation.types";

export async function createReservation(
    parkingId: number,
    vehicleId: number | null,
    startDatetime: string,
    endDatetime: string,
  ): Promise<Reservation> {
    return apiFetch("/reservations", {
      method: "POST",
      body: JSON.stringify({
        parkingId,
        ...(vehicleId != null ? { vehicleId } : {}),
        startDatetime,
        endDatetime,
      }),
    });
  }

export async function getMyReservations(): Promise<Reservation[]> {
  return apiFetch("/reservations");
}

export async function getReservation(reservationId: number): Promise<Reservation> {
  return apiFetch(`/reservations/${reservationId}`);
}

export async function cancelReservation(reservationId: number): Promise<Reservation> {
  return apiFetch(`/reservations/${reservationId}/cancel`, { method: "PATCH" });
}

export async function getUpcomingReservation(): Promise<Reservation | null> {
  console.log("[reservations-api] Calling upcoming reservation endpoint");
  const response = await apiFetch<{ reservation: Reservation | null }>("/reservations/upcoming/home");
  const reservation = response.reservation ?? null;
  console.log("[reservations-api] Upcoming reservation received", { found: Boolean(reservation), status: reservation?.status });
  return reservation;
}

export async function confirmCustomerReservationStart(reservationId: number): Promise<Reservation> {
  return apiFetch(`/reservations/${reservationId}/start/customer`, { method: "POST" });
}

export async function confirmOwnerReservationStart(reservationId: number): Promise<Reservation> {
  return apiFetch(`/reservations/${reservationId}/start/owner`, { method: "POST" });
}

export async function confirmReservationPayment(
  reservationId: number,
): Promise<Reservation> {
  return apiFetch(`/payments/${reservationId}/confirm`, {
    method: "POST",
  });
}

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

export async function confirmReservationPayment(
  reservationId: number,
): Promise<Reservation> {
  return apiFetch(`/payments/${reservationId}/confirm`, {
    method: "POST",
  });
}

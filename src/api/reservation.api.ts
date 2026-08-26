import { apiFetch } from "./api";

export async function createReservation(
    parkingId: number,
    vehicleId: number,
    startDatetime: string,
    endDatetime: string,
  ) {
    return apiFetch("/reservations", {
      method: "POST",
      body: JSON.stringify({
        parkingId,
        vehicleId,
        startDatetime,
        endDatetime,
      }),
    });
  }
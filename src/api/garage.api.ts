import { apiFetch } from "./api";
import { CreateParkingDto, Parking } from "../types/garage.types";

export type ParkingCoordinates = {
  latitude: number;
  longitude: number;
};

/**
 * The server owns the Geocoding API credential. Keeping that credential on the
 * server is required because the Android Maps key is restricted to the native
 * Maps SDK and cannot safely be used from a REST request in the app.
 */
export async function geocodeParkingAddress(
  address: string,
  city: string,
  country: string,
): Promise<ParkingCoordinates> {
  return apiFetch("/parkings/geocode", {
    method: "POST",
    body: JSON.stringify({ address, city, country }),
  });
}

export async function getParkings(): Promise<Parking[]> {
  return apiFetch("/parkings");
}

export async function getMyParkings(): Promise<Parking[]> {
  return apiFetch("/parkings/mine");
}

export async function createParking(
  parking: CreateParkingDto,
): Promise<Parking> {
  return apiFetch("/parkings", {
    method: "POST",
    body: JSON.stringify(parking),
  });
}

export async function updateParking(
  parkingId: number,
  parking: CreateParkingDto,
): Promise<Parking> {
  return apiFetch(`/parkings/${parkingId}`, {
    method: "PATCH",
    body: JSON.stringify(parking),
  });
}

export async function updateParkingActive(
  parkingId: number,
  active: boolean,
): Promise<Parking> {
  return apiFetch(`/parkings/${parkingId}/active`, {
    method: "PATCH",
    body: JSON.stringify({ active }),
  });
}

export async function getAvailableParkings(
  startDatetime: string,
  endDatetime: string,
  latitude: number,
  longitude: number,
  radius: number,
): Promise<Parking[]> {
  return apiFetch(
    `/parkings/available?startDatetime=${encodeURIComponent(
      startDatetime,
    )}&endDatetime=${encodeURIComponent(
      endDatetime,
    )}&latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
  );
}

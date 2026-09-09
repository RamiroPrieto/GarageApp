import { apiFetch } from "./api";
import { CreateParkingDto, Parking } from "../types/garage.types";

export async function getParkings(): Promise<Parking[]> {
  return apiFetch("/parkings");
}

export async function createParking(
  parking: CreateParkingDto,
): Promise<Parking> {
  return apiFetch("/parkings", {
    method: "POST",
    body: JSON.stringify(parking),
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

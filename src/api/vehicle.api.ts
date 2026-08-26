import { apiFetch } from "./api";
import { Vehicle } from "../types/vehicle.type";

export async function getMyVehicles(): Promise<Vehicle[]> {
  return apiFetch("/vehicles");
}
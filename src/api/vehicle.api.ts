import { apiFetch } from "./api";
import { Vehicle, VehicleInput } from "../types/vehicle.type";

export async function getMyVehicles(): Promise<Vehicle[]> {
  return apiFetch("/vehicles");
}

export async function createVehicle(vehicle: VehicleInput): Promise<Vehicle> {
  return apiFetch("/vehicles", { method: "POST", body: JSON.stringify(vehicle) });
}

export async function updateVehicle(vehicleId: number, vehicle: VehicleInput): Promise<Vehicle> {
  return apiFetch(`/vehicles/${vehicleId}`, { method: "PATCH", body: JSON.stringify(vehicle) });
}

export async function updateVehicleDefault(vehicleId: number, isDefault: boolean): Promise<Vehicle> {
  return apiFetch(`/vehicles/${vehicleId}/default`, { method: "PATCH", body: JSON.stringify({ isDefault }) });
}

export async function deleteVehicle(vehicleId: number): Promise<void> {
  await apiFetch(`/vehicles/${vehicleId}`, { method: "DELETE" });
}

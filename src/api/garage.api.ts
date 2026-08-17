import { apiFetch } from "./api";
import { Garage } from "../types/garage.types";

export async function getGarages(): Promise<Garage[]> {
  return apiFetch("/parkings");
}
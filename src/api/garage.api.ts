import { garages } from "../mocks/garages";

export async function getGarages() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return garages;
}
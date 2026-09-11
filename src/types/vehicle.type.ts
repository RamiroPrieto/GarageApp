export interface Vehicle {
    id: number;
    brand: string | null;
    model: string | null;
    licensePlate: string;
    color: string | null;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
  }

export type VehicleInput = {
  licensePlate: string;
  brand?: string;
  model?: string;
  color?: string;
};

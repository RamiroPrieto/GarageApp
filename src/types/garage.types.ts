export enum ParkingType {
  Garage = "GARAGE",
}

export type CreateParkingDto = {
  title: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  pricePerHour: number;
  pricePerDay?: number;
  maxHeight?: number;
  maxWidth?: number;
  covered?: boolean;
  parkingType: ParkingType;
};

export interface Parking {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  address: string;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  pricePerHour: string;
  pricePerDay: string;
  maxHeight: string;
  maxWidth: string;
  covered: boolean;
  parkingType: ParkingType;
  parkingStatus: string;
  active: boolean;
  availableSince: string | null;
  createdAt: string;
  updatedAt: string;
}

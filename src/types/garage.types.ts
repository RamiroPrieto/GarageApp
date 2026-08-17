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
  parkingType: string;
  parkingStatus: string;
  active: boolean;
  availableSince: string | null;
  createdAt: string;
  updatedAt: string;
}
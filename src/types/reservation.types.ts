import { Parking } from "./garage.types";
import { Currency } from "./garage.types";
import { Vehicle } from "./vehicle.type";

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ACTIVE"
  | "CANCELLED"
  | "COMPLETED"
  | "EXPIRED";

export type Reservation = {
  id: number;
  parkingId: number;
  userId: number;
  vehicleId: number | null;
  startDatetime: string;
  endDatetime: string;
  totalPrice: string | number;
  currency: Currency;
  status: ReservationStatus;
  expiresAt?: string | null;
  createdAt: string;
  customerStartedAt?: string | null;
  ownerStartedAt?: string | null;
  startedAt?: string | null;
  user?: { id: number; firstName: string; lastName: string; email?: string };
  parking?: Parking;
  vehicle?: Vehicle | null;
};

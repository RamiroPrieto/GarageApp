import { Parking } from "./garage.types";
import { Vehicle } from "./vehicle.type";

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "EXPIRED";

export type Reservation = {
  id: number;
  parkingId: number;
  vehicleId: number | null;
  startDatetime: string;
  endDatetime: string;
  totalPrice: string | number;
  status: ReservationStatus;
  createdAt: string;
  parking?: Parking;
  vehicle?: Vehicle | null;
};

import { Parking } from "../../types/garage.types";

export interface ParkingCardProps {
  parking: Parking;
  onClose: () => void;
  onReserve: (parking: Parking) => void;
}
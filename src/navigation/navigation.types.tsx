import { NavigatorScreenParams } from "@react-navigation/native";
import { Parking } from "../types/garage.types";
import { Vehicle } from "../types/vehicle.type";

export type MainTabParamList = {
  Home: undefined;
  Reservations: { reservationId?: number } | undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Search: undefined;
  CreateParking: undefined;
  MyParkings: undefined;
  EditParking: {
    parking: Parking;
  };
  MyVehicles: undefined;
  CreateVehicle: undefined;
  EditVehicle: {
    vehicle: Vehicle;
  };
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Reservation: {
    parking: Parking;
    startDatetime: string;
    endDatetime: string;
  };
  Payment: {
    reservationId: number;
  };
  BuyCredits: undefined;
  EditProfile: undefined;
  Support: undefined;
  Terms: undefined;
  OwnerBookings: undefined;
  BookingDetails: { reservationId: number };
  ReservationResult: {
    success: boolean;
  };
};

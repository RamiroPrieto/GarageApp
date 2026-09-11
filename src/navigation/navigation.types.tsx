import { NavigatorScreenParams } from "@react-navigation/native";
import { Parking } from "../types/garage.types";
import { Vehicle } from "../types/vehicle.type";

export type MainTabParamList = {
  Home: undefined;
  Reservations: undefined;
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
    parkingId: number;
    startDatetime: string;
    endDatetime: string;
  };
  Payment: {
    reservationId: number;
  };
  ReservationResult: {
    success: boolean;
  };
};

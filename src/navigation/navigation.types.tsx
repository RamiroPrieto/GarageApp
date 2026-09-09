import { NavigatorScreenParams } from "@react-navigation/native";

export type MainTabParamList = {
  Home: undefined;
  Reservations: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Search: undefined;
  CreateParking: undefined;
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

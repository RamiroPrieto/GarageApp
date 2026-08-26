export type RootStackParamList = {
    Login: undefined;

    Search: undefined;

    Home: {
      vehicleId: number;
      startDatetime: string;
      endDatetime: string;
    };

    Reservation: {
      parkingId: number;
      vehicleId: number;
      startDatetime: string;
      endDatetime: string;
    };

    Payment: {
      reservationId: number;
    };
  };
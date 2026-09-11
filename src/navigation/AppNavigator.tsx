import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginScreen } from "../screens/Login";
import { useAuth } from "../context/AuthContext";
import { PaymentScreen } from "../screens/Payment/PaymentScreen";
import { ReservationScreen } from "../screens/Reservation";
import { RootStackParamList } from "./navigation.types";
import { ReservationResultScreen } from "../screens/ReservationResult/ReservationResultScreen";
import { BottomTabNavigator } from "./BottomTabNavigator";
import { CreateParkingScreen } from "../screens/CreateParking";
import { EditParkingScreen } from "../screens/EditParking";
import { MyParkingsScreen } from "../screens/MyParkings";
import { CreateVehicleScreen } from "../screens/CreateVehicle";
import { EditVehicleScreen } from "../screens/EditVehicle";
import { MyVehiclesScreen } from "../screens/MyVehicles";


const Stack =
  createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
      )}
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
      />
      <Stack.Screen
        name="Reservation"
        component={ReservationScreen}
      />
      <Stack.Screen
        name="ReservationResult"
        component={ReservationResultScreen}
      />
      <Stack.Screen
        name="CreateParking"
        component={CreateParkingScreen}
      />
      <Stack.Screen name="MyParkings" component={MyParkingsScreen} />
      <Stack.Screen name="EditParking" component={EditParkingScreen} />
      <Stack.Screen name="MyVehicles" component={MyVehiclesScreen} />
      <Stack.Screen name="CreateVehicle" component={CreateVehicleScreen} />
      <Stack.Screen name="EditVehicle" component={EditVehicleScreen} />
    </Stack.Navigator>
  );
}

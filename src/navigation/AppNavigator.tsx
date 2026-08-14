import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginScreen } from "../screens/Login";
import { HomeScreen } from "../screens/Home";
import { useAuth } from "../context/AuthContext";
import { PaymentScreen } from "../screens/Payment/PaymentScreen";

import { RootStackParamList } from "./navigation.types";

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
        <Stack.Screen
          name="Home"
          component={PaymentScreen}
        />
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
    </Stack.Navigator>
  );
}
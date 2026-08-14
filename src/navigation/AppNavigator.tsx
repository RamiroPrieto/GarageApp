import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginScreen } from "../screens/Login";
import { HomeScreen } from "../screens/Home"
import { RootStackParamList } from "./navigation.types";
import { TestApiScreen } from "../screens/TestApi";
const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        name="TestApi"
        component={TestApiScreen}
      />
    </Stack.Navigator>
  );
}
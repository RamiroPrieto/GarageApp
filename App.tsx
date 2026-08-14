import { NavigationContainer } from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";

import { AppNavigator } from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";

export default function App() {
  return (
    <StripeProvider
      publishableKey={
        process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      }
    >
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </StripeProvider>
  );
}
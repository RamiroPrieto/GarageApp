import { NavigationContainer } from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { I18nProvider } from "./src/context/I18nContext";
import { DialogProvider } from "./src/context/DialogContext";

export default function App() {

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium, 
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <StripeProvider
      publishableKey={
        process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      }
    >
      <I18nProvider>
        <DialogProvider><AuthProvider><NavigationContainer><AppNavigator /></NavigationContainer></AuthProvider></DialogProvider>
      </I18nProvider>
    </StripeProvider>
  );
}

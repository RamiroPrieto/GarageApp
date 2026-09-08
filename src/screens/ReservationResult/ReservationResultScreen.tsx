import { View, Text } from "react-native";

import {
  RouteProp,
  useNavigation,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../navigation/navigation.types";

import { globalStyles } from "../../theme/global.styles";

import { Button } from "../../components/Button";

import { styles } from "./ReservationResult.styles";

type ReservationResultRouteProp = RouteProp<
  RootStackParamList,
  "ReservationResult"
>;

interface Props {
  route: ReservationResultRouteProp;
}
type ReservationResultNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ReservationResult"
>;

export function ReservationResultScreen({
  route,
}: Props) {
  const { success } = route.params;

  const navigation = useNavigation<ReservationResultNavigationProp>();

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "MainTabs",
          params: { screen: "Home" },
        },
      ],
    });
  };

  return (
    <View style={globalStyles.screen}>
      <View style={styles.container}>
        <Text style={styles.icon}>
          {success ? "✓" : "✕"}
        </Text>

        <Text style={styles.title}>
          {success
            ? "Prenotazione confermata"
            : "Prenotazione non completata"}
        </Text>

        <Text style={styles.description}>
          {success
            ? "Il tuo parcheggio è stato prenotato correttamente."
            : "Il pagamento non è stato completato. Puoi provare di nuovo."}
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Torna alla home"
            onPress={handleGoHome}
          />
        </View>
      </View>
    </View>
  );
}

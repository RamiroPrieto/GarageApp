import { Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { createParking } from "../../api/garage.api";
import { RootStackParamList } from "../../navigation/navigation.types";
import { ParkingForm } from "./ParkingForm";

type Props = NativeStackScreenProps<RootStackParamList, "CreateParking">;

export function CreateParkingScreen({ navigation }: Props) {
  return (
    <ParkingForm
      title="Publicar mi estacionamiento"
      submitLabel="Publicar"
      onBack={() => navigation.goBack()}
      onSubmit={createParking}
      onSuccess={() => Alert.alert("Estacionamiento publicado", "Tu estacionamiento ya está disponible.", [{ text: "Aceptar", onPress: () => navigation.navigate("MyParkings") }])}
    />
  );
}

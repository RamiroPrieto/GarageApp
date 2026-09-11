import { Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { updateParking } from "../../api/garage.api";
import { ParkingForm } from "../CreateParking/ParkingForm";
import { RootStackParamList } from "../../navigation/navigation.types";

type Props = NativeStackScreenProps<RootStackParamList, "EditParking">;

export function EditParkingScreen({ navigation, route }: Props) {
  const { parking } = route.params;

  return (
    <ParkingForm
      initialParking={parking}
      title="Editar estacionamiento"
      submitLabel="Guardar cambios"
      onBack={() => navigation.goBack()}
      onSubmit={(values) => updateParking(parking.id, values)}
      onSuccess={() => Alert.alert("Cambios guardados", "Tu estacionamiento fue actualizado.", [{ text: "Aceptar", onPress: () => navigation.goBack() }])}
    />
  );
}

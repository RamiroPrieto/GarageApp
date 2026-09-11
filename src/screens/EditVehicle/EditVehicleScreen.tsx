import { Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { updateVehicle } from "../../api/vehicle.api";
import { VehicleForm } from "../CreateVehicle/VehicleForm";
import { RootStackParamList } from "../../navigation/navigation.types";
import { useI18n } from "../../context/I18nContext";

type Props = NativeStackScreenProps<RootStackParamList, "EditVehicle">;

export function EditVehicleScreen({ navigation, route }: Props) {
  const { vehicle } = route.params;
  const { t } = useI18n();
  return <VehicleForm vehicle={vehicle} title={t("management.editVehicle")} submitLabel={t("management.saveChanges")} onBack={() => navigation.goBack()} onSubmit={(values) => updateVehicle(vehicle.id, values)} onSuccess={() => Alert.alert(t("management.changesSaved"), t("management.vehicleUpdated"), [{ text: t("settings.cancel"), onPress: () => navigation.goBack() }])} />;
}

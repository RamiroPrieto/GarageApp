import { Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { createVehicle } from "../../api/vehicle.api";
import { RootStackParamList } from "../../navigation/navigation.types";
import { VehicleForm } from "./VehicleForm";
import { useI18n } from "../../context/I18nContext";

type Props = NativeStackScreenProps<RootStackParamList, "CreateVehicle">;

export function CreateVehicleScreen({ navigation }: Props) {
  const { t } = useI18n();
  return <VehicleForm title={t("management.addVehicle")} submitLabel={t("management.saveVehicle")} onBack={() => navigation.goBack()} onSubmit={createVehicle} onSuccess={() => Alert.alert(t("management.vehicleAdded"), t("management.vehicleSaved"), [{ text: t("settings.cancel"), onPress: () => navigation.goBack() }])} />;
}

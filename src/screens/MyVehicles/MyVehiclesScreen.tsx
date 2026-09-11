import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { deleteVehicle, getMyVehicles, updateVehicleDefault } from "../../api/vehicle.api";
import { RootStackParamList } from "../../navigation/navigation.types";
import { colors } from "../../theme/colors";
import { Vehicle } from "../../types/vehicle.type";
import { styles } from "./MyVehicles.styles";

type Props = NativeStackScreenProps<RootStackParamList, "MyVehicles">;

const vehicleName = (vehicle: Vehicle) => [vehicle.brand, vehicle.model].filter(Boolean).join(" ") || "Vehículo sin modelo";

export function MyVehiclesScreen({ navigation }: Props) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadVehicles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setVehicles(await getMyVehicles());
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudieron cargar tus vehículos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { void loadVehicles(); }, [loadVehicles]));

  const changeDefault = async (vehicle: Vehicle, isDefault: boolean) => {
    const previous = vehicles;
    setUpdatingId(vehicle.id);
    setVehicles((current) => current.map((item) => ({ ...item, isDefault: isDefault ? item.id === vehicle.id : item.id === vehicle.id ? false : item.isDefault })));
    try {
      await updateVehicleDefault(vehicle.id, isDefault);
    } catch (caughtError) {
      setVehicles(previous);
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo actualizar el vehículo predeterminado.");
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDelete = (vehicle: Vehicle) => {
    Alert.alert("Eliminar vehículo", `¿Eliminar ${vehicleName(vehicle)} (${vehicle.licensePlate})? Las reservas existentes conservarán su historial.`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try {
          setUpdatingId(vehicle.id);
          await deleteVehicle(vehicle.id);
          setVehicles((current) => current.filter((item) => item.id !== vehicle.id));
        } catch (caughtError) {
          setError(caughtError instanceof Error ? caughtError.message : "No se pudo eliminar el vehículo.");
        } finally {
          setUpdatingId(null);
        }
      } },
    ]);
  };

  const addButton = <Pressable style={styles.addButton} onPress={() => navigation.navigate("CreateVehicle")}><Text style={styles.addText}>+ Agregar vehículo</Text></Pressable>;

  return <SafeAreaView style={styles.safeArea} edges={["top"]}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><View style={styles.header}><Pressable onPress={() => navigation.goBack()} style={styles.backButton} accessibilityLabel="Volver"><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable><View><Text style={styles.title}>Mis vehículos</Text><Text style={styles.subtitle}>Gestioná tus vehículos y elegí el predeterminado.</Text></View></View>{isLoading ? <View style={styles.empty}><ActivityIndicator size="large" color={colors.primary} /></View> : vehicles.length === 0 ? <View style={styles.empty}><Ionicons name="car-outline" size={44} color={colors.textSecondary} /><Text style={styles.emptyTitle}>Todavía no agregaste vehículos</Text><Text style={styles.emptyText}>Agregá un vehículo para usarlo en tus reservas.</Text>{addButton}</View> : <>{error && <Text style={styles.error}>{error}</Text>}{vehicles.map((vehicle) => <View key={vehicle.id} style={styles.card}><Text style={styles.vehicleName}>{vehicleName(vehicle)}</Text><Text style={styles.plate}>{vehicle.licensePlate}</Text><View style={styles.actions}><View style={styles.defaultRow}><Text style={styles.defaultLabel}>Predeterminado</Text><Switch value={vehicle.isDefault} onValueChange={(value) => void changeDefault(vehicle, value)} disabled={updatingId === vehicle.id} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.text} /></View><View style={styles.actionButtons}><Pressable style={styles.editButton} onPress={() => navigation.navigate("EditVehicle", { vehicle })}><Text style={styles.editText}>Editar</Text></Pressable><Pressable style={styles.deleteButton} disabled={updatingId === vehicle.id} onPress={() => confirmDelete(vehicle)}><Text style={styles.deleteText}>Eliminar</Text></Pressable></View></View></View>)}{addButton}</>}{!isLoading && vehicles.length === 0 && error && <Text style={styles.error}>{error}</Text>}</ScrollView></SafeAreaView>;
}

import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getMyParkings, updateParkingActive } from "../../api/garage.api";
import { RootStackParamList } from "../../navigation/navigation.types";
import { colors } from "../../theme/colors";
import { Parking } from "../../types/garage.types";
import { styles } from "./MyParkings.styles";

type Props = NativeStackScreenProps<RootStackParamList, "MyParkings">;

export function MyParkingsScreen({ navigation }: Props) {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadParkings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setParkings(await getMyParkings());
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudieron cargar tus estacionamientos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { void loadParkings(); }, [loadParkings]));

  const changeActive = async (parking: Parking, active: boolean) => {
    const previous = parkings;
    setUpdatingId(parking.id);
    setParkings((current) => current.map((item) => item.id === parking.id ? { ...item, active } : item));
    try {
      await updateParkingActive(parking.id, active);
    } catch (caughtError) {
      setParkings(previous);
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo actualizar el estado.");
    } finally {
      setUpdatingId(null);
    }
  };

  const addButton = <Pressable style={styles.addButton} onPress={() => navigation.navigate("CreateParking")}><Text style={styles.addText}>+ Agregar estacionamiento</Text></Pressable>;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}><Pressable onPress={() => navigation.goBack()} style={styles.backButton} accessibilityLabel="Volver"><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable><View><Text style={styles.title}>Mis estacionamientos</Text><Text style={styles.subtitle}>Gestioná los espacios que publicaste.</Text></View></View>
        {isLoading ? <View style={styles.empty}><ActivityIndicator size="large" color={colors.primary} /></View> : parkings.length === 0 ? <View style={styles.empty}><Ionicons name="car-outline" size={44} color={colors.textSecondary} /><Text style={styles.emptyTitle}>Todavía no publicaste estacionamientos</Text><Text style={styles.emptyText}>Agregá tu primer espacio para empezar a recibir reservas.</Text>{addButton}</View> : <>
          {error && <Text style={styles.error}>{error}</Text>}
          {parkings.map((parking) => <View key={parking.id} style={styles.card}><Text style={styles.cardTitle}>{parking.title}</Text><Text style={styles.address}>{[parking.address, parking.city, parking.country].filter(Boolean).join(", ")}</Text><Text style={styles.price}>${Number(parking.pricePerHour).toFixed(2)} / hora</Text><View style={styles.actions}><View style={styles.switchRow}><Text style={styles.activeLabel}>{parking.active ? "Activo" : "Inactivo"}</Text><Switch value={parking.active} onValueChange={(value) => void changeActive(parking, value)} disabled={updatingId === parking.id} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.text} /></View><Pressable style={styles.editButton} onPress={() => navigation.navigate("EditParking", { parking })}><Text style={styles.editText}>Editar</Text></Pressable></View></View>)}
          {addButton}
        </>}
        {!isLoading && parkings.length === 0 && error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

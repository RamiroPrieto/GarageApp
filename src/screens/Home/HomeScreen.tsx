import { View, Text, ActivityIndicator, Pressable } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getAvailableParkings } from "../../api/garage.api";
import { Parking } from "../../types/garage.types";
import { ParkingCard } from "../../components/ParkingCard/ParkingCard";
import { globalStyles } from "../../theme/global.styles";
import { useUserLocation } from "../../hooks/useUserLocation";
import { MainTabParamList, RootStackParamList } from "../../navigation/navigation.types";
import { styles } from "./Home.Styles";
import { colors } from "../../theme/colors";
import { getMyReservations } from "../../api/reservation.api";
import { Reservation } from "../../types/reservation.types";
import { UpcomingReservationCard } from "../../components/UpcomingReservationCard";
import { useI18n } from "../../context/I18nContext";

const FALLBACK_LOCATION = {
  latitude: 45.0703,
  longitude: 7.6869,
};

type HomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, "Home">,
  NativeStackNavigationProp<RootStackParamList>
>;

function getDefaultReservationWindow() {
  const startDatetime = new Date();
  const endDatetime = new Date(startDatetime);
  endDatetime.setHours(endDatetime.getHours() + 1);

  return {
    startDatetime: startDatetime.toISOString(),
    endDatetime: endDatetime.toISOString(),
  };
}

export function HomeScreen() {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [selectedParking, setSelectedParking] = useState<Parking | null>(null);
  const [upcomingReservation, setUpcomingReservation] = useState<Reservation | null>(null);
  const navigation = useNavigation<HomeNavigationProp>();
  const { t } = useI18n();
  const { location, error } = useUserLocation();
  const mapLocation = location ?? (error ? FALLBACK_LOCATION : null);
  const reservationWindow = useMemo(() => getDefaultReservationWindow(), []);

  useEffect(() => {
    if (!mapLocation) return;
    const loadParkings = async () => {
      try {
        const data = await getAvailableParkings(
          reservationWindow.startDatetime,
          reservationWindow.endDatetime,
          mapLocation.latitude,
          mapLocation.longitude,
          5,
        );
        setParkings(data);
      } catch (loadError) { console.log("ERROR CARGANDO PARKINGS:", loadError); }
    };
    loadParkings();
  }, [mapLocation, reservationWindow]);

  useEffect(() => {
    const loadUpcomingReservation = async () => {
      try {
        const now = new Date();
        const reservations = await getMyReservations();
        const upcoming = reservations
          .filter((reservation) => reservation.status === "CONFIRMED" && new Date(reservation.endDatetime) >= now)
          .sort((a, b) => new Date(a.startDatetime).getTime() - new Date(b.startDatetime).getTime())[0] ?? null;
        setUpcomingReservation(upcoming);
      } catch (loadError) {
        console.log("ERROR CARGANDO PRÓXIMA RESERVA:", loadError);
      }
    };
    void loadUpcomingReservation();
  }, []);

  if (!mapLocation) return <View style={[globalStyles.map, globalStyles.center]}><ActivityIndicator size="large" color={colors.primary} /></View>;
  return <View style={globalStyles.map}>
    <MapView
      style={{ flex: 1 }}
      provider={PROVIDER_GOOGLE}
      mapType="standard"
      initialRegion={{
        latitude: mapLocation.latitude,
        longitude: mapLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
    >
      {parkings.map((parking) => <Marker key={parking.id} coordinate={{ latitude: Number(parking.latitude), longitude: Number(parking.longitude) }} onPress={() => setSelectedParking(parking)} pinColor={colors.primary} />)}
    </MapView>
    <View style={styles.header}><View><Text style={styles.city}>TORINO, ITALIA</Text><Text style={styles.title}>{t("home.nearbyParking")}</Text></View><Pressable style={styles.searchButton} onPress={() => navigation.goBack()}><Ionicons name="search-outline" size={20} color={colors.textSecondary} /></Pressable></View>
    {selectedParking && <ParkingCard parking={selectedParking} onClose={() => setSelectedParking(null)} onReserve={(parking) => navigation.navigate("Reservation", { parkingId: parking.id, startDatetime: reservationWindow.startDatetime, endDatetime: reservationWindow.endDatetime })} />}
    {upcomingReservation && !selectedParking && <UpcomingReservationCard reservation={upcomingReservation} onPress={() => navigation.navigate("Reservations")} />}
  </View>;
}

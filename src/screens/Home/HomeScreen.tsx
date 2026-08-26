import { View, Text, ActivityIndicator, Pressable } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getAvailableParkings } from "../../api/garage.api";
import { Parking } from "../../types/garage.types";
import { ParkingCard } from "../../components/ParkingCard/ParkingCard";
import { globalStyles } from "../../theme/global.styles";
import { useUserLocation } from "../../hooks/useUserLocation";
import { RootStackParamList } from "../../navigation/navigation.types";
import { styles } from "./Home.Styles";
import { colors } from "../../theme/colors";

type HomeScreenRouteProp = RouteProp<RootStackParamList, "Home">;
type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;
const mapStyle = [{ elementType: "geometry", stylers: [{ color: "#101218" }] }, { elementType: "labels.text.fill", stylers: [{ color: "#636b7f" }] }, { elementType: "labels.text.stroke", stylers: [{ color: "#101218" }] }, { featureType: "road", elementType: "geometry", stylers: [{ color: "#191c25" }] }, { featureType: "water", elementType: "geometry", stylers: [{ color: "#090b10" }] }, { featureType: "poi", stylers: [{ visibility: "off" }] }];

export function HomeScreen() {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [selectedParking, setSelectedParking] = useState<Parking | null>(null);
  const navigation = useNavigation<HomeNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();
  const { location } = useUserLocation();
  const { vehicleId, startDatetime, endDatetime } = route.params;

  useEffect(() => {
    if (!location) return;
    const loadParkings = async () => {
      try {
        const data = await getAvailableParkings(startDatetime, endDatetime, location.latitude, location.longitude, 5);
        setParkings(data);
      } catch (error) { console.log("ERROR CARGANDO PARKINGS:", error); }
    };
    loadParkings();
  }, [startDatetime, endDatetime, location]);

  if (!location) return <View style={[globalStyles.map, globalStyles.center]}><ActivityIndicator size="large" color={colors.primary} /></View>;
  return <View style={globalStyles.map}>
    <MapView style={{ flex: 1 }} provider={PROVIDER_GOOGLE} customMapStyle={mapStyle} initialRegion={{ latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 }}>
      {parkings.map((parking) => <Marker key={parking.id} coordinate={{ latitude: Number(parking.latitude), longitude: Number(parking.longitude) }} onPress={() => setSelectedParking(parking)} pinColor={colors.primary} />)}
    </MapView>
    <View style={styles.header}><View><Text style={styles.city}>TORINO, ITALIA</Text><Text style={styles.title}>Parkings disponibles</Text></View><Pressable style={styles.searchButton} onPress={() => navigation.goBack()}><Ionicons name="search-outline" size={20} color={colors.textSecondary} /></Pressable></View>
    {!selectedParking && <View style={styles.count}><Text style={styles.countText}>{parkings.length} parkings cerca tuyo</Text></View>}
    {selectedParking && <ParkingCard parking={selectedParking} onClose={() => setSelectedParking(null)} onReserve={(parking) => navigation.navigate("Reservation", { parkingId: parking.id, vehicleId, startDatetime, endDatetime })} />}
  </View>;
}

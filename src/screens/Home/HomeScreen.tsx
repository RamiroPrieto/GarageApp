import { View, Text, ActivityIndicator, Pressable, TextInput } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CompositeNavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { autocompleteAddresses, getAvailableParkings, getPlaceDetails, PlaceSuggestion, reverseGeocodeLocation } from "../../api/garage.api";
import { Parking } from "../../types/garage.types";
import { ParkingCard } from "../../components/ParkingCard/ParkingCard";
import { globalStyles } from "../../theme/global.styles";
import { useUserLocation } from "../../hooks/useUserLocation";
import { MainTabParamList, RootStackParamList } from "../../navigation/navigation.types";
import { styles } from "./Home.Styles";
import { colors } from "../../theme/colors";
import { getUpcomingReservation } from "../../api/reservation.api";
import { Reservation } from "../../types/reservation.types";
import { UpcomingReservationCard } from "../../components/UpcomingReservationCard";
import { useI18n } from "../../context/I18nContext";
import { useAuth } from "../../context/AuthContext";

const FALLBACK_LOCATION = { latitude: 45.0703, longitude: 7.6869 };
type Coordinates = typeof FALLBACK_LOCATION;
type HomeNavigationProp = CompositeNavigationProp<BottomTabNavigationProp<MainTabParamList, "Home">, NativeStackNavigationProp<RootStackParamList>>;

function getDefaultReservationWindow() {
  const startDatetime = new Date();
  const endDatetime = new Date(startDatetime);
  endDatetime.setHours(endDatetime.getHours() + 1);
  return { startDatetime: startDatetime.toISOString(), endDatetime: endDatetime.toISOString() };
}

export function HomeScreen() {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [selectedParking, setSelectedParking] = useState<Parking | null>(null);
  const [upcomingReservation, setUpcomingReservation] = useState<Reservation | null>(null);
  const [upcomingDismissed, setUpcomingDismissed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [addressQuery, setAddressQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [searchLocation, setSearchLocation] = useState<Coordinates | null>(null);
  const [mapLocationLabel, setMapLocationLabel] = useState<string | null>(null);
  const [isSearchingAddresses, setIsSearchingAddresses] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [selectingAddress, setSelectingAddress] = useState(false);
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation<HomeNavigationProp>();
  const { t, language } = useI18n();
  const { user, refreshUser } = useAuth();
  const { location, error } = useUserLocation();
  const mapLocation = searchLocation ?? location ?? (error ? FALLBACK_LOCATION : null);
  const reservationWindow = useMemo(() => getDefaultReservationWindow(), []);

  useEffect(() => {
    if (!mapLocation) return;
    void getAvailableParkings(reservationWindow.startDatetime, reservationWindow.endDatetime, mapLocation.latitude, mapLocation.longitude, 5)
      .then(setParkings)
      .catch((loadError) => console.log("ERROR CARGANDO PARKINGS:", loadError));
  }, [mapLocation, reservationWindow]);

  useEffect(() => {
    if (!mapLocation) return;
    let active = true;
    setMapLocationLabel(null);
    void reverseGeocodeLocation(mapLocation)
      .then(({ city, country }) => {
        if (active) setMapLocationLabel(`${city}, ${country}`.toUpperCase());
      })
      .catch(() => {
        if (active) setMapLocationLabel(null);
      });
    return () => { active = false; };
  }, [mapLocation?.latitude, mapLocation?.longitude]);

  useEffect(() => {
    if (!searchOpen || addressQuery.trim().length < 3) {
      setSuggestions([]);
      setIsSearchingAddresses(false);
      setSearchError(false);
      return;
    }
    let active = true;
    const timeout = setTimeout(() => {
      setIsSearchingAddresses(true);
      setSearchError(false);
      void autocompleteAddresses(addressQuery.trim(), {
        ...mapLocation,
        languageCode: language === "es" ? "es-419" : language,
      }).then((items) => {
        if (active) setSuggestions(items);
      }).catch(() => {
        if (!active) return;
        setSuggestions([]);
        setSearchError(true);
      }).finally(() => {
        if (active) setIsSearchingAddresses(false);
      });
    }, 300);
    return () => { active = false; clearTimeout(timeout); };
  }, [addressQuery, searchOpen, mapLocation, language]);

  useEffect(() => {
    void getUpcomingReservation().then(setUpcomingReservation)
      .catch((loadError) => console.log("ERROR CARGANDO PRÓXIMA RESERVA:", loadError));
  }, []);
  useFocusEffect(useCallback(() => { void refreshUser().catch(() => undefined); }, [refreshUser]));

  const selectAddress = async (suggestion: PlaceSuggestion) => {
    try {
      setSelectingAddress(true);
      const place = await getPlaceDetails(suggestion.placeId);
      const target = { latitude: place.latitude, longitude: place.longitude };
      setAddressQuery(place.formattedAddress);
      setSuggestions([]);
      setSearchLocation(target);
      setSearchOpen(false);
      mapRef.current?.animateToRegion({ ...target, latitudeDelta: 0.02, longitudeDelta: 0.02 }, 350);
    } catch (searchError) { console.log("ERROR OBTENIENDO DIRECCIÓN:", searchError); }
    finally { setSelectingAddress(false); }
  };

  if (!mapLocation) return <View style={[globalStyles.map, globalStyles.center]}><ActivityIndicator size="large" color={colors.primary} /></View>;
  return <View style={globalStyles.map}>
    <MapView ref={mapRef} style={{ flex: 1 }} provider={PROVIDER_GOOGLE} mapType="standard" initialRegion={{ ...mapLocation, latitudeDelta: 0.02, longitudeDelta: 0.02 }}>
      {parkings.map((parking) => <Marker key={parking.id} coordinate={{ latitude: Number(parking.latitude), longitude: Number(parking.longitude) }} onPress={() => setSelectedParking(parking)} pinColor={colors.primary} />)}
    </MapView>
    <View style={styles.header}>
      {searchOpen ? <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
        <TextInput autoFocus value={addressQuery} onChangeText={setAddressQuery} placeholder={t("home.searchAddress")} placeholderTextColor={colors.textMuted} style={styles.searchInput} autoCorrect={false} />
        <Pressable onPress={() => { setSearchOpen(false); setAddressQuery(""); setSuggestions([]); setSearchError(false); }} hitSlop={8}><Ionicons name="close" size={20} color={colors.textSecondary} /></Pressable>
        {(isSearchingAddresses || suggestions.length > 0 || selectingAddress || searchError || addressQuery.trim().length >= 3) && <View style={styles.suggestions}>
          {(isSearchingAddresses || selectingAddress) && <View style={styles.suggestionStatus}><ActivityIndicator color={colors.primary} /></View>}
          {!isSearchingAddresses && !selectingAddress && suggestions.map((suggestion) => <Pressable key={suggestion.placeId} style={styles.suggestion} onPress={() => void selectAddress(suggestion)}><Ionicons name="location-outline" size={18} color={colors.accent} /><Text style={styles.suggestionText}>{suggestion.description}</Text></Pressable>)}
          {!isSearchingAddresses && !selectingAddress && suggestions.length === 0 && <View style={styles.suggestionStatus}><Text style={styles.suggestionStatusText}>{t(searchError ? "home.searchUnavailable" : "home.noAddressResults")}</Text></View>}
        </View>}
      </View> : <><View><Text style={styles.city}>{mapLocationLabel ?? ""}</Text><Text style={styles.title}>{t("home.nearbyParking")}</Text></View><View style={styles.headerActions}><Pressable style={styles.creditsButton} onPress={() => navigation.navigate("BuyCredits")}><Text style={styles.creditsText}>🪙 {user?.creditBalance ?? 0}</Text><Text style={styles.creditsPlus}>+</Text></Pressable><Pressable style={styles.searchButton} onPress={() => setSearchOpen(true)}><Ionicons name="search-outline" size={20} color={colors.textSecondary} /></Pressable></View></>}
    </View>
    {selectedParking && <ParkingCard parking={selectedParking} onClose={() => setSelectedParking(null)} onReserve={(parking) => navigation.navigate("Reservation", { parking, startDatetime: reservationWindow.startDatetime, endDatetime: reservationWindow.endDatetime })} />}
    {upcomingReservation && !upcomingDismissed && !selectedParking && <UpcomingReservationCard reservation={upcomingReservation} onClose={() => setUpcomingDismissed(true)} onPress={() => navigation.navigate("Reservations", { reservationId: upcomingReservation.id })} />}
  </View>;
}

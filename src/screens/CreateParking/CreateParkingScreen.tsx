import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createParking } from "../../api/garage.api";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { RootStackParamList } from "../../navigation/navigation.types";
import { colors } from "../../theme/colors";
import { CreateParkingDto, ParkingType } from "../../types/garage.types";
import { styles } from "./CreateParking.styles";
import appConfig from "../../../app.json";

type Props = NativeStackScreenProps<RootStackParamList, "CreateParking">;
type FormValues = Record<
  "title" | "description" | "address" | "city" | "country" | "pricePerHour" | "pricePerDay" | "maxHeight" | "maxWidth",
  string
>;

const initialValues: FormValues = {
  title: "", description: "", address: "", city: "", country: "",
  pricePerHour: "", pricePerDay: "", maxHeight: "", maxWidth: "",
};

const parkingTypes = Object.values(ParkingType);
const googleMapsApiKey = appConfig.expo.android.config.googleMaps.apiKey;

type Coordinates = {
  latitude: number;
  longitude: number;
};

type GoogleGeocodingResponse = {
  error_message?: string;
  results: Array<{
    geometry?: {
      location?: {
        lat?: number;
        lng?: number;
      };
    };
  }>;
  status: string;
};

export function CreateParkingScreen({ navigation }: Props) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues | "parkingType", string>>>({});
  const [covered, setCovered] = useState(false);
  const [parkingType, setParkingType] = useState<ParkingType>(ParkingType.Garage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const updateValue = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (field === "address" || field === "city" || field === "country") {
      setCoordinates(null);
      setLocationError(null);
    }
  };

  const parseOptionalNumber = (value: string) =>
    value.trim() === "" ? undefined : Number(value);

  const handleGetLocation = async () => {
    const addressFields: Array<keyof FormValues> = ["address", "city", "country"];
    const nextErrors: Partial<Record<keyof FormValues | "parkingType", string>> = {};
    addressFields.forEach((field) => {
      if (!values[field].trim()) nextErrors[field] = "Este campo es obligatorio.";
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors((current) => ({ ...current, ...nextErrors }));
      setCoordinates(null);
      setLocationError("Completá dirección, ciudad y país para obtener la ubicación.");
      return;
    }

    try {
      setIsGeocoding(true);
      setCoordinates(null);
      setLocationError(null);
      const address = [values.address.trim(), values.city.trim(), values.country.trim()].join(", ");
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${encodeURIComponent(googleMapsApiKey)}`;
      const response = await fetch(url);
      const data: GoogleGeocodingResponse = await response.json();
      const location = data.results[0]?.geometry?.location;

      if (
        !response.ok ||
        data.status !== "OK" ||
        !location ||
        typeof location.lat !== "number" ||
        typeof location.lng !== "number"
      ) {
        if (data.status === "ZERO_RESULTS") {
          throw new Error("No pudimos encontrar esa dirección. Revisá la dirección, ciudad y país.");
        }
        if (data.status === "OVER_QUERY_LIMIT") {
          throw new Error("El servicio de ubicación alcanzó su límite. Intentá nuevamente más tarde.");
        }
        if (data.status === "REQUEST_DENIED") {
          throw new Error("No se pudo acceder al servicio de ubicación. Verificá la configuración de Google Maps.");
        }
        throw new Error("No se pudo obtener la ubicación. Intentá nuevamente.");
      }

      const nextCoordinates = { latitude: location.lat, longitude: location.lng };
      if (
        !Number.isFinite(nextCoordinates.latitude) ||
        !Number.isFinite(nextCoordinates.longitude) ||
        nextCoordinates.latitude < -90 ||
        nextCoordinates.latitude > 90 ||
        nextCoordinates.longitude < -180 ||
        nextCoordinates.longitude > 180
      ) {
        throw new Error("El servicio devolvió una ubicación inválida. Intentá nuevamente.");
      }

      setCoordinates(nextCoordinates);
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : "No se pudo obtener la ubicación.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = async () => {
    const nextErrors: Partial<Record<keyof FormValues | "parkingType", string>> = {};
    const requiredFields: Array<keyof FormValues> = ["title", "address", "city", "country", "pricePerHour"];
    requiredFields.forEach((field) => {
      if (!values[field].trim()) nextErrors[field] = "Este campo es obligatorio.";
    });

    (["pricePerHour", "pricePerDay", "maxHeight", "maxWidth"] as Array<keyof FormValues>).forEach((field) => {
      if (values[field].trim() && !Number.isFinite(Number(values[field]))) {
        nextErrors[field] = "Ingresá un número válido.";
      }
    });
    (["pricePerHour", "pricePerDay", "maxHeight", "maxWidth"] as Array<keyof FormValues>).forEach((field) => {
      if (values[field].trim() && Number(values[field]) <= 0) {
        nextErrors[field] = "Ingresá un valor mayor a cero.";
      }
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (!coordinates) {
      setLocationError("Obtené la ubicación antes de publicar el estacionamiento.");
      return;
    }

    try {
      setIsSubmitting(true);
      setRequestError(null);
      const parking: CreateParkingDto = {
        title: values.title.trim(),
        address: values.address.trim(),
        city: values.city.trim(),
        country: values.country.trim(),
        ...coordinates,
        pricePerHour: Number(values.pricePerHour),
        covered,
        parkingType,
      };
      const description = values.description.trim();
      if (description) parking.description = description;
      const pricePerDay = parseOptionalNumber(values.pricePerDay);
      const maxHeight = parseOptionalNumber(values.maxHeight);
      const maxWidth = parseOptionalNumber(values.maxWidth);
      if (pricePerDay !== undefined) parking.pricePerDay = pricePerDay;
      if (maxHeight !== undefined) parking.maxHeight = maxHeight;
      if (maxWidth !== undefined) parking.maxWidth = maxWidth;
      await createParking(parking);
      Alert.alert("Estacionamiento publicado", "Tu estacionamiento ya está disponible.", [
        { text: "Aceptar", onPress: () => navigation.navigate("MainTabs", { screen: "Settings" }) },
      ]);
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "No se pudo publicar el estacionamiento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton} accessibilityLabel="Volver">
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>ANUNCIAR ESPACIO</Text>
            <Text style={styles.title}>Publicar mi estacionamiento</Text>
          </View>
        </View>

        <Input label="Título *" value={values.title} onChangeText={(value) => updateValue("title", value)} error={errors.title} placeholder="Ej. Cochera céntrica" />
        <Input label="Descripción" value={values.description} onChangeText={(value) => updateValue("description", value)} placeholder="Contá los detalles de tu espacio" multiline style={styles.multilineInput} />
        <Input label="Dirección *" value={values.address} onChangeText={(value) => updateValue("address", value)} error={errors.address} placeholder="Calle y número" />
        <Input label="Ciudad *" value={values.city} onChangeText={(value) => updateValue("city", value)} error={errors.city} placeholder="Ciudad" />
        <Input label="País *" value={values.country} onChangeText={(value) => updateValue("country", value)} error={errors.country} placeholder="País" />

        <Text style={styles.sectionTitle}>Ubicación</Text>
        <Text style={styles.locationHint}>Obtené la ubicación a partir de la dirección ingresada.</Text>
        <Button title="Obtener ubicación" onPress={handleGetLocation} loading={isGeocoding} />
        {coordinates && <Text style={styles.locationHint}>Ubicación encontrada</Text>}
        {locationError && <Text style={styles.requestError}>{locationError}</Text>}

        <Text style={styles.sectionTitle}>Tipo de estacionamiento *</Text>
        <View style={styles.typeOptions}>
          {parkingTypes.map((type) => <Pressable key={type} style={[styles.typeOption, parkingType === type && styles.typeOptionSelected]} onPress={() => setParkingType(type)}><Text style={[styles.typeText, parkingType === type && styles.typeTextSelected]}>{type}</Text></Pressable>)}
        </View>

        <Input label="Precio por hora *" value={values.pricePerHour} onChangeText={(value) => updateValue("pricePerHour", value)} error={errors.pricePerHour} keyboardType="decimal-pad" placeholder="0" />
        <Input label="Precio por día" value={values.pricePerDay} onChangeText={(value) => updateValue("pricePerDay", value)} error={errors.pricePerDay} keyboardType="decimal-pad" placeholder="0" />
        <View style={styles.rowInputs}>
          <View style={styles.halfInput}><Input label="Altura máx. (m)" value={values.maxHeight} onChangeText={(value) => updateValue("maxHeight", value)} error={errors.maxHeight} keyboardType="decimal-pad" /></View>
          <View style={styles.halfInput}><Input label="Ancho máx. (m)" value={values.maxWidth} onChangeText={(value) => updateValue("maxWidth", value)} error={errors.maxWidth} keyboardType="decimal-pad" /></View>
        </View>
        <View style={styles.coveredRow}><View><Text style={styles.coveredTitle}>Estacionamiento cubierto</Text><Text style={styles.coveredDescription}>Indica si el vehículo queda bajo techo.</Text></View><Switch value={covered} onValueChange={setCovered} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.text} /></View>
        {requestError && <Text style={styles.requestError}>{requestError}</Text>}
        <Button title="Publicar" onPress={handleSubmit} loading={isSubmitting} />
      </ScrollView>
    </SafeAreaView>
  );
}

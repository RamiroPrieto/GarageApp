import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  geocodeParkingAddress,
  ParkingCoordinates,
} from "../../api/garage.api";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { colors } from "../../theme/colors";
import {
  CreateParkingDto,
  Parking,
  ParkingType,
} from "../../types/garage.types";
import { styles } from "./CreateParking.styles";

type FormValues = Record<
  | "title"
  | "description"
  | "address"
  | "city"
  | "country"
  | "pricePerHour"
  | "pricePerDay"
  | "maxHeight"
  | "maxWidth",
  string
>;

type ParkingFormProps = {
  initialParking?: Parking;
  submitLabel: string;
  title: string;
  onBack: () => void;
  onSubmit: (parking: CreateParkingDto) => Promise<unknown>;
  onSuccess: () => void;
};

const addressFields: Array<keyof FormValues> = ["address", "city", "country"];
const parkingTypes = Object.values(ParkingType);

function valueOrEmpty(value: string | null | undefined) {
  return value == null ? "" : String(value);
}

function getInitialValues(parking?: Parking): FormValues {
  return {
    title: parking?.title ?? "",
    description: parking?.description ?? "",
    address: parking?.address ?? "",
    city: parking?.city ?? "",
    country: parking?.country ?? "",
    pricePerHour: valueOrEmpty(parking?.pricePerHour),
    pricePerDay: valueOrEmpty(parking?.pricePerDay),
    maxHeight: valueOrEmpty(parking?.maxHeight),
    maxWidth: valueOrEmpty(parking?.maxWidth),
  };
}

function getInitialCoordinates(parking?: Parking): ParkingCoordinates | null {
  const latitude = Number(parking?.latitude);
  const longitude = Number(parking?.longitude);

  return Number.isFinite(latitude) && Number.isFinite(longitude)
    ? { latitude, longitude }
    : null;
}

export function ParkingForm({
  initialParking,
  submitLabel,
  title,
  onBack,
  onSubmit,
  onSuccess,
}: ParkingFormProps) {
  const [values, setValues] = useState<FormValues>(() => getInitialValues(initialParking));
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [covered, setCovered] = useState(initialParking?.covered ?? false);
  const [parkingType, setParkingType] = useState<ParkingType>(initialParking?.parkingType ?? ParkingType.Garage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [coordinates, setCoordinates] = useState<ParkingCoordinates | null>(() => getInitialCoordinates(initialParking));
  const [locationError, setLocationError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const geocodingRequest = useRef(0);
  const resolvedAddress = useRef<string | null>(initialParking ? [initialParking.address, initialParking.city, initialParking.country].join(", ") : null);

  const updateValue = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (addressFields.includes(field)) {
      geocodingRequest.current += 1;
      resolvedAddress.current = null;
      setCoordinates(null);
      setLocationError(null);
      setIsGeocoding(false);
    }
  };

  const geocodeAddress = async () => {
    const address = values.address.trim();
    const city = values.city.trim();
    const country = values.country.trim();
    if (!address || !city || !country) return;

    const locationKey = [address, city, country].join(", ");
    if (resolvedAddress.current === locationKey || isGeocoding) return;

    const requestId = geocodingRequest.current + 1;
    geocodingRequest.current = requestId;
    setIsGeocoding(true);
    setCoordinates(null);
    setLocationError(null);

    try {
      const result = await geocodeParkingAddress(address, city, country);
      if (requestId !== geocodingRequest.current) return;
      if (
        !Number.isFinite(result.latitude) ||
        !Number.isFinite(result.longitude) ||
        result.latitude < -90 ||
        result.latitude > 90 ||
        result.longitude < -180 ||
        result.longitude > 180
      ) {
        throw new Error("El servicio devolvió una ubicación inválida. Intentá nuevamente.");
      }
      resolvedAddress.current = locationKey;
      setCoordinates(result);
    } catch (error) {
      if (requestId !== geocodingRequest.current) return;
      setLocationError(error instanceof Error ? error.message : "No pudimos encontrar esa dirección. Revisá la dirección, ciudad y país.");
    } finally {
      if (requestId === geocodingRequest.current) setIsGeocoding(false);
    }
  };

  const parseOptionalNumber = (value: string) => (value.trim() === "" ? undefined : Number(value));

  const handleSubmit = async () => {
    const nextErrors: Partial<Record<keyof FormValues, string>> = {};
    (["title", "address", "city", "country", "pricePerHour"] as Array<keyof FormValues>).forEach((field) => {
      if (!values[field].trim()) nextErrors[field] = "Este campo es obligatorio.";
    });
    (["pricePerHour", "pricePerDay", "maxHeight", "maxWidth"] as Array<keyof FormValues>).forEach((field) => {
      const number = Number(values[field]);
      if (values[field].trim() && (!Number.isFinite(number) || number <= 0)) nextErrors[field] = "Ingresá un valor válido mayor a cero.";
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    if (isGeocoding || !coordinates) {
      setLocationError(isGeocoding ? "Esperá a que termine la búsqueda de ubicación." : "No pudimos obtener la ubicación. Revisá la dirección, ciudad y país.");
      return;
    }

    const parking: CreateParkingDto = {
      title: values.title.trim(),
      address: values.address.trim(),
      city: values.city.trim(),
      country: values.country.trim(),
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      pricePerHour: Number(values.pricePerHour),
      covered,
      parkingType,
    };
    parking.description = values.description.trim();
    (["pricePerDay", "maxHeight", "maxWidth"] as const).forEach((field) => {
      const number = parseOptionalNumber(values[field]);
      if (number !== undefined) parking[field] = number;
    });

    try {
      setIsSubmitting(true);
      setRequestError(null);
      await onSubmit(parking);
      onSuccess();
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "No se pudo guardar el estacionamiento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView style={styles.safeArea} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.content} keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
          <View style={styles.header}>
            <Pressable onPress={onBack} style={styles.backButton} accessibilityLabel="Volver"><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable>
            <View style={styles.headerText}><Text style={styles.eyebrow}>ANUNCIAR ESPACIO</Text><Text style={styles.title}>{title}</Text></View>
          </View>
          <Input label="Título *" value={values.title} onChangeText={(value) => updateValue("title", value)} error={errors.title} placeholder="Ej. Cochera céntrica" />
          <Input label="Descripción" value={values.description} onChangeText={(value) => updateValue("description", value)} placeholder="Contá los detalles de tu espacio" multiline style={styles.multilineInput} />
          <Input label="Dirección *" value={values.address} onChangeText={(value) => updateValue("address", value)} onBlur={geocodeAddress} error={errors.address} placeholder="Calle y número" />
          <Input label="Ciudad *" value={values.city} onChangeText={(value) => updateValue("city", value)} onBlur={geocodeAddress} error={errors.city} placeholder="Ciudad" />
          <Input label="País *" value={values.country} onChangeText={(value) => updateValue("country", value)} onBlur={geocodeAddress} error={errors.country} placeholder="País" />
          <Text style={styles.sectionTitle}>Ubicación</Text>
          {isGeocoding && <Text style={styles.locationHint}>Buscando ubicación...</Text>}
          {coordinates && <Text style={styles.locationSuccess}>Ubicación encontrada</Text>}
          {!isGeocoding && !coordinates && !locationError && <Text style={styles.locationHint}>Se buscará automáticamente al completar la dirección.</Text>}
          {locationError && <Text style={styles.requestError}>{locationError}</Text>}
          <Text style={styles.sectionTitle}>Tipo de estacionamiento *</Text>
          <View style={styles.typeOptions}>{parkingTypes.map((type) => <Pressable key={type} style={[styles.typeOption, parkingType === type && styles.typeOptionSelected]} onPress={() => setParkingType(type)}><Text style={[styles.typeText, parkingType === type && styles.typeTextSelected]}>{type}</Text></Pressable>)}</View>
          <Input label="Precio por hora *" value={values.pricePerHour} onChangeText={(value) => updateValue("pricePerHour", value)} error={errors.pricePerHour} keyboardType="decimal-pad" placeholder="0" />
          <Input label="Precio por día" value={values.pricePerDay} onChangeText={(value) => updateValue("pricePerDay", value)} error={errors.pricePerDay} keyboardType="decimal-pad" placeholder="0" />
          <View style={styles.rowInputs}><View style={styles.halfInput}><Input label="Altura máx. (m)" value={values.maxHeight} onChangeText={(value) => updateValue("maxHeight", value)} error={errors.maxHeight} keyboardType="decimal-pad" /></View><View style={styles.halfInput}><Input label="Ancho máx. (m)" value={values.maxWidth} onChangeText={(value) => updateValue("maxWidth", value)} error={errors.maxWidth} keyboardType="decimal-pad" /></View></View>
          <View style={styles.coveredRow}><View><Text style={styles.coveredTitle}>Estacionamiento cubierto</Text><Text style={styles.coveredDescription}>Indica si el vehículo queda bajo techo.</Text></View><Switch value={covered} onValueChange={setCovered} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.text} /></View>
          {requestError && <Text style={styles.requestError}>{requestError}</Text>}
          <Button title={submitLabel} onPress={handleSubmit} loading={isSubmitting} disabled={isGeocoding || !coordinates} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

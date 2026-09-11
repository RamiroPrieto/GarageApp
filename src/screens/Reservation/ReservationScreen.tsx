import { Alert, Pressable, Text, View } from "react-native";

import {
  RouteProp,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useStripe } from "@stripe/stripe-react-native";

import { useCallback, useState } from "react";

import { confirmReservationPayment, createReservation } from "../../api/reservation.api";
import { getMyVehicles } from "../../api/vehicle.api";

import { apiFetch } from "../../api/api";

import { Button } from "../../components/Button";

import { globalStyles } from "../../theme/global.styles";

import { styles } from "./Reservation.Screen";

import { RootStackParamList } from "../../navigation/navigation.types";
import { Vehicle } from "../../types/vehicle.type";
import { useI18n } from "../../context/I18nContext";

type ReservationScreenRouteProp = RouteProp<
  RootStackParamList,
  "Reservation"
>;
type ReservationNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Reservation"
>;

export function ReservationScreen({
  route,
}: {
  route: ReservationScreenRouteProp;
}) {
  const {
    parkingId,
    startDatetime,
    endDatetime,
  } = route.params;

  const navigation = useNavigation<ReservationNavigationProp>();
  const { dateLocale, t } = useI18n();

  const {
    initPaymentSheet,
    presentPaymentSheet,
  } = useStripe();

  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showVehicles, setShowVehicles] = useState(false);

  const loadVehicles = useCallback(async () => {
      try {
        const data = await getMyVehicles();

        setVehicles(data);

        if (data.length > 0) {
          setSelectedVehicle(data.find((vehicle) => vehicle.isDefault) ?? data[0]);
        } else {
          setSelectedVehicle(null);
        }
      } catch (error) {
        console.log("ERROR CARGANDO VEHICULOS:");
        console.log(error);
      }
  }, []);

  useFocusEffect(useCallback(() => { void loadVehicles(); }, [loadVehicles]));

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(dateLocale, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString(dateLocale, {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleConfirmReservation = async () => {
    try {
      setLoading(true);

      // 1. Crear reserva en estado PENDING
      const reservation = await createReservation(
        parkingId,
        selectedVehicle?.id ?? null,
        startDatetime,
        endDatetime,
      );

      // 2. Crear PaymentIntent
      const data = await apiFetch("/payments", {
        method: "POST",
        body: JSON.stringify({
          reservationId: reservation.id,
          savePaymentMethod: true,
        }),
      });

      // 3. Inicializar Stripe PaymentSheet
      const { error: initError } =
        await initPaymentSheet({
          merchantDisplayName: "GarageApp",
          paymentIntentClientSecret: data.clientSecret,
        });

      if (initError) {
        console.log(
          "Error inicializando Stripe:",
          initError,
        );

        navigation.navigate("ReservationResult", {
          success: false,
        });

        return;
      }

      // 4. Mostrar Stripe PaymentSheet
      const { error: paymentError } =
        await presentPaymentSheet();

      if (paymentError) {
        console.log(
          "Error de pago:",
          paymentError,
        );

        // Si el usuario simplemente cerró/canceló Stripe,
        // se queda en la pantalla de reserva
        if (paymentError.code === "Canceled") {
          return;
        }

        // Error real de pago
        navigation.navigate("ReservationResult", {
          success: false,
        });

        return;
      }

      // 5. Stripe completó el pago. El servidor verifica el PaymentIntent antes de confirmar.
      await confirmReservationPayment(reservation.id);

      // 6. Pago y reserva confirmados
      navigation.navigate("ReservationResult", {
        success: true,
      });

    } catch (error) {
      console.log(
        "Error durante la reserva:",
        error,
      );

      navigation.navigate("ReservationResult", {
        success: false,
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {t("reservation.title")}
        </Text>

        <View style={styles.section}>
          <Text style={styles.label}>
            {t("reservation.parking")}
          </Text>

          <Text style={styles.value}>
            {t("parking.fallbackName", { id: parkingId })}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.vehicleHeader}>
            <Text style={[styles.label, styles.vehicleHeaderLabel]}>
              {t("reservation.vehicle")}
            </Text>

            <Pressable
              style={styles.addButton}
              onPress={() => navigation.navigate("CreateVehicle")}
              hitSlop={8}
            >
              <Text style={styles.addButtonText}>+</Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.vehicleField}
            onPress={() => setShowVehicles(!showVehicles)}
          >
            <Text style={styles.value}>
              {selectedVehicle
                ? `${selectedVehicle.brand} ${selectedVehicle.model}`
                : t("reservation.noVehicle")}
            </Text>
          </Pressable>

          {showVehicles && vehicles.length > 0 && (
            <View style={styles.vehicleList}>
              {vehicles.map((vehicle) => (
                <Pressable
                  key={vehicle.id}
                  style={styles.vehicleItem}
                  onPress={() => {
                    setSelectedVehicle(vehicle);
                    setShowVehicles(false);
                  }}
                >
                  <Text style={styles.value}>
                    {vehicle.brand} {vehicle.model}
                  </Text>

                  <Text style={styles.vehiclePlate}>
                    {vehicle.licensePlate}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
          {vehicles.length === 0 && (
            <Pressable style={styles.addVehicleEmpty} onPress={() => navigation.navigate("CreateVehicle")}>
              <Text style={styles.addVehicleEmptyText}>{t("management.addVehicle")}</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>
            {t("reservation.date")}
          </Text>

          <Text style={styles.value}>
            {formatDate(startDatetime)}
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.timeContainer}>
            <Text style={styles.label}>
            {t("reservation.entry")}
            </Text>

            <Text style={styles.value}>
              {formatTime(startDatetime)}
            </Text>
          </View>

          <View style={styles.timeContainer}>
            <Text style={styles.label}>
            {t("reservation.exit")}
            </Text>

            <Text style={styles.value}>
              {formatTime(endDatetime)}
            </Text>
          </View>
        </View>

        <Button
          title={t("reservation.confirmAndPay")}
          loading={loading}
          onPress={handleConfirmReservation}
        />
      </View>
    </View>
  );
}

import { View, Text, Alert } from "react-native";

import { RouteProp } from "@react-navigation/native";

import { useStripe } from "@stripe/stripe-react-native";

import { globalStyles } from "../../theme/global.styles";

import { styles } from "./Reservation.Screen";

import { createReservation } from "../../api/reservation.api";

import { apiFetch } from "../../api/api";

import { useState } from "react";

import { Button } from "../../components/Button";

type ReservationScreenRouteProp = RouteProp<
  {
    Reservation: {
      parkingId: number;
      vehicleId: number;
      startDatetime: string;
      endDatetime: string;
    };
  },
  "Reservation"
>;

interface Props {
  route: ReservationScreenRouteProp;
}

export function ReservationScreen({
  route,
}: Props) {
  const {
    parkingId,
    vehicleId,
    startDatetime,
    endDatetime,
  } = route.params;

  const { initPaymentSheet, presentPaymentSheet } =
    useStripe();

  const [loading, setLoading] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleConfirmReservation = async () => {
    try {
      setLoading(true);

      // 1. Creamos la reserva como PENDING
      const reservation = await createReservation(
        parkingId,
        vehicleId,
        startDatetime,
        endDatetime,
      );

      console.log(
        "RESERVA CREADA:",
        reservation,
      );

      // 2. Creamos el PaymentIntent
      const data = await apiFetch("/payments", {
        method: "POST",
        body: JSON.stringify({
          reservationId: reservation.id,
          savePaymentMethod: true,
        }),
      });

      const { clientSecret } = data;

      // 3. Inicializamos Stripe
      const { error: initError } =
        await initPaymentSheet({
          merchantDisplayName: "GarageApp",
          paymentIntentClientSecret: clientSecret,
        });

      if (initError) {
        console.log(
          "Error inicializando PaymentSheet:",
          initError,
        );

        Alert.alert(
          "Errore",
          initError.message,
        );

        return;
      }

      // 4. Abrimos el modal de Stripe
      const { error: paymentError } =
        await presentPaymentSheet();

      if (paymentError) {
        console.log(
          "Error de pago:",
          paymentError,
        );

        if (paymentError.code !== "Canceled") {
          Alert.alert(
            "Errore",
            paymentError.message,
          );
        }

        return;
      }

      // 5. Pago exitoso
      Alert.alert(
        "Pagamento completato",
        "Il pagamento è stato elaborato correttamente.",
      );

    } catch (error) {
      console.log(
        "ERROR CREANDO RESERVA O PAGO:",
        error,
      );

      Alert.alert(
        "Errore",
        error instanceof Error
          ? error.message
          : "Si è verificato un errore",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>
          Conferma la tua prenotazione
        </Text>

        <View style={styles.section}>
          <Text style={styles.label}>
            Parcheggio
          </Text>

          <Text style={styles.value}>
            Parking #{parkingId}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>
            Veicolo
          </Text>

          <Text style={styles.value}>
            Veicolo #{vehicleId}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>
            Data
          </Text>

          <Text style={styles.value}>
            {formatDate(startDatetime)}
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.timeContainer}>
            <Text style={styles.label}>
              Ingresso
            </Text>

            <Text style={styles.value}>
              {formatTime(startDatetime)}
            </Text>
          </View>

          <View style={styles.timeContainer}>
            <Text style={styles.label}>
              Uscita
            </Text>

            <Text style={styles.value}>
              {formatTime(endDatetime)}
            </Text>
          </View>
        </View>

        {/* <View style={styles.buttonContainer}> */}
          <Button
            title="Conferma e paga"
            loading={loading}
            onPress={handleConfirmReservation}
          />
        {/* </View> */}
      </View>
    </View>
  );
}
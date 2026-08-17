import { useState } from "react";
import { Alert, Button, Text, View } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";

import { apiFetch } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

export function PaymentScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const { logout } = useAuth();

  const [loading, setLoading] = useState(false);

  const reservationId = 7;

  const handlePayment = async () => {
    try {
      setLoading(true);

      // 1. Pedimos al backend crear el PaymentIntent
      const data = await apiFetch("/payments", {
        method: "POST",
        body: JSON.stringify({
          reservationId,
          savePaymentMethod: true,
        }),
      });

      const { clientSecret } = data;

      // 2. Inicializamos Stripe PaymentSheet
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
          "Error",
          initError.message,
        );

        return;
      }

      // 3. Mostramos el PaymentSheet
      const { error: paymentError } =
        await presentPaymentSheet();

      if (paymentError) {
        console.log(
          "Error de pago:",
          paymentError,
        );

        if (paymentError.code !== "Canceled") {
          Alert.alert(
            "Error",
            paymentError.message,
          );
        }

        return;
      }

      // 4. Pago completado
      Alert.alert(
        "Pago realizado",
        "El pago se procesó correctamente.",
      );

    } catch (error) {
      console.log("Error:", error);

      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Ocurrió un error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          marginBottom: 10,
        }}
      >
        Reserva #{reservationId}
      </Text>

      <Text
        style={{
          fontSize: 18,
          marginBottom: 30,
        }}
      >
        Total: €7.50
      </Text>

      <Button
        title={
          loading
            ? "Procesando..."
            : "Pagar"
        }
        onPress={handlePayment}
        disabled={loading}
      />
      <Button
  title="Cerrar sesión"
  onPress={logout}
/>
    </View>
  );
}
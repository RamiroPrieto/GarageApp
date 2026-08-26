import { useState } from "react";
import { Alert, SafeAreaView, Text, View } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { Ionicons } from "@expo/vector-icons";
import { apiFetch } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/navigation.types";
import { Button } from "../../components/Button";
import { styles } from "./PaymentScreen.styles";

type PaymentScreenRouteProp = RouteProp<RootStackParamList, "Payment">;
interface Props { route: PaymentScreenRouteProp; }

export function PaymentScreen({ route }: Props) {
  const { reservationId } = route.params;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const handlePayment = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/payments", { method: "POST", body: JSON.stringify({ reservationId, savePaymentMethod: true }) });
      const { error: initError } = await initPaymentSheet({ merchantDisplayName: "GarageApp", paymentIntentClientSecret: data.clientSecret });
      if (initError) { Alert.alert("Error", initError.message); return; }
      const { error: paymentError } = await presentPaymentSheet();
      if (paymentError) { if (paymentError.code !== "Canceled") Alert.alert("Error", paymentError.message); return; }
      Alert.alert("Pago realizado", "El pago se procesó correctamente.");
    } catch (error) { Alert.alert("Error", error instanceof Error ? error.message : "Ocurrió un error"); }
    finally { setLoading(false); }
  };
  return <SafeAreaView style={styles.screen}><View style={styles.content}>
    <Text style={styles.eyebrow}>PAGO SEGURO</Text><Text style={styles.title}>Finalizá tu reserva</Text><Text style={styles.parking}>Reserva #{reservationId}</Text>
    <View style={styles.method}><View style={styles.methodIcon}><Ionicons name="card-outline" size={22} color="#F4F5FA" /></View><View><Text style={styles.methodTitle}>Tarjeta</Text><Text style={styles.methodText}>El pago se solicitará de forma segura</Text></View></View>
    <View style={styles.card}><View style={styles.chip} /><Ionicons name="card" size={35} color="#B1A8FF" style={styles.cardIcon} /><Text style={styles.cardDots}>••••  ••••  ••••  ••••</Text><View style={styles.cardFooter}><Text style={styles.cardCaption}>TITULAR{`\n`}TU NOMBRE</Text><Text style={styles.cardCaption}>VENCE{`\n`}MM/AA</Text></View></View>
    <View style={styles.summary}><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>€2,5</Text></View><View style={styles.summaryRow}><Text style={styles.summaryLabel}>IVA (21%)</Text><Text style={styles.summaryValue}>€1</Text></View><View style={styles.totalRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>€3</Text></View></View>
    <Button title={loading ? "Procesando..." : "Pagar ahora"} onPress={handlePayment} loading={loading} />
    <Text style={styles.security}>⌕ Pago 100% seguro · SSL encriptado</Text>
    <Text style={styles.logout} onPress={logout}>Cerrar sesión</Text>
  </View></SafeAreaView>;
}

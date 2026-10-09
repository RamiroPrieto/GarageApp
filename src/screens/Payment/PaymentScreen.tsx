import { useEffect, useState } from "react";
import { Alert, SafeAreaView, Text, View } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { Ionicons } from "@expo/vector-icons";
import { apiFetch } from "../../api/api";
import { getMyReservations } from "../../api/reservation.api";
import { useAuth } from "../../context/AuthContext";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/navigation.types";
import { Button } from "../../components/Button";
import { styles } from "./PaymentScreen.styles";
import { Reservation } from "../../types/reservation.types";
import { formatCurrency } from "../../utils/currency";
import { useI18n } from "../../context/I18nContext";

type PaymentScreenRouteProp = RouteProp<RootStackParamList, "Payment">;
interface Props { route: PaymentScreenRouteProp; }

export function PaymentScreen({ route }: Props) {
  const { reservationId } = route.params;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { logout } = useAuth();
  const { dateLocale, t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  useEffect(() => { void getMyReservations().then((items) => setReservation(items.find((item) => item.id === reservationId) ?? null)).catch(() => setReservation(null)); }, [reservationId]);
  const handlePayment = async () => {
    try { setLoading(true); const data = await apiFetch("/payments", { method: "POST", body: JSON.stringify({ reservationId, savePaymentMethod: true }) }); const { error: initError } = await initPaymentSheet({ merchantDisplayName: "GarageApp", paymentIntentClientSecret: data.clientSecret }); if (initError) { Alert.alert(t("common.error"), initError.message); return; } const { error: paymentError } = await presentPaymentSheet(); if (paymentError) { if (paymentError.code !== "Canceled") Alert.alert(t("common.error"), paymentError.message); return; } Alert.alert(t("payment.successTitle"), t("payment.successMessage")); }
    catch (error) { Alert.alert(t("common.error"), error instanceof Error ? error.message : t("common.unknownError")); }
    finally { setLoading(false); }
  };
  const total = reservation ? formatCurrency(reservation.totalPrice, reservation.currency, dateLocale) : "-";
  return <SafeAreaView style={styles.screen}><View style={styles.content}><Text style={styles.eyebrow}>{t("payment.secure")}</Text><Text style={styles.title}>{t("payment.title")}</Text><Text style={styles.parking}>{t("payment.reservation", { id: reservationId })}</Text><View style={styles.method}><View style={styles.methodIcon}><Ionicons name="card-outline" size={22} color="#F4F5FA" /></View><View><Text style={styles.methodTitle}>{t("payment.card")}</Text><Text style={styles.methodText}>{t("payment.cardSecure")}</Text></View></View><View style={styles.card}><View style={styles.chip} /><Ionicons name="card" size={35} color="#B1A8FF" style={styles.cardIcon} /><View style={styles.cardFooter}><Text style={styles.cardCaption}>{t("payment.cardHolder")}{`\n`}{t("payment.yourName")}</Text><Text style={styles.cardCaption}>{t("payment.expires")}{`\n`}MM/AA</Text></View></View><View style={styles.summary}><View style={styles.summaryRow}><Text style={styles.summaryLabel}>{t("payment.subtotal")}</Text><Text style={styles.summaryValue}>{total}</Text></View><View style={styles.totalRow}><Text style={styles.totalLabel}>{t("payment.total")}</Text><Text style={styles.totalValue}>{total}</Text></View></View><Button title={loading ? t("payment.processing") : t("payment.payNow")} onPress={handlePayment} loading={loading} /><Text style={styles.security}>{t("payment.security")}</Text><Text style={styles.logout} onPress={logout}>{t("payment.logout")}</Text></View></SafeAreaView>;
}

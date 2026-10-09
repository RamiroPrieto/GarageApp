import { Modal, Platform, Pressable, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RouteProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useStripe } from "@stripe/stripe-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cancelReservation, createReservation, getReservation } from "../../api/reservation.api";
import { getReservationCreditQuote, payReservationWithCredits } from "../../api/credits.api";
import { getMyVehicles } from "../../api/vehicle.api";
import { apiFetch } from "../../api/api";
import { Button } from "../../components/Button";
import { globalStyles } from "../../theme/global.styles";
import { styles } from "./Reservation.Screen";
import { RootStackParamList } from "../../navigation/navigation.types";
import { Vehicle } from "../../types/vehicle.type";
import { useI18n } from "../../context/I18nContext";
import { formatCurrency } from "../../utils/currency";
import { useAuth } from "../../context/AuthContext";
import { useDialog } from "../../context/DialogContext";

type ReservationScreenRouteProp = RouteProp<RootStackParamList, "Reservation">;
type ReservationNavigationProp = NativeStackNavigationProp<RootStackParamList, "Reservation">;
type PaymentPhase = "idle" | "creatingReservation" | "creatingPaymentIntent" | "paymentSheet" | "waitingConfirmation" | "finalized";

const PAYMENT_CONFIRMATION_ATTEMPTS = 8;
const PAYMENT_CONFIRMATION_INTERVAL_MS = 1_000;

type ApiError = Error & { code?: string };

function combineDateAndTime(date: Date, time: Date) {
  const value = new Date(date);
  value.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return value;
}

export function ReservationScreen({ route }: { route: ReservationScreenRouteProp }) {
  const { parking, startDatetime, endDatetime } = route.params;
  const navigation = useNavigation<ReservationNavigationProp>();
  const { dateLocale, t: translate } = useI18n();
  const { user, refreshUser } = useAuth();
  const { show } = useDialog();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const initialStart = useMemo(() => new Date(startDatetime), [startDatetime]);
  const initialEnd = useMemo(() => new Date(endDatetime), [endDatetime]);
  const [date, setDate] = useState(initialStart);
  const [startTime, setStartTime] = useState(initialStart);
  const [endTime, setEndTime] = useState(initialEnd);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentPhase, setPaymentPhase] = useState<PaymentPhase>("idle");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showVehicles, setShowVehicles] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "credits">("card");
  const [creditCost, setCreditCost] = useState<number | null>(null);
  const [showCreditConfirmation, setShowCreditConfirmation] = useState(false);
  // The displayed cost must use the server quote too: EUR reservations depend
  // on the server-only exchange-rate setting and cannot be calculated safely
  // from the client.
  const t = (key: Parameters<typeof translate>[0], params?: Parameters<typeof translate>[1]) =>
    translate(key, key === "reservation.creditsInfo" ? { ...params, cost: creditCost ?? "..." } : params);

  const selectedStart = combineDateAndTime(date, startTime);
  const selectedEnd = combineDateAndTime(date, endTime);
  const durationHours = Math.max(0, (selectedEnd.getTime() - selectedStart.getTime()) / 3_600_000);
  const totalPrice = durationHours * Number(parking.pricePerHour);

  useEffect(() => {
    if (paymentMethod !== "credits" || selectedEnd <= selectedStart) { setCreditCost(null); return; }
    let active = true;
    void getReservationCreditQuote(parking.id, selectedStart.toISOString(), selectedEnd.toISOString())
      .then((quote) => { if (active) setCreditCost(quote.credits); })
      .catch(() => { if (active) setCreditCost(null); });
    return () => { active = false; };
  }, [parking.id, paymentMethod, selectedEnd, selectedStart]);

  const loadVehicles = useCallback(async () => {
    try { const data = await getMyVehicles(); setVehicles(data); setSelectedVehicle((current) => current && data.some((vehicle) => vehicle.id === current.id) ? current : data.find((vehicle) => vehicle.isDefault) ?? data[0] ?? null); }
    catch (error) { console.log("ERROR CARGANDO VEHICULOS:", error); }
  }, []);
  useFocusEffect(useCallback(() => { void loadVehicles(); }, [loadVehicles]));
  const formatDate = (value: Date) => value.toLocaleDateString(dateLocale, { day: "2-digit", month: "long", year: "numeric" });
  const formatTime = (value: Date) => value.toLocaleTimeString(dateLocale, { hour: "2-digit", minute: "2-digit", hour12: false });
  const showValidation = (message: string) => show(t("common.error"), message, [{ text: t('common.ok') }]);

  const waitForPaymentConfirmation = async (reservationId: number) => {
    console.log("[reservation-payment] Waiting for payment confirmation", { reservationId });
    for (let attempt = 0; attempt < PAYMENT_CONFIRMATION_ATTEMPTS; attempt += 1) {
      try {
        const reservation = await getReservation(reservationId);
        if (reservation.status === "CONFIRMED") return "CONFIRMED" as const;
        if (["CANCELLED", "EXPIRED"].includes(reservation.status)) return "FAILED" as const;
      } catch {
        console.log("[reservation-payment] Confirmation refresh failed", { reservationId, attempt: attempt + 1 });
      }
      await new Promise((resolve) => setTimeout(resolve, PAYMENT_CONFIRMATION_INTERVAL_MS));
    }
    return "PENDING" as const;
  };

  const cancelPendingReservation = async (reservationId: number) => {
    try {
      await cancelReservation(reservationId);
      console.log("[reservation-payment] Pending reservation cancelled", { reservationId });
    } catch {
      console.log("[reservation-payment] Could not cancel pending reservation", { reservationId });
    }
  };

  const navigateToBookings = (reservationId: number) => {
    console.log("[reservation-payment] Navigation executed", { reservationId });
    navigation.reset({ index: 0, routes: [{ name: "MainTabs", params: { screen: "Reservations", params: { reservationId } } }] });
  };

  const processReservationPayment = async () => {
    if (selectedEnd <= selectedStart) { showValidation(t("reservation.invalidTime")); return; }
    if (selectedStart < new Date()) { showValidation(t("reservation.invalidDateTime")); return; }
    let reservationId: number | null = null;
    let paymentCompletedInSheet = false;
    try {
      setLoading(true);
      setPaymentPhase("creatingReservation");
      const reservation = await createReservation(parking.id, selectedVehicle?.id ?? null, selectedStart.toISOString(), selectedEnd.toISOString());
      reservationId = reservation.id;
      console.log("[reservation-payment] Reservation created", { reservationId });
      if (paymentMethod === "credits") {
        await payReservationWithCredits(reservation.id);
        await refreshUser();
        setPaymentPhase("finalized");
        console.log("[reservation-payment] Reservation finalized", { reservationId });
        navigateToBookings(reservation.id);
        return;
      }
      setPaymentPhase("creatingPaymentIntent");
      const data = await apiFetch("/payments", { method: "POST", body: JSON.stringify({ reservationId: reservation.id, savePaymentMethod: true }) });
      console.log("[reservation-payment] PaymentIntent created", { reservationId });
      const { error: initError } = await initPaymentSheet({ merchantDisplayName: "GarageApp", paymentIntentClientSecret: data.clientSecret });
      if (initError) throw initError;
      setPaymentPhase("paymentSheet");
      const { error: paymentError } = await presentPaymentSheet();
      console.log("[reservation-payment] PaymentSheet result", { reservationId, success: !paymentError, code: paymentError?.code });
      if (paymentError) {
        console.log(paymentError.code === "Canceled" ? "[reservation-payment] PaymentSheet cancel" : "[reservation-payment] PaymentSheet error", { reservationId, code: paymentError.code });
        await cancelPendingReservation(reservation.id);
        showValidation(paymentError.code === "Canceled" ? t("reservation.paymentCancelled") : t("reservation.paymentFailed"));
        return;
      }
      paymentCompletedInSheet = true;
      setPaymentPhase("waitingConfirmation");
      const confirmation = await waitForPaymentConfirmation(reservation.id);
      if (confirmation === "FAILED") {
        showValidation(t("reservation.paymentFailed"));
        return;
      }
      if (confirmation === "PENDING") show(t("reservation.paymentPendingTitle"), t("reservation.paymentPendingMessage"), [{ text: t('common.ok') }]);
      else console.log("[reservation-payment] Payment confirmed", { reservationId });
      setPaymentPhase("finalized");
      console.log("[reservation-payment] Reservation finalized", { reservationId });
      navigateToBookings(reservation.id);
    } catch (error) {
      const apiError = error as ApiError;
      console.log("[reservation-payment] Reservation payment error", { reservationId, code: apiError.code, message: apiError.message });
      if (reservationId !== null && !paymentCompletedInSheet) await cancelPendingReservation(reservationId);
      showValidation(apiError.code === "INSUFFICIENT_CREDITS" ? t("reservation.insufficientCredits") : t("reservation.paymentFailed"));
    } finally {
      setPaymentPhase("idle");
      setLoading(false);
    }
  };

  const handleConfirmReservation = () => {
    if (selectedEnd <= selectedStart) { showValidation(t("reservation.invalidTime")); return; }
    if (selectedStart < new Date()) { showValidation(t("reservation.invalidDateTime")); return; }
    if (paymentMethod !== "credits") {
      void processReservationPayment();
      return;
    }
    if (creditCost !== null && (user?.creditBalance ?? 0) < creditCost) {
      showValidation(t("reservation.insufficientCredits"));
      return;
    }

    setShowCreditConfirmation(true);
  };

  return <View style={globalStyles.screen}><View style={styles.container}>
    <Text style={styles.title}>{t("reservation.title")}</Text>
    <View style={styles.section}><Text style={styles.label}>{t("reservation.parking")}</Text><Text style={styles.value}>{parking.title}</Text><Text style={styles.address}>{[parking.address, parking.city, parking.country].filter(Boolean).join(", ")}</Text></View>
    <View style={styles.section}><View style={styles.vehicleHeader}><Text style={[styles.label, styles.vehicleHeaderLabel]}>{t("reservation.vehicle")}</Text><Pressable style={styles.addButton} onPress={() => navigation.navigate("CreateVehicle")} hitSlop={8}><Text style={styles.addButtonText}>+</Text></Pressable></View><Pressable style={styles.vehicleField} onPress={() => setShowVehicles(!showVehicles)}><Text style={styles.value}>{selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : t("reservation.noVehicle")}</Text></Pressable>{showVehicles && vehicles.length > 0 && <View style={styles.vehicleList}>{vehicles.map((vehicle) => <Pressable key={vehicle.id} style={styles.vehicleItem} onPress={() => { setSelectedVehicle(vehicle); setShowVehicles(false); }}><Text style={styles.value}>{vehicle.brand} {vehicle.model}</Text><Text style={styles.vehiclePlate}>{vehicle.licensePlate}</Text></Pressable>)}</View>}{vehicles.length === 0 && <Pressable style={styles.addVehicleEmpty} onPress={() => navigation.navigate("CreateVehicle")}><Text style={styles.addVehicleEmptyText}>{t("management.addVehicle")}</Text></Pressable>}</View>
    <View style={styles.section}><Text style={styles.label}>{t("reservation.date")}</Text><Pressable style={styles.pickerField} onPress={() => setShowDatePicker(true)}><Text style={styles.value}>{formatDate(date)}</Text></Pressable>{showDatePicker && <DateTimePicker value={date} mode="date" minimumDate={new Date()} onChange={(_, value) => { if (Platform.OS !== "ios") setShowDatePicker(false); if (value) setDate(value); }} />}</View>
    <View style={styles.row}><View style={styles.timeContainer}><Text style={styles.label}>{t("reservation.entry")}</Text><Pressable style={styles.pickerField} onPress={() => setShowStartPicker(true)}><Text style={styles.value}>{formatTime(startTime)}</Text></Pressable>{showStartPicker && <DateTimePicker value={startTime} mode="time" is24Hour onChange={(_, value) => { if (Platform.OS !== "ios") setShowStartPicker(false); if (value) setStartTime(value); }} />}</View><View style={styles.timeContainer}><Text style={styles.label}>{t("reservation.exit")}</Text><Pressable style={styles.pickerField} onPress={() => setShowEndPicker(true)}><Text style={styles.value}>{formatTime(endTime)}</Text></Pressable>{showEndPicker && <DateTimePicker value={endTime} mode="time" is24Hour onChange={(_, value) => { if (Platform.OS !== "ios") setShowEndPicker(false); if (value) setEndTime(value); }} />}</View></View>
    <View style={styles.total}><Text style={styles.label}>{t("reservation.total")}</Text><Text style={styles.totalValue}>{formatCurrency(totalPrice, parking.currency, dateLocale)}</Text></View>
    <View style={styles.section}><Text style={styles.label}>{t("reservation.paymentMethod")}</Text><View style={styles.paymentMethods}><Pressable style={[styles.paymentMethod, paymentMethod === "card" && styles.paymentMethodSelected]} onPress={() => setPaymentMethod("card")}><Text style={styles.value}>{t("reservation.creditCard")}</Text></Pressable><Pressable style={[styles.paymentMethod, paymentMethod === "credits" && styles.paymentMethodSelected]} onPress={() => setPaymentMethod("credits")}><Text style={styles.value}>{t("reservation.credits")}</Text></Pressable></View>{paymentMethod === "credits" && <Text style={styles.creditInfo}>{t("reservation.creditsInfo", { balance: user?.creditBalance ?? 0, cost: parking.currency === "USD" ? Math.ceil(totalPrice * 100) : "—" })}</Text>}{paymentMethod === "credits" && parking.currency === "EUR" && <Text style={styles.creditWarning}>{t("reservation.eurCreditsRate")}</Text>}</View>
    {paymentPhase === "waitingConfirmation" && <Text style={styles.creditInfo}>{t("reservation.paymentConfirming")}</Text>}
    <Button title={t("reservation.confirmAndPay")} loading={loading} onPress={handleConfirmReservation} />
    <Modal transparent visible={showCreditConfirmation} animationType="fade" onRequestClose={() => setShowCreditConfirmation(false)}>
      <View style={styles.modalOverlay}><View style={styles.modalCard}>
        <Text style={styles.modalTitle}>{t("reservation.creditPaymentConfirmTitle")}</Text>
        <Text style={styles.modalMessage}>{creditCost === null ? t("reservation.creditPaymentConfirmMessage") : t("reservation.creditPaymentConfirmAmount", { credits: creditCost })}</Text>
        <View style={styles.modalActions}>
          <Pressable style={styles.modalSecondaryButton} onPress={() => setShowCreditConfirmation(false)}><Text style={styles.modalSecondaryText}>{t("reservation.creditPaymentCancel")}</Text></Pressable>
          <Pressable style={styles.modalPrimaryButton} onPress={() => { setShowCreditConfirmation(false); void processReservationPayment(); }}><Text style={styles.modalPrimaryText}>{t("reservation.creditPaymentAccept")}</Text></Pressable>
        </View>
      </View></View>
    </Modal>
  </View></View>;
}

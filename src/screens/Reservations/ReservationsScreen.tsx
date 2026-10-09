import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { confirmCustomerReservationStart, confirmOwnerReservationStart, getMyReservations } from "../../api/reservation.api";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../context/I18nContext";
import { MainTabParamList, RootStackParamList } from "../../navigation/navigation.types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "../../theme/colors";
import { Reservation } from "../../types/reservation.types";
import { formatCurrency } from "../../utils/currency";
import { styles } from "./Reservations.styles";

type ReservationsRoute = RouteProp<MainTabParamList, "Reservations">;
type Section = "upcoming" | "active" | "history";

function isStartAvailable(reservation: Reservation, now: Date) {
  const millisecondsUntilStart = new Date(reservation.startDatetime).getTime() - now.getTime();
  return reservation.status === "CONFIRMED" && millisecondsUntilStart <= 10 * 60 * 1000 && millisecondsUntilStart >= 0;
}

function ReservationCard({ reservation, userId, selected, onCustomerStart, onOwnerStart }: { reservation: Reservation; userId: number; selected: boolean; onCustomerStart: (id: number) => void; onOwnerStart: (id: number) => void }) {
  const { dateLocale, t } = useI18n();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 15_000); return () => clearInterval(timer); }, []);
  const start = new Date(reservation.startDatetime);
  const end = new Date(reservation.endDatetime);
  const isOwner = reservation.parking?.ownerId === userId;
  const isCustomer = reservation.user?.id === userId || reservation.userId === userId;
  const canStart = isStartAvailable(reservation, now);
  const badgeStyle = { PENDING: styles.badgePENDING, CONFIRMED: styles.badgeCONFIRMED, ACTIVE: styles.badgeACTIVE, CANCELLED: styles.badgeCANCELLED, COMPLETED: styles.badgeCOMPLETED, EXPIRED: styles.badgeEXPIRED }[reservation.status];
  const badgeTextStyle = { PENDING: styles.badgeTextPENDING, CONFIRMED: styles.badgeTextCONFIRMED, ACTIVE: styles.badgeTextACTIVE, CANCELLED: styles.badgeTextCANCELLED, COMPLETED: styles.badgeTextCOMPLETED, EXPIRED: styles.badgeTextEXPIRED }[reservation.status];
  const parkingName = reservation.parking?.title ?? t("parking.fallbackName", { id: reservation.parkingId });
  const address = reservation.parking ? `${reservation.parking.address}, ${reservation.parking.city}` : t("parking.addressUnavailable");
  const statusMessage = reservation.status === "ACTIVE" ? t("reservations.bookingStarted") : isCustomer && reservation.customerStartedAt && !reservation.ownerStartedAt ? t("reservations.waitingForOwner") : isOwner && reservation.customerStartedAt && !reservation.ownerStartedAt ? t("reservations.customerWaiting") : null;
  return <View style={[styles.card, selected && { borderColor: colors.primary, borderWidth: 1 }]}><View style={styles.cardHeader}><View style={styles.parkingInfo}><Text style={styles.parkingName}>{parkingName}</Text><Text style={styles.address}>{address}</Text></View><View style={[styles.badge, badgeStyle]}><Text style={[styles.badgeText, badgeTextStyle]}>{t(`reservations.status.${reservation.status}`)}</Text></View></View><View style={styles.dateRow}><Ionicons name="calendar-outline" size={16} color={colors.textSecondary} /><Text style={styles.date}>{start.toLocaleDateString(dateLocale, { day: "2-digit", month: "long", year: "numeric" })}</Text></View><View style={styles.detailsRow}><Text style={styles.time}>{start.toLocaleTimeString(dateLocale, { hour: "2-digit", minute: "2-digit" })} - {end.toLocaleTimeString(dateLocale, { hour: "2-digit", minute: "2-digit" })}</Text><Text style={styles.price}>{formatCurrency(reservation.totalPrice, reservation.currency, dateLocale)}</Text></View>{statusMessage && <Text style={styles.address}>{statusMessage}</Text>}{canStart && isCustomer && !reservation.customerStartedAt && <Pressable style={styles.startButton} onPress={() => onCustomerStart(reservation.id)}><Text style={styles.startButtonText}>{t("reservations.start")}</Text></Pressable>}{canStart && isOwner && !reservation.ownerStartedAt && <Pressable style={styles.startButton} onPress={() => onOwnerStart(reservation.id)}><Text style={styles.startButtonText}>{t("reservations.start")}</Text></Pressable>}</View>;
}

export function ReservationsScreen() {
  const { t } = useI18n();
  const { user } = useAuth();
  const route = useRoute<ReservationsRoute>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const selectedId = route.params?.reservationId;
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadReservations = useCallback(async (showLoading = false) => { try { if (showLoading) setLoading(true); setError(null); const items = await getMyReservations(); console.log("[bookings] Reservations received", { count: items.length, statuses: items.map((item) => ({ id: item.id, status: item.status })) }); setReservations(items); } catch (caughtError) { setError(caughtError instanceof Error ? caughtError.message : t("reservations.loadError")); } finally { if (showLoading) setLoading(false); } }, [t]);
  useFocusEffect(useCallback(() => { void loadReservations(true); const timer = setInterval(() => void loadReservations(), 2_000); return () => clearInterval(timer); }, [loadReservations]));
  const startCustomer = async (reservationId: number) => { try { await confirmCustomerReservationStart(reservationId); await loadReservations(); } catch (caughtError) { setError(caughtError instanceof Error ? caughtError.message : t("reservations.startError")); } };
  const startOwner = async (reservationId: number) => { try { await confirmOwnerReservationStart(reservationId); await loadReservations(); } catch (caughtError) { setError(caughtError instanceof Error ? caughtError.message : t("reservations.startError")); } };
  const sections = useMemo(() => { const now = new Date(); const byStart = (a: Reservation, b: Reservation) => new Date(a.startDatetime).getTime() - new Date(b.startDatetime).getTime(); const prioritizeSelected = (items: Reservation[]) => items.sort((a, b) => (a.id === selectedId ? -1 : b.id === selectedId ? 1 : byStart(a, b))); return { upcoming: prioritizeSelected(reservations.filter((r) => ["PENDING", "CONFIRMED"].includes(r.status) && new Date(r.endDatetime) >= now)), active: prioritizeSelected(reservations.filter((r) => r.status === "ACTIVE")), history: prioritizeSelected(reservations.filter((r) => ["COMPLETED", "CANCELLED", "EXPIRED"].includes(r.status) || new Date(r.endDatetime) < now)) }; }, [reservations, selectedId]);
  const renderSection = (section: Section, title: string) => <><Text style={styles.sectionTitle}>{title}</Text>{sections[section].length === 0 ? <Text style={styles.sectionEmpty}>{t(`reservations.no${section.charAt(0).toUpperCase()}${section.slice(1)}` as "reservations.noUpcoming" | "reservations.noActive" | "reservations.noHistory")}</Text> : sections[section].map((reservation) => <Pressable key={reservation.id} onPress={() => navigation.navigate('BookingDetails', { reservationId: reservation.id })}><ReservationCard reservation={reservation} userId={user!.id} selected={reservation.id === selectedId} onCustomerStart={startCustomer} onOwnerStart={startOwner} /></Pressable>)}</>;
  return <SafeAreaView style={styles.safeArea} edges={["top"]}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><Text style={styles.eyebrow}>{t("reservations.eyebrow")}</Text><Text style={styles.title}>{t("reservations.title")}</Text>{loading ? <View style={styles.state}><ActivityIndicator color={colors.primary} /></View> : error ? <View style={styles.state}><Text style={styles.error}>{error}</Text></View> : reservations.length === 0 ? <View style={styles.state}><Ionicons name="calendar-outline" size={28} color={colors.textMuted} /><Text style={styles.empty}>{t("reservations.empty")}</Text></View> : <>{renderSection("upcoming", t("reservations.upcoming"))}{renderSection("active", t("reservations.active"))}{renderSection("history", t("reservations.previous"))}</>}</ScrollView></SafeAreaView>;
}

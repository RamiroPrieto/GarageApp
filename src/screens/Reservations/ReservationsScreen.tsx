import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getMyReservations } from "../../api/reservation.api";
import { Reservation, ReservationStatus } from "../../types/reservation.types";
import { colors } from "../../theme/colors";
import { styles } from "./Reservations.styles";

const statusLabels: Record<ReservationStatus, string> = {
  PENDING: "In attesa",
  CONFIRMED: "Confermata",
  CANCELLED: "Annullata",
  COMPLETED: "Completata",
  EXPIRED: "Scaduta",
};

function ReservationCard({ reservation }: { reservation: Reservation }) {
  const start = new Date(reservation.startDatetime);
  const end = new Date(reservation.endDatetime);
  const parkingName = reservation.parking?.title ?? `Parking #${reservation.parkingId}`;
  const address = reservation.parking
    ? `${reservation.parking.address}, ${reservation.parking.city}`
    : "Indirizzo non disponibile";
  const badgeStyle = {
    PENDING: styles.badgePENDING,
    CONFIRMED: styles.badgeCONFIRMED,
    CANCELLED: styles.badgeCANCELLED,
    COMPLETED: styles.badgeCOMPLETED,
    EXPIRED: styles.badgeEXPIRED,
  }[reservation.status];
  const badgeTextStyle = {
    PENDING: styles.badgeTextPENDING,
    CONFIRMED: styles.badgeTextCONFIRMED,
    CANCELLED: styles.badgeTextCANCELLED,
    COMPLETED: styles.badgeTextCOMPLETED,
    EXPIRED: styles.badgeTextEXPIRED,
  }[reservation.status];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.parkingInfo}>
          <Text style={styles.parkingName}>{parkingName}</Text>
          <Text style={styles.address}>{address}</Text>
        </View>
        <View style={[styles.badge, badgeStyle]}>
          <Text style={[styles.badgeText, badgeTextStyle]}>{statusLabels[reservation.status]}</Text>
        </View>
      </View>
      <View style={styles.dateRow}>
        <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.date}>{start.toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })}</Text>
      </View>
      <View style={styles.detailsRow}>
        <Text style={styles.time}>{start.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })} – {end.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}</Text>
        <Text style={styles.price}>€ {Number(reservation.totalPrice).toFixed(2)}</Text>
      </View>
    </View>
  );
}

export function ReservationsScreen() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setReservations(await getMyReservations());
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Impossibile caricare le prenotazioni");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { void loadReservations(); }, [loadReservations]));

  const now = new Date();
  const upcoming = reservations.filter((reservation) => new Date(reservation.endDatetime) >= now).sort((a, b) => new Date(a.startDatetime).getTime() - new Date(b.startDatetime).getTime());
  const previous = reservations.filter((reservation) => new Date(reservation.endDatetime) < now).sort((a, b) => new Date(b.endDatetime).getTime() - new Date(a.endDatetime).getTime());

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>LE TUE SOSTE</Text>
        <Text style={styles.title}>Le mie prenotazioni</Text>
        {loading ? <View style={styles.state}><ActivityIndicator color={colors.primary} /></View> : error ? <View style={styles.state}><Text style={styles.error}>{error}</Text></View> : reservations.length === 0 ? <View style={styles.state}><Ionicons name="calendar-outline" size={28} color={colors.textMuted} /><Text style={styles.empty}>Non hai ancora prenotazioni</Text></View> : <>
          <Text style={styles.sectionTitle}>Prossime</Text>
          {upcoming.length === 0 ? <Text style={styles.sectionEmpty}>Nessuna prenotazione in programma</Text> : upcoming.map((reservation) => <ReservationCard key={reservation.id} reservation={reservation} />)}
          <Text style={styles.sectionTitle}>Precedenti</Text>
          {previous.length === 0 ? <Text style={styles.sectionEmpty}>Nessuna prenotazione precedente</Text> : previous.map((reservation) => <ReservationCard key={reservation.id} reservation={reservation} />)}
        </>}
      </ScrollView>
    </SafeAreaView>
  );
}

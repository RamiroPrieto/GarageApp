import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { Reservation } from "../../types/reservation.types";
import { styles } from "./UpcomingReservationCard.styles";

type Props = {
  reservation: Reservation;
  onPress: () => void;
};

export function UpcomingReservationCard({ reservation, onPress }: Props) {
  const start = new Date(reservation.startDatetime);
  const end = new Date(reservation.endDatetime);
  const today = new Date().toDateString() === start.toDateString();

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>PROSSIMA PRENOTAZIONE</Text>
        <Ionicons name="chevron-forward" size={18} style={styles.icon} />
      </View>
      <Text style={styles.title}>{reservation.parking?.title ?? `Parking #${reservation.parkingId}`}</Text>
      <Text style={styles.date}>{today ? "Oggi" : start.toLocaleDateString("it-IT", { day: "2-digit", month: "short" })}</Text>
      <Text style={styles.time}>{start.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })} – {end.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}</Text>
    </Pressable>
  );
}

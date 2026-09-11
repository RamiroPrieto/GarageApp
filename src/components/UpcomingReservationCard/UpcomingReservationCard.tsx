import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { Reservation } from "../../types/reservation.types";
import { styles } from "./UpcomingReservationCard.styles";
import { useI18n } from "../../context/I18nContext";

type Props = {
  reservation: Reservation;
  onPress: () => void;
};

export function UpcomingReservationCard({ reservation, onPress }: Props) {
  const { dateLocale, t } = useI18n();
  const start = new Date(reservation.startDatetime);
  const end = new Date(reservation.endDatetime);
  const today = new Date().toDateString() === start.toDateString();

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>{t("upcomingReservation.eyebrow")}</Text>
        <Ionicons name="chevron-forward" size={18} style={styles.icon} />
      </View>
      <Text style={styles.title}>{reservation.parking?.title ?? t("parking.fallbackName", { id: reservation.parkingId })}</Text>
      <Text style={styles.date}>{today ? t("upcomingReservation.today") : start.toLocaleDateString(dateLocale, { day: "2-digit", month: "short" })}</Text>
      <Text style={styles.time}>{start.toLocaleTimeString(dateLocale, { hour: "2-digit", minute: "2-digit" })} – {end.toLocaleTimeString(dateLocale, { hour: "2-digit", minute: "2-digit" })}</Text>
    </Pressable>
  );
}

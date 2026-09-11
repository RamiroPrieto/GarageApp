import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ParkingCardProps } from "./ParkingCard.types";
import { styles } from "./ParkingCard.styles";
import { Button } from "../Button";
import { useI18n } from "../../context/I18nContext";

export function ParkingCard({ parking, onClose, onReserve }: ParkingCardProps) {
  const { t } = useI18n();
  const isAvailable = parking.parkingStatus === "AVAILABLE";
  return (
    <View style={styles.container}>
      <View style={styles.handle} />
      <Pressable style={styles.closeButton} onPress={onClose} hitSlop={8}>
        <Ionicons name="close" size={20} color="#8E97AD" />
      </Pressable>
      <View style={styles.row}>
        <Text style={styles.title}>{parking.title}</Text>
        <View style={styles.price}><Text style={styles.priceNumber}>€{parking.pricePerHour}</Text><Text style={styles.priceText}>{t("parking.perHour")}</Text></View>
      </View>
      <View style={styles.infoRow}><Ionicons name="location-outline" size={17} color="#8E97AD" /><Text style={styles.infoText}>{parking.address}, {parking.city}</Text></View>
      <View style={styles.infoRow}><Ionicons name="grid-outline" size={17} color="#8E97AD" /><Text style={styles.infoText}>{isAvailable ? t("parking.spacesAvailable") : t("parking.unavailable")}</Text></View>
      <Text style={styles.detail}>{t("parking.dimensions", { height: parking.maxHeight ?? "-", width: parking.maxWidth ?? "-" })}</Text>
      <Button title={t("parking.reserve")} onPress={() => onReserve(parking)} />
    </View>
  );
}

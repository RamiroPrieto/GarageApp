import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export const styles = StyleSheet.create({
  container: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, paddingTop: 14, elevation: 12, shadowColor: "#000", shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.35, shadowRadius: 14 },
  handle: { alignSelf: "center", width: 36, height: 4, borderRadius: 2, backgroundColor: "#3C4253", marginBottom: 16 },
  closeButton: { position: "absolute", top: 17, right: 18, zIndex: 1 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12, marginBottom: 18 },
  title: { flex: 1, color: colors.text, fontSize: 19, ...typography.semiBold },
  price: { alignItems: "flex-end" },
  priceNumber: { color: colors.primary, fontSize: 22, ...typography.semiBold },
  priceText: { color: colors.textMuted, fontSize: 10, ...typography.regular, marginTop: 2 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 13 },
  infoText: { color: colors.text, fontSize: 13, ...typography.medium },
  detail: { color: colors.textSecondary, fontSize: 12, ...typography.regular, marginBottom: 20 },
  address: {}, detailLegacy: {}, status: {}, available: {}, unavailable: {}, statusText: {}, closeText: {}, dayPrice: {},
});

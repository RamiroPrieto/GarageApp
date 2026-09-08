import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 36 },
  eyebrow: { color: colors.accent, fontSize: 11, letterSpacing: 1, ...typography.medium },
  title: { color: colors.text, fontSize: 26, marginTop: 5, marginBottom: 26, ...typography.semiBold },
  sectionTitle: { color: colors.text, fontSize: 17, marginTop: 12, marginBottom: 12, ...typography.semiBold },
  card: { backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 15, marginBottom: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  parkingInfo: { flex: 1 },
  parkingName: { color: colors.text, fontSize: 16, ...typography.semiBold },
  address: { color: colors.textSecondary, fontSize: 12, marginTop: 4, ...typography.regular },
  badge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5, alignSelf: "flex-start" },
  badgeText: { fontSize: 10, ...typography.medium },
  badgePENDING: { backgroundColor: "rgba(255, 190, 80, 0.15)" }, badgeTextPENDING: { color: "#FFBE50" },
  badgeCONFIRMED: { backgroundColor: "rgba(0, 169, 145, 0.15)" }, badgeTextCONFIRMED: { color: colors.success },
  badgeCANCELLED: { backgroundColor: "rgba(255, 102, 122, 0.15)" }, badgeTextCANCELLED: { color: colors.danger },
  badgeCOMPLETED: { backgroundColor: "rgba(109, 93, 251, 0.15)" }, badgeTextCOMPLETED: { color: colors.primary },
  badgeEXPIRED: { backgroundColor: "rgba(142, 151, 173, 0.15)" }, badgeTextEXPIRED: { color: colors.textSecondary },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 16 },
  date: { color: colors.textSecondary, fontSize: 13, ...typography.regular },
  detailsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 9 },
  time: { color: colors.text, fontSize: 14, ...typography.medium },
  price: { color: colors.text, fontSize: 14, ...typography.semiBold },
  state: { minHeight: 220, justifyContent: "center", alignItems: "center", gap: 12 },
  empty: { color: colors.textSecondary, fontSize: 14, ...typography.regular },
  error: { color: colors.danger, fontSize: 14, textAlign: "center", ...typography.regular },
  sectionEmpty: { color: colors.textMuted, fontSize: 13, marginBottom: 18, ...typography.regular },
});

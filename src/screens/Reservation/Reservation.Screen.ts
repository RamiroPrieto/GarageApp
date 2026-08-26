import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 48 },
  title: { fontSize: 27, color: colors.text, ...typography.semiBold, marginBottom: 28 },
  section: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 16, marginBottom: 12 },
  label: { fontSize: 11, color: colors.textSecondary, letterSpacing: 0.55, marginBottom: 7, ...typography.medium },
  value: { fontSize: 16, color: colors.text, ...typography.medium },
  divider: { display: "none" },
  row: { flexDirection: "row", gap: 12, marginBottom: 25 },
  timeContainer: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 16 },
});

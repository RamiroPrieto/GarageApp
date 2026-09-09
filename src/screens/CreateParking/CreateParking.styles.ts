import { StyleSheet } from "react-native";

import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 36 },
  header: { alignItems: "flex-start", flexDirection: "row", marginBottom: 24 },
  backButton: { paddingRight: 14, paddingTop: 3 },
  headerText: { flex: 1 },
  eyebrow: { ...typography.medium, color: colors.accent, fontSize: 11, letterSpacing: 0.8, marginBottom: 5 },
  title: { ...typography.semiBold, color: colors.text, fontSize: 25 },
  multilineInput: { height: 90, textAlignVertical: "top" },
  sectionTitle: { ...typography.semiBold, color: colors.text, fontSize: 15, marginBottom: 5, marginTop: 16 },
  locationHint: { ...typography.regular, color: colors.textSecondary, fontSize: 12, marginBottom: 10 },
  rowInputs: { flexDirection: "row", gap: 12 },
  halfInput: { flex: 1 },
  typeOptions: { flexDirection: "row", gap: 8, marginBottom: 4 },
  typeOption: { borderColor: colors.border, borderRadius: 10, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10 },
  typeOptionSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeText: { ...typography.medium, color: colors.textSecondary, fontSize: 13 },
  typeTextSelected: { color: colors.text },
  coveredRow: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 12, borderWidth: 1, flexDirection: "row", justifyContent: "space-between", marginBottom: 18, marginTop: 4, padding: 14 },
  coveredTitle: { ...typography.medium, color: colors.text, fontSize: 14 },
  coveredDescription: { ...typography.regular, color: colors.textSecondary, fontSize: 11, marginTop: 3, maxWidth: 240 },
  requestError: { ...typography.regular, color: colors.danger, fontSize: 13, marginBottom: 12, textAlign: "center" },
});

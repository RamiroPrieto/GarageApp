import { StyleSheet } from "react-native";

import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, padding: 20, paddingBottom: 36 },
  header: { alignItems: "center", flexDirection: "row", marginBottom: 24 },
  backButton: { paddingRight: 14, paddingVertical: 4 },
  title: { ...typography.semiBold, color: colors.text, fontSize: 25 },
  subtitle: { ...typography.regular, color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 14, borderWidth: 1, marginBottom: 12, padding: 16 },
  vehicleName: { ...typography.semiBold, color: colors.text, fontSize: 17 },
  plate: { ...typography.medium, color: colors.primary, fontSize: 14, marginTop: 5 },
  actions: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
  defaultRow: { alignItems: "center", flexDirection: "row" },
  defaultLabel: { ...typography.medium, color: colors.textSecondary, fontSize: 13, marginRight: 8 },
  actionButtons: { flexDirection: "row", gap: 8 },
  editButton: { borderColor: colors.primary, borderRadius: 9, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 8 },
  editText: { ...typography.medium, color: colors.primary, fontSize: 13 },
  deleteButton: { borderColor: colors.danger, borderRadius: 9, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 8 },
  deleteText: { ...typography.medium, color: colors.danger, fontSize: 13 },
  addButton: { alignItems: "center", backgroundColor: colors.primary, borderRadius: 12, marginTop: 12, padding: 15 },
  addText: { ...typography.semiBold, color: colors.text, fontSize: 15 },
  empty: { alignItems: "center", flex: 1, justifyContent: "center", paddingHorizontal: 26 },
  emptyTitle: { ...typography.semiBold, color: colors.text, fontSize: 20, marginTop: 12, textAlign: "center" },
  emptyText: { ...typography.regular, color: colors.textSecondary, fontSize: 14, marginBottom: 22, marginTop: 8, textAlign: "center" },
  error: { ...typography.regular, color: colors.danger, fontSize: 13, marginBottom: 12, textAlign: "center" },
});

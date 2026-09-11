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
  vehicleHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 7 },
  vehicleHeaderLabel: { marginBottom: 0 },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: { fontSize: 20, color: colors.primary, lineHeight: 22, ...typography.medium },
  vehicleField: { minHeight: 24, justifyContent: "center" },
  vehicleList: { marginTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  vehicleItem: { paddingTop: 12, paddingBottom: 8 },
  vehiclePlate: { fontSize: 12, color: colors.textSecondary, marginTop: 3, ...typography.regular },
  addVehicleEmpty: { borderColor: colors.primary, borderRadius: 8, borderWidth: 1, marginTop: 12, padding: 10 },
  addVehicleEmptyText: { ...typography.medium, color: colors.primary, fontSize: 13, textAlign: "center" },
});

import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 2, justifyContent: "center" },
  title: { ...typography.semiBold, fontSize: 28, color: colors.text, marginBottom: 8 },
  subtitle: { ...typography.regular, fontSize: 14, lineHeight: 20, color: colors.textSecondary, marginBottom: 30 },
  label: { ...typography.medium, fontSize: 11, letterSpacing: 0.6, color: colors.textSecondary, marginBottom: 8, marginTop: 2 },
  input: { height: 54, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 13, justifyContent: "center", paddingHorizontal: 16, marginBottom: 19 },
  inputText: { ...typography.regular, color: colors.text, fontSize: 14 },
  location: { height: 54, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 13, justifyContent: "center", paddingHorizontal: 16, marginBottom: 19 },
  locationText: { ...typography.regular, color: colors.text, fontSize: 14 },
  vehicleList: { backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border, borderRadius: 13, marginTop: -10, marginBottom: 19, overflow: "hidden" },
  vehicleItem: { paddingVertical: 13, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  vehiclePlate: { ...typography.regular, fontSize: 12, color: colors.textSecondary, marginTop: 3 },
});

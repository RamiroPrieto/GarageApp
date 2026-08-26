import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export const styles = StyleSheet.create({
  header: { position: "absolute", top: 54, left: 20, right: 20, zIndex: 2, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  city: { color: colors.accent, fontSize: 11, letterSpacing: 0.8, ...typography.medium, marginBottom: 3 },
  title: { color: colors.text, fontSize: 20, ...typography.semiBold },
  searchButton: { height: 40, width: 40, borderRadius: 20, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border, justifyContent: "center", alignItems: "center" },
  count: { position: "absolute", bottom: 26, alignSelf: "center", zIndex: 1, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  countText: { color: colors.textSecondary, fontSize: 11, ...typography.regular },
});

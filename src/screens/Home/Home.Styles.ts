import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export const styles = StyleSheet.create({
  header: { position: "absolute", top: 54, left: 20, right: 20, zIndex: 2, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  city: { color: colors.accent, fontSize: 11, letterSpacing: 0.8, ...typography.medium, marginBottom: 3 },
  title: { color: colors.text, fontSize: 20, ...typography.semiBold },
  searchButton: { height: 40, width: 40, borderRadius: 20, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border, justifyContent: "center", alignItems: "center" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  creditsButton: { height: 40, borderRadius: 20, paddingHorizontal: 11, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", gap: 5 },
  creditsText: { color: colors.text, fontSize: 12, ...typography.medium },
  creditsPlus: { color: colors.accent, fontSize: 18, ...typography.semiBold, marginTop: -1 },
  searchContainer: { flex: 1, minHeight: 44, flexDirection: "row", alignItems: "center", paddingHorizontal: 13, backgroundColor: colors.surfaceRaised, borderColor: colors.border, borderWidth: 1, borderRadius: 14 },
  searchInput: { flex: 1, color: colors.text, fontSize: 14, marginHorizontal: 9, paddingVertical: 10, ...typography.regular },
  suggestions: { position: "absolute", top: 50, left: 0, right: 0, backgroundColor: colors.surfaceRaised, borderColor: colors.border, borderWidth: 1, borderRadius: 14, overflow: "hidden", paddingVertical: 4 },
  suggestion: { flexDirection: "row", alignItems: "center", gap: 9, paddingHorizontal: 13, paddingVertical: 12 },
  suggestionText: { flex: 1, color: colors.text, fontSize: 13, ...typography.regular },
  count: { position: "absolute", bottom: 26, alignSelf: "center", zIndex: 1, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  countText: { color: colors.textSecondary, fontSize: 11, ...typography.regular },
});

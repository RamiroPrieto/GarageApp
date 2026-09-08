import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export const styles = StyleSheet.create({
  card: { position: "absolute", left: 20, right: 20, bottom: 20, backgroundColor: colors.surfaceRaised, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16 },
  heading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  eyebrow: { color: colors.accent, fontSize: 10, letterSpacing: 0.8, ...typography.medium },
  icon: { color: colors.textSecondary },
  title: { color: colors.text, fontSize: 16, marginTop: 8, ...typography.semiBold },
  date: { color: colors.textSecondary, fontSize: 12, marginTop: 8, ...typography.regular },
  time: { color: colors.text, fontSize: 14, marginTop: 2, ...typography.medium },
});

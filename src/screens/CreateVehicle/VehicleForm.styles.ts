import { StyleSheet } from "react-native";

import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, padding: 20, paddingBottom: 36 },
  header: { alignItems: "flex-start", flexDirection: "row", marginBottom: 24 },
  backButton: { paddingRight: 14, paddingTop: 3 },
  eyebrow: { ...typography.medium, color: colors.accent, fontSize: 11, letterSpacing: 0.8, marginBottom: 5 },
  title: { ...typography.semiBold, color: colors.text, fontSize: 25 },
  error: { ...typography.regular, color: colors.danger, fontSize: 13, marginBottom: 12, textAlign: "center" },
});

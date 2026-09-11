import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  hero: { height: 180, justifyContent: "flex-end", padding: 28, paddingBottom: 30, backgroundColor: colors.surfaceMuted, borderBottomWidth: 1, borderBottomColor: colors.border },
  eyebrow: { color: colors.accent, fontSize: 11, letterSpacing: 1.1, ...typography.medium, marginBottom: 5 },
  brand: { color: colors.text, fontSize: 29, ...typography.semiBold },
  form: { flexGrow: 1, paddingHorizontal: 38, paddingTop: 18, paddingBottom: 32 },
  forgotPassword: { color: colors.primary, fontSize: 12, ...typography.medium, marginBottom: 22, width: "100%", textAlign: "right" },
  error: { color: colors.danger, fontSize: 12, ...typography.regular, marginBottom: 12 },
  notice: { color: colors.success, fontSize: 12, ...typography.regular, marginBottom: 12 },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 25 },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textMuted, marginHorizontal: 12, fontSize: 11, ...typography.regular },
  socialRow: { flexDirection: "row", gap: 12 },
});

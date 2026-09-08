import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export const styles = StyleSheet.create({
  container: { width: "100%", marginBottom: 17 },
  label: {
    marginBottom: 8,
    color: colors.textSecondary,
    fontSize: 11,
    letterSpacing: 0.55,
    ...typography.medium,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  input: {
    height: 56,
    color: colors.text,
    fontSize: 14,
    ...typography.regular,
    flex: 1,
  },
  eye: { fontSize: 20 },
  error: { color: colors.danger, fontSize: 12, marginTop: 6, ...typography.regular },
});

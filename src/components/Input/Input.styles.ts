import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 17,
  },

  label: {
    color: colors.textSecondary,
    marginBottom: 8,
    fontSize: 11,
    letterSpacing: 0.55,
    ...typography.medium,
  },

  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    color: colors.text,
    fontSize: 14,
    ...typography.regular,
  },

  error: {
    color: colors.danger,
    marginTop: 6,
    fontSize: 12,
  },
});

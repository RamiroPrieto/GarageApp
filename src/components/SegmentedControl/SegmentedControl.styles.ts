import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },

  button: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 10,
  },

  activeButton: {
    backgroundColor: colors.primary,
  },

  text: {
    color: colors.textSecondary,
    fontSize: 13,
    ...typography.medium,
  },

  activeText: {
    color: colors.text,
  },
});

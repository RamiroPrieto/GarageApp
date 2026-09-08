import { StyleSheet } from "react-native";

import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  icon: {
    fontSize: 72,
    marginBottom: 24,
    color: colors.primary,
  },

  title: {
    fontSize: 24,
    ...typography.semiBold,
    color: colors.text,
    textAlign: "center",
    marginBottom: 12,
  },

  description: {
    fontSize: 16,
    ...typography.medium,
    color: colors.text,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },

  buttonContainer: {
    width: "100%",
  },
});
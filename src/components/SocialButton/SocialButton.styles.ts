import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    gap: 10,
  },

  text: {
    color: colors.text,
    fontSize: 13,
    ...typography.medium,
  },
});

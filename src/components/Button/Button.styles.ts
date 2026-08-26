import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

export const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    height: 54,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  pressed: {
    opacity: 0.8,
  },

  text: {
    color: colors.text,
    fontSize: 16,
    ...typography.semiBold,
  },
});

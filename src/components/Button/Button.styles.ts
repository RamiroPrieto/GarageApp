import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 16,
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
    fontWeight: "600",
  },
});
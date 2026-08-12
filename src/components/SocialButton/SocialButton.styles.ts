import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2B2F3A",

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    gap: 10,
  },

  text: {
    color: "white",
    fontWeight: "600",
  },
});
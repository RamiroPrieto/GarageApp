import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#1C1F2A",
    borderRadius: 12,
    padding: 4,
    marginBottom: 8
  },

  button: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 10,
  },

  activeButton: {
    backgroundColor: "#6C63FF",
  },

  text: {
    color: "#8B90A0",
    fontWeight: "600",
  },

  activeText: {
    color: "#FFF",
  },
});
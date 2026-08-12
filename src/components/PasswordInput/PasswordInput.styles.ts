import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },

  label: {
    marginBottom: 8,
    color: "#FFFFFF",
    fontWeight: "600",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1F2A",
    borderRadius: 12,
    color: "#FFFFFF",
    paddingHorizontal: 16,
  },

  input: {
    backgroundColor: "#1C1F2A",
    borderRadius: 12,
    // paddingHorizontal: 16,
    height: 56,
    color: "#FFF",
    fontSize: 16,
    flex: 1
  },

  eye: {
    fontSize: 20,
  },
});
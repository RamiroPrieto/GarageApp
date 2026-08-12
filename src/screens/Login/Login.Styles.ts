import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
  },

  forgotPassword:{
    color: "white",
    marginBottom: 20,
    width: "100%",
    textAlign: "right"
  },

  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#2B2F3A",
  },
  
  dividerText: {
    color: "#8B90A0",
    marginHorizontal: 12,
    fontSize: 12,
  },
});
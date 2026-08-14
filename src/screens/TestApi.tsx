import { useState } from "react";
import { Button, Text, View } from "react-native";
import { apiFetch } from "../api/api";

export function TestApiScreen() {
  const [result, setResult] = useState("");

  async function testConnection() {
    try {
      const data = await apiFetch("/parkings");
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(
        error instanceof Error
          ? error.message
          : "Error desconocido",
      );
    }
  }

  return (
    <View style={{ flex: 1, padding: 30, justifyContent: "center" }}>
      <Button
        title="Probar conexión"
        onPress={testConnection}
      />

      <Text style={{ marginTop: 20 }}>
        {result}
      </Text>
    </View>
  );
}
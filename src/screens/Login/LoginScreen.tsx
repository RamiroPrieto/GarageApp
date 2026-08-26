import { useState } from "react";
import { SafeAreaView, Text, View } from "react-native";

import { styles } from "./Login.Styles";
import { SegmentedControl } from "../../components/SegmentedControl/SegmentedControl";
import { Input } from "../../components/Input/Input";
import { PasswordInput } from "../../components/PasswordInput/PasswordInput";
import { Button } from "../../components/Button";
import { SocialButton } from "../../components/SocialButton";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/api";

export function LoginScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async () => {
    try {
      setError("");
      setLoading(true);
      if (mode === "login") {
        await login(email, password);
        return;
      }
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      setMode("login");
      setPassword("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>BIENVENIDO A</Text>
        <Text style={styles.brand}>Espacios</Text>
      </View>
      <View style={styles.form}>
        <SegmentedControl value={mode} onChange={setMode} />
        {mode === "register" && <>
          <Input label="NOMBRE" placeholder="Ingresá tu nombre" autoCapitalize="words" value={firstName} onChangeText={setFirstName} />
          <Input label="APELLIDO" placeholder="Ingresá tu apellido" autoCapitalize="words" value={lastName} onChangeText={setLastName} />
        </>}
        <Input label="EMAIL" placeholder="tu@email.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <PasswordInput label="CONTRASEÑA" placeholder="Ingresá tu contraseña" value={password} onChangeText={setPassword} />
        {mode === "login" && <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>}
        {error !== "" && <Text style={styles.error}>{error}</Text>}
        <Button title={loading ? "Cargando..." : mode === "login" ? "Ingresar" : "Registrarse"} onPress={handleSubmit} />
        <View style={styles.divider}><View style={styles.line} /><Text style={styles.dividerText}>o continuá con</Text><View style={styles.line} /></View>
        <View style={styles.socialRow}><SocialButton provider="google" onPress={() => {}} /><SocialButton provider="apple" onPress={() => {}} /></View>
      </View>
    </SafeAreaView>
  );
}

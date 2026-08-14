import { View, Text } from "react-native";
import { useState } from "react";

import { styles } from "./Login.Styles";
import { globalStyles } from "../../theme/global.styles";
import { SegmentedControl } from "../../components/SegmentedControl/SegmentedControl";
import { Input } from "../../components/Input/Input";
import { PasswordInput } from "../../components/PasswordInput/PasswordInput";
import { Button } from "../../components/Button";
import { SocialButton } from "../../components/SocialButton";

import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/api";

export function LoginScreen() {
  const [mode, setMode] =
    useState<"login" | "register">("login");

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

        console.log("Login exitoso");

        return;
      }

      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      console.log("Registro exitoso");
      console.log(data);

      setMode("login");
      setPassword("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        globalStyles.screen,
        globalStyles.center,
      ]}
    >
      <SegmentedControl
        value={mode}
        onChange={setMode}
      />

      {mode === "register" && (
        <>
          <Input
            label="Nombre"
            placeholder="Ingresá tu Nombre"
            autoCapitalize="words"
            value={firstName}
            onChangeText={setFirstName}
          />

          <Input
            label="Apellido"
            placeholder="Ingresá tu Apellido"
            autoCapitalize="words"
            value={lastName}
            onChangeText={setLastName}
          />
        </>
      )}

      <Input
        label="Email"
        placeholder="Ingresá tu email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <PasswordInput
        label="Contraseña"
        placeholder="Ingrese su contraseña"
        value={password}
        onChangeText={setPassword}
      />

      {mode === "login" && (
        <Text style={styles.forgotPassword}>
          ¿Olvidaste tu contraseña?
        </Text>
      )}

      {error !== "" && (
        <Text>
          {error}
        </Text>
      )}

      <Button
        title={
          loading
            ? "Cargando..."
            : mode === "login"
              ? "Ingresar"
              : "Registrarse"
        }
        onPress={handleSubmit}
      />

      <View style={styles.divider}>
        <View style={styles.line} />

        <Text style={styles.dividerText}>
          o continuá con
        </Text>

        <View style={styles.line} />
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 16,
        }}
      >
        <SocialButton
          provider="google"
          onPress={() => {}}
        />

        <SocialButton
          provider="apple"
          onPress={() => {}}
        />
      </View>
    </View>
  );
}
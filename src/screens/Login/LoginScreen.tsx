import { View, Text } from "react-native";
import { styles } from "./Login.Styles";
import { globalStyles } from "../../theme/global.styles";
import { SegmentedControl } from "../../components/SegmentedControl/SegmentedControl";
import { Input } from "../../components/Input/Input";
import { PasswordInput } from "../../components/PasswordInput/PasswordInput";
import { Button } from "../../components/Button";
import { useState } from "react";
import { SocialButton } from "../../components/SocialButton";

export function LoginScreen() {

  const [mode , setMode] = useState<"login" | "register">("login")
 
  const handleSubmit = () =>{
    console.log("qasd")
  }

  return (
    <View style={[
      globalStyles.screen,
      globalStyles.center,
    ]}>
      <SegmentedControl
        value={mode}
        onChange={setMode}
      />
      { mode == "register" &&
        <>
            <Input
            label="Nombre"
            placeholder="Ingresá tu Nombre"
            autoCapitalize="words"
            />  
            <Input
            label="Apellido"
            placeholder="Ingresá tu Apellido"
            autoCapitalize="words"
            />  
        </>
      }
      <Input
        label="Email"
        placeholder="Ingresá tu email"
        keyboardType="email-address"
        autoCapitalize="none"
        />
      <PasswordInput
        label="Contraseña"
        placeholder="Ingrese su contraseña"
        value=""
        onChange={() => {}}
      />
      { mode == "login" &&
          <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
      }
      <Button
        title={mode === "login" ? "Ingresar" : "Registrarse"}
        // onPress={handleSubmit()}
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
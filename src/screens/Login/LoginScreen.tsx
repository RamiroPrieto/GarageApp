import { GoogleSignin, isSuccessResponse } from "@react-native-google-signin/google-signin";
import { useState } from "react";
import { SafeAreaView, Text, View } from "react-native";

import { apiFetch } from "../../api/api";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input/Input";
import { PasswordInput } from "../../components/PasswordInput/PasswordInput";
import { SegmentedControl } from "../../components/SegmentedControl/SegmentedControl";
import { SocialButton } from "../../components/SocialButton";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../context/I18nContext";
import { styles } from "./Login.Styles";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
});

export function LoginScreen() {
  const { t } = useI18n();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();

  const validate = () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return t("auth.invalidEmail");
    if (password.length < 8) return t("auth.passwordMin");
    if (mode === "register" && (!firstName.trim() || !lastName.trim() || !phone.trim())) return t("auth.completeFields");
    if (mode === "register" && !/^\+?[1-9]\d{6,14}$/.test(phone.trim())) return t("auth.invalidPhone");
    return null;
  };

  const handleSubmit = async () => {
    setError("");
    setNotice("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      if (mode === "login") {
        await login(email.trim(), password);
        return;
      }
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password, phone: phone.trim() }),
      });
      setMode("login");
      setPassword("");
      setNotice(t("auth.registerCheckEmail"));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : t("auth.genericError"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;
    try {
      setError("");
      setNotice("");
      setLoading(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();
      if (!isSuccessResponse(response)) return;
      if (!response.data.idToken) throw new Error(t("auth.googleInvalidCredential"));
      await loginWithGoogle(response.data.idToken);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : t("auth.googleError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.hero}><Text style={styles.eyebrow}>{t("auth.welcome")}</Text><Text style={styles.brand}>GarageApp</Text></View>
      <View style={styles.form}>
        <SegmentedControl value={mode} onChange={setMode} />
        {mode === "register" && <>
          <Input label={t("auth.firstName")} placeholder={t("auth.firstNamePlaceholder")} autoCapitalize="words" value={firstName} onChangeText={setFirstName} />
          <Input label={t("auth.lastName")} placeholder={t("auth.lastNamePlaceholder")} autoCapitalize="words" value={lastName} onChangeText={setLastName} />
          <Input label={t("auth.phone")} placeholder="+5492230000000" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        </>}
        <Input label={t("auth.email")} placeholder={t("auth.emailPlaceholder")} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <PasswordInput label={t("auth.password")} placeholder={t("auth.passwordPlaceholder")} value={password} onChangeText={setPassword} />
        {mode === "login" && <Text style={styles.forgotPassword}>{t("auth.forgotPassword")}</Text>}
        {error !== "" && <Text style={styles.error}>{error}</Text>}
        {notice !== "" && <Text style={styles.notice}>{notice}</Text>}
        <Button title={mode === "login" ? t("auth.login") : t("auth.register")} loading={loading} onPress={handleSubmit} />
        <View style={styles.divider}><View style={styles.line} /><Text style={styles.dividerText}>{t("auth.orContinueWith")}</Text><View style={styles.line} /></View>
        <View style={styles.socialRow}><SocialButton provider="google" onPress={handleGoogleLogin} /><SocialButton provider="apple" onPress={() => setNotice(t("auth.appleUnavailable"))} /></View>
      </View>
    </SafeAreaView>
  );
}

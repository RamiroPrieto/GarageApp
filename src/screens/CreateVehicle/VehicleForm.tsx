import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { colors } from "../../theme/colors";
import { Vehicle, VehicleInput } from "../../types/vehicle.type";
import { styles } from "./VehicleForm.styles";
import { useI18n } from "../../context/I18nContext";

type Props = {
  vehicle?: Vehicle;
  title: string;
  submitLabel: string;
  onBack: () => void;
  onSubmit: (vehicle: VehicleInput) => Promise<unknown>;
  onSuccess: () => void;
};

export function VehicleForm({ vehicle, title, submitLabel, onBack, onSubmit, onSuccess }: Props) {
  const { t } = useI18n();
  const [brand, setBrand] = useState(vehicle?.brand ?? "");
  const [model, setModel] = useState(vehicle?.model ?? "");
  const [licensePlate, setLicensePlate] = useState(vehicle?.licensePlate ?? "");
  const [color, setColor] = useState(vehicle?.color ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!licensePlate.trim()) {
      setError(t("management.plateRequired"));
      return;
    }
    try {
      setLoading(true);
      setError("");
      await onSubmit({
        licensePlate: licensePlate.trim().toUpperCase(),
        ...(brand.trim() ? { brand: brand.trim() } : {}),
        ...(model.trim() ? { model: model.trim() } : {}),
        ...(color.trim() ? { color: color.trim() } : {}),
      });
      onSuccess();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : t("management.vehicleSaveError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView style={styles.safeArea} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.content} keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
          <View style={styles.header}><Pressable onPress={onBack} style={styles.backButton} accessibilityLabel={t("management.back")}><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable><View><Text style={styles.eyebrow}>{t("management.myVehicles")}</Text><Text style={styles.title}>{title}</Text></View></View>
          <Input label={t("management.brand")} placeholder={t("management.brand")} value={brand} onChangeText={setBrand} autoCapitalize="words" />
          <Input label={t("management.model")} placeholder={t("management.model")} value={model} onChangeText={setModel} autoCapitalize="words" />
          <Input label={`${t("management.plate")} *`} placeholder={t("management.plate")} value={licensePlate} onChangeText={setLicensePlate} autoCapitalize="characters" maxLength={20} />
          <Input label={t("management.color")} placeholder={t("management.color")} value={color} onChangeText={setColor} autoCapitalize="words" />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title={submitLabel} onPress={handleSubmit} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

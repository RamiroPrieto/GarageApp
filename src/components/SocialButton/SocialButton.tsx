import { Pressable, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { styles } from "./SocialButton.styles";
import { SocialButtonProps } from "./SocialButton.types";

export function SocialButton({
  provider,
  onPress,
  label,
  disabled = false,
}: SocialButtonProps) {
  return (
    <Pressable
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <AntDesign
        name={provider}
        size={22}
        color={provider === "google" ? "#EA4335" : "#FFFFFF"}
      />

      <Text style={styles.text}>
        {label ?? (provider === "google" ? "Google" : "Apple")}
      </Text>
    </Pressable>
  );
}

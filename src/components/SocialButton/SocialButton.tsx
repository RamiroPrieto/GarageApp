import { Pressable, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { styles } from "./SocialButton.styles";
import { SocialButtonProps } from "./SocialButton.types";

export function SocialButton({
  provider,
  onPress,
}: SocialButtonProps) {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
    >
      <AntDesign
        name={provider}
        size={22}
        color={provider === "google" ? "#EA4335" : "#FFFFFF"}
      />

      <Text style={styles.text}>
        {provider === "google" ? "Google" : "Apple"}
      </Text>
    </Pressable>
  );
}
import { ActivityIndicator, Pressable, Text } from "react-native";

import { colors } from "../../theme/colors";
import { styles } from "./Button.styles";
import { ButtonProps } from "./Button.types";

export function Button({
  title,
  loading = false,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}
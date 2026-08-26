import { ActivityIndicator, Pressable, Text } from "react-native";
import { colors } from "../../theme/colors";
import { styles } from "./Button.styles";
import { ButtonProps } from "./Button.types";

export function Button({ title, loading = false, disabled, ...props }: ButtonProps) {
  const isDisabled = loading || disabled;
  return (
    <Pressable
      style={({ pressed }) => [styles.button, (pressed || isDisabled) && styles.pressed]}
      disabled={isDisabled}
      {...props}
    >
      {loading ? <ActivityIndicator color={colors.text} /> : <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
}

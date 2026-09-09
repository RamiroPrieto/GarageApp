import { View, Text, TextInput } from "react-native";

import { InputProps } from "./Input.types";
import { styles } from "./Input.styles";
import { colors } from "../../theme/colors";

export function Input({
  label,
  error,
  style,
  ...props
}: InputProps) {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}

      <TextInput
        {...props}
        style={[styles.input, style]}
        placeholderTextColor={colors.textSecondary}
      />

      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

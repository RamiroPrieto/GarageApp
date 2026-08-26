import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { PasswordInputProps } from "./PasswordInput.types";
import { styles } from "./PasswordInput.styles";
import { colors } from "../../theme/colors";

export function PasswordInput({ label, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          {...props}
          secureTextEntry={!showPassword}
          style={styles.input}
          placeholderTextColor={colors.textSecondary}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={19}
            color={colors.textSecondary}
          />
        </Pressable>
      </View>
    </View>
  );
}

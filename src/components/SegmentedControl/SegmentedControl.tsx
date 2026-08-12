import { Pressable, Text, View } from "react-native";
import { styles } from "./SegmentedControl.styles";
import { SegmentedControlProps } from "./SegmentedControl.types";

export function SegmentedControl({
  value,
  onChange,
}: SegmentedControlProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.button,
          value === "login" && styles.activeButton,
        ]}
        onPress={() => onChange("login")}
      >
        <Text
          style={[
            styles.text,
            value === "login" && styles.activeText,
          ]}
        >
          Ingresar
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.button,
          value === "register" && styles.activeButton,
        ]}
        onPress={() => onChange("register")}
      >
        <Text
          style={[
            styles.text,
            value === "register" && styles.activeText,
          ]}
        >
          Registrarse
        </Text>
      </Pressable>
    </View>
  );
}
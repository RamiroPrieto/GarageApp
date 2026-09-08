import { Pressable, Text, View } from "react-native";
import { useI18n } from "../../context/I18nContext";
import { styles } from "./SegmentedControl.styles";
import { SegmentedControlProps } from "./SegmentedControl.types";

export function SegmentedControl({
  value,
  onChange,
}: SegmentedControlProps) {
  const { t } = useI18n();

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
          {t("auth.login")}
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
          {t("auth.register")}
        </Text>
      </Pressable>
    </View>
  );
}
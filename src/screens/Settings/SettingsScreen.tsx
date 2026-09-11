import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { colors } from "../../theme/colors";
import { styles } from "./Settings.styles";
import { RootStackParamList } from "../../navigation/navigation.types";
import { useI18n } from "../../context/I18nContext";

type SettingsRowProps = {
  title: string;
  subtitle?: string;
  value?: string;
  bordered?: boolean;
  toggle?: boolean;
};

function SettingsRow({
  title,
  subtitle,
  value,
  bordered,
  toggle,
}: SettingsRowProps) {
  return (
    <View style={[styles.row, bordered && styles.rowBorder]}>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>

        {subtitle && (
          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        )}
      </View>

      {toggle ? (
        <View style={styles.toggle}>
          <View style={styles.toggleKnob} />
        </View>
      ) : (
        <>
          {value && (
            <Text style={styles.rowValue}>{value}</Text>
          )}

          <Ionicons
            name="chevron-forward"
            size={17}
            color={colors.primary}
          />
        </>
      )}
    </View>
  );
}

export function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { language, setPreference, t } = useI18n();
  const handleLogout = () => {
    Alert.alert(
      t("settings.logoutTitle"),
      t("settings.logoutMessage"),
      [
        {
          text: t("settings.cancel"),
          style: "cancel",
        },
        {
          text: t("settings.logout"),
          style: "destructive",
          onPress: () => {
            console.log("Logout");
          },
        },
      ]
    );
  };

  const selectLanguage = () => {
    Alert.alert(t("language.selectTitle"), t("language.selectMessage"), [
      { text: t("language.es"), onPress: () => void setPreference("es") },
      { text: t("language.en"), onPress: () => void setPreference("en") },
      { text: t("language.it"), onPress: () => void setPreference("it") },
      { text: t("settings.cancel"), style: "cancel" },
    ]);
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>{t("settings.eyebrow")}</Text>

        <Text style={styles.title}>
          {t("settings.title")}
        </Text>

        <View style={styles.profileCard}>
          <Text style={styles.avatar}>U</Text>

          <View style={styles.profileText}>
            <Text style={styles.profileName}>
              {t("settings.profileName")}
            </Text>

            <Text style={styles.profileEmail}>
              {t("settings.profileSubtitle")}
            </Text>
          </View>

          <Text style={styles.edit}>
            {t("settings.edit")}
          </Text>
        </View>

        <Text style={styles.sectionLabel}>
          {t("settings.preferences")}
        </Text>

        <View style={styles.group}>
          <SettingsRow
            title={t("settings.notifications")}
            subtitle={t("settings.notificationsSubtitle")}
            toggle
            bordered
          />

          <SettingsRow
            title={t("settings.paymentMethod")}
            subtitle={t("settings.paymentMethodSubtitle")}
            bordered
          />

          <Pressable style={styles.publishParking} onPress={() => navigation.navigate("MyVehicles")}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{t("management.manageVehicles")}</Text>
              <Text style={styles.rowSubtitle}>{t("management.manageVehiclesSubtitle")}</Text>
            </View>
            <Ionicons name="car-sport-outline" size={21} color={colors.primary} />
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>
          {t("settings.settings")}
        </Text>

        <View style={styles.group}>
          <Pressable
            style={({ pressed }) => [
              styles.publishParking,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => navigation.navigate("MyParkings")}
          >
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{t("management.manageParkings")}</Text>
              <Text style={styles.rowSubtitle}>{t("settings.vehiclesSubtitle")}</Text>
            </View>
            <Ionicons name="car-outline" size={21} color={colors.primary} />
          </Pressable>

          <SettingsRow
            title={t("settings.privacy")}
            subtitle={t("settings.privacySubtitle")}
            bordered
          />

          <Pressable style={styles.publishParking} onPress={selectLanguage}>
            <View style={styles.rowText}><Text style={styles.rowTitle}>{t("settings.language")}</Text></View>
            <Text style={styles.rowValue}>{t(`language.${language}`)}</Text>
            <Ionicons name="chevron-forward" size={17} color={colors.primary} />
          </Pressable>

          <SettingsRow
            title={t("settings.help")}
            subtitle={t("settings.helpSubtitle")}
          />
        </View>

        <Text style={styles.sectionLabel}>
          {t("settings.account")}
        </Text>

        <View style={styles.group}>
          <Pressable
            style={({ pressed }) => [
              styles.logout,
              pressed && { opacity: 0.7 },
            ]}
            onPress={handleLogout}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={colors.danger}
            />

            <Text style={styles.logoutText}>
              {t("settings.logout")}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { HomeScreen } from "../screens/Home";
import { SettingsScreen } from "../screens/Settings";
import { ReservationsScreen } from "../screens/Reservations";
import { useI18n } from "../context/I18nContext";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { MainTabParamList } from "./navigation.types";

const Tab = createBottomTabNavigator<MainTabParamList>();

export function BottomTabNavigator() {
  const { t } = useI18n();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surfaceMuted,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          ...typography.medium,
          fontSize: 11,
          marginTop: 2,
        },
        tabBarIcon: ({ color, focused, size }) => {
          const iconName =
            route.name === "Home"
              ? focused
                ? "home"
                : "home-outline"
              : route.name === "Reservations"
                ? focused
                  ? "calendar"
                  : "calendar-outline"
              : focused
                ? "settings"
                : "settings-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t("tabs.home") }} />
      <Tab.Screen
        name="Reservations"
        component={ReservationsScreen}
        options={{ title: t("tabs.reservations") }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t("tabs.settings") }}
      />
    </Tab.Navigator>
  );
}

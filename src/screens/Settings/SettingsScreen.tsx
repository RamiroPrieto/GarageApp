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
  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que querés cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: () => {
            console.log("Logout");
          },
        },
      ]
    );
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
        <Text style={styles.eyebrow}>PREFERENZE</Text>

        <Text style={styles.title}>
          Configurazione
        </Text>

        <View style={styles.profileCard}>
          <Text style={styles.avatar}>U</Text>

          <View style={styles.profileText}>
            <Text style={styles.profileName}>
              Il tuo profilo
            </Text>

            <Text style={styles.profileEmail}>
              Gestisci le tue informazioni
            </Text>
          </View>

          <Text style={styles.edit}>
            Modifica
          </Text>
        </View>

        <Text style={styles.sectionLabel}>
          PREFERENZE
        </Text>

        <View style={styles.group}>
          <SettingsRow
            title="Notifiche"
            subtitle="Aggiornamenti sulle tue prenotazioni"
            toggle
            bordered
          />

          <SettingsRow
            title="Metodo di pagamento"
            subtitle="Carte e metodi salvati"
            bordered
          />

          <SettingsRow
            title="Veicoli"
            subtitle="Gestisci i tuoi veicoli"
          />
        </View>

        <Text style={styles.sectionLabel}>
          IMPOSTAZIONI
        </Text>

        <View style={styles.group}>
          <Pressable
            style={({ pressed }) => [
              styles.publishParking,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => navigation.navigate("CreateParking")}
          >
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Publicar mi estacionamiento</Text>
              <Text style={styles.rowSubtitle}>Ofrecé tu lugar para estacionar</Text>
            </View>
            <Ionicons name="add-circle-outline" size={21} color={colors.primary} />
          </Pressable>

          <SettingsRow
            title="Privacy"
            subtitle="Dati e autorizzazioni"
            bordered
          />

          <SettingsRow
            title="Lingua"
            value="Italiano"
            bordered
          />

          <SettingsRow
            title="Assistenza"
            subtitle="Hai bisogno di aiuto?"
          />
        </View>

        <Text style={styles.sectionLabel}>
          ACCOUNT
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
              Esci
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

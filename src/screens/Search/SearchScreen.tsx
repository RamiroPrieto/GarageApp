import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Button } from "../../components/Button";
import { globalStyles } from "../../theme/global.styles";
import { styles } from "./SearchScreen.styles";
import { getMyVehicles } from "../../api/vehicle.api";
import { Vehicle } from "../../types/vehicle.type";
import { RootStackParamList } from "../../navigation/navigation.types";
import { useI18n } from "../../context/I18nContext";

export function SearchScreen() {
  const { dateLocale, t } = useI18n();
  const navigation = useNavigation<
    NativeStackNavigationProp<RootStackParamList, "Search">
  >();

  const [date, setDate] = useState(new Date());
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showVehicles, setShowVehicles] = useState(false);
  const [startTime, setStartTime] = useState(
    new Date(),
  );

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await getMyVehicles();
  
        setVehicles(data);
  
        if (data.length > 0) {
          setSelectedVehicle(data[0]);
        }
      } catch (error) {
        console.log("ERROR CARGANDO VEHICULOS:");
        console.log(error);
      }
    };
  
    loadVehicles();
  }, []);

  const [endTime, setEndTime] = useState(() => {
    const time = new Date();

    time.setHours(time.getHours() + 1);

    return time;
  });

  const [showDatePicker, setShowDatePicker] =
    useState(false);

  const [showStartTimePicker, setShowStartTimePicker] =
    useState(false);

  const [showEndTimePicker, setShowEndTimePicker] =
    useState(false);

  const formatDate = (value: Date) => {
    return value.toLocaleDateString(dateLocale, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (value: Date) => {
    return value.toLocaleTimeString(dateLocale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleSearch = () => {
    const startDatetime = new Date(date);

    startDatetime.setHours(
      startTime.getHours(),
      startTime.getMinutes(),
      0,
      0,
    );

    const endDatetime = new Date(date);

    endDatetime.setHours(
      endTime.getHours(),
      endTime.getMinutes(),
      0,
      0,
    );
    if (!selectedVehicle) {
      console.log("Seleccioná un vehículo");
      return;
    }
    navigation.navigate("MainTabs", {
      screen: "Home",
    });
  };

  return (
    <View style={globalStyles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {t("search.title")}
        </Text>

        <Text style={styles.subtitle}>
          {t("search.subtitle")}
        </Text>

        <Text style={styles.label}>
          {t("search.location")}
        </Text>

        <View style={styles.location}>
          <Text style={styles.locationText}>
            📍 Torino, Italia
          </Text>
        </View>

        <Text style={styles.label}>
          {t("search.date")}
        </Text>

        <Pressable
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.inputText}>
            {formatDate(date)}
          </Text>
        </Pressable>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);

              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}

        <Text style={styles.label}>
          {t("search.entryTime")}
        </Text>

        <Pressable
          style={styles.input}
          onPress={() =>
            setShowStartTimePicker(true)
          }
        >
          <Text style={styles.inputText}>
            {formatTime(startTime)}
          </Text>
        </Pressable>

        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            is24Hour
            onChange={(event, selectedTime) => {
              setShowStartTimePicker(false);

              if (selectedTime) {
                setStartTime(selectedTime);
              }
            }}
          />
        )}

        <Text style={styles.label}>
          {t("search.exitTime")}
        </Text>

        <Pressable
          style={styles.input}
          onPress={() =>
            setShowEndTimePicker(true)
          }
        >
          <Text style={styles.inputText}>
            {formatTime(endTime)}
          </Text>
        </Pressable>

        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            is24Hour
            onChange={(event, selectedTime) => {
              setShowEndTimePicker(false);

              if (selectedTime) {
                setEndTime(selectedTime);
              }
            }}
          />
        )}

        <Text style={styles.label}>
          {t("search.vehicle")}
        </Text>

        <Pressable
          style={styles.input}
          onPress={() => setShowVehicles(!showVehicles)}
        >
          <Text style={styles.inputText}>
            {selectedVehicle
              ? `${selectedVehicle.brand} ${selectedVehicle.model}`
              : t("search.selectVehicle")}
          </Text>
        </Pressable>

        {showVehicles && (
          <View style={styles.vehicleList}>
            {vehicles.map((vehicle) => (
              <Pressable
                key={vehicle.id}
                style={styles.vehicleItem}
                onPress={() => {
                  setSelectedVehicle(vehicle);
                  setShowVehicles(false);
                }}
              >
                <Text style={styles.inputText}>
                  {vehicle.brand} {vehicle.model}
                </Text>

                <Text style={styles.vehiclePlate}>
                  {vehicle.licensePlate}
                </Text>
              </Pressable>
            ))}
          </View>
        )}


        <Button
          title={t("search.cta")}
          onPress={handleSearch}
        />
      </View>
    </View>
  );
}

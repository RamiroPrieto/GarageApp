import { View, Text } from "react-native";
import { globalStyles } from "../../theme/global.styles";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useEffect, useState } from "react";

import { getGarages } from "../../api/garage.api";
import { Garage } from "../../types/garage.types";


export function HomeScreen() {
  
  const [garages, setGarages] = useState<Garage[]>([]);

  useEffect(() => {
    const loadGarages = async () => {
      const data = await getGarages();
      setGarages(data);
    };

    loadGarages();
  }, []);

  return (
    <View style={globalStyles.screen}>
      <MapView
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: -37.9992,
          longitude: -57.5486,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        onMapReady={() => console.log("Mapa listo")}
      >
        {garages.map((garage) => (
          <Marker
            key={garage.id}
            coordinate={{
              latitude: garage.latitude,
              longitude: garage.longitude,
            }}
            title={garage.name}
          />
        ))}
      </MapView>
    </View>
  );
}
import { View } from "react-native";
import { globalStyles } from "../../theme/global.styles";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { useEffect, useState } from "react";

import { getGarages } from "../../api/garage.api";
import { Garage } from "../../types/garage.types";

export function HomeScreen() {
  const [garages, setGarages] = useState<Garage[]>([]);

  useEffect(() => {
    const loadGarages = async () => {
      try {
        const data = await getGarages();
        setGarages(data);

        // console.log("GARAGES RECIBI
        
      } catch (error) {
        console.log("ERROR CARGANDO GARAGES:");
        console.log(error);
      }
    };

    loadGarages();
  }, []);

  return (
    <View style={globalStyles.map}>
      <MapView
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 45.0703,
          longitude: 7.6869,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        onMapReady={() => console.log("Mapa listo")}
      >
        {garages.map((parking) => (
          <Marker
            key={parking.id}
            coordinate={{
              latitude: Number(parking.latitude),
              longitude: Number(parking.longitude),
            }}
            title={parking.title}
            description={`$${parking.pricePerHour} por hora`}
          />
        ))}
      </MapView>
    </View>
  );
}
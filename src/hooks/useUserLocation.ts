import { useEffect, useState } from "react";
import * as Location from "expo-location";

type UserLocation = {
  latitude: number;
  longitude: number;
};

export function useUserLocation() {
  const [location, setLocation] =
    useState<UserLocation | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Permiso de ubicación denegado");
        return;
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({});

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    };

    getLocation();
  }, []);

  return {
    location,
    error,
  };
}
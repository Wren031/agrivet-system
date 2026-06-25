import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";
import { agentApi } from "../services/agentApi";
import { AgentStatus, AgentLocation } from "../../../types";
import * as Location from "expo-location";

const LOCATION_UPDATE_INTERVAL = 30000;
const LOCATION_TIMEOUT = 15000;

async function getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    const err = new Error("Location permission denied") as any;
    err.code = 1;
    throw err;
  }
  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
    timeout: LOCATION_TIMEOUT,
  });
  return {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
  };
}

function formatAddress(address: Location.LocationGeocodedAddress): string {
  const parts: string[] = [];
  if (address.region) parts.push(address.region);
  if (address.city) parts.push(address.city);
  if (address.district) parts.push(address.district);
  if (address.name && address.name !== address.district) parts.push(address.name);
  if (!address.region && !address.city && !address.district && address.name) {
    parts.push(address.name);
  }
  return parts.join(", ") || address.name || "Unknown location";
}

export function useAgentStatus() {
  const { user, updateUser } = useAuth();
  const [agentStatus, setAgentStatus] = useState<AgentStatus>(user?.status || "OFFLINE");
  const [location, setLocation] = useState<AgentLocation | null>(user?.location || null);
  const [address, setAddress] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initializedRef = useRef(false);

  const agentId = user?.agentProfileId;

  const updateStatus = useCallback(async (status: AgentStatus) => {
    if (!agentId) return;
    try {
      await agentApi.updateStatus(agentId, status);
      setAgentStatus(status);
      updateUser({ status } as any);
    } catch (err: any) {
      console.warn("Failed to update agent status:", err.message);
    }
  }, [agentId, updateUser]);

  const updateUserLocation = useCallback(async (lat: number, lng: number) => {
    if (!agentId) return;
    try {
      const result = await agentApi.updateLocation(agentId, lat, lng);
      const loc = { latitude: result.latitude, longitude: result.longitude, updatedAt: result.updatedAt };
      setLocation(loc);
      updateUser({ location: loc } as any);
      setLocationError(null);
    } catch (err: any) {
      console.warn("Failed to update location:", err.message);
    }
  }, [agentId, updateUser]);

  const syncLocation = useCallback(async () => {
    setLocationLoading(true);
    try {
      const pos = await getCurrentPosition();
      await updateUserLocation(pos.latitude, pos.longitude);
      try {
        const geocode = await Location.reverseGeocodeAsync(pos);
        if (geocode.length > 0) {
          setAddress(formatAddress(geocode[0]));
        }
      } catch {
        setAddress(`${pos.latitude.toFixed(4)}, ${pos.longitude.toFixed(4)}`);
      }
    } catch (err: any) {
      if (err.code === 1) {
        setLocationError("Location permission denied");
      } else {
        setLocationError("Unable to get location - ensure GPS is enabled");
      }
    } finally {
      setLocationLoading(false);
    }
  }, [updateUserLocation]);

  const syncLocationRef = useRef(syncLocation);
  syncLocationRef.current = syncLocation;
  const updateStatusRef = useRef(updateStatus);
  updateStatusRef.current = updateStatus;

  useEffect(() => {
    if (!agentId) return;
    if (initializedRef.current) return;
    initializedRef.current = true;

    (async () => {
      await updateStatusRef.current("ONLINE");
      await syncLocationRef.current();
    })();

    intervalRef.current = setInterval(() => {
      syncLocationRef.current();
    }, LOCATION_UPDATE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      initializedRef.current = false;
    };
  }, [agentId]);

  const setOffline = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    await updateStatus("OFFLINE");
  }, [updateStatus]);

  return {
    agentStatus,
    location,
    address,
    locationError,
    locationLoading,
    isOnline: agentStatus === "ONLINE",
    updateStatus,
    syncLocation,
    setOffline,
  };
}

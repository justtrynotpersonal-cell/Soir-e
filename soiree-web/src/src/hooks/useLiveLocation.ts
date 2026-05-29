"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { distanceKm } from "@/lib/room/geo";
import type { LocationUpdatePayload } from "@/types/room";

const MIN_INTERVAL_MS = 4000;
const MIN_MOVE_KM = 0.02;

interface UseLiveLocationOptions {
  enabled: boolean;
  userId: string;
  displayName: string;
  color: string;
  onUpdate: (payload: LocationUpdatePayload) => void;
  onClear: (userId: string) => void;
}

export function useLiveLocation({
  enabled,
  userId,
  displayName,
  color,
  onUpdate,
  onClear,
}: UseLiveLocationOptions) {
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFix, setLastFix] = useState<GeolocationPosition | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const lastSentRef = useRef<{
    lat: number;
    lng: number;
    time: number;
  } | null>(null);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const publishPosition = useCallback(
    (position: GeolocationPosition) => {
      const { latitude: lat, longitude: lng, accuracy } = position.coords;
      const now = Date.now();
      const last = lastSentRef.current;

      if (last) {
        const elapsed = now - last.time;
        const moved = distanceKm({ lat, lng }, { lat: last.lat, lng: last.lng });
        if (elapsed < MIN_INTERVAL_MS && moved < MIN_MOVE_KM) {
          return;
        }
      }

      lastSentRef.current = { lat, lng, time: now };
      setLastFix(position);

      onUpdate({
        userId,
        displayName,
        color,
        lat,
        lng,
        accuracy,
        updatedAt: now,
      });
    },
    [color, displayName, onUpdate, userId],
  );

  const startSharing = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    setError(null);
    setSharing(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => publishPosition(position),
      (err) => {
        setError(err.message || "Unable to access your location.");
        setSharing(false);
        stopWatching();
        onClear(userId);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      },
    );
  }, [onClear, publishPosition, stopWatching, userId]);

  const stopSharing = useCallback(() => {
    stopWatching();
    setSharing(false);
    setLastFix(null);
    lastSentRef.current = null;
    onClear(userId);
  }, [onClear, stopWatching, userId]);

  const toggleSharing = useCallback(() => {
    if (sharing) {
      stopSharing();
    } else {
      startSharing();
    }
  }, [sharing, startSharing, stopSharing]);

  useEffect(() => {
    if (!enabled && sharing) {
      stopSharing();
    }
  }, [enabled, sharing, stopSharing]);

  useEffect(() => {
    const handleUnload = () => {
      if (sharing) {
        onClear(userId);
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      stopWatching();
    };
  }, [onClear, sharing, stopWatching, userId]);

  return {
    sharing,
    error,
    lastFix,
    toggleSharing,
    stopSharing,
  };
}

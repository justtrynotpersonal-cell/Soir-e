"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { LocationPin } from "@/types/room";
import { initialsFromName } from "@/lib/room/colors";
import "leaflet/dist/leaflet.css";

function FitBounds({ pins }: { pins: LocationPin[] }) {
  const map = useMap();

  useEffect(() => {
    if (pins.length === 0) return;
    if (pins.length === 1) {
      map.setView([pins[0]!.lat, pins[0]!.lng], 14, { animate: true });
      return;
    }
    const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15, animate: true });
  }, [map, pins]);

  return null;
}

function avatarIcon(pin: LocationPin) {
  const initials = initialsFromName(pin.displayName);
  return L.divIcon({
    className: "soiree-leaflet-pin",
    html: `<div style="
      width:36px;height:36px;border-radius:9999px;
      background:${pin.color};
      border:2px solid rgba(255,255,255,0.95);
      box-shadow:0 4px 14px rgba(0,0,0,0.45);
      display:flex;align-items:center;justify-content:center;
      font-size:11px;font-weight:700;color:#fff;font-family:system-ui,sans-serif;
    ">${initials}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

interface RoomLocationMapProps {
  pins: LocationPin[];
  className?: string;
}

export default function RoomLocationMap({
  pins,
  className = "",
}: RoomLocationMapProps) {
  const center = useMemo(() => {
    if (pins.length === 0) return { lat: 20, lng: 0 };
    const lat = pins.reduce((sum, p) => sum + p.lat, 0) / pins.length;
    const lng = pins.reduce((sum, p) => sum + p.lng, 0) / pins.length;
    return { lat, lng };
  }, [pins]);

  if (pins.length === 0) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl border border-dashed border-white/15 bg-zinc-950/80 text-center text-xs text-zinc-500 ${className}`}
      >
        No live locations in this room yet.
      </div>
    );
  }

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      scrollWheelZoom={false}
      className={`z-0 h-full w-full rounded-xl ${className}`}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitBounds pins={pins} />
      {pins.map((pin) => (
        <Marker
          key={pin.userId}
          position={[pin.lat, pin.lng]}
          icon={avatarIcon(pin)}
        >
          <Popup>
            <span className="text-sm font-medium">{pin.displayName}</span>
            {pin.accuracy != null && (
              <p className="mt-1 text-[10px] text-zinc-500">
                ±{Math.round(pin.accuracy)}m
              </p>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

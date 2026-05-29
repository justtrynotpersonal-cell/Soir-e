"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type {
  LocationClearPayload,
  LocationPin,
  LocationUpdatePayload,
  RoomChatMessage,
} from "@/types/room";

type BroadcastPayload =
  | { event: "chat-message"; payload: RoomChatMessage }
  | { event: "location-update"; payload: LocationUpdatePayload }
  | { event: "location-clear"; payload: LocationClearPayload };

export function useRoomChannel(roomId: string) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<RoomChatMessage[]>([]);
  const [locationPins, setLocationPins] = useState<Map<string, LocationPin>>(
    () => new Map(),
  );
  const channelRef = useRef<RealtimeChannel | null>(null);

  const broadcast = useCallback((message: BroadcastPayload) => {
    channelRef.current?.send({
      type: "broadcast",
      event: message.event,
      payload: message.payload,
    });
  }, []);

  const sendChat = useCallback(
    (message: RoomChatMessage) => {
      setMessages((prev) => [...prev, message]);
      broadcast({ event: "chat-message", payload: message });
    },
    [broadcast],
  );

  const sendLocationUpdate = useCallback(
    (payload: LocationUpdatePayload) => {
      setLocationPins((prev) => {
        const next = new Map(prev);
        next.set(payload.userId, payload);
        return next;
      });
      broadcast({ event: "location-update", payload });
    },
    [broadcast],
  );

  const sendLocationClear = useCallback(
    (userId: string) => {
      setLocationPins((prev) => {
        const next = new Map(prev);
        next.delete(userId);
        return next;
      });
      broadcast({ event: "location-clear", payload: { userId } });
    },
    [broadcast],
  );

  useEffect(() => {
    let client: ReturnType<typeof createSupabaseBrowserClient>;
    try {
      client = createSupabaseBrowserClient();
    } catch {
      return;
    }

    const channel = client.channel(`soiree-lounge-${roomId}`, {
      config: { broadcast: { self: false } },
    });

    channel
      .on("broadcast", { event: "chat-message" }, ({ payload }) => {
        const msg = payload as RoomChatMessage;
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      })
      .on("broadcast", { event: "location-update" }, ({ payload }) => {
        const pin = payload as LocationUpdatePayload;
        setLocationPins((prev) => {
          const next = new Map(prev);
          next.set(pin.userId, pin);
          return next;
        });
      })
      .on("broadcast", { event: "location-clear" }, ({ payload }) => {
        const { userId } = payload as LocationClearPayload;
        setLocationPins((prev) => {
          const next = new Map(prev);
          next.delete(userId);
          return next;
        });
      })
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
      setConnected(false);
    };
  }, [roomId]);

  return {
    connected,
    messages,
    locationPins,
    sendChat,
    sendLocationUpdate,
    sendLocationClear,
  };
}

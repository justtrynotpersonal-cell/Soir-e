"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronUp,
  MessageSquare,
  Send,
  Wifi,
  WifiOff,
} from "lucide-react";
import LocationShareToggle from "@/components/room/LocationShareToggle";
import { useLiveLocation } from "@/hooks/useLiveLocation";
import { colorFromUserId } from "@/lib/room/colors";
import type { LocationPin, RoomChatMessage } from "@/types/room";

const RoomLocationMap = dynamic(
  () => import("@/components/room/RoomLocationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-44 items-center justify-center rounded-xl border border-white/10 bg-zinc-950 text-xs text-zinc-500">
        Loading map…
      </div>
    ),
  },
);

interface RoomChatPanelProps {
  connected: boolean;
  roomId: string;
  userId: string;
  displayName: string;
  messages: RoomChatMessage[];
  locationPins: Map<string, LocationPin>;
  onSendChat: (message: RoomChatMessage) => void;
  onLocationUpdate: (payload: LocationPin) => void;
  onLocationClear: (userId: string) => void;
}

export default function RoomChatPanel({
  connected,
  roomId,
  userId,
  displayName,
  messages,
  locationPins,
  onSendChat,
  onLocationUpdate,
  onLocationClear,
}: RoomChatPanelProps) {
  const [draft, setDraft] = useState("");
  const [mobileMapOpen, setMobileMapOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const userColor = useMemo(() => colorFromUserId(userId), [userId]);

  const location = useLiveLocation({
    enabled: connected,
    userId,
    displayName,
    color: userColor,
    onUpdate: onLocationUpdate,
    onClear: onLocationClear,
  });

  const pins = useMemo(
    () => Array.from(locationPins.values()),
    [locationPins],
  );

  const pinCount = pins.length;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (pinCount === 0) {
      setMobileMapOpen(false);
    }
  }, [pinCount]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !connected) return;

    onSendChat({
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      senderId: userId,
      senderName: displayName,
      senderColor: userColor,
      text,
      timestamp: Date.now(),
    });
    setDraft("");
  };

  const mapBlock = (
    <div className="h-44 sm:h-48 md:h-52">
      <RoomLocationMap pins={pins} className="h-full min-h-[11rem]" />
    </div>
  );

  return (
    <>
      <aside className="flex h-full min-h-[32rem] flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl lg:min-h-[calc(100vh-8rem)]">
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-violet-400" />
            <div>
              <p className="text-sm font-semibold text-white">Room chat</p>
              <p className="font-mono text-[10px] text-zinc-500">#{roomId}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono ${
              connected
                ? "bg-emerald-950/60 text-emerald-400"
                : "bg-red-950/60 text-red-400"
            }`}
          >
            {connected ? (
              <Wifi className="h-3 w-3" />
            ) : (
              <WifiOff className="h-3 w-3" />
            )}
            {connected ? "LIVE" : "OFFLINE"}
          </span>
        </header>

        <div className="border-b border-white/10 p-3">
          <LocationShareToggle
            sharing={location.sharing}
            disabled={!connected}
            error={location.error}
            onToggle={location.toggleSharing}
          />
        </div>

        {/* Desktop / tablet inline map */}
        <div className="hidden border-b border-white/10 p-3 md:block">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Room map · {pinCount} sharing
          </p>
          {mapBlock}
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <p className="py-8 text-center text-xs text-zinc-500">
                No messages yet. Say hello to the room.
              </p>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === userId;
                const isSystem = msg.senderId === "system";

                if (isSystem) {
                  return (
                    <p
                      key={msg.id}
                      className="text-center text-[10px] text-zinc-500"
                    >
                      {msg.text}
                    </p>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className="max-w-[85%] rounded-2xl px-3 py-2 text-sm"
                      style={{
                        backgroundColor: isMe
                          ? `${msg.senderColor}22`
                          : "rgba(255,255,255,0.04)",
                        borderWidth: 1,
                        borderColor: isMe
                          ? `${msg.senderColor}40`
                          : "rgba(255,255,255,0.08)",
                      }}
                    >
                      {!isMe && (
                        <p
                          className="mb-0.5 text-[10px] font-semibold"
                          style={{ color: msg.senderColor }}
                        >
                          {msg.senderName}
                        </p>
                      )}
                      <p className="text-zinc-100">{msg.text}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-white/10 p-3"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={connected ? "Message the room…" : "Connecting…"}
                disabled={!connected}
                className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/50 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!connected || !draft.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-500 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </aside>

      {/* Mobile bottom-sheet map */}
      {pinCount > 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 md:hidden">
          <div className="pointer-events-auto mx-auto max-w-lg px-3 pb-3">
            {!mobileMapOpen && (
              <button
                type="button"
                onClick={() => setMobileMapOpen(true)}
                className="flex w-full items-center justify-between rounded-t-2xl border border-white/10 bg-zinc-950/95 px-4 py-3 text-left shadow-2xl backdrop-blur-xl"
              >
                <span className="text-sm font-medium text-white">
                  Room map · {pinCount} live
                </span>
                <ChevronUp className="h-5 w-5 text-violet-400" />
              </button>
            )}

            {mobileMapOpen && (
              <div className="overflow-hidden rounded-t-2xl border border-white/10 bg-zinc-950/98 shadow-2xl backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => setMobileMapOpen(false)}
                  className="flex w-full items-center justify-center gap-2 border-b border-white/10 py-2 text-xs text-zinc-400"
                >
                  <ChevronUp className="h-4 w-4 rotate-180" />
                  Collapse map
                </button>
                <div className="p-3 pt-0">{mapBlock}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

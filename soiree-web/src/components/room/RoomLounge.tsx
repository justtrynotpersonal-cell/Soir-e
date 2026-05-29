"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Video } from "lucide-react";
import RoomChatPanel from "@/components/room/RoomChatPanel";
import { useGuestIdentity } from "@/hooks/useGuestIdentity";
import { useRoomChannel } from "@/hooks/useRoomChannel";
import { colorFromUserId } from "@/lib/room/colors";

export default function RoomLounge() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room")?.trim() || "lounge";
  const guest = useGuestIdentity();

  const userId = guest?.userId ?? "guest";
  const displayName = guest?.displayName ?? "Guest";

  const {
    connected,
    messages,
    locationPins,
    sendChat,
    sendLocationUpdate,
    sendLocationClear,
  } = useRoomChannel(roomId);

  const userColor = useMemo(() => colorFromUserId(userId), [userId]);

  if (!guest) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem] xl:grid-cols-[1fr_24rem]">
      <section className="flex min-h-[20rem] flex-col gap-4">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 sm:p-6">
          <p className="text-sm text-violet-300">Watch lounge</p>
          <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
            Room <span className="font-mono text-emerald-400">#{roomId}</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Share this page URL so anyone can join — no sign-in required.
          </p>
        </div>

        <div className="flex aspect-video flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/50">
          <Video className="mb-3 h-10 w-10 text-violet-400/80" />
          <p className="text-sm text-zinc-500">Video stage</p>
          <p
            className="mt-1 font-mono text-[10px]"
            style={{ color: userColor }}
          >
            {displayName}
          </p>
        </div>
      </section>

      <RoomChatPanel
        connected={connected}
        roomId={roomId}
        userId={userId}
        displayName={displayName}
        messages={messages}
        locationPins={locationPins}
        onSendChat={sendChat}
        onLocationUpdate={sendLocationUpdate}
        onLocationClear={sendLocationClear}
      />
    </div>
  );
}

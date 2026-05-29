import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import RoomLounge from "@/components/room/RoomLounge";

export default function LoungePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      }
    >
      <RoomLounge />
    </Suspense>
  );
}

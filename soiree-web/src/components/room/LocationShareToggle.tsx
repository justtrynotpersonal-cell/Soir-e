"use client";

import { Loader2, MapPin, MapPinOff } from "lucide-react";

interface LocationShareToggleProps {
  sharing: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: string | null;
  onToggle: () => void;
}

export default function LocationShareToggle({
  sharing,
  disabled,
  loading,
  error,
  onToggle,
}: LocationShareToggleProps) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={disabled || loading}
        onClick={onToggle}
        className={`group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-xl border px-4 py-3 text-left transition ${
          sharing
            ? "border-emerald-500/40 bg-gradient-to-r from-emerald-950/80 to-teal-950/50 shadow-[0_0_24px_rgba(16,185,129,0.12)]"
            : "border-white/10 bg-zinc-900/80 hover:border-violet-500/30 hover:bg-zinc-900"
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <span
          className={`absolute inset-0 opacity-0 transition group-hover:opacity-100 ${
            sharing ? "bg-emerald-500/5" : "bg-violet-500/5"
          }`}
          aria-hidden
        />
        <span className="relative flex items-center gap-3">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              sharing
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-violet-500/15 text-violet-300"
            }`}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : sharing ? (
              <MapPin className="h-5 w-5" />
            ) : (
              <MapPinOff className="h-5 w-5" />
            )}
          </span>
          <span>
            <span className="block text-sm font-semibold text-white">
              Share Live Location
            </span>
            <span className="block text-[11px] text-zinc-400">
              {sharing
                ? "Broadcasting your position to the room"
                : "Opt in to show your pin on the room map"}
            </span>
          </span>
        </span>
        <span
          className={`relative h-6 w-11 shrink-0 rounded-full transition ${
            sharing ? "bg-emerald-500" : "bg-zinc-700"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
              sharing ? "left-[22px]" : "left-0.5"
            }`}
          />
        </span>
      </button>
      {error && (
        <p className="rounded-lg border border-red-500/25 bg-red-950/40 px-3 py-2 text-[11px] text-red-200">
          {error}
        </p>
      )}
    </div>
  );
}

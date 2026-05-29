"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "soiree-guest";

export type GuestIdentity = {
  userId: string;
  displayName: string;
};

function loadStoredGuest(): GuestIdentity | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GuestIdentity;
    if (parsed.userId && parsed.displayName) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

function createGuest(): GuestIdentity {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return {
    userId: crypto.randomUUID(),
    displayName: `Guest ${suffix}`,
  };
}

export function useGuestIdentity() {
  const [guest, setGuest] = useState<GuestIdentity | null>(null);

  useEffect(() => {
    const existing = loadStoredGuest();
    const identity = existing ?? createGuest();
    if (!existing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
    }
    setGuest(identity);
  }, []);

  return guest;
}

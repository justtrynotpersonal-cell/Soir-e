"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clapperboard, MessageCircle } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_40%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl sm:px-6">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-900/40">
              <MessageCircle className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="text-lg font-semibold tracking-tight text-white">
                Soirée
              </p>
              <p className="text-xs text-zinc-400">
                Synced watch parties &amp; rooms
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/lounge"
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                pathname.startsWith("/lounge")
                  ? "bg-white/15 text-white"
                  : "text-zinc-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Clapperboard className="h-4 w-4" />
              Lounge
            </Link>
          </nav>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-zinc-950/90 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-center">
          <Link
            href="/lounge"
            className={`flex flex-col items-center gap-1 text-xs ${
              pathname.startsWith("/lounge")
                ? "text-violet-300"
                : "text-zinc-400"
            }`}
          >
            <Clapperboard className="h-5 w-5" />
            Lounge
          </Link>
        </div>
      </nav>
    </div>
  );
}

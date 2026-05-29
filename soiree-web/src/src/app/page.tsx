import Link from "next/link";
import { Clapperboard, Link2, Radio, Smartphone } from "lucide-react";

const features = [
  {
    title: "Synchronized playback",
    description:
      "Low-latency room state designed for watch parties across desktop and mobile.",
    icon: Clapperboard,
  },
  {
    title: "Open room links",
    description:
      "Create a room name, share the URL, and guests join instantly — no accounts.",
    icon: Link2,
  },
  {
    title: "Realtime chat",
    description:
      "Live messages and optional location sharing powered by Supabase Realtime.",
    icon: Radio,
  },
  {
    title: "Mobile-first",
    description:
      "Responsive layouts and thumb-friendly navigation for cinema nights.",
    icon: Smartphone,
  },
];

export default function HomePage() {
  return (
    <section className="space-y-12 pb-10">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-violet-200">
            Open rooms · No login
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Cinema-grade watch parties with{" "}
            <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
              real-time control
            </span>
          </h1>
          <p className="max-w-xl text-lg text-zinc-400">
            Start or join a room with a link. Everyone lands in the same lounge
            for chat and sync — pick any room name you like.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/lounge?room=main"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:brightness-110"
            >
              Join main lounge
            </Link>
            <Link
              href="/lounge"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
            >
              Default room
            </Link>
          </div>
          <p className="text-sm text-zinc-500">
            Custom room:{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-zinc-300">
              /lounge?room=your-party-name
            </code>
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/90 to-black p-6 shadow-2xl shadow-violet-950/30">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="relative space-y-4">
            <div className="aspect-video rounded-2xl border border-white/10 bg-black/60 p-4">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>ROOM · NIGHT-OWL</span>
                  <span className="text-emerald-400">LIVE</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full rounded-full bg-zinc-800">
                    <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
                  </div>
                  <p className="text-sm text-zinc-300">
                    Everyone synced · 00:42:18
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-zinc-400">
              Share your room link with friends. They open it in the browser and
              join the same chat instantly.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {features.map(({ title, description, icon: Icon }) => (
          <article
            key={title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm"
          >
            <Icon className="mb-3 h-5 w-5 text-violet-300" />
            <h2 className="text-lg font-medium text-white">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

# Soirée (Next.js)

Secure foundation for synchronized watch parties with **Firebase Phone OTP** auth and a **Supabase** user ledger. Deploy on [Vercel](https://vercel.com).

## Stack

- Next.js App Router, TypeScript, Tailwind CSS, Lucide React
- Firebase Authentication (phone OTP) + Admin SDK (session cookies)
- Supabase PostgreSQL (users table) + service-role API routes

## Quick start

1. Install and run (from this folder):

   ```bash
   npm install
   npm run dev
   ```

2. Copy `.env.example` to `.env.local` and fill in values.

3. **Firebase**

   - Enable **Phone** sign-in: Authentication → Sign-in method.
   - Add `localhost` and your production domain to **Authorized domains**.
   - Create a **Web app** for `NEXT_PUBLIC_FIREBASE_*` keys.
   - Create a **service account** for `FIREBASE_ADMIN_*`.

4. **Supabase**

   - Run `supabase/migrations/20260529120000_users.sql` (SQL Editor or CLI).
   - Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.

5. **Admin**

   - Set `ADMIN_PHONE_NUMBER` to your E.164 number (e.g. `+15551234567`).
   - Sign in with that number, then open `/admin-panel`.

## Routes

| Route | Purpose |
| ----- | ------- |
| `/` | Landing |
| `/login` | Phone OTP sign-in |
| `/lounge` | Room chat + opt-in live location map |
| `/lounge?room=xyz` | Named room channel |
| `/admin-panel` | Admin-only user ledger |
| `/denied` | Blocked users |

## Vercel

Deploy from the repo root with **Root Directory** = `soiree-web`. See the root [README](../README.md) for step-by-step Vercel setup and environment variables.

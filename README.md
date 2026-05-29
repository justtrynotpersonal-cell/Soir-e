# Soirée

Real-time synchronized watch-party platform — **Next.js** app with Firebase phone auth, Supabase user ledger, and room lounge.

## Local development

```bash
cd soiree-web
cp .env.example .env.local
# Fill in Firebase + Supabase values (see soiree-web/README.md)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

The deployable app lives in **`soiree-web/`** (Next.js 16).

### 1. Push to GitHub

Create a repo and push this project if you have not already.

### 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repository.
2. Under **Root Directory**, click **Edit** and set it to **`soiree-web`**.
3. Framework should auto-detect **Next.js**. Leave build command as `npm run build` (default).

### 3. Environment variables

In the Vercel project → **Settings** → **Environment Variables**, add every key from [`soiree-web/.env.example`](./soiree-web/.env.example) for **Production** (and Preview if you use preview deploys):

| Variable | Notes |
| -------- | ----- |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase web app config |
| `FIREBASE_ADMIN_PROJECT_ID` | Service account |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Service account |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Paste the key with `\n` for line breaks, or use Vercel’s multiline value |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only — never expose to the client |
| `ADMIN_PHONE_NUMBER` | Your E.164 admin phone |

### 4. Firebase & Supabase (production)

- **Firebase Console** → Authentication → Settings → **Authorized domains**: add your Vercel URL (`your-app.vercel.app`) and custom domain when you add one.
- **Supabase**: run [`soiree-web/supabase/migrations/20260529120000_users.sql`](./soiree-web/supabase/migrations/20260529120000_users.sql) in the SQL editor if you have not already.

### 5. Deploy

Click **Deploy** on Vercel, or from your machine:

```bash
cd soiree-web
npx vercel login
npx vercel link    # choose / create project; root = soiree-web
npx vercel env pull .env.local   # optional: sync env from Vercel
npx vercel         # preview
npx vercel --prod  # production
```

After deploy, sign in at `/login` with your admin phone and open `/admin-panel`.

More detail: [`soiree-web/README.md`](./soiree-web/README.md).

-- Soirée user ledger (Firebase Auth is the identity provider)
CREATE TYPE public.user_status AS ENUM ('pending', 'approved', 'blocked');

CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL UNIQUE,
  status public.user_status NOT NULL DEFAULT 'pending',
  last_login_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  login_ip TEXT,
  location JSONB
);

CREATE INDEX users_firebase_uid_idx ON public.users (firebase_uid);
CREATE INDEX users_status_idx ON public.users (status);
CREATE INDEX users_last_login_idx ON public.users (last_login_at DESC);

CREATE OR REPLACE FUNCTION public.set_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.set_users_updated_at();

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- No public policies: all access goes through Next.js API routes using the service role key.

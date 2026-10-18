-- Run this once in Supabase SQL Editor to repair service booking API access.
-- Authenticated users can access the table, while RLS limits clients to their
-- own bookings and keeps booking updates restricted to admins.
BEGIN;

GRANT USAGE ON SCHEMA public TO authenticated;
REVOKE ALL ON TABLE public.service_bookings FROM anon, PUBLIC;
GRANT SELECT, INSERT, UPDATE ON TABLE public.service_bookings TO authenticated;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles AS profile
    WHERE profile.id = (SELECT auth.uid())
      AND profile.role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients can view own bookings" ON public.service_bookings;
CREATE POLICY "Clients can view own bookings"
ON public.service_bookings FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin()));

DROP POLICY IF EXISTS "Clients can insert own bookings" ON public.service_bookings;
CREATE POLICY "Clients can insert own bookings"
ON public.service_bookings FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Admins can update any booking" ON public.service_bookings;
CREATE POLICY "Admins can update any booking"
ON public.service_bookings FOR UPDATE
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

COMMIT;

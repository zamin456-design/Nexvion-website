-- Run this in the Supabase SQL Editor after both admin accounts exist
-- and their email addresses have been verified.
INSERT INTO public.profiles (id, email, full_name, role)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  'admin'
FROM auth.users
WHERE lower(email) IN ('zamin@nexvion.com', 'qasim@nexvion.com')
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    role = 'admin';

-- Use a SECURITY DEFINER helper to avoid profiles RLS policies querying
-- profiles recursively while checking whether the current user is an admin.
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

-- Clients may create/read bookings; RLS below limits rows to their own.
REVOKE ALL ON TABLE public.service_bookings FROM anon, PUBLIC;
GRANT SELECT, INSERT, UPDATE ON TABLE public.service_bookings TO authenticated;

DROP POLICY IF EXISTS "Public can view own profile" ON public.profiles;
CREATE POLICY "Public can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = id OR (SELECT public.is_admin()));

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

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

DROP POLICY IF EXISTS "Booking participants can view messages" ON public.booking_messages;
CREATE POLICY "Booking participants can view messages"
ON public.booking_messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.service_bookings AS booking
    WHERE booking.id = booking_id
      AND (booking.user_id = (SELECT auth.uid()) OR (SELECT public.is_admin()))
  )
);

DROP POLICY IF EXISTS "Booking participants can post messages" ON public.booking_messages;
CREATE POLICY "Booking participants can post messages"
ON public.booking_messages FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.service_bookings AS booking
    WHERE booking.id = booking_id
      AND (booking.user_id = (SELECT auth.uid()) OR (SELECT public.is_admin()))
  )
);

-- Prevent users from changing their own role through the public API.
REVOKE UPDATE ON TABLE public.profiles FROM authenticated;
GRANT UPDATE (full_name, company) ON TABLE public.profiles TO authenticated;

-- Ignore user-supplied role metadata when new accounts are created.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'client'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

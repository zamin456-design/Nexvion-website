import { createClient } from '@supabase/supabase-js';
import { BOOKING_STATUSES } from './bookingStatus';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if valid Supabase credentials are provided
export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabaseAnonKey !== 'your-anon-public-key' &&
    supabaseUrl.startsWith('https://')
  );
};

// Initialize real Supabase client if configured
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable account and data features.'
    );
  }

  return supabase;
}

export async function getSupabaseUserProfile(authUser) {
  const client = requireSupabase();
  const { data: profile, error } = await client
    .from('profiles')
    .select('id, email, full_name, company, role')
    .eq('id', authUser.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load your account role: ${error.message}`);
  }

  if (!profile) {
    throw new Error(
      'Your account profile was not found. Run the admin setup SQL in the Supabase SQL Editor, then sign in again.'
    );
  }

  if (profile.role !== 'admin' && profile.role !== 'client') {
    throw new Error('Your account has no valid role. Contact the project administrator.');
  }

  return { ...authUser, ...profile };
}

// ===============================================================
// SUPABASE AUTHENTICATION
// ===============================================================
export async function signUpUser({ email, password, full_name, company, role = 'client' }) {
  const client = requireSupabase();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, company, role },
    },
  });
  if (error) throw error;
  return { success: true, user: data.user, mode: 'supabase' };
}

export async function signInUser({ email, password }) {
  const client = requireSupabase();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;

  return {
    success: true,
    user: await getSupabaseUserProfile(data.user),
    mode: 'supabase',
  };
}

export async function signOutUser() {
  const client = requireSupabase();
  const { error } = await client.auth.signOut();
  if (error) throw error;
  return { success: true };
}

// ===============================================================
// SERVICE BOOKINGS API (CLIENT & ADMIN)
// ===============================================================
export async function createServiceBooking(bookingData) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('service_bookings')
    .insert([
      {
        user_id: bookingData.user_id,
        user_name: bookingData.user_name,
        user_email: bookingData.user_email,
        user_company: bookingData.user_company || '',
        service_id: bookingData.service_id,
        service_name: bookingData.service_name,
        package_tier: bookingData.package_tier || 'Production Tier',
        price: bookingData.price,
        discount_saved: bookingData.discount_saved || 0,
        project_title: bookingData.project_title,
        project_details: bookingData.project_details,
        deadline: bookingData.deadline || 'Standard Turnaround',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return { success: true, booking: data, mode: 'supabase' };
}

export async function fetchUserBookings(userId) {
  const client = requireSupabase();
  if (!userId) throw new Error('A user ID is required to fetch bookings.');

  const { data, error } = await client
    .from('service_bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchAllBookings() {
  const client = requireSupabase();
  const { data, error } = await client
    .from('service_bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateBookingStatus(bookingId, status, notes = '') {
  const client = requireSupabase();
  if (!BOOKING_STATUSES.some((bookingStatus) => bookingStatus.value === status)) {
    throw new Error(`Unsupported booking status: ${status}`);
  }

  const updates = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (notes) updates.notes_admin = notes;

  const { data, error } = await client
    .from('service_bookings')
    .update(updates)
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('The booking status was not updated.');
  return { success: true, booking: data };
}

// ===============================================================
// REAL-TIME MESSAGING API (CLIENT <-> ADMIN)
// ===============================================================
export async function fetchBookingMessages(bookingId) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('booking_messages')
    .select('*')
    .eq('booking_id', bookingId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function sendBookingMessage({ bookingId, senderId, senderName, senderRole, message }) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('booking_messages')
    .insert([
      {
        booking_id: bookingId,
        sender_id: senderId,
        sender_name: senderName,
        sender_role: senderRole,
        message,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return { success: true, message: data };
}

// Inquiries & Newsletter
export async function submitContactInquiry(inquiryData) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('contact_inquiries')
    .insert([
      {
        name: inquiryData.name,
        email: inquiryData.email,
        company: inquiryData.company || null,
        service: inquiryData.service || 'General AI Inquiry',
        budget: inquiryData.budget || 'Not specified',
        timeline: inquiryData.timeline || 'Flexible',
        message: inquiryData.message,
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) throw error;
  return { success: true, data, mode: 'supabase' };
}

export async function subscribeNewsletter(email) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('newsletter_subscribers')
    .insert([{ email, created_at: new Date().toISOString() }])
    .select();

  if (error) {
    if (error.code === '23505') {
      return { success: true, message: 'You are already subscribed!', mode: 'supabase' };
    }
    throw error;
  }

  return { success: true, data, mode: 'supabase' };
}

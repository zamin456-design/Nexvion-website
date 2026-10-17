-- ===============================================================
-- NexVion — Complete Production Supabase Database Schema
-- Includes Authentication, User Profiles, Service Catalog,
-- Client Bookings, Real-Time Messaging & RLS Security Policies
-- ===============================================================

-- 1. PROFILES TABLE (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    company TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SERVICES CATALOG (Pre-loaded with market-rate AI & Full-Stack services)
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    market_price NUMERIC NOT NULL,
    discount_price NUMERIC NOT NULL,
    discount_percent INTEGER NOT NULL,
    turnaround TEXT NOT NULL,
    description TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. SERVICE BOOKINGS (Created by Clients, Managed by Admin)
CREATE TABLE IF NOT EXISTS public.service_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_company TEXT,
    service_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    package_tier TEXT DEFAULT 'Production Tier',
    price NUMERIC NOT NULL,
    discount_saved NUMERIC DEFAULT 0,
    project_title TEXT NOT NULL,
    project_details TEXT NOT NULL,
    deadline TEXT DEFAULT 'Standard Turnaround',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'in_development', 'testing', 'completed', 'cancelled')),
    notes_admin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. REAL-TIME BOOKING MESSAGES (Client <-> Admin Communication)
CREATE TABLE IF NOT EXISTS public.booking_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.service_bookings(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('client', 'admin')),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CONTACT INQUIRIES & NEWSLETTER
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    service TEXT DEFAULT 'General AI Inquiry',
    budget TEXT,
    timeline TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new'
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email TEXT UNIQUE NOT NULL
);

-- ===============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

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

-- Profiles: Users can view & update their own profile; Admins can view all
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

REVOKE UPDATE ON TABLE public.profiles FROM authenticated;
GRANT UPDATE (full_name, company) ON TABLE public.profiles TO authenticated;

-- Services: Everyone can read active services; Admins can manage
CREATE POLICY "Anyone can view active services" 
ON public.services FOR SELECT 
TO anon, authenticated 
USING (is_active = true);

-- Bookings: Clients can view & insert their own; Admins can view & update all
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

-- Messages: Participants can read & insert messages for their booking
DROP POLICY IF EXISTS "Booking participants can view messages" ON public.booking_messages;
CREATE POLICY "Booking participants can view messages" 
ON public.booking_messages FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.service_bookings b 
        WHERE b.id = booking_id 
        AND (b.user_id = (SELECT auth.uid()) OR (SELECT public.is_admin()))
    )
);

DROP POLICY IF EXISTS "Booking participants can post messages" ON public.booking_messages;
CREATE POLICY "Booking participants can post messages" 
ON public.booking_messages FOR INSERT 
TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.service_bookings b 
        WHERE b.id = booking_id 
        AND (b.user_id = (SELECT auth.uid()) OR (SELECT public.is_admin()))
    )
);

-- Public inquiries
CREATE POLICY "Public insert inquiries" ON public.contact_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public insert newsletter" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ===============================================================
-- AUTOMATIC PROFILE TRIGGER ON SUPABASE SIGNUP
-- ===============================================================
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ===============================================================
-- SEED INITIAL SERVICES WITH MARKET RATES & DISCOUNT PRICING
-- ===============================================================
INSERT INTO public.services (id, name, category, market_price, discount_price, discount_percent, turnaround, description, features)
VALUES
('full-stack', 'Full Stack Web Development', 'Web & Cloud', 4800, 3199, 33, '3-5 Weeks', 'Production-ready web application with modern responsive frontend, robust microservices backend, PostgreSQL database, authentication, and continuous deployment.', '["Custom React / Next.js Architecture", "PostgreSQL / Supabase Database", "RESTful & GraphQL API Endpoints", "CI/CD Deployment & Hosting Setup", "100% Responsive UI/UX"]'::jsonb),
('ai-chatbots', 'Enterprise AI Chatbots', 'Conversational AI', 2900, 1899, 35, '2-3 Weeks', 'Intelligent conversational agents with custom system knowledge, function calling, tool usage, multi-turn state, and seamless CRM integration.', '["Zero-Hallucination Guardrails", "Multi-Turn Context & Session Memory", "API & Tool Calling Execution", "Omnichannel: Web, WhatsApp, Discord", "Human-in-the-Loop Handover"]'::jsonb),
('ai-models', 'Custom AI Model Architecture', 'Machine Learning', 5500, 3799, 31, '4-6 Weeks', 'Tailored deep learning models, classification, regression, and custom neural topologies optimized for your specific business domain.', '["Domain Data Preprocessing", "Custom Neural Network Architecture", "Hyperparameter Optimization", "Inference Latency Benchmarking", "Docker Containerized Deployment"]'::jsonb),
('automation-systems', 'Business Automation Systems', 'Workflows', 2800, 1699, 39, '2-4 Weeks', 'Autonomous process automations replacing hundreds of hours of manual data entry, cross-system sync, document routing, and report generation.', '["Multi-Platform API Sync (Stripe, Slack, ERP)", "Autonomous Anomaly Detection", "Scheduled & Event-Driven Workers", "Failover & Automatic Retries", "Audit Logging & Performance Telemetry"]'::jsonb),
('saas-systems', 'SaaS Systems (Multi-Tenant)', 'Cloud Products', 8500, 5699, 33, '5-8 Weeks', 'End-to-end software-as-a-service platforms with multi-tenancy, Stripe subscription billing, role-based access control, and team management.', '["Multi-Tenant Database Architecture", "Stripe Recurring Billing & Metering", "Enterprise RBAC & Permissions", "Automated User Onboarding", "Admin Analytics Dashboard"]'::jsonb),
('rag-systems', 'RAG Based Knowledge Systems', 'Retrieval AI', 5200, 3399, 35, '3-4 Weeks', 'Hybrid vector search over millions of internal proprietary company documents with citation-backed, zero-hallucination accuracy.', '["Dense + Sparse BM25 Hybrid Retrieval", "Quantized Vector DB (Qdrant / Pinecone)", "Cross-Encoder Re-Ranking Pipeline", "Multi-Format Ingestion (PDF, Scans, Audio)", "Sub-50ms P95 Search Latency"]'::jsonb),
('llm-solutions', 'LLM Solutions & Integration', 'Language Models', 4200, 2799, 33, '2-4 Weeks', 'Strategic integration of frontier LLMs (Claude 3.5, GPT-4o, Llama 3) with custom prompt pipelines, semantic caching, and structured JSON output.', '["Pydantic-Enforced JSON Output", "Semantic Vector Caching (70% Token Savings)", "Dynamic Context Window Management", "Prompt Injection Defense Shield", "Continuous Latency Monitoring"]'::jsonb),
('fine-tuning', 'Model Pre-Training & Fine-Tuning', 'Deep Learning', 6800, 4499, 34, '4-6 Weeks', 'Specialized parameter-efficient fine-tuning (LoRA / QLoRA) and Direct Preference Optimization (DPO) to train models exclusively on your proprietary data.', '["Dataset Cleaning & Tokenization", "LoRA / QLoRA Efficient Adaptation", "Direct Preference Optimization (DPO)", "Model Distillation into 8B/14B Weights", "Private On-Prem Air-Gap Export"]'::jsonb),
('video-generation', 'AI-Based Video Generation', 'Generative Media', 4600, 2899, 37, '3-5 Weeks', 'Automated generative video creation pipelines, dynamic avatar synthesis, automated captioning, and programmatic video rendering for marketing and education.', '["AI Avatar & Voice Synthesis", "Dynamic Scene Composition", "Programmatic Video Rendering API", "Automated Subtitle & Audio Translation", "Batch Rendering Queues"]'::jsonb),
('social-media-ai', 'Social Media AI Handling', 'Autonomous Ops', 2400, 1399, 42, '1-2 Weeks', 'Autonomous content ideation, automated generation, brand-safe copy, multi-platform scheduling, and intelligent follower engagement bots.', '["Brand Tone Customization", "Multi-Platform Dispatch (X, LinkedIn, IG)", "Autonomous Performance Analytics", "Automated Comment & Inquiry Triage", "Visual Graphic & Video Generation"]'::jsonb),
('custom-website', 'Custom Website Building (Front & Back)', 'Web Engineering', 3600, 2299, 36, '2-3 Weeks', 'Bespoke high-performance websites engineered with sleek aesthetics, high conversion layouts, custom CMS, and lightning-fast edge performance.', '["Obsidian & Cyberpunk Modern Aesthetics", "Full-Stack React / Next.js Integration", "SEO & OpenGraph Optimization", "Custom Form Intakes & Database Sync", "Sub-Second Global Edge Delivery"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    market_price = EXCLUDED.market_price,
    discount_price = EXCLUDED.discount_price,
    discount_percent = EXCLUDED.discount_percent;

-- ===============================================================
-- HELPER QUERY TO PROMOTE AN ACCOUNT TO ADMIN (Run whenever needed)
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@domain.com';
-- ===============================================================

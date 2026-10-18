# NexVion — Autonomous AI & Full-Stack Engineering Platform

An enterprise AI-first software house web platform built with **React 18**, **Vite 6**, **Tailwind CSS**, and **Supabase Real-Time Backend**.

Features separate **Client Portal** and **Admin Console**, real-time service booking, two-way direct engineer communication, transparent market rates with exclusive discounts, and complete Antigravity IDE workflows.

---

## ⚡ Quick Start

Start the development server from the project directory:
```bash
npm run dev
```
Vite prints the local URL in the terminal.

- **Client Portal**: `http://localhost:5173/portal`
- **Admin Console**: `http://localhost:5173/admin`
- **Services & Market Rates**: `http://localhost:5173/services`
- **Sign In**: `http://localhost:5173/login`
- **Client Sign Up**: `http://localhost:5173/signup`

### Signup Email Rate Limits
Supabase's built-in email service has strict sending limits. The limit applies to authentication email sends and can be reached even when no clients have registered (for example, after repeated signup attempts); it is not based on how many client accounts exist.

For production, configure a custom SMTP provider in **Supabase Dashboard → Authentication → SMTP Settings**, then review **Authentication → Rate Limits**. If email verification is not required for a temporary launch, disabling **Confirm email** under the email provider settings avoids sending confirmation emails, but means users can register with unverified email addresses. Prefer custom SMTP and keep verification enabled for a client-facing production site.

---

## 🔐 Account Access

Client and admin accounts authenticate through the connected Supabase project. Clients can register through the signup page. Admin access is restricted to accounts with the `admin` role; create and promote admin accounts using the Supabase setup steps below. The application does not include demo accounts or local mock authentication.

---

## 🗄️ How to Connect External Supabase Organization & Project

Follow these exact steps to connect your external Supabase organization and handle all client data in real-time:

### Step 1: Create an Organization & Project on Supabase
1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Under your dashboard, click **"New Organization"** (or use your existing organization) and name it **NexVion** (or your preferred company name).
3. Inside your organization, click **"New Project"**.
4. Set:
   - **Name**: `nexvion-production`
   - **Database Password**: Enter a secure password (save it safely).
   - **Region**: Select a region close to your target users (e.g., US East, EU Frankfurt, Singapore).
5. Click **"Create new project"** and wait ~1-2 minutes for the database cluster to initialize.

---

### Step 2: Paste the SQL Schema into Supabase SQL Editor
1. In your Supabase project dashboard, click the **SQL Editor** tab in the left sidebar.
2. Click **"New Query"**.
3. Open the file [**`supabase/schema.sql`**](./supabase/schema.sql) in this repository and copy the entire file.
4. Paste the SQL into the Supabase SQL editor and click **Run**.

If a client sees `permission denied for table service_bookings` when booking,
run [`supabase/fix-booking-permissions.sql`](./supabase/fix-booking-permissions.sql)
in the Supabase SQL Editor. It restores the required authenticated table
privileges and booking row-level security policies without making bookings
public.

**What this SQL creates for you:**
- **`profiles`** table with automatic role tracking (`client` or `admin`).
- Automatic trigger `on_auth_user_created` so every signup automatically populates a profile!
- **`services`** table pre-seeded with all 11 market-researched services, market prices, and discounts.
- **`service_bookings`** table storing all client commissioned projects, budgets, and milestones.
- **`booking_messages`** table powering two-way real-time chat between Client and Admin.
- Strict **Row Level Security (RLS)** policies ensuring clients can only view their own projects, while Admins have full access.

---

### Step 3: Copy Your API Keys into `.env`
1. In your Supabase dashboard, navigate to **Project Settings** (gear icon) ➔ **API**.
2. Copy the **Project URL** (e.g., `https://abcdefgh.supabase.co`).
3. Copy the **anon / public** API Key.
4. Open [**`.env`**](./.env) in this project and paste them:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
5. Save the file and restart Vite (`npm run dev`) or refresh your browser.

The badge in the Navbar and Contact page will turn to **"Supabase Live"** with a glowing green pulse, and all client registrations, bookings, and messages will sync directly to Supabase in real-time!

---

### Step 4: Promote an Account to Admin in Supabase
Create the user in Supabase **Authentication → Users**, then promote its profile with a SQL Editor query. For the NexVion admin accounts, use the SQL setup file in the next section.

### Add the NexVion Admin Accounts
1. In Supabase **Authentication → Users**, create `zamin@nexvion.com` and `qasim@nexvion.com` with secure, distinct passwords, and verify both email addresses.
2. In **SQL Editor**, run the latest [`supabase/admin-users.sql`](./supabase/admin-users.sql). It promotes existing users, repairs the recursive profile/booking/message RLS policies, and prevents signup metadata from granting admin privileges. If you already ran an earlier copy, run this updated file again.

Do not store admin passwords in this repository or share one password between accounts. If a password has been posted in chat, treat it as exposed and set a new one in Supabase.

---

## 💼 Full Services Catalog & Transparent Market Rates

Every service is calibrated against current industry standard market rates with built-in discount savings:

| Service | Category | Market Rate | NexVion Discount Rate | You Save | Standard Turnaround |
|---|---|---|---|---|---|
| **Full Stack Web Development** | Web & Cloud | $4,800 | **$3,199** | Save $1,601 (33% Off) | 3-5 Weeks |
| **Enterprise AI Chatbots** | Conversational AI | $2,900 | **$1,899** | Save $1,001 (35% Off) | 2-3 Weeks |
| **Custom AI Model Architecture** | Machine Learning | $5,500 | **$3,799** | Save $1,701 (31% Off) | 4-6 Weeks |
| **Business Automation Systems** | Workflow Ops | $2,800 | **$1,699** | Save $1,101 (39% Off) | 2-4 Weeks |
| **SaaS Systems (Multi-Tenant)** | Cloud Products | $8,500 | **$5,699** | Save $2,801 (33% Off) | 5-8 Weeks |
| **RAG Based Knowledge Systems** | Retrieval AI | $5,200 | **$3,399** | Save $1,801 (35% Off) | 3-4 Weeks |
| **LLM Solutions & Integration** | Language Models | $4,200 | **$2,799** | Save $1,401 (33% Off) | 2-4 Weeks |
| **Model Pre-Training & Fine-Tuning** | Deep Learning | $6,800 | **$4,499** | Save $2,301 (34% Off) | 4-6 Weeks |
| **AI-Based Video Generation** | Generative Media | $4,600 | **$2,899** | Save $1,701 (37% Off) | 3-5 Weeks |
| **Social Media AI Handling** | Autonomous Ops | $2,400 | **$1,399** | Save $1,001 (42% Off) | 1-2 Weeks |
| **Custom Website (Front & Back)** | Web Engineering | $3,600 | **$2,299** | Save $1,301 (36% Off) | 2-3 Weeks |

---

## 🛠️ Developing on Antigravity IDE: Next Steps & Improvements

Here is how to maintain, improve, and extend this codebase directly in Antigravity IDE:

1. **Adding Stripe Payment Processing**:
   - In Antigravity IDE, create `src/lib/stripe.js` to accept instant credit card deposits when a client books a service in the modal.
2. **Supabase Realtime WebSockets**:
   - In `src/pages/UserPortal.jsx` and `src/pages/AdminPortal.jsx`, you can enable `supabase.channel('custom-filter-channel').on(...)` to listen for new chat messages without polling.
3. **Automated Email / Discord Notifications**:
   - In Supabase, configure Database Webhooks (under **Database ➔ Webhooks**) pointing to a Discord webhook or Resend email API so whenever a client books a service, your phone or Slack channel gets notified instantly!
4. **Deploying to Vercel or Cloudflare Pages**:
   - Run `npm run build` in Antigravity IDE terminal.
   - Connect your GitHub repository to Vercel/Netlify.
   - Add the two environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

---

## 🏛️ Project Directory Map

```
Nexvion/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── ProtectedRoute.jsx # Client & Admin role gatekeeper
│   │   ├── layout/
│   │   │   ├── Navbar.jsx         # Sticky header with dynamic portal badges
│   │   │   └── Footer.jsx         # Intelligence dispatch & system links
│   │   └── sections/
│   │       ├── Hero.jsx           # Live neural execution playground
│   │       ├── StatsBanner.jsx    # Real-time latency & precision counters
│   │       ├── TechMarquee.jsx    # AI stack infinite ticker
│   │       ├── HowWeWork.jsx      # 4-stage engineering methodology
│   │       └── Testimonials.jsx   # Enterprise reviews & proof
│   ├── context/
│   │   └── AuthContext.jsx        # Supabase session manager
│   ├── lib/
│   │   ├── servicesData.js        # 11 services with market prices & discounts
│   │   └── supabase.js            # Supabase API for Auth, Bookings & Messages
│   ├── pages/
│   │   ├── Services.jsx           # Full catalog with direct booking triggers
│   │   ├── UserPortal.jsx         # Client dashboard, booking modal & chat
│   │   ├── AdminPortal.jsx        # Operations command, status updater & chat
│   │   ├── Login.jsx              # Client/admin sign in
│   │   ├── Signup.jsx             # Client registration
│   │   ├── Projects.jsx           # Production case studies & PoC lab
│   │   ├── About.jsx              # Student founders manifesto & team
│   │   └── Contact.jsx            # Project intake & Supabase connection
│   ├── App.jsx                    # Routing & smooth scrolling
│   └── index.css                  # Obsidian cyberpunk design system
├── supabase/
│   └── schema.sql                 # Complete PostgreSQL schema & RLS policies
├── .env                           # Local environment keys
├── .env.example                   # Keys template
└── README.md                      # Complete system documentation
```

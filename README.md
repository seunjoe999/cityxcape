# The City Xcape Niche

A production-ready luxury hotel management platform with role-based access for **Super Admins**, **Moderators**, and **Guests**. Backed by **Supabase** (Postgres + Auth + Storage with Row-Level Security) and packaged with **Capacitor** for Android Play Store distribution.

![Status](https://img.shields.io/badge/status-production_ready-success)
![React](https://img.shields.io/badge/react-19.2-61dafb)
![Vite](https://img.shields.io/badge/vite-6.0-646cff)
![Supabase](https://img.shields.io/badge/supabase-postgres-3fcf8e)
![Capacitor](https://img.shields.io/badge/capacitor-android-119eff)

---

## What's inside

This is a complete, multi-tenant hospitality platform. Three roles, three portals, one database with strict access boundaries:

- **Super Admin** — multi-property command center. Live financial overview, properties CRUD with image uploads, full inbox, calendar, kanban tasks, finance ledger, and team management (promote users to moderators, assign properties).
- **Moderator** — scoped to a single assigned property. Sees only that property's reservations, messages, tasks, inventory, and orders. RLS policies enforce this at the database level — moderators *cannot* access other properties' data even if they bypass the UI.
- **Guest** — luxury-tone consumer experience. Browse all suites, book stays, room-service ordering, in-app wallet with transaction history, customer-care chat, profile editing, and loyalty tier.

The very first user to sign up is automatically promoted to super admin via a database trigger. After that, signups default to guest, and the super admin can promote anyone to moderator.

---

## Quick start (5 minutes)

```bash
# 1. Install
npm install

# 2. Set up Supabase (see docs/SUPABASE_SETUP.md for the full walkthrough)
cp .env.example .env
# fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 3. Run the SQL migration in Supabase SQL editor
# (paste the contents of supabase/migrations/0001_init.sql)

# 4. Start the dev server
npm run dev
```

Open `http://localhost:5173`, sign up your first account, and you're now a super admin.

---

## Deploying to Google Play Store

The app is wired up for **Capacitor** which produces a real native Android `.aab` bundle ready for Play Console upload.

```bash
# Build the web app, sync to Android, open Android Studio
npm run android:open

# Or build a release AAB directly (requires Java + Android SDK)
npm run android:release
```

See **`docs/PLAY_STORE.md`** for the complete walkthrough — from generating a signing keystore to filling out the Play Console listing.

---

## Tech stack

| Layer       | Choice                                                        |
| ----------- | ------------------------------------------------------------- |
| Framework   | React 19 + Vite 6                                             |
| Styling     | Tailwind CSS 3.4 with a custom navy + gold theme              |
| Backend     | Supabase (Postgres, Auth, Storage)                            |
| Security    | Row-Level Security policies on every table                    |
| Mobile      | Capacitor 6 (Android target, iOS easily added later)          |
| Icons       | lucide-react                                                  |
| Fonts       | Fraunces (display) + Outfit (body) + JetBrains Mono           |

---

## Architecture

```
src/
├── App.jsx                          # role gates + auth flow
├── main.jsx                         # entry
├── index.css                        # Tailwind + design tokens
│
├── lib/
│   ├── supabase.js                  # Supabase client
│   └── db.js                        # all data-access in one file
│
├── hooks/
│   └── useAsync.js                  # loading/error/data hook
│
├── context/
│   └── AuthContext.jsx              # session + profile + role
│
└── components/
    ├── auth/
    │   ├── AuthScreen.jsx           # sign in + sign up
    │   └── SetupScreen.jsx          # shown when env vars missing
    │
    ├── shared/
    │   ├── UI.jsx                   # primitives (Modal, Avatar, AsyncBoundary…)
    │   ├── RoleBanner.jsx           # top role indicator
    │   ├── InboxScreen.jsx
    │   ├── CalendarScreen.jsx
    │   └── OrdersScreen.jsx
    │
    ├── admin/
    │   ├── AdminPortal.jsx
    │   ├── AdminNav.jsx
    │   ├── AdminDashboard.jsx       # KPIs + finance hero + team mgmt
    │   ├── PropertiesScreen.jsx     # CRUD with image upload
    │   ├── TasksScreen.jsx          # kanban
    │   └── FinancesScreen.jsx       # expense ledger
    │
    ├── moderator/
    │   ├── ModeratorPortal.jsx
    │   ├── ModeratorNav.jsx
    │   ├── ModeratorDashboard.jsx
    │   └── InventoryScreen.jsx
    │
    └── guest/
        ├── GuestPortal.jsx
        ├── GuestNav.jsx
        ├── ExploreScreen.jsx        # suite browser + booking
        ├── StayScreen.jsx           # progress + room service + chat
        ├── OrdersWalletScreen.jsx   # tracking + wallet + promo
        └── SettingsScreen.jsx       # profile + loyalty + prefs
```

**Key principle**: every screen calls into `lib/db.js`. No screen talks to Supabase directly. This means swapping providers (or adding caching, optimistic updates, type checking) only touches one file.

---

## Database

12 tables, all with Row-Level Security:

| Table                  | Purpose                                                     |
| ---------------------- | ----------------------------------------------------------- |
| `profiles`             | Mirror of `auth.users` with role + property assignment      |
| `properties`           | Hotels                                                      |
| `suites`               | Bookable rooms (per property)                               |
| `reservations`         | Bookings                                                    |
| `messages`             | Inbox / customer care threads                               |
| `tasks`                | Operations kanban                                           |
| `inventory`            | Stock per property                                          |
| `menu_items`           | Room-service catalog                                        |
| `orders`               | Room-service orders with JSON line items                    |
| `expenses`             | Admin finance ledger                                        |
| `wallet_transactions`  | Guest credit history (single source of truth for balance)   |
| `promo_codes`          | Redeemable codes that top up guest wallet                   |

The full schema, helper functions (`is_superadmin()`, `can_manage_property()`), the auto-provisioning trigger, and every RLS policy are in `supabase/migrations/0001_init.sql`.

---

## Documentation

- **`docs/SUPABASE_SETUP.md`** — Step-by-step guide to creating your Supabase project, running the migration, and enabling auth.
- **`docs/PLAY_STORE.md`** — End-to-end walkthrough from `npm install` to a signed `.aab` ready for Play Console upload.

---

## Design system

| Token         | Use                                              |
| ------------- | ------------------------------------------------ |
| Navy `#0a192f`  | Primary surface, headers, hero cards            |
| Gold `#c9a24c`  | Accent, super-admin signature, luxury cues      |
| Royal `#7c3aed` | Moderator accent                                |
| Success `#10b981` | Guest accent, paid statuses                  |
| Fraunces      | Display headings, prices                         |
| Outfit        | Body text, UI labels                              |

Custom shadows (`soft`, `card`, `lift`, `glow-gold`, `glow-navy`) and animations (`fade-in`, `slide-up`, `slide-down`, `scale-in`, `pulse-soft`) live in `tailwind.config.js`.

---

## What changed from v1

If you're upgrading from the demo-only v1:

- **Removed** the in-memory `mockData.js` — every screen now hits Supabase.
- **Removed** the four hardcoded demo accounts. Replaced with real email/password auth.
- **Added** loading skeletons, error boundaries, and empty states on every screen.
- **Added** real photo uploads for properties (Supabase Storage).
- **Added** team management — super admin can promote users to moderators.
- **Added** Capacitor configuration for Play Store distribution.
- **Added** SQL migration with 12 tables and complete RLS policies.

---

## License

MIT

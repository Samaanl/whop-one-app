# 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        GATED DAILY DROP                         │
│                     Full-Stack Architecture                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│   USER JOURNEY   │
└──────────────────┘

PUBLIC:
   Landing Page (/)
        │
        ├─→ Check Today's Drop
        │
        ↓
   Access Check (/api/check-access)
        │
        ├─→ HAS ACCESS ────→ /today (Member View)
        │
        └─→ NO ACCESS ─────→ /locked (Upgrade Page)
                                 │
                                 └─→ Whop Checkout
                                      │
                                      └─→ Purchase → Reload → /today

ADMIN:
   Admin Dashboard (/admin)
        │
        └─→ Create Drop (/api/daily-drop POST)
             │
             └─→ Save to Appwrite
                  │
                  └─→ Success → /today


┌──────────────────────────────────────────────────────────────┐
│                     TECH ARCHITECTURE                        │
└──────────────────────────────────────────────────────────────┘

┌─────────────────┐
│   FRONTEND      │
│   (Next.js 15)  │
└─────────────────┘
        │
        ├─→ app/page.tsx (/landing)
        ├─→ app/today/page.tsx (member view)
        ├─→ app/locked/page.tsx (upgrade page)
        └─→ app/admin/page.tsx (admin dashboard)
              │
              │
              ↓
┌─────────────────────────────────────────┐
│           API ROUTES                    │
│       (Next.js API Routes)              │
└─────────────────────────────────────────┘
        │
        ├─→ /api/check-access (GET)
        │   └─→ Verify user membership
        │
        └─→ /api/daily-drop
            ├─→ GET: Fetch today's drop
            └─→ POST: Create/update drop
              │
              │
              ↓
┌─────────────────────────────────────────┐
│        EXTERNAL SERVICES                │
└─────────────────────────────────────────┘
        │
        ├─→ Whop SDK
        │   ├─→ verifyUserToken()
        │   ├─→ checkIfUserHasAccessToAccessPass()
        │   ├─→ checkIfUserHasAccessToCompany()
        │   └─→ inAppPurchase() [iframe SDK]
        │
        └─→ Appwrite
            ├─→ databases.listDocuments()
            ├─→ databases.createDocument()
            └─→ databases.updateDocument()


┌──────────────────────────────────────────────────────────────┐
│                    DATA FLOW                                 │
└──────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Browser    │◄────►│   Next.js    │◄────►│  Whop API    │
│   (Client)   │      │   (Server)   │      │  (Auth/Pay)  │
└──────────────┘      └──────────────┘      └──────────────┘
                             │
                             │
                             ↓
                      ┌──────────────┐
                      │  Appwrite    │
                      │  (Database)  │
                      └──────────────┘


┌──────────────────────────────────────────────────────────────┐
│                 SECURITY LAYERS                              │
└──────────────────────────────────────────────────────────────┘

Layer 1: Whop User Token
   │
   ├─→ Verified on every API request
   └─→ Stored in HTTP headers (secure)

Layer 2: Access Pass Check
   │
   ├─→ Verified before showing content
   └─→ Blocks non-paying users

Layer 3: Admin Check
   │
   ├─→ Verified before allowing content creation
   └─→ Uses company access level check

Layer 4: Server-Side Only
   │
   ├─→ All sensitive operations on server
   └─→ WHOP_API_KEY never exposed to client


┌──────────────────────────────────────────────────────────────┐
│                    DATABASE SCHEMA                           │
└──────────────────────────────────────────────────────────────┘

Collection: daily_drops
┌─────────────┬──────────┬──────────┬──────────┐
│ Field       │ Type     │ Required │ Indexed  │
├─────────────┼──────────┼──────────┼──────────┤
│ title       │ String   │ No       │ No       │
│ content     │ String   │ Yes      │ No       │
│ video_url   │ String   │ No       │ No       │
│ link        │ String   │ No       │ No       │
│ date        │ String   │ Yes      │ Yes ✓    │
└─────────────┴──────────┴──────────┴──────────┘

Query Pattern:
  Query.equal("date", "2025-10-20")
  Query.limit(1)


┌──────────────────────────────────────────────────────────────┐
│                   COMPONENT TREE                             │
└──────────────────────────────────────────────────────────────┘

RootLayout (app/layout.tsx)
  │
  ├─→ <WhopApp> Provider
  │     │
  │     └─→ All child pages
  │
  ├─→ Landing Page (/)
  │     └─→ "Check Today's Drop" button
  │
  ├─→ Today Page (/today)
  │     ├─→ useEffect: checkAccess()
  │     ├─→ useEffect: fetchTodaysDrop()
  │     └─→ Drop Card
  │           ├─→ Date badge
  │           ├─→ Title
  │           ├─→ Content
  │           ├─→ Video (optional)
  │           └─→ Link (optional)
  │
  ├─→ Locked Page (/locked)
  │     ├─→ Lock icon
  │     ├─→ Benefits list
  │     └─→ useIframeSdk()
  │           └─→ inAppPurchase()
  │
  └─→ Admin Page (/admin)
        ├─→ Form
        │     ├─→ Title input
        │     ├─→ Content textarea
        │     ├─→ Video URL input
        │     └─→ Link input
        └─→ handleSubmit()
              └─→ POST /api/daily-drop


┌──────────────────────────────────────────────────────────────┐
│                     DEPLOYMENT                               │
└──────────────────────────────────────────────────────────────┘

Development:
   localhost:3000
      │
      └─→ Whop iframe settings: "localhost"

Production:
   Vercel
      │
      ├─→ Auto-deploy from GitHub
      ├─→ Environment variables configured
      ├─→ HTTPS enabled
      └─→ Custom domain (optional)
            │
            └─→ Update Whop Base URL


┌──────────────────────────────────────────────────────────────┐
│                    ENV VARIABLES                             │
└──────────────────────────────────────────────────────────────┘

Server-Side Only:
   WHOP_API_KEY ─────────────→ Whop API authentication

Client & Server:
   NEXT_PUBLIC_WHOP_*  ──────→ Whop configuration
   NEXT_PUBLIC_APPWRITE_* ───→ Appwrite configuration


┌──────────────────────────────────────────────────────────────┐
│                   PERFORMANCE                                │
└──────────────────────────────────────────────────────────────┘

Optimization Strategies:
   ├─→ Server-Side Rendering (SSR)
   ├─→ Client-Side Routing (SPA navigation)
   ├─→ Indexed database queries
   ├─→ Minimal JavaScript bundle
   └─→ Static asset optimization


┌──────────────────────────────────────────────────────────────┐
│              MONETIZATION FLOW                               │
└──────────────────────────────────────────────────────────────┘

User Journey to Purchase:
   1. Visit Landing → Interest
   2. Click "Check Drop" → Discover lock
   3. See Benefits → Build desire
   4. Click "Upgrade Now" → Whop checkout
   5. Complete Purchase → Instant access
   6. Daily habit formed → Retention
   7. Recurring revenue → Creator success


┌──────────────────────────────────────────────────────────────┐
│                   SUCCESS METRICS                            │
└──────────────────────────────────────────────────────────────┘

Track:
   ├─→ Daily Active Members (DAM)
   ├─→ Conversion Rate (visit → purchase)
   ├─→ Retention Rate (day 7, day 30)
   ├─→ Average Drop Views
   └─→ Monthly Recurring Revenue (MRR)
```

---

## Key Architecture Decisions

### 1. **Server-Side Access Control**

- All membership checks happen on server
- Prevents client-side bypass
- Secure token verification

### 2. **Date-Based Content**

- One drop per day (date = primary key)
- Automatic date stamping
- Time-zone independent (uses YYYY-MM-DD)

### 3. **Minimal Client State**

- Fetch data on-demand
- No complex state management
- Simple React hooks

### 4. **Whop as Auth Layer**

- No custom auth system needed
- Leverages Whop's robust infrastructure
- Seamless checkout experience

### 5. **Appwrite as Data Layer**

- Managed database
- No server management
- Built-in security rules

---

## Scalability Considerations

**Current Scale:** 1-10k members

- Single database collection
- Simple date queries
- Minimal server load

**Future Scale:** 10k+ members

- Add caching layer (Redis/Vercel KV)
- Implement CDN for static assets
- Consider read replicas for Appwrite
- Add rate limiting to API routes

---

**This architecture provides:**
✅ Security (server-side verification)
✅ Simplicity (minimal dependencies)
✅ Scalability (managed services)
✅ Developer experience (great DX)
✅ User experience (fast, responsive)

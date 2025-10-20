# 🚀 Quick Start Guide

Get your Gated Daily Drop app running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Whop account
- Appwrite account

## Step-by-Step Setup

### 1️⃣ Install Dependencies (30 seconds)

```bash
pnpm install
```

### 2️⃣ Configure Whop (2 minutes)

1. Go to https://whop.com/dashboard/developer
2. Create a new app
3. Create an Access Pass and Pricing Plan
4. Copy all IDs

📖 **Detailed guide:** See `WHOP_SETUP.md`

### 3️⃣ Configure Appwrite (2 minutes)

1. Go to https://cloud.appwrite.io
2. Create a project and database
3. Create `daily_drops` collection
4. Copy all IDs

📖 **Detailed guide:** See `APPWRITE_SETUP.md`

### 4️⃣ Set Environment Variables (1 minute)

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values.

### 5️⃣ Run the App!

```bash
pnpm dev
```

Visit http://localhost:3000

## First-Time Usage

### As Creator/Admin:

1. Visit http://localhost:3000/admin
2. Fill in your first daily drop:
   - **Title:** 🔥 Welcome to Daily Drops
   - **Content:** This is your first exclusive drop for members!
   - (Optional) Add video URL or link
3. Click "Publish Drop"

### As Member (Testing):

1. In Whop, open your app
2. Click the settings icon → select "localhost"
3. Click "Check Today's Drop"
4. You should see your drop!

### As Non-Member (Testing):

1. Open incognito window
2. Visit your Whop app
3. Should see "Locked" page
4. Test the upgrade flow

## File Structure Overview

```
├── app/
│   ├── page.tsx           → Landing page (public)
│   ├── today/page.tsx     → Member view
│   ├── locked/page.tsx    → Non-member upgrade page
│   ├── admin/page.tsx     → Admin dashboard
│   └── api/
│       ├── check-access/  → Verify user access
│       └── daily-drop/    → CRUD operations
├── lib/
│   ├── appwrite.ts        → Appwrite config
│   └── whop-sdk.ts        → Whop SDK config
└── .env.local             → Your secrets (not in git)
```

## Key Pages

| URL       | Description     | Access          |
| --------- | --------------- | --------------- |
| `/`       | Landing page    | Public          |
| `/today`  | View daily drop | Members only    |
| `/locked` | Upgrade prompt  | Non-members     |
| `/admin`  | Post drops      | Creators/Admins |

## Testing Checklist

- [ ] Landing page loads
- [ ] Can create a drop from `/admin`
- [ ] Drop appears on `/today`
- [ ] Non-member sees `/locked` page
- [ ] Checkout modal opens when clicking "Upgrade Now"

## Common Commands

```bash
# Development
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type checking
pnpm type-check
```

## Troubleshooting

**App won't start:**

```bash
rm -rf node_modules .next
pnpm install
pnpm dev
```

**Environment variables not loading:**

- Make sure file is named `.env.local` (not `.env`)
- Restart dev server after changing variables
- Check for typos in variable names

**Can't see today's drop:**

- Create a drop from `/admin` first
- Check browser console for errors
- Verify Appwrite collection has data

**Checkout not working:**

- Ensure `NEXT_PUBLIC_WHOP_PLAN_ID` is correct
- Check that app is wrapped in `<WhopApp>` (it is by default)
- Test in Whop iframe, not standalone browser

## Next Steps

1. ✅ Get the app running locally
2. 📝 Create your first drop
3. 🎨 Customize branding/copy
4. 🚀 Deploy to Vercel
5. 📢 Launch to your audience!

## Need Help?

- 📖 Full README: `README.md`
- 🎯 Whop Setup: `WHOP_SETUP.md`
- 📋 Appwrite Setup: `APPWRITE_SETUP.md`
- ✅ Deployment: `DEPLOYMENT_CHECKLIST.md`

---

**You're ready to build! 🎉**

Questions? Check the docs above or visit:

- Whop: https://docs.whop.com
- Appwrite: https://appwrite.io/docs

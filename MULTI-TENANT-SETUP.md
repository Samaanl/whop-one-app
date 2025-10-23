# Multi-Tenant Setup Guide

## 🎯 Overview

Your **Gated Daily Drop** app is now **fully multi-tenant**. This means:

- ✅ Each Whop creator has their own isolated drops
- ✅ Creator A's members only see Creator A's drops
- ✅ Creator B's members only see Creator B's drops
- ✅ No data leakage between different creators

## 🔧 How It Works

### 1. Company ID Isolation

Every database operation includes the `companyId` to ensure isolation:

```typescript
// When fetching drops
Query.equal("companyId", companyId)

// When creating drops
{
  companyId,  // This isolates the drop to specific creator
  title,
  content,
  ...
}
```

### 2. API Routes

Both GET and POST routes now require `companyId`:

**GET `/api/daily-drop?companyId=biz_xxx`**

- Fetches drops only for that specific company
- Verifies user has access to that company

**POST `/api/daily-drop`**

- Requires `companyId` in request body
- Verifies user is admin of that company
- Saves drop with `companyId` for isolation

### 3. Frontend Pages

Pages pass `companyId` via URL parameters:

```
/today?companyId=biz_xxx
/admin?companyId=biz_xxx
```

The `companyId` can come from:

1. URL query parameter (when accessed from Whop iframe)
2. Environment variable (for local development)

## 📋 Setup Checklist

### ✅ Code Changes (Already Done)

- [x] Updated API routes to accept dynamic `companyId`
- [x] Added `companyId` to DailyDrop TypeScript interface
- [x] Modified GET route to filter by `companyId`
- [x] Modified POST route to save with `companyId`
- [x] Updated frontend to pass `companyId` to API

### ⚠️ Database Setup (YOU MUST DO THIS)

Go to [Appwrite Console](https://cloud.appwrite.io) and add the `companyId` attribute:

1. Navigate to: **Your Project → Databases → `daily_drops` collection**
2. Click **"Add Attribute"**
3. Configure:
   - **Attribute Key**: `companyId`
   - **Type**: String
   - **Size**: 255
   - **Required**: ✅ Yes (checked)
   - **Array**: ❌ No
4. Click **"Create"**
5. Create **Indexes** for performance:
   - **Index 1**: `companyId_idx` (single attribute: `companyId`)
   - **Index 2**: `companyId_date_idx` (attributes: `companyId`, `date`)

### ⚠️ Vercel Environment Variables (Already Set?)

Make sure these are in Vercel:

```bash
WHOP_API_KEY=your_key
NEXT_PUBLIC_WHOP_APP_ID=app_xxx
NEXT_PUBLIC_WHOP_AGENT_USER_ID=user_xxx
# Note: NEXT_PUBLIC_WHOP_COMPANY_ID is now only for fallback/dev
NEXT_PUBLIC_WHOP_COMPANY_ID=biz_xxx

NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=xxx
NEXT_PUBLIC_APPWRITE_DATABASE_ID=xxx
NEXT_PUBLIC_APPWRITE_DAILY_DROPS_COLLECTION_ID=daily_drops
```

## 🧪 Testing Multi-Tenant Isolation

### Test Scenario:

1. **Creator A** (companyId: `biz_AAA`):

   - Goes to `/admin?companyId=biz_AAA`
   - Creates drop: "Welcome to Creator A's community!"
   - Their members see it at `/today?companyId=biz_AAA`

2. **Creator B** (companyId: `biz_BBB`):

   - Goes to `/admin?companyId=biz_BBB`
   - Creates drop: "Welcome to Creator B's community!"
   - Their members see it at `/today?companyId=biz_BBB`

3. **Verification**:
   - Creator A's members DO NOT see Creator B's drop
   - Creator B's members DO NOT see Creator A's drop
   - Each creator only sees their own drops in admin panel

## 🚀 How Users Access the App

When creators install your app from the Whop App Store:

1. Whop automatically embeds your app in an iframe
2. Whop passes the creator's `companyId` in the URL
3. Your app uses that `companyId` to:
   - Verify the user is an admin
   - Save/load drops specific to that company
   - Show drops only to members of that company

## 🔐 Security

- ✅ User authentication via Whop SDK
- ✅ Admin verification (only company admins can create drops)
- ✅ Access verification (only company members can view drops)
- ✅ Database-level isolation (companyId in all queries)

## 📚 Related Files

- `app/api/daily-drop/route.ts` - API routes with companyId filtering
- `app/admin/page.tsx` - Admin page that passes companyId
- `app/today/page.tsx` - Member view that passes companyId
- `lib/appwrite.ts` - DailyDrop interface with companyId field

## ❓ FAQ

**Q: What if companyId is missing?**
A: The app will show an error asking the user to access from Whop dashboard.

**Q: Can I test locally with different companies?**
A: Yes! Just change the URL: `/admin?companyId=biz_TEST1` vs `/admin?companyId=biz_TEST2`

**Q: Do I need different Appwrite databases for each creator?**
A: No! All creators share ONE database, but rows are isolated by `companyId`.

## ✨ Next Steps

1. **Add the companyId attribute to Appwrite** (see Database Setup above)
2. Test with multiple company IDs
3. Deploy to Vercel
4. Submit to Whop App Store
5. Let creators install and use your app! 🎉

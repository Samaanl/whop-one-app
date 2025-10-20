# 🔥 Gated Daily Drop - Whop Template

The simplest daily content gate for Whop creators. Send exclusive daily drops that only paying members can access.

## 📖 Overview

**Gated Daily Drop** is a minimal, premium app that helps creators send one daily exclusive piece of content to their paying members. Built on Whop for payments/auth and Appwrite for data storage.

### Key Features

✅ **Whop Authentication** - Seamless member verification  
✅ **Whop Checkout Integration** - One-click upgrades for non-members  
✅ **Daily Content Management** - Admin dashboard for posting  
✅ **Appwrite Database** - Reliable content storage  
✅ **Minimal Design** - Typography-driven, distraction-free UI  
✅ **Mobile-First** - Responsive and beautiful on all devices

---

## 🚀 Quick Start

### Prerequisites

1. **Whop Account** - Create an app at [Whop Developer Dashboard](https://whop.com/dashboard/developer)
2. **Appwrite Project** - Create a project at [Appwrite Cloud](https://cloud.appwrite.io)
3. **Node.js 18+** and **pnpm** installed

### Installation

1. **Install Dependencies**

   ```bash
   pnpm install
   ```

2. **Set Up Environment Variables**

   Copy `.env.example` to `.env.local` and fill in your credentials:

   ```bash
   # Whop Configuration
   WHOP_API_KEY=your_whop_api_key_here
   NEXT_PUBLIC_WHOP_AGENT_USER_ID=your_agent_user_id_here
   NEXT_PUBLIC_WHOP_APP_ID=your_app_id_here
   NEXT_PUBLIC_WHOP_COMPANY_ID=your_company_id_here
   NEXT_PUBLIC_WHOP_ACCESS_PASS_ID=your_access_pass_id_here
   NEXT_PUBLIC_WHOP_PLAN_ID=your_plan_id_here

   # Appwrite Configuration
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here
   NEXT_PUBLIC_APPWRITE_DAILY_DROPS_COLLECTION_ID=your_collection_id_here
   ```

3. **Configure Appwrite Database**

   In your Appwrite console:

   a. **Create a Database** - Note the Database ID

   b. **Create a Collection** called `daily_drops` with these attributes:

   | Attribute | Type   | Size  | Required |
   | --------- | ------ | ----- | -------- |
   | title     | String | 255   | No       |
   | content   | String | 10000 | Yes      |
   | video_url | String | 500   | No       |
   | link      | String | 500   | No       |
   | date      | String | 10    | Yes      |

   c. **Set Permissions**:

   - Read: `Any`
   - Create/Update/Delete: `Any` (or restrict to admin users)

   d. **Create Index** on `date` field for faster queries

4. **Configure Whop**

   In your [Whop Dashboard](https://whop.com/dashboard/developer):

   a. **Create an Access Pass** (Product)

   - Go to Access Passes tab
   - Click "Create Access Pass"
   - Name it (e.g., "Daily Drop Premium")
   - Copy the Access Pass ID

   b. **Create a Pricing Plan**

   - Add pricing to your access pass
   - Set your price (e.g., $9.99/month)
   - Copy the Plan ID

   c. **Request Permissions**

   - Go to Permissions tab
   - Request these permissions:
     - `member:basic:read`
     - `access_pass:basic:read`
     - `company:basic:read`

   d. **Set Hosting Paths**

   - Base URL: Your deployment domain
   - App path: `/experiences/[experienceId]`
   - Dashboard path: `/dashboard/[companyId]`

5. **Run Development Server**

   ```bash
   pnpm dev
   ```

   Visit `http://localhost:3000`

   **Important:** Use the translucent settings icon in the Whop iframe and select "localhost" to test locally.

---

## 🎯 App Flow

### For Members:

1. **Landing Page** (`/`) - Clean welcome screen
2. Click "Check Today's Drop"
3. **Authentication Check** - Whop verifies membership
4. **Today's Drop** (`/today`) - View daily exclusive content
5. Daily habit formed! 🔥

### For Non-Members:

1. **Landing Page** (`/`) - Click "Check Today's Drop"
2. **Locked Page** (`/locked`) - See benefits and pricing
3. Click "Upgrade Now"
4. **Whop Checkout Modal** - Complete purchase
5. Access unlocked! ✨

### For Creators (Admins):

1. Visit **Admin Dashboard** (`/admin`)
2. Fill in daily drop content (title, text, video, link)
3. Click "Publish Drop"
4. Members see the new drop immediately

---

## 📁 Project Structure

```
whop-app/
├── app/
│   ├── page.tsx              # Landing page
│   ├── today/
│   │   └── page.tsx          # Member view - daily drop
│   ├── locked/
│   │   └── page.tsx          # Locked page with upgrade CTA
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard for posting
│   ├── api/
│   │   ├── check-access/     # Access verification endpoint
│   │   └── daily-drop/       # CRUD for daily drops
│   ├── layout.tsx            # Root layout with Whop provider
│   └── globals.css           # Global styles
├── lib/
│   ├── appwrite.ts           # Appwrite client & types
│   └── whop-sdk.ts           # Whop SDK configuration
├── .env.example              # Environment template
└── package.json
```

---

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables
4. Deploy!

### Update Whop App Settings

1. Go to your Whop app settings
2. Under **Hosting**, update your Base URL to your Vercel domain
3. Save and install the app into your Whop

---

## 🔐 Security Notes

- Never expose `WHOP_API_KEY` on the client
- Appwrite credentials are public (protected by permissions)
- Always verify user access on the server side
- Use HTTPS in production

---

## 🛠️ Customization Ideas

### MVP Enhancements:

- [ ] Rich text editor for admin (Markdown/WYSIWYG)
- [ ] Image upload support
- [ ] Draft/schedule posts
- [ ] Content preview before publish

### Future Features (Optional):

- [ ] Member streak tracker ("7 days in a row 🔥")
- [ ] Push notifications via Whop
- [ ] Auto-expiring drops (24h limit)
- [ ] Analytics dashboard (views, engagement)

---

## 🆘 Troubleshooting

**Issue: "Configuration error"**

- Check that all environment variables are set in `.env.local`
- Verify IDs are correct (no typos)

**Issue: "Access denied"**

- Ensure user has purchased the access pass
- Check that `NEXT_PUBLIC_WHOP_ACCESS_PASS_ID` matches your product

**Issue: "Failed to fetch daily drop"**

- Verify Appwrite database and collection are created
- Check collection permissions allow read access
- Ensure date index exists

**Issue: App not loading in Whop**

- Set "App path" explicitly in Whop dashboard: `/experiences/[experienceId]`
- Use the settings icon in Whop iframe and select "localhost" for local testing

---

## 📚 Resources

- [Whop Documentation](https://docs.whop.com)
- [Whop SDK Reference](https://docs.whop.com/sdk)
- [Appwrite Documentation](https://appwrite.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

## 💡 Why This App Matters

**One creator. One daily post. Infinite engagement.**

1. **Daily Retention** - Members come back every single day
2. **Membership Value** - Even small daily drops build perceived value
3. **Professional Space** - Owned experience outside chaotic Discord
4. **Powered by Whop** - Showcases monetized micro-interactions

Built with ❤️ using Whop SDK and Appwrite

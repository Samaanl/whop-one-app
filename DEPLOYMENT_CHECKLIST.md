# ✅ Deployment Checklist

Use this checklist to ensure everything is set up correctly before deploying your Gated Daily Drop app.

## Pre-Deployment Checklist

### 1. Whop Configuration ✓

- [ ] Created Whop app in [Developer Dashboard](https://whop.com/dashboard/developer)
- [ ] Copied App ID, API Key, and Agent User ID
- [ ] Created Access Pass (Product)
- [ ] Created Pricing Plan (copied Plan ID)
- [ ] Requested and approved permissions:
  - [ ] `member:basic:read`
  - [ ] `access_pass:basic:read`
  - [ ] `company:basic:read`
- [ ] Set hosting paths in app settings:
  - [ ] Base URL (localhost for dev, domain for prod)
  - [ ] App path: `/experiences/[experienceId]`
  - [ ] Dashboard path: `/dashboard/[companyId]`
- [ ] Installed app into your Whop
- [ ] Copied Company ID

### 2. Appwrite Configuration ✓

- [ ] Created Appwrite project
- [ ] Created database
- [ ] Created `daily_drops` collection with attributes:
  - [ ] `title` (String, 255, optional)
  - [ ] `content` (String, 10000, required)
  - [ ] `video_url` (String, 500, optional)
  - [ ] `link` (String, 500, optional)
  - [ ] `date` (String, 10, required)
- [ ] Created index on `date` field
- [ ] Set collection permissions (Read: Any)
- [ ] Copied all IDs:
  - [ ] Project ID
  - [ ] Database ID
  - [ ] Collection ID

### 3. Environment Variables ✓

Created `.env.local` with all variables:

**Whop:**

- [ ] `WHOP_API_KEY`
- [ ] `NEXT_PUBLIC_WHOP_AGENT_USER_ID`
- [ ] `NEXT_PUBLIC_WHOP_APP_ID`
- [ ] `NEXT_PUBLIC_WHOP_COMPANY_ID`
- [ ] `NEXT_PUBLIC_WHOP_ACCESS_PASS_ID`
- [ ] `NEXT_PUBLIC_WHOP_PLAN_ID`

**Appwrite:**

- [ ] `NEXT_PUBLIC_APPWRITE_ENDPOINT`
- [ ] `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_APPWRITE_DATABASE_ID`
- [ ] `NEXT_PUBLIC_APPWRITE_DAILY_DROPS_COLLECTION_ID`

### 4. Local Testing ✓

- [ ] Ran `pnpm install` successfully
- [ ] Ran `pnpm dev` without errors
- [ ] Tested landing page (`/`)
- [ ] Tested admin dashboard (`/admin`)
- [ ] Created a test daily drop
- [ ] Tested member view (`/today`)
- [ ] Tested locked page (`/locked`)
- [ ] Tested checkout flow (use Whop test mode)

### 5. Code Quality ✓

- [ ] No TypeScript errors (`pnpm build`)
- [ ] No console errors in browser
- [ ] All API routes working
- [ ] Proper error handling implemented

## Deployment Checklist

### 1. Prepare for Production

- [ ] Remove any test/debug code
- [ ] Update app name/branding if needed
- [ ] Optimize images (if any)
- [ ] Review security (no exposed secrets)

### 2. Deploy to Vercel

- [ ] Pushed code to GitHub
- [ ] Connected GitHub repo to Vercel
- [ ] Added all environment variables in Vercel:
  - [ ] All Whop variables
  - [ ] All Appwrite variables
- [ ] Deployed successfully
- [ ] Noted deployment URL (e.g., `https://your-app.vercel.app`)

### 3. Update Whop Settings

- [ ] Updated Base URL to Vercel domain
- [ ] Verified hosting paths are correct
- [ ] Re-approved permissions if needed
- [ ] Tested app in production environment

### 4. Final Testing

- [ ] Visited production landing page
- [ ] Tested member flow (purchase → access)
- [ ] Tested admin dashboard (create drop)
- [ ] Tested on mobile device
- [ ] Checked all links work
- [ ] Verified checkout completes successfully

## Post-Deployment

### Marketing & Launch

- [ ] Create compelling description for app listing
- [ ] Add screenshots/demo video
- [ ] Set pricing strategy
- [ ] Announce to your audience
- [ ] Share install link: `https://whop.com/apps/app_xxxxx/install`

### Monitoring

- [ ] Monitor for errors (Vercel Analytics)
- [ ] Track user signups
- [ ] Check Appwrite usage
- [ ] Monitor payment success rate

### Ongoing Maintenance

- [ ] Post daily drops consistently
- [ ] Respond to member feedback
- [ ] Update content based on engagement
- [ ] Consider adding bonus features

## Common Issues & Solutions

| Issue                  | Solution                                            |
| ---------------------- | --------------------------------------------------- |
| App won't load in Whop | Check Base URL, ensure "App path" is explicitly set |
| Checkout fails         | Verify Plan ID is correct, check browser console    |
| Can't create drops     | Verify admin access, check Appwrite permissions     |
| Daily drop not showing | Ensure date format is YYYY-MM-DD, check time zones  |
| Unauthorized errors    | Re-approve permissions in Whop dashboard            |

## Need Help?

- **Whop Support:** [docs.whop.com](https://docs.whop.com)
- **Appwrite Support:** [appwrite.io/docs](https://appwrite.io/docs)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)

---

## Success! 🎉

When all checkboxes are complete, your Gated Daily Drop app is ready to:

- ✅ Accept members
- ✅ Process payments
- ✅ Deliver daily value
- ✅ Build retention

**One creator. One daily post. Infinite engagement.**

Go build something amazing! 🚀

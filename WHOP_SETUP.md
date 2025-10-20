# 🎯 Whop Setup Guide

This guide will walk you through setting up Whop for the Gated Daily Drop app.

## Step 1: Create a Whop App

1. Go to [Whop Developer Dashboard](https://whop.com/dashboard/developer)
2. Click **"Create App"**
3. Enter a name (e.g., "Daily Drop")
4. Click **"Create"**

### Copy Environment Variables

From the app settings page, copy:

- **App ID** → `NEXT_PUBLIC_WHOP_APP_ID`
- **API Key** → `WHOP_API_KEY` (keep this secret!)
- **Agent User ID** → `NEXT_PUBLIC_WHOP_AGENT_USER_ID`

## Step 2: Create an Access Pass (Product)

An access pass is the product that members will purchase.

1. In your Whop dashboard, go to **Access Passes** tab
2. Click **"Create Access Pass"**
3. Fill in details:
   - **Name**: "Daily Drop Premium" (or your preference)
   - **Description**: "Get exclusive daily drops"
   - **Image**: Upload a cover image (optional)
4. Click **"Create"**
5. Copy the **Access Pass ID** → `NEXT_PUBLIC_WHOP_ACCESS_PASS_ID`

## Step 3: Create a Pricing Plan

1. In the access pass you just created, click **"Add Pricing"**
2. Set up your plan:
   - **Plan Type**: Recurring (recommended) or One-time
   - **Price**: e.g., $9.99/month
   - **Billing Cycle**: Monthly, Yearly, etc.
   - **Name**: "Monthly Access" (visible to customers)
3. Click **"Create"**
4. From the 3-dot menu on the pricing card, click **"Copy Plan ID"**
5. Save as → `NEXT_PUBLIC_WHOP_PLAN_ID`

## Step 4: Request Permissions

Your app needs permissions to access Whop data.

1. Go to **Permissions** tab in your app settings
2. Click **"Add Permissions"**
3. Select these permissions:
   - `member:basic:read` - To read member info
   - `access_pass:basic:read` - To check access pass status
   - `company:basic:read` - To verify admin access
4. For each permission, add a justification:
   - "To verify member access to daily drops"
   - "To check subscription status"
   - "To allow creators to post content"
5. Mark all as **Required**
6. Click **"Save"**

## Step 5: Configure Hosting Paths

1. Go to **Hosting** tab in your app settings
2. Set these paths:

   **Base URL:**

   - For development: `http://localhost:3000`
   - For production: Your Vercel domain (e.g., `https://your-app.vercel.app`)

   **App Path (Experience View):**

   ```
   /experiences/[experienceId]
   ```

   **Dashboard Path:**

   ```
   /dashboard/[companyId]
   ```

   **Discover Path:**

   ```
   /discover
   ```

3. Click **"Save"**

## Step 6: Get Your Company ID

1. Go to your [Whop dashboard](https://whop.com/dashboard)
2. Look at the URL - it should be something like:
   ```
   https://whop.com/dashboard/companies/biz_xxxxxxxxxxxxx
   ```
3. Copy the `biz_xxxxxxxxxxxxx` part
4. Save as → `NEXT_PUBLIC_WHOP_COMPANY_ID`

## Step 7: Install Your App

1. Go to your app's page in the developer dashboard
2. Click the **"Install"** button (or copy the install link)
3. Select your company/whop
4. **Approve all permissions**
5. Confirm installation

## Step 8: Configure for Local Testing

When testing locally:

1. Run `pnpm dev` to start your app
2. Open your installed app from your Whop
3. Click the **translucent settings icon** (cog) in the top-right
4. Select **"localhost"**
5. Ensure port is set to `3000` (default)

## Step 9: (Optional) Set Up Webhooks

If you want to receive notifications about payments:

1. Go to **Webhooks** tab in your app settings
2. Click **"Create Webhook"**
3. Set endpoint URL:
   - Development: Use [ngrok](https://ngrok.com) to tunnel to localhost
   - Production: `https://your-domain.com/api/webhooks`
4. Select events:
   - `payment.succeeded`
   - `membership.went_valid`
   - `membership.went_invalid`
5. Click **"Save"**
6. Copy the **Webhook Secret** → `WHOP_WEBHOOK_SECRET`

## Environment Variables Summary

Your `.env.local` should now have:

```bash
# Whop Configuration
WHOP_API_KEY=whop_xxxxxxxxxxxxx
NEXT_PUBLIC_WHOP_AGENT_USER_ID=user_xxxxxxxxxxxxx
NEXT_PUBLIC_WHOP_APP_ID=app_xxxxxxxxxxxxx
NEXT_PUBLIC_WHOP_COMPANY_ID=biz_xxxxxxxxxxxxx

# Whop Products
NEXT_PUBLIC_WHOP_ACCESS_PASS_ID=prod_xxxxxxxxxxxxx
NEXT_PUBLIC_WHOP_PLAN_ID=plan_xxxxxxxxxxxxx

# Whop Webhooks (optional)
WHOP_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

## Testing the Flow

### Test Member Access:

1. Purchase your own product using a test card
2. Visit `/today` - you should see today's drop
3. Visit `/admin` - you should be able to post

### Test Non-Member Flow:

1. Use an incognito window or different browser
2. Visit `/today` - should redirect to `/locked`
3. Click "Upgrade Now" - should open Whop checkout
4. Complete purchase - should gain access

## Troubleshooting

**Issue: "Configuration error"**

- Double-check all IDs are correct
- Ensure no extra spaces in environment variables
- Restart dev server after changing `.env.local`

**Issue: "Access denied"**

- Make sure you've installed the app into your Whop
- Verify permissions were approved during installation
- Check that `NEXT_PUBLIC_WHOP_ACCESS_PASS_ID` matches your product

**Issue: App not loading in iframe**

- Explicitly set "App path" in Whop dashboard (don't rely on placeholder text)
- Use settings icon → select "localhost" for local testing
- Check that port 3000 is not blocked

**Issue: Checkout not working**

- Verify `NEXT_PUBLIC_WHOP_PLAN_ID` is correct
- Ensure iframe SDK is initialized (wrapped in `<WhopApp>`)
- Check browser console for errors

## Next Steps

Once Whop is configured:

1. Set up Appwrite (see `APPWRITE_SETUP.md`)
2. Test the complete user flow
3. Deploy to production
4. Update Base URL to your Vercel domain

## Resources

- [Whop Documentation](https://docs.whop.com)
- [Whop SDK Reference](https://docs.whop.com/sdk)
- [Developer Dashboard](https://whop.com/dashboard/developer)

---

✅ **You're all set!** Your Whop integration is ready for the Gated Daily Drop app.

# 📋 Appwrite Setup Guide

This guide will walk you through setting up Appwrite for the Gated Daily Drop app.

## Step 1: Create an Appwrite Project

1. Go to [Appwrite Cloud](https://cloud.appwrite.io)
2. Sign up or log in
3. Click **"Create Project"**
4. Name your project (e.g., "Gated Daily Drop")
5. Copy the **Project ID** - you'll need this for your `.env.local`

## Step 2: Create a Database

1. In your Appwrite project, click **Databases** in the left sidebar
2. Click **"Create Database"**
3. Name it "daily_drops_db" (or any name you prefer)
4. Copy the **Database ID** - save this for your environment variables

## Step 3: Create the Daily Drops Collection

1. Inside your database, click **"Create Collection"**
2. Name it "daily_drops"
3. Copy the **Collection ID** - save this as `NEXT_PUBLIC_APPWRITE_DAILY_DROPS_COLLECTION_ID`

### Add Attributes

Click **"Attributes"** tab and add these fields:

| Attribute Name | Type   | Size  | Required | Default |
| -------------- | ------ | ----- | -------- | ------- |
| `title`        | String | 255   | No       | -       |
| `content`      | String | 10000 | Yes      | -       |
| `video_url`    | String | 500   | No       | -       |
| `link`         | String | 500   | No       | -       |
| `date`         | String | 10    | Yes      | -       |

**How to add each attribute:**

1. Click **"Create Attribute"**
2. Select **"String"**
3. Enter the attribute name
4. Set the size
5. Check "Required" if needed
6. Click **"Create"**

### Create Index

Create an index on the `date` field for faster queries:

1. Click **"Indexes"** tab
2. Click **"Create Index"**
3. Key: `date`
4. Type: **Key**
5. Attributes: Select `date` from dropdown
6. Order: **ASC**
7. Click **"Create"**

## Step 4: Set Collection Permissions

1. Go to **Settings** tab in your collection
2. Under **Permissions**, configure:

**Read Access:**

- Click **"Add Role"**
- Select **"Any"**
- This allows anyone to read drops

**Create/Update/Delete Access:**

- Option A (Simple): Select **"Any"** for testing
- Option B (Secure): Add specific user roles for admins only

## Step 5: (Optional) Create Users Collection

If you want to track user streaks and preferences:

1. Create another collection called "users"
2. Add these attributes:

| Attribute Name | Type    | Size | Required | Default |
| -------------- | ------- | ---- | -------- | ------- |
| `userId`       | String  | 50   | Yes      | -       |
| `streak`       | Integer | -    | No       | 0       |
| `lastCheckIn`  | String  | 50   | No       | -       |

3. Create index on `userId` field

## Step 6: Update Environment Variables

Copy all the IDs to your `.env.local`:

```bash
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here
NEXT_PUBLIC_APPWRITE_DAILY_DROPS_COLLECTION_ID=your_collection_id_here
```

## Step 7: Test the Connection

Run your Next.js app:

```bash
pnpm dev
```

Try creating a drop from the admin dashboard at `/admin`.

## Troubleshooting

**Error: "Failed to fetch daily drop"**

- Check that Project ID, Database ID, and Collection ID are correct
- Verify permissions are set to allow read access
- Make sure the `date` attribute exists

**Error: "Document not found"**

- Create a drop first from `/admin`
- Ensure the date format is YYYY-MM-DD

**Error: "Missing required attribute"**

- Make sure all required attributes are marked correctly in Appwrite
- Check that `content` and `date` are required

## Next Steps

Once Appwrite is configured:

1. Set up your Whop app (see main README)
2. Create an access pass and pricing plan
3. Test the full flow from landing → locked → upgrade → member view

## Need Help?

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Discord](https://appwrite.io/discord)
- [Appwrite Cloud Console](https://cloud.appwrite.io)

---

✅ **You're all set!** Your Appwrite backend is ready for the Gated Daily Drop app.

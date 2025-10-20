import { Client, Databases, Storage } from "appwrite";

// Appwrite client configuration
const client = new Client()
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1"
  )
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

export const databases = new Databases(client);
export const storage = new Storage(client);

// Database and collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
export const DAILY_DROPS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DAILY_DROPS_COLLECTION_ID || "";
export const USERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "";

// Storage bucket ID
export const STORAGE_BUCKET_ID =
  process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || "";

// Types for daily drops
export interface DailyDrop {
  $id?: string;
  companyId: string; // CRITICAL: Multi-tenant isolation by Whop company
  title: string;
  content: string;
  video_url?: string;
  link?: string;
  date: string; // ISO date string (YYYY-MM-DD)
  $createdAt?: string;
  $updatedAt?: string;
}

export interface UserPreferences {
  $id?: string;
  userId: string;
  streak: number;
  lastCheckIn?: string;
  $createdAt?: string;
  $updatedAt?: string;
}

import {
  databases,
  DATABASE_ID,
  DAILY_DROPS_COLLECTION_ID,
} from "@/lib/appwrite";
import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Query } from "appwrite";

// GET - Fetch list of drops for a company
export async function GET(request: Request) {
  try {
    // Verify user authentication
    const headersList = await headers();
    const userToken = await whopSdk.verifyUserToken(headersList);

    if (!userToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get companyId from query parameters
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Verify the user has access to THIS specific company (admin only for managing drops)
    const access = await whopSdk.access.checkIfUserHasAccessToCompany({
      companyId,
      userId: userToken.userId,
    });

    if (!access.hasAccess || access.accessLevel !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Fetch drops from Appwrite - filtered by companyId, ordered by date desc
    const response = await databases.listDocuments(
      DATABASE_ID,
      DAILY_DROPS_COLLECTION_ID,
      [
        Query.equal("companyId", companyId),
        Query.orderDesc("date"),
        Query.limit(limit),
      ]
    );

    // Calculate stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const stats = {
      totalDrops: response.total,
      thisMonth: response.documents.filter((doc) => {
        const docDate = new Date(doc.date);
        return docDate >= startOfMonth;
      }).length,
      thisWeek: response.documents.filter((doc) => {
        const docDate = new Date(doc.date);
        return docDate >= startOfWeek;
      }).length,
    };

    return NextResponse.json({
      drops: response.documents,
      stats,
      total: response.total,
    });
  } catch (error) {
    console.error("Error fetching drops list:", error);
    return NextResponse.json(
      { error: "Failed to fetch drops" },
      { status: 500 }
    );
  }
}

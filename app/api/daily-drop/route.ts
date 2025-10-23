import {
  databases,
  DATABASE_ID,
  DAILY_DROPS_COLLECTION_ID,
  type DailyDrop,
} from "@/lib/appwrite";
import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Query } from "appwrite";

// GET - Fetch today's drop
export async function GET(request: Request) {
  try {
    // Verify user authentication
    const headersList = await headers();
    const userToken = await whopSdk.verifyUserToken(headersList);

    if (!userToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get companyId from query parameters (passed from frontend)
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Verify the user has access to THIS specific company
    const hasAccess = await whopSdk.access.checkIfUserHasAccessToCompany({
      companyId,
      userId: userToken.userId,
    });

    if (!hasAccess.hasAccess) {
      return NextResponse.json(
        { error: "Access denied to this company" },
        { status: 403 }
      );
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Fetch today's drop from Appwrite - filtered by BOTH date AND companyId
    const response = await databases.listDocuments(
      DATABASE_ID,
      DAILY_DROPS_COLLECTION_ID,
      [
        Query.equal("date", today),
        Query.equal("companyId", companyId),
        Query.limit(1),
      ]
    );

    if (response.documents.length === 0) {
      return NextResponse.json({ drop: null });
    }

    const drop: DailyDrop = {
      companyId: response.documents[0].companyId,
      title: response.documents[0].title,
      content: response.documents[0].content,
      video_url: response.documents[0].video_url,
      link: response.documents[0].link,
      date: response.documents[0].date,
    };

    return NextResponse.json({ drop });
  } catch (error) {
    console.error("Error fetching daily drop:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily drop" },
      { status: 500 }
    );
  }
}

// POST - Create a new daily drop (admin only)
export async function POST(request: Request) {
  try {
    // Verify user authentication
    const headersList = await headers();
    const userToken = await whopSdk.verifyUserToken(headersList);

    if (!userToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body (companyId comes from frontend)
    const body = await request.json();
    const { title, content, video_url, link, companyId } = body;

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Check if user is admin/creator of THIS specific company
    const access = await whopSdk.access.checkIfUserHasAccessToCompany({
      companyId,
      userId: userToken.userId,
    });

    if (!access.hasAccess || access.accessLevel !== "admin") {
      return NextResponse.json(
        { error: "Admin access required for this company" },
        { status: 403 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Check if a drop already exists for today FOR THIS COMPANY
    const existing = await databases.listDocuments(
      DATABASE_ID,
      DAILY_DROPS_COLLECTION_ID,
      [Query.equal("date", today), Query.equal("companyId", companyId)]
    );

    if (existing.documents.length > 0) {
      // Update existing drop
      const updated = await databases.updateDocument(
        DATABASE_ID,
        DAILY_DROPS_COLLECTION_ID,
        existing.documents[0].$id,
        {
          companyId, // CRITICAL: Ensure companyId stays with the drop
          title: title || "",
          content,
          video_url: video_url || "",
          link: link || "",
          date: today,
        }
      );

      return NextResponse.json({
        drop: updated,
        message: "Drop updated successfully",
      });
    }

    // Create new drop
    const drop = await databases.createDocument(
      DATABASE_ID,
      DAILY_DROPS_COLLECTION_ID,
      "unique()",
      {
        companyId, // CRITICAL: Isolate drops by company
        title: title || "",
        content,
        video_url: video_url || "",
        link: link || "",
        date: today,
      }
    );

    return NextResponse.json(
      { drop, message: "Drop created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating daily drop:", error);
    return NextResponse.json(
      { error: "Failed to create daily drop" },
      { status: 500 }
    );
  }
}

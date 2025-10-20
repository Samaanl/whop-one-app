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
export async function GET() {
  try {
    // Verify user authentication
    const headersList = await headers();
    const userToken = await whopSdk.verifyUserToken(headersList);

    if (!userToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has access
    const accessPassId = process.env.NEXT_PUBLIC_WHOP_ACCESS_PASS_ID;
    if (!accessPassId) {
      return NextResponse.json(
        { error: "Configuration error" },
        { status: 500 }
      );
    }

    const hasAccess = await whopSdk.access.checkIfUserHasAccessToAccessPass({
      accessPassId,
      userId: userToken.userId,
    });

    if (!hasAccess.hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get the company ID from the user's context
    const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;
    if (!companyId) {
      return NextResponse.json(
        { error: "Configuration error" },
        { status: 500 }
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

    // Check if user is admin/creator
    // You can implement your own admin check logic here
    // For now, we'll assume the creator has a specific role or is the company owner
    const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;
    if (!companyId) {
      return NextResponse.json(
        { error: "Configuration error" },
        { status: 500 }
      );
    }

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

    // Parse request body
    const body = await request.json();
    const { title, content, video_url, link } = body;

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

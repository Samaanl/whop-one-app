import {
  databases,
  DATABASE_ID,
  DAILY_DROPS_COLLECTION_ID,
} from "@/lib/appwrite";
import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// PUT - Update a drop
export async function PUT(request: Request) {
  try {
    // Verify user authentication
    const headersList = await headers();
    const userToken = await whopSdk.verifyUserToken(headersList);

    if (!userToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { id, companyId, title, content, video_url, link, date } = body;

    if (!id || !companyId || !content) {
      return NextResponse.json(
        { error: "Drop ID, Company ID, and content are required" },
        { status: 400 }
      );
    }

    // Verify the user is admin of THIS specific company
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

    // Verify the drop belongs to this company (security check)
    const existingDrop = await databases.getDocument(
      DATABASE_ID,
      DAILY_DROPS_COLLECTION_ID,
      id
    );

    if (existingDrop.companyId !== companyId) {
      return NextResponse.json(
        { error: "Drop does not belong to this company" },
        { status: 403 }
      );
    }

    // Update the drop
    const updated = await databases.updateDocument(
      DATABASE_ID,
      DAILY_DROPS_COLLECTION_ID,
      id,
      {
        companyId, // Ensure companyId stays with the drop
        title: title || "",
        content,
        video_url: video_url || "",
        link: link || "",
        date: date || existingDrop.date,
      }
    );

    return NextResponse.json({
      drop: updated,
      message: "Drop updated successfully",
    });
  } catch (error) {
    console.error("Error updating drop:", error);
    return NextResponse.json(
      { error: "Failed to update drop" },
      { status: 500 }
    );
  }
}

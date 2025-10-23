import {
  databases,
  DATABASE_ID,
  DAILY_DROPS_COLLECTION_ID,
} from "@/lib/appwrite";
import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// DELETE - Delete a drop
export async function DELETE(request: Request) {
  try {
    // Verify user authentication
    const headersList = await headers();
    const userToken = await whopSdk.verifyUserToken(headersList);

    if (!userToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get params
    const { searchParams } = new URL(request.url);
    const dropId = searchParams.get("id");
    const companyId = searchParams.get("companyId");

    if (!dropId || !companyId) {
      return NextResponse.json(
        { error: "Drop ID and Company ID are required" },
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
    const drop = await databases.getDocument(
      DATABASE_ID,
      DAILY_DROPS_COLLECTION_ID,
      dropId
    );

    if (drop.companyId !== companyId) {
      return NextResponse.json(
        { error: "Drop does not belong to this company" },
        { status: 403 }
      );
    }

    // Delete the drop
    await databases.deleteDocument(
      DATABASE_ID,
      DAILY_DROPS_COLLECTION_ID,
      dropId
    );

    return NextResponse.json({
      message: "Drop deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting drop:", error);
    return NextResponse.json(
      { error: "Failed to delete drop" },
      { status: 500 }
    );
  }
}

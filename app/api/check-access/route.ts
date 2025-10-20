import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Verify user authentication via Whop
    const headersList = await headers();
    const userToken = await whopSdk.verifyUserToken(headersList);

    if (!userToken) {
      return NextResponse.json({ hasAccess: false }, { status: 401 });
    }

    const userId = userToken.userId;

    // Check if user has access to the premium plan/product
    // Replace with your actual access pass ID
    const accessPassId = process.env.NEXT_PUBLIC_WHOP_ACCESS_PASS_ID;

    if (!accessPassId) {
      console.error("Access pass ID not configured");
      return NextResponse.json(
        { hasAccess: false, error: "Configuration error" },
        { status: 500 }
      );
    }

    const hasAccess = await whopSdk.access.checkIfUserHasAccessToAccessPass({
      accessPassId,
      userId,
    });

    return NextResponse.json({ hasAccess: hasAccess.hasAccess });
  } catch (error) {
    console.error("Error checking access:", error);
    return NextResponse.json(
      { hasAccess: false, error: "Failed to check access" },
      { status: 500 }
    );
  }
}

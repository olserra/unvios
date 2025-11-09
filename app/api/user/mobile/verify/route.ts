import { db } from "@/lib/db/drizzle";
import { getUser } from "@/lib/db/queries";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Verification code is required" },
        { status: 400 }
      );
    }

    // Validate verification code
    if (code !== user.mobileVerificationToken) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Check if code has expired
    if (
      !user.mobileVerificationExpires ||
      new Date() > user.mobileVerificationExpires
    ) {
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Mark mobile as verified
    await db
      .update(users)
      .set({
        mobileVerified: new Date(),
        mobileVerificationToken: null,
        mobileVerificationExpires: null,
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({
      success: true,
      message: "Mobile number verified successfully",
    });
  } catch (error) {
    console.error("Error verifying mobile number:", error);
    return NextResponse.json(
      { error: "Failed to verify mobile number" },
      { status: 500 }
    );
  }
}

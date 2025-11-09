import { db } from "@/lib/db/drizzle";
import { getUser } from "@/lib/db/queries";
import { users } from "@/lib/db/schema";
import { sendVerificationSMS } from "@/lib/firebase-admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mobileNumber } = await request.json();

    if (!mobileNumber || typeof mobileNumber !== "string") {
      return NextResponse.json(
        { error: "Mobile number is required" },
        { status: 400 }
      );
    }

    // Parse phone number to extract country code and number
    // Format expected: +12345678901
    const phoneMatch = mobileNumber.match(/^\+(\d{1,5})(\d+)$/);
    if (!phoneMatch) {
      return NextResponse.json(
        {
          error:
            "Invalid phone number format. Please include country code (e.g., +1234567890)",
        },
        { status: 400 }
      );
    }

    const countryCode = `+${phoneMatch[1]}`;
    const phoneNumber = phoneMatch[2];

    // Generate 6-digit verification code
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new mobile number and verification token
    await db
      .update(users)
      .set({
        mobileCountryCode: countryCode,
        mobileNumber: phoneNumber,
        mobileVerificationToken: verificationToken,
        mobileVerificationExpires: verificationExpires,
        mobileVerified: null, // Reset verification status
      })
      .where(eq(users.id, user.id));

    // Send SMS verification code
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    const smsResult = await sendVerificationSMS(
      fullPhoneNumber,
      verificationToken
    );

    if (!smsResult.success && smsResult.error) {
      console.warn("SMS sending warning:", smsResult.error);
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent",
    });
  } catch (error) {
    console.error("Error updating mobile number:", error);
    return NextResponse.json(
      { error: "Failed to update mobile number" },
      { status: 500 }
    );
  }
}

import twilio from "twilio";

/**
 * Send SMS verification code using Twilio
 * Falls back to console logging if Twilio is not configured
 */
export async function sendVerificationSMS(
  phoneNumber: string,
  verificationCode: string
): Promise<{ success: boolean; error?: string }> {
  // Check if Twilio is configured
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    // No Twilio configured - log to console for development
    console.log("\n=================================");
    console.log("📱 SMS VERIFICATION CODE");
    console.log("=================================");
    console.log(`Phone: ${phoneNumber}`);
    console.log(`Code: ${verificationCode}`);
    console.log("=================================\n");

    return {
      success: true,
      error:
        "SMS not sent - Twilio not configured. Code logged to console for development.",
    };
  }

  try {
    const client = twilio(accountSid, authToken);

    const message = await client.messages.create({
      body: `Your Unvios verification code is: ${verificationCode}\n\nThis code expires in 10 minutes.`,
      to: phoneNumber,
      from: fromNumber,
    });

    console.log(`SMS sent successfully to ${phoneNumber}. SID: ${message.sid}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to send SMS via Twilio:", error);

    // Fall back to console logging
    console.log("\n=================================");
    console.log("📱 SMS VERIFICATION CODE (Fallback)");
    console.log("=================================");
    console.log(`Phone: ${phoneNumber}`);
    console.log(`Code: ${verificationCode}`);
    console.log("=================================\n");

    return {
      success: false,
      error: `Failed to send SMS: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

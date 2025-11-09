# Twilio SMS Configuration Guide

This guide will help you set up Twilio to send SMS verification codes to users.

## Why Twilio?

- **Free Trial**: $15 credit (approximately 500-750 SMS)
- **Easy Setup**: Takes about 10 minutes
- **Reliable**: Industry standard for SMS delivery
- **Good Documentation**: Excellent API and support

## Step-by-Step Setup

### 1. Create Twilio Account

1. Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free account
3. Verify your email address
4. Complete the verification process

### 2. Get Your Credentials

Once logged in to the [Twilio Console](https://console.twilio.com/):

1. **Account SID**: Found on the main dashboard
2. **Auth Token**: Click "Show" next to Auth Token on dashboard
3. **Copy both values** - you'll need them for the `.env.local` file

### 3. Get a Phone Number

1. In Twilio Console, go to: **Phone Numbers** → **Buy a number**
2. For trial accounts:
   - Choose a country (e.g., United States)
   - Select "Voice" and "SMS" capabilities
   - Click "Search"
3. Pick a number and click "Buy"
4. **Note**: Trial accounts can only send to verified numbers

### 4. Verify Your Phone Number (Trial Accounts)

For trial accounts, you need to verify your Portuguese number:

1. Go to: **Phone Numbers** → **Verified Caller IDs**
2. Click **Add a new Caller ID**
3. Enter your number: `+351914127195`
4. Complete the verification (you'll receive a call or SMS)

### 5. Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

Replace:

- `ACxxxxxx...` with your Account SID from Twilio dashboard
- `your_auth_token_here` with your Auth Token
- `+1234567890` with the phone number you purchased

### 6. Restart Your Development Server

```bash
pnpm dev
```

## Testing

1. Go to your sign-up page or settings
2. Enter your phone number: `+351914127195`
3. Click "Send Verification Code"
4. You should receive an SMS within seconds!

## Trial Account Limitations

**Free trial includes:**

- $15 credit (≈500-750 SMS depending on country)
- Can only send to verified numbers
- Messages include "Sent from a Twilio Trial Account" prefix

**To remove limitations:**

- Upgrade to a paid account (no monthly fee, pay-as-you-go)
- Cost: ~$0.0079/SMS for US, varies by country
- Remove trial message prefix
- Send to any number

## Upgrading to Production

When ready to go to production:

1. **Upgrade Account**:

   - Go to Twilio Console → Billing
   - Add payment method
   - No monthly fees, only pay per SMS

2. **Purchase More Numbers** (optional):

   - If you need multiple numbers for different countries
   - Or a dedicated short code

3. **Enable International SMS**:

   - Go to Settings → Geo Permissions
   - Enable countries you want to send to (e.g., Portugal)

4. **Set Up Alerts**:
   - Configure usage alerts to monitor costs
   - Set spending limits if needed

## Cost Estimates

| Country        | Price per SMS | 1000 users |
| -------------- | ------------- | ---------- |
| Portugal       | $0.056        | $56        |
| United States  | $0.0079       | $8         |
| Brazil         | $0.012        | $12        |
| United Kingdom | $0.044        | $44        |

**Note**: Prices are approximate and may vary. Check [Twilio Pricing](https://www.twilio.com/pricing/messaging) for current rates.

## Troubleshooting

### SMS Not Received?

1. **Check Console Logs**: Look for error messages
2. **Verify Phone Format**: Must be in E.164 format (e.g., `+351914127195`)
3. **Check Trial Limits**: If on trial, number must be verified
4. **Check Twilio Logs**: Console → Monitor → Logs → Messaging

### "Unable to create record: Authenticate" Error?

- Double-check your Account SID and Auth Token
- Make sure there are no extra spaces or quotes
- Restart your dev server after adding credentials

### "Phone number not verified" Error?

- For trial accounts, verify the recipient number first
- Go to: Phone Numbers → Verified Caller IDs

### No Environment Variables?

- Make sure `.env.local` file exists
- Restart your development server
- Check that variables don't have quotes around them

## Alternative: Firebase Phone Auth

If you prefer Firebase (truly free up to 10,000/month):

1. Follow [Firebase Phone Auth Setup](https://firebase.google.com/docs/auth/web/phone-auth)
2. Update `lib/firebase-admin.ts` to use Firebase instead of Twilio
3. Note: Requires client-side Firebase SDK integration

## Support

- **Twilio Docs**: [https://www.twilio.com/docs/sms](https://www.twilio.com/docs/sms)
- **Community Support**: [https://support.twilio.com/](https://support.twilio.com/)
- **Status Page**: [https://status.twilio.com/](https://status.twilio.com/)

## Next Steps

Once SMS is working:

1. Test with multiple phone numbers
2. Monitor usage in Twilio Console
3. Set up usage alerts
4. Consider upgrading when traffic increases
5. Implement rate limiting to prevent abuse

---

**Ready to test?** Add your Twilio credentials to `.env.local` and restart your server!

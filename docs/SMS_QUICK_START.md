# 📱 SMS Verification - Quick Start

## ✅ Status: Ready to Test!

The SMS verification system is fully implemented and ready to send real SMS messages to your phone.

## 🚀 Quick Setup (10 minutes)

### Step 1: Get Twilio Credentials

1. Go to **[https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)**
2. Sign up for free account (you get **$15 credit** = ~750 SMS)
3. Get your credentials from the dashboard:
   - **Account SID** (starts with AC...)
   - **Auth Token** (click "Show" to reveal)
   - Buy a **phone number** (free with trial)

### Step 2: Verify Your Phone (Trial Accounts Only)

For trial accounts, verify your number `+351914127195`:

1. In Twilio Console: **Phone Numbers** → **Verified Caller IDs**
2. Click **Add a new Caller ID**
3. Enter: `+351914127195`
4. Verify via SMS or voice call

### Step 3: Add to .env.local

Add these lines to your `.env.local` file:

```bash
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 4: Restart Server

```bash
pnpm dev
```

### Step 5: Test!

1. Go to: **http://localhost:3000/sign-up** or **http://localhost:3000/dashboard/general**
2. Enter your phone: `+351914127195`
3. Click "Send Verification Code"
4. **You should receive SMS within seconds!** 📨

## 🆓 Cost

**Free tier:** $15 credit = approximately 750 SMS messages

**After free tier:**

- Portugal: ~$0.056 per SMS
- US: ~$0.0079 per SMS
- Pay-as-you-go, no monthly fees

## 🔍 Troubleshooting

### No SMS received?

1. **Check console logs** for errors
2. **Verify phone format**: Must be `+351914127195` (include country code)
3. **Trial accounts**: Number must be verified first
4. **Check Twilio logs**: Console → Monitor → Logs → Messaging

### Environment variables not working?

1. Make sure `.env.local` file exists in project root
2. No quotes around values
3. Restart dev server after changes

### Still no SMS?

The system falls back to **console logging** if Twilio is not configured:

- Check your terminal/console for the verification code
- Look for: `📱 SMS VERIFICATION CODE`

## 📚 Detailed Documentation

See **[docs/TWILIO_SETUP.md](./docs/TWILIO_SETUP.md)** for:

- Complete step-by-step guide
- Screenshots
- Troubleshooting tips
- Production setup
- Cost estimates by country

## 🔐 What's Implemented

✅ Mobile number collection on sign-up
✅ Phone number management in settings
✅ 6-digit verification codes (10-minute expiration)
✅ SMS sending via Twilio
✅ Fallback to console logging (development)
✅ International phone number support
✅ Professional UI with country code dropdown
✅ Verification status tracking

## 🎯 Current Behavior

**Without Twilio configured:**

- Verification codes are logged to console
- System works perfectly for development/testing
- Just look in terminal for the 6-digit code

**With Twilio configured:**

- Real SMS sent to phone numbers
- Production-ready
- Reliable delivery worldwide

## 💡 Alternative: Free SMS (10k/month)

If you want completely free SMS (up to 10,000/month), you can use **Firebase Phone Auth** instead:

See ADR document for Firebase setup instructions.

## 🚦 Next Steps

1. **Now**: Set up Twilio trial and test (10 minutes)
2. **Before launch**: Upgrade to paid account (removes "trial" message)
3. **Production**: Add rate limiting and monitoring

---

**Need help?** Check `docs/TWILIO_SETUP.md` or the Twilio documentation.

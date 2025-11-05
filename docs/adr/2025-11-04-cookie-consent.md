---
Title: Cookie consent banner (Accept All / Decline All)
Date: 2025-11-04
Status: Accepted

Context
-------
We need a GDPR-friendly cookie consent mechanism for first-time visitors. The site must not enable non-essential tracking without explicit consent. The app uses a mix of server components and client components (Next.js App Router). Some browser extensions or client-only code may add attributes on hydration which can cause hydration mismatch warnings.

Decision
--------
Add a simple, explicit cookie consent banner that appears fixed at the bottom of the page for first-time visitors with two actions:

- "Accept All" — enables non-essential cookies/analytics (implementation detail: the event is emitted and consumers may initialize analytics based on it).
- "Decline All" — disables non-essential cookies/analytics.

Implementation specifics
-----------------------
- Client component: `components/ui/cookie-consent.tsx` (client component). Renders a bottom banner using existing UI primitives (`Button`).
- Persistence: store result in a cookie named `unvios_cookie_consent` (max-age 1 year, SameSite=Lax, Secure when HTTPS) and mirror to `localStorage` as a fallback when cookies are blocked.
- Event: dispatch a DOM CustomEvent `unvios:cookie-consent` with detail `{ consent: 'accepted' | 'declined' }` so analytics or other client code can conditionally initialize.
- Privacy link: banner includes link to `/privacy` which contains the privacy policy and a contact mailto link.
- Root layout: banner rendered from `app/layout.tsx` (imported and included) so it appears site-wide.
- Hydration note: to avoid noisy console warnings caused by client-side differences (extensions or client-only attributes), `suppressHydrationWarning` was added to the `<body>` in `app/layout.tsx`. This does not change SSR HTML — it only suppresses the hydration warning for differences on the body element.

Rationale
---------
- Explicit opt-in/opt-out is the simplest, auditable approach that aligns with GDPR expectations for analytics and tracking.
- Mirroring consent to `localStorage` provides a fallback if cookies are blocked.
- Emitting a DOM event leaves the initialization of third-party scripts to the app code, not the banner itself, keeping concerns separated.
- Adding `suppressHydrationWarning` on the `body` reduces false-positive console noise from browser extensions that modify attributes only in the client.

Consequences & Migration
------------------------
- No database migrations required.
- Existing users remain unaffected. New visitors will be shown the banner until they choose Accept or Decline.
- To enable analytics or other systems on consent, developers should listen for `unvios:cookie-consent` in client-side code and initialize/disable services accordingly.

Rollback
--------
- Remove `components/ui/cookie-consent.tsx` and the import from `app/layout.tsx`, and remove `suppressHydrationWarning` if desired.

Next steps
----------
- (Optional) Add a "Manage Preferences" UI to choose granular consent (analytics, personalization, marketing).
- Wire analytics initialization to the `unvios:cookie-consent` event (only initialize when `consent === 'accepted'`).
- Add automated client tests to verify cookie/localStorage writes and event emission.

References
----------
- GDPR guidelines on consent and tracking
- Project coding patterns: keep memory format and storage patterns unchanged

---

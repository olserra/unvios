# ADR: User Onboarding Tour Implementation

**Date:** 2025-11-04
**Status:** Accepted

## Context

New users arriving at the dashboard/memories page for the first time need guidance on how to use the application. Without onboarding, users may not discover the two primary ways to add memories:

1. Through natural conversation in the Chat interface
2. Manually via the "+" button

The lack of initial guidance can lead to confusion and reduced engagement with the core features of the application.

## Decision

Implemented a 2-step onboarding tour that activates automatically when:

- A user accesses `/dashboard/memories` for the first time
- The user has zero memories in their account
- The user has not previously completed the onboarding (tracked via localStorage)

### Implementation Details

**New Components:**

- `components/dashboard/OnboardingTour.tsx` — A modal overlay component that highlights specific UI elements with a spotlight effect

**Tour Flow:**

1. **Step 1/2:** Highlights the "Chat" button in the sidebar

   - Explains that memories can be added through natural conversation
   - Provides a "Next" button to proceed

2. **Step 2/2:** Highlights the "+" (New) button
   - Explains manual memory creation
   - Provides "Back" and "Done" buttons

**Visual Design:**

- Dark overlay (60% black) to dim the rest of the interface
- White spotlight effect with orange ring around highlighted elements
- Floating tooltip card with step indicator, title, description, and navigation buttons
- Smooth transitions between steps

**Persistence:**

- Uses `localStorage.setItem("memora_onboarding_seen", "true")` after completion
- Prevents body scroll during onboarding
- Can be dismissed by clicking the overlay or the X button

**Integration Points:**

- `components/dashboard/MemoriesPanel.tsx` — Added `useEffect` to check for empty memories and localStorage flag
- `data-onboarding="add-memory"` attribute added to the + button for targeting
- Chat link in sidebar is targeted via `a[href="/dashboard/chat"]` selector

## Rationale

**Why a spotlight-style tour:**

- Non-intrusive: doesn't block the entire interface
- Contextual: shows users exactly where to click
- Progressive: guides users step-by-step through core features

**Why localStorage instead of database:**

- Faster: no API call needed to check onboarding status
- Simpler: no schema changes required
- Acceptable trade-off: if a user clears localStorage, seeing the tour again is not harmful

**Why trigger on zero memories:**

- Most relevant time: users need guidance when they haven't created anything yet
- Avoids annoyance: returning users with existing memories won't see the tour

**Why 2 steps specifically:**

- Focused: only highlights the two primary ways to add memories
- Quick: doesn't overwhelm new users with too much information
- Complete: covers both primary user flows (chat-based and manual)

## Migration/Rollback

**Migration:**

- No database changes required
- No environment variables needed
- Automatically activates for users with zero memories who haven't seen it yet

**Rollback:**

- Remove `OnboardingTour` component
- Remove onboarding state and effect from `MemoriesPanel.tsx`
- Remove `data-onboarding` attribute from + button

**Testing Rollback:**

- Clear localStorage key: `localStorage.removeItem("memora_onboarding_seen")`
- Delete all memories to trigger the tour again

## Next Steps

1. **Analytics tracking (future):** Add event tracking to measure:

   - How many users complete the onboarding
   - How many dismiss it early
   - Which step has the highest drop-off

2. **A/B testing (future):** Test alternative onboarding flows:

   - Single-step tour
   - Video/GIF demonstrations
   - Interactive tutorial with sample memory creation

3. **Expand tour (future):** Consider adding steps for:

   - Memory search and filtering
   - Tag management
   - Grid vs. list view toggle

4. **Multi-language support:** Add i18n for onboarding text to match the app's Portuguese/English support

## Trade-offs

**Pros:**

- Improves first-time user experience
- Increases feature discoverability
- Minimal code complexity
- No backend changes required

**Cons:**

- localStorage approach means tour resets if user clears browser data
- Manual DOM querying for highlight positioning could be fragile if UI structure changes significantly
- No server-side tracking of onboarding completion status

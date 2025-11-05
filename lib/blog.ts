export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string; // ISO date
  image?: string; // optional hero image URL
  imageAlt?: string; // alt text for the image
};

// Two example posts with dates in the recent past
export const posts: Post[] = [
  {
    slug: "introducing-unvios-ai",
    title: "Introducing Unvios AI: Your Second Brain",
    excerpt:
      "Meet Unvios AI — an assistant that lives in WhatsApp, remembers what matters, and helps you recall context when you need it.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop",
    imageAlt: "Abstract visualization of neural networks and AI technology",
    content: `## Your Memory, Reimagined

We've all been there. A brilliant idea strikes while you're driving, cooking, or falling asleep. You make a mental note to remember it later. And then... it's gone.

Or maybe you had an important conversation last week, and now you're struggling to recall the key details. Was it Tuesday or Wednesday? What was the name they mentioned? The context you need is buried somewhere in your brain, just out of reach.

**This is the problem Unvios was built to solve.**

## What is Unvios AI?

Unvios AI is your personal memory assistant that lives right inside WhatsApp—the app you already use every day. No need to download another app, learn a new interface, or change your habits.

Simply send a message, voice note, or forward anything to Unvios, and it becomes part of your searchable, AI-organized second brain.

### How It Works

**1. Capture Everything**
- Send text messages with ideas, tasks, or notes
- Record voice memos that get automatically transcribed
- Forward important messages, links, or documents
- Even transcribe phone calls for later reference

**2. AI-Powered Organization**
Unvios doesn't just store your memories—it understands them. Our AI automatically:
- Categorizes content by topic and context
- Tags people, places, and important concepts
- Connects related memories across time
- Extracts key information and insights

**3. Instant Recall**
Ask Unvios anything in natural language:
- "What was that restaurant Maria recommended?"
- "Show me my ideas about the mobile app redesign"
- "What did I discuss with John last Tuesday?"

Unvios searches through your entire memory bank and surfaces exactly what you need, with full context.

## Privacy First

We know your memories are personal. That's why Unvios is built with privacy at its core:

- **End-to-end encryption** for all your data
- **You own your memories**—export them anytime
- **No data selling** or third-party sharing
- **Secure infrastructure** with regular audits

Your thoughts, ideas, and conversations stay yours. Always.

## Built for Your Workflow

Unlike traditional note-taking apps, Unvios adapts to how you already work:

- **No app switching**: Everything happens in WhatsApp
- **No manual organization**: AI handles the filing
- **No searching through folders**: Just ask what you need
- **No learning curve**: If you can send a message, you can use Unvios

## Who Is Unvios For?

**Creative Professionals**: Capture fleeting inspiration and recall ideas when you need them.

**Busy Executives**: Keep track of conversations, decisions, and action items without drowning in notes.

**Students & Researchers**: Build a knowledge base that grows with you and surfaces connections you didn't know existed.

**Anyone who thinks**: If you have ideas worth remembering, Unvios is for you.

## Getting Started

Ready to never forget again? Getting started with Unvios takes less than 2 minutes:

1. Sign up at [unvios.ai](https://unvios.ai)
2. Connect your WhatsApp account
3. Start capturing memories

Your first 100 memories are free, forever. No credit card required.

## The Future of Memory

We're just getting started. Unvios is constantly learning and evolving:

- **Smart reminders** based on context and timing
- **Proactive insights** from your memory patterns
- **Team workspaces** for shared knowledge
- **Integration** with your favorite tools

Your brain is incredible at thinking, creating, and connecting. Let Unvios handle the remembering.

---

*Try Unvios today and discover what it feels like to never lose an idea again.*`,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // ~30 days ago
  },
  {
    slug: "productivity-habits-for-creatives",
    title: "Productivity Habits for Creatives",
    excerpt:
      "Small routines that help creatives capture, iterate, and act on ideas without losing momentum.",
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=600&fit=crop",
    imageAlt: "Creative workspace with notebook, laptop, and coffee",
    content: `## The Creative's Dilemma

You're walking to grab coffee when it hits you—the perfect solution to a problem you've been wrestling with for days. You make a mental note. By the time you're back at your desk, it's gone.

Or maybe you're in the shower, half-awake, when your brain serves up three brilliant ideas in rapid succession. You tell yourself you'll remember them. You won't.

**This is the creative paradox**: our best ideas arrive when we're least prepared to capture them. And the ideas we lose might be the ones that could have changed everything.

The solution isn't trying harder to remember. It's building simple habits that make capturing, refining, and acting on ideas effortless.

## Habit 1: Capture Everything, Immediately

The first rule of creative productivity is brutally simple: **if you don't capture it, it doesn't exist.**

Your brain is for having ideas, not storing them. Every idea you try to hold in your head is taking up mental bandwidth that could be used for creative thinking.

### Make Capturing Friction-Free

The easier it is to capture ideas, the more ideas you'll capture. This means:

**Choose one primary capture tool** and stick to it. For most people, that's their phone—it's always with you, and you can capture text, voice, or photos instantly.

**Use voice notes liberally**. Speaking is faster than typing, and you can capture nuance and emotion that gets lost in text. With Unvios, your voice notes are automatically transcribed and searchable.

**Capture in context**. Don't just write "mobile app idea"—capture why you thought of it, what problem it solves, who it's for. Future you will thank present you for the context.

### The Two-Minute Rule

If capturing an idea will take less than two minutes, do it immediately. Don't add it to a mental list. Don't tell yourself you'll remember. Just capture it now.

This applies even during meetings, conversations, or while you're working on something else. A two-minute interruption beats losing the idea entirely.

## Habit 2: Weekly Review & Connection

Capturing ideas is only half the battle. The real magic happens when you **review what you've captured and find connections** between seemingly unrelated thoughts.

### Schedule a Weekly Review

Pick a consistent time each week—Friday afternoon, Sunday morning, whatever works for you—and dedicate 30 minutes to reviewing your captured ideas.

During this review:

**Read through everything you captured that week**. You'll be surprised what you forgot you thought of.

**Look for patterns and themes**. Are multiple ideas pointing at the same problem? Are you repeatedly drawn to certain topics?

**Connect related ideas**. This is where AI-powered tools like Unvios shine—they can surface connections you might miss, linking a design idea from Tuesday to a business concept from three months ago.

**Flag ideas worth developing**. Not every captured thought deserves immediate action, but some will be worth exploring further. Mark them.

### The Compound Effect

Here's what most people miss: **creative breakthroughs rarely come from single ideas**. They come from connecting multiple ideas in novel ways.

Steve Jobs didn't invent the computer or the mouse or the graphical interface. He connected them in a way no one had before. Your weekly review is your chance to do the same.

## Habit 3: Creative Sprints, Not Marathons

Creatives often fall into two traps:

1. **Waiting for inspiration** (which may never come)
2. **Forcing long work sessions** (which lead to burnout)

The solution? **Time-boxed creative sprints**.

### The 25-Minute Magic

Set a timer for 25 minutes. During that time, you're going to work on *one specific creative task* with complete focus. No email, no Slack, no "quick checks" of anything.

When the timer goes off, take a 5-minute break. Then decide: another sprint, or switch tasks?

This works because:

**It removes the pressure of "finishing"**. You're not committing to complete the project, just to work on it for 25 minutes.

**It's easier to start**. "I'll work on this for 25 minutes" feels more achievable than "I'll finish this project."

**It builds momentum**. Often the hardest part is starting. Once you're 25 minutes in, you'll want to keep going.

### Protect Your Deep Work Time

Not all hours are created equal for creative work. Most people have 2-4 hours per day when their brain is firing on all cylinders. For some, it's first thing in the morning. For others, late at night.

**Figure out when your peak creative hours are, then protect them fiercely.** No meetings, no calls, no "quick questions." This is sacred time for deep, focused creative work.

Use your lower-energy hours for email, admin tasks, and routine work that doesn't require peak mental capacity.

## Habit 4: Embrace Constraints

Unlimited options are the enemy of creativity. **Constraints force creative solutions.**

### Set Clear Boundaries

Before starting any creative work, define your constraints:

**Time**: "I have 2 hours to sketch out this concept"
**Scope**: "This needs to be a one-page solution, not a full report"
**Tools**: "I'm going to use only what I have right now, no new purchases"

Constraints aren't limitations—they're creative fuel. They force you to make decisions, prioritize what matters, and find innovative solutions within the boundaries you've set.

### The 80/20 Rule for Creatives

Not every idea deserves the same amount of attention. Some ideas will have outsized impact, while others are interesting but ultimately minor.

Focus 80% of your creative energy on the 20% of ideas that could make the biggest difference. Be ruthless about this. Good ideas that don't serve your current goals can go into your "someday/maybe" list.

## Habit 5: Share Early, Iterate Often

Perfectionism kills creativity. **Your first version will never be perfect, so stop trying to make it perfect before sharing.**

### The Rough Draft Mindset

Think of everything as a rough draft:

**First drafts are for getting ideas out**, not getting them right.
**Second drafts are for structure**, not polish.
**Third drafts are for refinement**, not perfection.

Share your rough drafts with trusted colleagues, friends, or communities. The feedback you get will be infinitely more valuable than spending another week trying to perfect something in isolation.

### Unvios as Your Creative Partner

This is where a tool like Unvios becomes invaluable. You can:

**Dump rough ideas** without organizing them
**Ask for related thoughts** when you need inspiration
**Surface old ideas** that connect to current projects
**Build a knowledge base** that grows with you over time

Your creative partner doesn't judge your rough drafts or half-formed thoughts. It just helps you capture, connect, and build on them.

## Building Your Creative System

These five habits work together to create a sustainable creative practice:

1. **Capture everything** → you never lose ideas
2. **Review weekly** → you find connections and patterns
3. **Work in sprints** → you make consistent progress without burnout
4. **Embrace constraints** → you make decisions and ship work
5. **Share and iterate** → you improve through feedback, not isolation

The goal isn't to implement all of these perfectly starting tomorrow. Pick one habit, practice it for a few weeks until it feels natural, then add another.

Your creative output isn't limited by your talent or your inspiration. It's limited by your systems. Build better systems, and your creativity will flourish.

---

*Start building your creative system today. Capture your next idea in Unvios and see where it leads.*`,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(), // ~120 days ago
  },
];

export function getPostBySlug(slug?: string | string[] | null) {
  if (!slug) return null;
  const s = Array.isArray(slug) ? slug.join("/") : slug;
  const decoded = decodeURIComponent(s).toLowerCase().trim();
  return posts.find((p) => p.slug.toLowerCase().trim() === decoded) || null;
}

export function getAllPosts() {
  return posts.slice();
}

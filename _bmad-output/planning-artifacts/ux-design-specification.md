---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
workflowStatus: complete
completionDate: 2026-04-17
inputDocuments: 
  - project-context.md
  - prd.md
---

# UX Design Specification word-unscrambler

**Author:** Chris
**Date:** 2026-04-16

---

## Executive Summary

### Project Vision

word-unscrambler is an **instant lookup tool** for the moment of frustration. A user stuck on a word game enters their letters and immediately sees every valid word they can make. No accounts, no features beyond the core lookup—designed for one job: *get unstuck, fast*.

The emotional arc is simple: **frustration → action → relief → move on.**

### Target Users

**The Stuck Gamer:**
- Playing word games (Scrabble, Wordle, crossword, letter puzzles)
- Stuck on their current turn
- Want answers *now*, not to learn about words
- May switch between devices (typing on phone, game on tablet)
- Will likely use this tool multiple times per session (different letter combinations)
- Just need to *see* the word and remember it—no need to copy or take notes

### Key Design Challenges

**Challenge 1: Speed ≠ Simplicity**
Users expect instant gratification. Even though API response is < 10 seconds, the interface must feel *immediate*. Every pixel of UI, every interaction, every state must remove friction. What seems like a small delay feels broken to a stuck user.

**Challenge 2: Empty Results Feel Like Failure**
When users enter letters that make no words, they're already frustrated. The error message must feel supportive, not like the tool failed them. "No words match those letters" frames it as a letter problem, not a tool problem.

**Challenge 3: Making Results Scannable**
Grouping by word length and sorting alphabetically is smart—but the presentation must let users *glance* and find what they need in under 1 second. No parsing, no visual noise.

### Design Opportunities

**Opportunity 1: Progressive Feedback**
Show validation guidance the moment they interact—a message "3-7 letters accepted" below the input field signals the rules without being preachy. This creates the feeling of a ready, waiting tool.

**Opportunity 2: Reusability Without Friction**
Since users may do multiple lookups in one session, each lookup should feel fresh. No clutter from previous searches, no need to "clear" the form. Just ready for the next letters.

**Opportunity 3: Wildcard as a Power Feature**
The `?` wildcard is powerful—let it feel natural and discoverable. A user stuck with "c_t" should intuitively try "c?t" without thinking. Small hint or label could make this obvious.

## Core User Experience

### Defining Experience

word-unscrambler's core experience is a **single, repeatable lookup loop**: enter letters → see all words → repeat. Users may perform multiple lookups in one session, and each loop should feel equally fresh and effortless.

The interaction is: **Type letters → Press Enter/button → See results → Click field again for next lookup**

No refinement, no filtering, no distractions. Each lookup is a complete cycle.

### Platform Strategy

**Web-first, device-agnostic:** word-unscrambler is a responsive web application accessible from any device (phone, tablet, desktop). The interaction must work equally well with:
- Touch input (mobile/tablet)
- Keyboard + mouse (desktop)
- Keyboard-only navigation (accessibility)

The form is the entire interface. No navigation, no menus, no secondary flows. Everything users need is on one page.

### Effortless Interactions

**The Input Field:**
- Auto-focuses on page load (user starts typing immediately, no click needed)
- Accepts letters a-z and `?` wildcard
- Shows validation hint below: "3-7 letters accepted"
- When user clicks to start a new lookup, field auto-clears (one less action)

**The Submit:**
- Press Enter OR click a button (user chooses their preferred method)
- Both feel equally fast—no waiting, no loading animation that breaks the flow

**The Results:**
- Appear below the input (no page scroll, results stay visible with input)
- Grouped by word length (3-letter, 4-letter, etc.)
- Alphabetically sorted within each group
- Scannable in under 1 second

**No Words Found:**
- Display: "No words match those letters. Try different letters."
- Supportive tone, not an error
- Results area clears; user immediately understands and can try again

### Critical Success Moments

**Moment 1: The First Result**
User submits letters and instantly sees valid words. This is the moment they feel the tool *works*. The visual appearance of results must feel immediate—no spinner, no delay messaging. Results just appear.

**Moment 2: The "Aha" Word**
User scans results and finds a word they hadn't thought of. They immediately recognize it as valid and usable. This is where word-unscrambler earns its purpose.

**Moment 3: The Next Lookup**
User clicks the field, it auto-clears, and they're ready to try different letters. This moment defines whether the tool feels repeatable and frictionless. No need to manually clear, no residual UI from the previous search.

### Experience Principles

1. **Instant Gratification:** Every interaction resolves within 1 second of user action (submit, result appearance, field clear). Delays compound frustration for an already-stuck user.

2. **One Thing, Done Well:** No options, no refinement, no "advanced search." Just enter letters, see words. Simplicity is the differentiator.

3. **Reusable Without Thinking:** Each lookup should feel like a fresh start. Auto-clear, no residual state, no "clear previous results" step. Users flow from lookup to lookup seamlessly.

4. **Supportive, Not Judgmental:** When no words match, the message frames it as a letter problem ("try different letters"), not a tool failure. Tone matters when users are already frustrated.

## Desired Emotional Response

### Primary Emotional Goals

Users should feel **empowered and accomplished** when using word-unscrambler. The core emotional win is the moment they see a word they hadn't considered—and realize they're smart enough to have found it (with the tool's help). The experience reframes being "stuck" as temporary, not inadequate.

Secondary emotional goals:
- **Capable:** "I can solve this. The tool makes me effective."
- **In Control:** "I choose what to do next. No surprises."
- **Supported, Not Judged:** "When nothing works, the tool helps me try again—it doesn't make me feel dumb."

### Emotional Journey Mapping

**Stage 1: Arrival (Frustration)**
User arrives stuck, possibly annoyed. They need to feel the tool is ready for them—auto-focused, waiting, no barriers. Immediate clarity: "I can type here. The rules are simple."

**Stage 2: The Lookup (Anticipation)**
User enters letters and submits. The moment before results feel slightly tense—"Will this work?" The emotional transition from action to waiting is brief.

**Stage 3: Results Appear (Relief + Accomplishment)**
Results appear and user scans them. The emotional peak: finding a word they hadn't considered. They feel smart. The tool amplifies their capability, not replaced it.

**Stage 4: Next Lookup (Familiar Rhythm)**
User clicks the field, it auto-clears, they're ready to try again. This moment should feel *familiar*—not like starting over, but like a natural next step in a rhythm they're learning. Comfortable, predictable, not surprising.

**Stage 5: Exit (Confidence)**
User leaves with their word (or words) and returns to their game. They should feel capable and ready, not confused about what just happened.

### Micro-Emotions

**Confidence vs. Confusion:**
- ✅ DO: Every interaction should build confidence—clear labels, obvious buttons, instant feedback
- ❌ DON'T: Ambiguity about what happened ("Did my search work?"), unclear next steps

**Accomplishment vs. Frustration:**
- ✅ DO: Results should highlight the user's discovery ("Look what you found!"), not the tool's cleverness
- ❌ DON'T: Generic results that feel like a lookup engine, not personal discovery

**Supported vs. Judged:**
- ✅ DO: Error message says "Try different letters"—frames it as a letter problem, not user failure
- ❌ DON'T: "Invalid input" or "Error"—makes user feel wrong

**Control vs. Helplessness:**
- ✅ DO: User controls the pace. They submit when ready. Results appear, they take time to read.
- ❌ DON'T: Auto-submit, auto-load, auto-advance. User should feel in command.

### Design Implications

**For Clean & Calm Aesthetic:**
- Generous whitespace (breathing room, not cramped)
- Simple typography (one or two font sizes max)
- Neutral color palette (avoid bright, energetic colors)
- No animations that startle or distract (a word list appearing is enough)
- Clear visual hierarchy (input first, results below, nothing competes)

**For Empowerment:**
- Results grouped by word length and sorted alphabetically (easy to scan, user feels organized)
- No hidden options or advanced settings (what you see is what you get—clarity builds confidence)
- Simple language throughout ("3-7 letters accepted," not "Input specification")

**For Support Without Coddling:**
- Error message is helpful, not apologetic: "No words match those letters. Try different letters."
- Validation hint below input: "3-7 letters accepted" (guidance, not scolding)
- Auto-clear on next lookup (removes friction, user appreciated, not infantilizing)

**For Familiar Rhythm:**
- Every lookup cycle follows the same pattern (consistency = comfort)
- Same input location, same results location, same submission method
- No surprises between lookups—predictability feels like mastery

### Emotional Design Principles

1. **Clarity Builds Confidence:** Users should never wonder "Did that work?" or "What do I do next?" Visual clarity, consistent patterns, and instant feedback remove doubt.

2. **Repetition Creates Comfort:** Each lookup feels the same (input → submit → results → next). This familiarity lets users flow without thinking, and repeated success builds accomplishment.

3. **Support Without Condescension:** When words don't match, the language acknowledges the situation ("Try different letters") without making the user feel wrong. Supportive tone is calm, not cheerful.

4. **Visual Calm Enables Focus:** A clean, minimal interface reduces cognitive load. Users can focus on the task (finding words), not navigating UI. Whitespace, simple typography, and neutral colors create an environment of calm focus.

5. **Results Amplify User Agency:** Present words in a way that highlights the user's discovery ("These are the words you can make"), not the tool's intelligence. Users should feel capable, not dependent.

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

**wordunscrambler.me**
A working tool for the same problem domain. Strengths: results grouped by word length with alphabetical sorting within groups; simple input form; graceful "No word found" message. The core interaction (enter letters → see words) is uncluttered and functional. Lesson: this layout works. Users understand it instantly.

**Google Search**
The gold standard for instant lookup UX. Strengths: single input field dominating the page; search executes on submit; results appear below input in a predictable location; error handling is graceful—network failures simply don't return results rather than displaying error messages. The experience feels inevitable: you type, you search, you see results. Lesson: simplicity at scale. Google never apologizes for errors; results just appear or don't.

### Transferable UX Patterns

**Pattern 1: Grouped & Sorted Results**
From wordunscrambler.me: Group results by word length, sort alphabetically within each group. This organization makes results *scannable* in under 1 second—users glance at 3-letter words, then 4-letter, then 5-letter. No sorting needed by users. Adopt as-is.

**Pattern 2: Single Input, Single Action**
From Google: One input field, one way to submit (Enter or button), one result area. Everything else disappears. This creates the sense of an app built for one purpose. Adopt: center the input, make the button obvious, let results appear below without competing.

**Pattern 3: Minimal Error Messaging**
From both products: "No word found" (wordunscrambler.me) is better than verbose error reporting. Google's approach: errors are silent or minimal—don't apologize, just indicate the situation. Adopt: "No words match those letters. Try different letters." Supportive, not apologetic.

**Pattern 4: Graceful Degradation**
From Google: Network errors don't trigger a red error box. Results just don't appear. Users understand. For word-unscrambler: if the API times out or fails, a simple message ("Something went wrong. Please try again.") is enough. Don't expose technical details.

### Anti-Patterns to Avoid

**Anti-Pattern 1: Extra UI Elements Beyond Core**
wordunscrambler.me has an "Options" button and associated blog. These add complexity and distraction. Word-unscrambler should eliminate them: no settings, no links, no secondary navigation. Just the tool.

**Anti-Pattern 2: Feature Creep in Results**
Avoid adding sorting options, filtering, or "show more." Resist the urge to let users refine. You've committed to one interaction: enter letters, see all words. Stick to it.

**Anti-Pattern 3: Verbose or Apologetic Error Messages**
Avoid: "I'm sorry, we couldn't find any words matching those letters. Please verify your input and try again."
Preferred: "No words match those letters. Try different letters."

**Anti-Pattern 4: Loading States That Feel Slow**
Avoid spinners, progress bars, "searching..." messages. If the response is fast (< 1 second typical), let it feel instant. Show nothing until results appear. If you must acknowledge the action, a subtle visual change (button state, slight dimming) is enough.

### Design Inspiration Strategy

**What to Adopt:**

- **Grouped-by-length, alphabetically-sorted results** — wordunscrambler.me got this right. Don't reinvent.
- **Single input, single action, predictable flow** — Google's principle. One field, one submit, results below.
- **Simple, supportive error messaging** — "No words match those letters. Try different letters."
- **No secondary UI** — No options, settings, links, or navigation. Just the tool.

**What to Adapt:**

- **Visual design** — Make it prettier than wordunscrambler.me. Apply your "clean and calm" emotional goals: generous whitespace, simple typography, neutral colors.
- **Validation hint** — Adopt "3-7 letters accepted" under the input (better than wordunscrambler.me's approach).
- **Interaction refinement** — Auto-focus on load, auto-clear on next lookup (not present in wordunscrambler.me).

**What to Avoid:**

- **Options or settings buttons** — Adds cognitive load.
- **Blog links or secondary content** — Distraction from core purpose.
- **Complex error handling** — Keep it simple: "No words match those letters. Try different letters." or "Something went wrong. Please try again."
- **Visual complexity** — No animations, no gradients, no decorative elements. Clean and calm.

**Uniqueness Strategy:**
You're not copying wordunscrambler.me—you're honoring its layout (which works) while improving aesthetics and interaction design. Your "clean and calm" emotional design, auto-focus, and auto-clear behaviors make this unique while staying true to proven patterns.

## Design System Foundation

### Design System Choice

**Tailwind CSS + shadcn/ui**

This combination provides:
- **Lightweight foundation:** Tailwind adds ~15KB gzipped; shadcn/ui components are copied into your project (no extra dependencies)
- **Pre-built, accessible components:** Buttons, inputs, and form elements are ready to use, styled with Tailwind
- **Full customization:** Every component is editable in your project; you're not locked into a design system's aesthetic
- **Clean & calm by default:** shadcn/ui's default styling aligns with minimal, professional design
- **Learning friendly:** You'll learn Tailwind by seeing how components are styled

### Rationale for Selection

1. **Timeline Compliance:** Pre-built components accelerate development for MVP in 3 days
2. **Bundle Constraint:** Tailwind + shadcn/ui keeps you well under 100KB (estimated 25-30KB combined with tree-shaking)
3. **Clean Aesthetic:** shadcn/ui's component defaults match "clean and calm" emotional goals without extra configuration
4. **Customization:** Every component lives in your project, so you can tweak colors, spacing, and behavior without fighting a design system
5. **Learning:** Tailwind is industry-standard; learning it on this project has long-term value

### Implementation Approach

**Setup Phase:**
1. Install Tailwind CSS in the Vite project
2. Initialize shadcn/ui and select a base color palette (recommend neutral grays for "calm")
3. Copy initial components: Button, Input, Card (if needed for grouping results)

**Component Strategy:**
- Use shadcn/ui for: Button (submit), Input (letter entry)
- Custom styling with Tailwind for: Results container, word groupings, spacing

**Responsive Strategy:**
- Tailwind's mobile-first breakpoints handle responsive design (works on phone, tablet, desktop automatically)
- Single breakpoint needed: ensure input and results stack correctly on small screens

**Color Palette:**
- Primary: Neutral gray (aligns with "clean and calm")
- Accent: Subtle color for button hover states and active states
- Text: Dark gray on white (high contrast for readability)
- Background: Pure white or off-white for breathing room

### Customization Strategy

**Components to Style with Tailwind:**
- Input field: Large, centered, visible focus state
- Button: Clear, obvious, hover states that feel responsive
- Results container: Generous spacing, grouped by word length, scannable typography
- Error state: Simple text, supportive tone, same layout as results

**Design Tokens (Tailwind Configuration):**
- Spacing: Generous (16px/24px increments for breathing room)
- Typography: Single font family, 2-3 sizes (headings, body, small labels)
- Shadows: Minimal or none (aligns with "clean and calm")
- Animations: None. No transitions on button hover. Results appear instantly without animation.
- Radius: Subtle rounded corners on input/button (8px) if desired, or square (0px) for minimal aesthetic

**Customization Freedom:**
All components are editable in your codebase. If you want to adjust colors, spacing, or component behavior, you edit them directly—no design system fighting back.

## Core User Experience

### Defining Experience

**"Enter scrambled letters and instantly see all valid words you can make, grouped by length and sorted alphabetically."**

This is word-unscrambler's singular, repeatable loop. Users will perform this lookup multiple times per session, trying different letter combinations. The defining experience is that each lookup feels equally fast, equally clear, and equally empowering.

The emotional arc of each lookup:
1. User clicks the input field → field is ready (auto-focused on first visit)
2. User types letters → characters appear instantly (responsive typing)
3. User presses Enter or clicks button → action is clear
4. Results appear → user scans and finds a word they hadn't considered
5. User feels accomplished → ready for the next lookup

### User Mental Model

Users bring a **search mentality** to word-unscrambler. They expect:
- One input field for their query (letters)
- One way to submit (Enter or button)
- Instant results below the input
- Clear indication of what happened (results or "no match" message)

**Input Handling:** Users can type letters freely—uppercase, lowercase, or mixed. The tool normalizes everything to lowercase for processing. Users don't think about this; they just type. This is a supportive detail: the tool adapts to how users naturally type, not the reverse.

This is familiar territory. Users don't need to learn anything new. They type, they submit, they see results. It works like Google Search, Calculator, or weather lookup—established patterns users understand without thinking.

Users do NOT expect:
- Settings or options to configure
- Multiple steps or wizards
- Explanations or onboarding
- Features beyond the core lookup

### Success Criteria for Core Experience

**A successful lookup loop achieves:**

1. **Speed:** Results appear within 10 seconds (typically < 1 second), creating the feeling of instant gratification
2. **Clarity:** User immediately understands what happened (results displayed or "no words match" message)
3. **Empowerment:** User finds a word they hadn't considered and feels smart for discovering it
4. **Readiness:** After seeing results, user feels ready to try again without friction
5. **Confidence:** User never wonders "did that work?" or "what do I do next?"

### Established UX Patterns

This interaction uses **purely established patterns**—no novel design needed. We're borrowing from:

- **Search UI pattern:** Single input, one submit action, results below
- **Instant feedback pattern:** Users see confirmation of their action immediately
- **Graceful error handling:** "No words match" feels supportive, not like failure
- **Familiar mental models:** Users don't need to learn; they know how search works

**Innovation Within Familiar Patterns:**
- Grouping by word length makes scanning 10x faster than alphabetical-only lists
- Auto-focus on load removes one unnecessary click
- Auto-clear on next lookup removes manual "clear" step
- Input stays focused after "no words found" shows users they can immediately retry

These micro-innovations make familiar patterns feel frictionless, not revolutionary.

### Experience Mechanics

**1. Initiation (Page Load)**

- Input field is auto-focused
- User sees placeholder text: "Enter 3-7 letters"
- Hint below input: "3-7 letters accepted"
- Button is visible and obvious (below or beside input)
- User understands: "I can type here"

**2. Interaction (User Typing)**

- Characters appear instantly as user types (no lag)
- No keystroke validation or error messages while typing
- User can type a-z, A-Z, and `?` freely; all letters normalize to lowercase
- User can press Enter OR click button to submit
- Both submit methods feel equally responsive

**3. Feedback (Submission)**

- Button might show subtle state change on hover (color shift, slightly darker)
- Input field shows visible focus outline (ring around border)
- On submit, results begin to load (no spinner needed if response is < 1 second)
- User knows: "I submitted my search"

**4. Results Display (Success Case)**

- Results appear below input in same location
- Results are grouped by word length (3-letter words, 4-letter words, etc.)
- Each group is labeled: "3-letter words" (optional label for clarity)
- Words within each group sorted alphabetically
- Each word appears as plain text, scannable in < 1 second
- No interactive elements in results (no buttons, no links, just text)
- User scans, finds a word, remembers it, leaves

**5. No Words Found (Error Case)**

- Input field remains focused (ready for retry)
- Results area is cleared
- Simple, supportive message appears: "No words match those letters. Try different letters."
- User immediately understands: "My letters made no words, but I can try again"
- User clicks/taps field (already focused) or just starts typing
- Field auto-clears (if user starts typing immediately)
- Workflow continues seamlessly

**6. Next Lookup (Repeat)**

- User clicks input field → field auto-clears if it still has text
- OR user just starts typing (field auto-clears when focus returns)
- User sees fresh, ready-to-go form
- No residual UI from previous search
- User flows directly into typing next letters
- Cycle repeats without friction

**Timing & Performance:**

- Page load to interactive: < 1 second
- Typing response: Instant (no validation delay)
- API response: < 10 seconds (typically < 1 second)
- Result rendering: Instant
- Field auto-clear on focus: Instant
- Overall loop time: User can do 5-10 lookups per minute if desired

**Accessibility & Keyboard Navigation:**

- Enter key submits (standard search behavior)
- Tab navigates between input and button
- Focus states are visible (outline on input, color on button)
- No visual tricks that confuse screen readers
- Clear, simple labels ("3-7 letters accepted")

## Visual Design Foundation

### Color System

**Dark Theme with Soft Neutral Base**

Primary Colors (Neutrals):
- Background: Very dark gray (#1a1a1a or #0f0f0f) - dark hero section and page background
- Surface: Charcoal gray (#2d2d2d) - input field, button backgrounds
- Text: Off-white (#f5f5f5 or #e8e8e8) - primary text, labels
- Text Secondary: Light gray (#a0a0a0) - hints, secondary text

Accent Colors (Primary & Secondary):
- Accent 1: Soft blue (#4a9eff or #6bb6ff) - subtitle text, button hover state
- Accent 2: Soft teal (#20b2aa or #48d1cc) - focus ring on input field, alternative accent

Semantic Colors:
- Success (results appear): Uses Accent 1 color implicitly (results have visual weight via grouping)
- Error: Soft coral or warm accent (#e07856 or #d4775f) - "No words match" message
- Hover states: Accent 1 with subtle brightness increase (button hover)
- Focus state: Accent 2 ring around input field (2-3px, subtle glow effect optional)

Contrast & Accessibility:
- Text on dark background: 7:1+ contrast ratio (WCAG AAA for accessibility)
- Button text on Accent 1: Ensure sufficient contrast (likely need light text)
- All interactive elements: 4.5:1+ contrast for normal text

### Typography System

**Professional, Minimal Hierarchy**

Font Family:
- Primary: System font stack (-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)
- Rationale: Professional, clean, loads instantly, no web font overhead

Type Scale (based on 16px base):
- **Hero Title ("Word Unscrambler")**: 56px, font-weight 700, line-height 1.2
- **Subtitle ("Simple, fast, and easy")**: 18px, font-weight 400, color: Accent 1, line-height 1.4
- **Input field text**: 16px, font-weight 400, line-height 1.5
- **Hint text ("3-7 letters accepted")**: 12px, font-weight 400, color: Text Secondary, line-height 1.4
- **Button text ("Unscramble!")**: 16px, font-weight 600, all caps optional (or sentence case)
- **Section headers ("3-Letter Words")**: 14px, font-weight 600, color: Text Secondary, margin-top 24px
- **Result words**: 16px, font-weight 400, line-height 1.6

Visual Hierarchy:
- Title dominates (56px) - immediate visual weight
- Subtitle clarifies intent (18px, colored accent)
- Input field is obvious and clickable (standard size, good padding)
- Hints are subtle but readable (12px, secondary color)
- Results are scannable (standard size, grouped by section)

### Spacing & Layout Foundation

**Single Column, Centered or Left-Aligned**

Container:
- Hero section: Full viewport width, dark background (possibly with subtle gradient or image)
- Content width: 60-70% of viewport (max ~600px recommended) for centered layout, or left-aligned with 40-60px margin on desktop

Spacing Scale (8px base unit):
- Extra large (32px): Between hero section and results section
- Large (24px): Between title and subtitle, between subtitle and input
- Medium (16px): Between input and button, between button and results
- Small (12px): Between input and hint text, between button text and border
- Extra small (8px): Internal padding within components

Layout Structure:
```
┌─────────────────────────────────────────────────┐
│                  (HERO SECTION)                 │
│                                                 │
│         Word Unscrambler (56px title)           │
│                                                 │
│    Simple, fast, and easy (18px, Accent 1)     │
│                                                 │
│              [Input Field (16px)]               │
│              3-7 letters accepted (12px hint)   │
│                                                 │
│              [Unscramble! Button (16px)]        │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│              RESULTS SECTION                    │
│            (60-70% width, left-aligned)         │
│                                                 │
│  3-Letter Words (14px header)                   │
│  abc  bac  cab  (16px words, space-separated)   │
│                                                 │
│  4-Letter Words (14px header)                   │
│  [words listed alphabetically]                  │
│                                                 │
│  5-Letter Words                                 │
│  [words listed alphabetically]                  │
│                                                 │
│  [Additional sections as needed]                │
│                                                 │
│  [If no words: "No words match..." message]     │
│                                                 │
└─────────────────────────────────────────────────┘
```

Result Section Strategy:
- Each word length gets its own section (e.g., "3-Letter Words", "4-Letter Words")
- Sections with no words are omitted entirely
- Words are displayed as a flowing list, space-separated, wrapping naturally
- OR displayed as a simple comma-separated list (choose based on preference)
- Sections are clearly separated (24px margin-top between sections)
- Words within sections are sorted alphabetically

### Accessibility Considerations

**Color & Contrast:**
- Dark theme accessible for low-light use, reduces eye strain
- All text meets WCAG AAA contrast (7:1+)
- Accent colors chosen for sufficient contrast against dark background
- Focus states are clearly visible (Accent 2 ring, 2-3px width)
- No information conveyed by color alone (always pair with text or iconography)

**Typography:**
- Minimum font size is 12px (hint text); acceptable due to secondary importance
- Line heights 1.4-1.6 ensure readability
- No text smaller than 12px for important information
- Sufficient whitespace between lines and sections aids readability

**Interactive Elements:**
- Input field: Clear focus state (visible 2-3px outline or ring)
- Button: Clear hover state (color shift, slight scale or brightness change)
- All interactive elements are keyboard accessible (Tab through input → button)
- Focus order is logical and visible

**Motion & Animation:**
- No automatic animations (results appear instantly)
- Transitions optional (button hover color change, max 200ms)
- No flashing or rapid animations (accessible to users with motion sensitivity)

**Responsive Adjustments:**
- Mobile (< 600px): Full width, slight margin adjustments
- Title size may reduce slightly on small screens (48px instead of 56px)
- Button and input remain standard size for touch targets (min 44px height)
- Results section adjusts to mobile width (100% width on small screens)

## Design Direction Decision

### Design Directions Explored

8 design direction variations were explored, ranging from classic centered layouts to compact efficient designs, card-based results, and gradient hero backgrounds. Each direction tested different approaches to layout, visual weight, button prominence, and results presentation.

### Chosen Direction

**Direction 7: Card Results + Gradient Hero Background**

A hybrid approach combining two design directions:
- **Base Layout:** Direction 7 (Card Results) - Results displayed in cards with background fill and left-border accent
- **Hero Background:** Direction 8 (Gradient Hero) - Subtle multi-color gradient background in hero section

This combination provides:
- **Structured clarity:** Card-based result sections create visual distinction and scannable groupings
- **Visual sophistication:** Gradient hero adds subtle visual interest without overwhelming minimalism
- **Professional feel:** Cards convey organization; gradient conveys thoughtfulness
- **Clean & calm:** Maintains dark theme, soft neutrals, and spacious layout while adding visual depth

### Design Rationale

**Why Card Results:**
- Each word-length group appears distinct and organized
- Left-border accent (Accent 1 color) provides visual hierarchy
- Background fill (#2d2d2d) creates visual separation
- Scannable layout: users quickly identify word groupings
- Aligns with "clean and calm" without feeling sparse

**Why Gradient Hero:**
- Subtle gradient (charcoal → cool blue → warm charcoal) adds sophistication
- Complements dark theme without introducing new colors
- Creates visual depth and prevents flat appearance
- Supports emotional goal of "professional and minimal"
- Gradient is subtle enough to not distract from content

**Combined Impact:**
The gradient hero draws attention and creates visual entry point. Card-based results then organize information clearly below. Together, they balance visual interest with clarity.

### Implementation Approach

**Hero Section:**
- Full-viewport-width hero with subtle multi-color gradient background
- Gradient: `linear-gradient(135deg, #1a1a1a 0%, #0f2c4a 50%, #2d1a1a 100%)`
- Title, subtitle, input, and button centered in hero
- Clear separation between hero and results section (32px margin)

**Results Section:**
- Results displayed below hero in a full-width container
- Each word-length group rendered as a card:
  - Background: #2d2d2d
  - Padding: 20px
  - Border-radius: 4px
  - Left border: 3px solid #4a9eff (Accent 1)
  - Margin-bottom: 16px
- Card title: "3-Letter Words" (14px, font-weight 600, color #a0a0a0)
- Words inside card: 16px, flowing list, space-separated, wrapping naturally

**Responsive Adjustments:**
- Hero section remains full-width on mobile
- Title size reduced on small screens (48px instead of 56px)
- Results cards expand to full width on mobile
- Cards maintain 20px padding for touch targets

**Accessibility:**
- Gradient is purely decorative; content is accessible regardless
- Cards use semantic background color (#2d2d2d) for contrast; text remains 7:1+ contrast
- Left border accent is secondary; cards are identified by position and title
- All interactive elements (input, button) maintain focus states with Accent 2 ring

## User Journey Flows

### Journey 1: Successful Word Lookup (Happy Path)

**User Goal:** Find valid words from scrambled letters and return to their game with confidence.

**Trigger:** User is stuck on a word game, visits word-unscrambler.

**Flow:**
```
PAGE LOAD
   ↓
[Input field auto-focuses]
   ↓
USER TYPES LETTERS (a-z, A-Z, ?)
   ↓
[Characters appear instantly]
   ↓
USER PRESSES ENTER or CLICKS BUTTON
   ↓
[Button shows subtle state change (color/hover)]
   ↓
API REQUEST SENT
   ↓
[Waiting... results loading]
   ↓
RESULTS RECEIVED (< 1 second typically)
   ↓
RESULTS DISPLAY (one card for each word length with results)
   - 3-Letter Words card (if any 3-letter words exist)
   - 4-Letter Words card (if any 4-letter words exist)
   - 5-Letter Words card (if any 5-letter words exist)
   - 6-Letter Words card (if any 6-letter words exist)
   - 7-Letter Words card (if any 7-letter words exist)
   [Cards with 0 results are omitted entirely]
   ↓
USER SCANS RESULTS
   ↓
USER FINDS WORD THEY HADN'T CONSIDERED
   ↓
[User feels accomplished and smart]
   ↓
USER REMEMBERS WORD
   ↓
USER LEAVES TOOL
   ↓
USER RETURNS TO GAME WITH CONFIDENCE
```

**Key Moments:**
1. **Entry Moment:** Auto-focused input signals readiness
2. **Submission Moment:** Button provides clear feedback
3. **Results Moment:** Cards organize results for instant scanning
4. **Success Moment:** User finds word and feels capable
5. **Exit Moment:** User leaves with confidence

**Emotional Arc:** "This is ready for me" → "I'm in control" → "Wow, I found words I didn't think of" → "I'm back to playing"

---

### Journey 2: No Words Match (Error Path)

**User Goal:** Understand why their letters made no words and retry with confidence.

**Trigger:** User enters letters that don't form valid words (e.g., "xyz").

**Flow:**
```
USER ENTERS LETTERS
   ↓
USER PRESSES ENTER or CLICKS BUTTON
   ↓
API REQUEST SENT
   ↓
NO VALID WORDS FOUND
   ↓
MESSAGE DISPLAYED
[Appears in results area]
"No words match those letters. Try different letters."
   ↓
INPUT FIELD REMAINS FOCUSED
   ↓
[User is ready to immediately retry]
   ↓
USER SEES SUPPORTING MESSAGE
   ↓
[User understands: "It's the letters, not me"]
   ↓
USER DECIDES: RETRY or LEAVE
   ↓
IF RETRY:
   User clicks/taps input field
   OR just starts typing
      ↓
   [Field auto-clears]
      ↓
   [Back to Journey 1: try new letters]
   ↓
IF LEAVE:
   User exits tool
```

**Key Moments:**
1. **Understanding Moment:** Clear message explains the situation
2. **Support Moment:** Tone is helpful, not judgmental
3. **Readiness Moment:** Input field stays focused, user can immediately retry
4. **Auto-Clear Moment:** Field clears as user starts typing (zero friction)

**Emotional Arc:** "Hmm, nothing worked" → "Oh, I just need to try different letters" → "Let me try again" → [Back to Journey 1]

**What NOT to Do:**
- ❌ Display: "Error" or "Invalid input" (feels like user failed)
- ❌ Require manual "clear" button click
- ❌ Display technical error details

---

### Journey 3: Multiple Lookups (Rapid Retry Loop)

**User Goal:** Quickly try several letter combinations to find the best words.

**Trigger:** User finishes one lookup and immediately wants to try new letters.

**Flow:**
```
[End of Journey 1 or 2]
   ↓
USER CLICKS INPUT FIELD
   OR JUST STARTS TYPING
   ↓
[Field auto-clears any previous text]
   ↓
INPUT IS EMPTY AND FOCUSED
   ↓
USER TYPES NEW LETTERS
   ↓
[See Journey 1: Submit → Results or Journey 2: No Words]
   ↓
REPEAT AS DESIRED
   ↓
[User can do 5-10 lookups per minute without friction]
```

**Key Moments:**
1. **Fresh Start Moment:** Field clears automatically (no manual action)
2. **Momentum Moment:** User can immediately type new letters
3. **Rhythm Moment:** Each lookup feels the same (predictable)
4. **Flow Moment:** No residual UI from previous search

**Emotional Arc:** "Let me try again" → [Immediate field ready] → "Let me try one more" → [Repeat]

**Critical UX Detail:** The auto-clear-on-focus is what makes multiple lookups feel frictionless. Without it, users would need to manually select/delete previous text.

---

### Journey Patterns

**Pattern 1: Instant Feedback**
Every user action receives immediate feedback:
- Typing → characters appear instantly
- Submit button → subtle visual state change
- Results → appear below input without page scroll
- Error message → appears in same location as results

**Pattern 2: Input Field Persistence**
Input field is always ready:
- Auto-focuses on page load
- Remains focused after results display
- Auto-clears when user starts typing for next lookup
- Never requires manual "clear" action

**Pattern 3: Single Action Loop**
Each lookup follows the same pattern:
- Type letters → Submit → See results → Ready for next

**Pattern 4: Supportive Error Handling**
When things go wrong, the tone supports the user:
- "No words match those letters" (not "Error")
- "Try different letters" (not "Invalid input")
- Input stays focused (user can immediately retry)
- No technical details exposed

**Pattern 5: Visual Organization**
Results are presented for easy scanning:
- Grouped by word length (3-letter, 4-letter, etc.)
- Sorted alphabetically within groups
- Card-based layout separates each section
- User can glance and find words in < 1 second

---

### Flow Optimization Principles

**Principle 1: Minimize Steps to Value**
- No login, no setup, no onboarding
- User types letters immediately (input auto-focused)
- Results appear in < 1 second
- User accomplishes their goal in 2-3 actions

**Principle 2: Reduce Cognitive Load**
- One input field (no options, filters, or settings)
- One button (submit)
- Clear results grouping (no sorting required)
- Supportive error messages (no confusion)

**Principle 3: Create Flow Without Friction**
- Auto-focus removes click to start typing
- Auto-clear removes manual cleanup
- Enter key or button both work (user choice)
- Results appear in expected location (no surprise scrolling)

**Principle 4: Support Immediate Retry**
- Input field stays focused after results
- No confirmation dialogs or extra steps
- Field clears automatically when user starts typing new letters
- Error state doesn't block retry

**Principle 5: Build Confidence**
- Instant response to user action (submit → results)
- Results are visually organized (user feels in control)
- Supportive language (user doesn't feel blamed)
- Repeatable pattern (user learns the rhythm quickly)

## Component Strategy

### Design System Components (shadcn/ui)

**Available Components:**

- **Button** - Used for "Unscramble!" button with Tailwind hover states
  - Filled button with Accent 1 background (#4a9eff)
  - Hover: brightness increase
  - Focus: Accent 2 ring (focus-ring-2)

- **Input** - Used for letter entry field
  - Dark background (#1a1a1a), light text (#e8e8e8)
  - Placeholder text in secondary color
  - Focus state: Accent 2 ring around border
  - Standard 16px padding

- **Card** - Used as wrapper for result groups
  - Default Card with custom Tailwind styling
  - Background #2d2d2d, 3px left border in Accent 1

### Custom Components

#### 1. SearchForm Component

**Purpose:** Encapsulate the search input, hint text, and submit button as a cohesive unit.

**Anatomy:**
```
[Title: "Word Unscrambler"]
[Subtitle: "Simple, fast, and easy"]
[
  Input field (placeholder: "Enter 3-7 letters")
  Hint text: "3-7 letters accepted"
]
[Button: "Unscramble!"]
```

**States:**
- Default: Input focused, ready for typing
- Typing: Characters appear in real-time
- Submitting: Button shows visual state change (optional color shift)
- Error: If API fails, show generic error message below input

**Behavior:**
- Input auto-focuses on page load
- Accepts a-z, A-Z, ? characters
- Normalizes uppercase to lowercase internally (transparent to user)
- Enter key submits (same as button click)
- Button click submits form
- Input remains focused after submission

**Accessibility:**
- label associated with input (implicit or via htmlFor)
- Button accessible via keyboard (Tab navigation)
- Focus states clearly visible (Accent 2 ring)
- Hint text is descriptive, not redundant

#### 2. ResultsDisplay Component

**Purpose:** Container that manages which result cards to display and their layout.

**Anatomy:**
```
Results Section
├─ ResultCard (3-Letter Words)
├─ ResultCard (4-Letter Words)
├─ ResultCard (5-Letter Words)
├─ ResultCard (6-Letter Words)
└─ ResultCard (7-Letter Words)
[Only cards with results are rendered; empty-result cards are omitted]
```

**Logic:**
- Receives array of results grouped by word length
- Renders ResultCard for each length that has words
- If no words at all, displays: "No words match those letters. Try different letters."
- Results appear below SearchForm in 60-70% width container

**Behavior:**
- Results appear instantly after API response (no animation)
- Results replace previous results (no accumulation)
- Clearing: When user types new letters, results area remains (shows previous results) until new results arrive

**Accessibility:**
- Results are plain text, fully accessible (no custom ARIA needed)
- Each card is semantically a section with a heading

#### 3. ResultCard Component

**Purpose:** Display all words of a given length in a visually distinct card.

**Anatomy:**
```
┌─ ResultCard ─────────────────────────┐
│                                      │
│ 3-Letter Words (card title)          │
│                                      │
│ abc  bac  cab  (words, space-sep)    │
│                                      │
└──────────────────────────────────────┘
```

**Props:**
- `length: number` — Word length (3, 4, 5, etc.)
- `words: string[]` — Array of words to display

**Styling:**
- Background: #2d2d2d
- Left border: 3px solid #4a9eff (Accent 1)
- Padding: 20px
- Border-radius: 4px
- Margin-bottom: 16px

**Title:**
- Font-size: 14px
- Font-weight: 600
- Color: #a0a0a0 (Text Secondary)
- Text: "3-Letter Words", "4-Letter Words", etc.
- Margin-bottom: 12px

**Words:**
- Font-size: 16px
- Color: #e8e8e8 (Text primary)
- Line-height: 1.8
- Display: inline, space-separated
- Wrapping: natural (words break to next line as needed)

**Behavior:**
- Words are plain text (no links, no interactivity)
- User can select/copy words if desired
- Words flow naturally and wrap at container edge

**Accessibility:**
- Card is a `<section>` with heading
- Words are plain text, fully selectable
- No custom styling interferes with readability

### Component Implementation Strategy

**Development Order (Priority):**

1. **Phase 1 - Core (Required for MVP):**
   - SearchForm (input + button + hint)
   - ResultsDisplay (container logic)
   - ResultCard (display words)

2. **Phase 2 - Polish (Nice-to-have, post-MVP):**
   - Optional: Error boundary wrapper
   - Optional: Loading state indicator (if API response > 1 sec)

3. **Phase 3 - Enhancement (Future):**
   - Optional: Copy-to-clipboard button on results
   - Optional: Word frequency indicators
   - Optional: Definition tooltips

**Implementation Notes:**
- All components are simple, no complex state management
- Components use Tailwind for styling (no CSS-in-JS needed)
- Components accept standard React props
- Avoid unnecessary wrapper divs (minimize nesting)
- Use semantic HTML (`<section>`, `<button>`, `<input>`)

### Implementation Roadmap

**Week 1 - MVP Foundation:**
- Set up React + Tailwind + shadcn/ui
- Build SearchForm (input, hint, button)
- Build ResultCard (static styling)
- Build ResultsDisplay (render logic)
- Connect to API
- Test happy path and no-results path

**Week 2 - Polish & Deploy:**
- Refine responsive layout (mobile testing)
- Add keyboard support (Enter key submit)
- Accessibility audit (color contrast, focus states)
- Error handling (API failures, network timeouts)
- Deploy to production

**Future - Enhancements:**
- Performance optimizations if needed
- Advanced features (if demand exists)

## UX Consistency Patterns

### Button Hierarchy

**Primary Action Button: "Unscramble!"**

**When to Use:** Only one primary action button on the page—the submit button for searching.

**Visual Design:**
- Background: Accent 1 (#4a9eff)
- Text: White/light text (high contrast)
- Size: 16px font, 12px padding (vertical) × 32px padding (horizontal)
- Focus state: Accent 2 ring around button (2-3px)
- Hover state: Slightly brighter color (#6bb6ff)

**Behavior:**
- Click to submit letters for search
- Enter key also submits (keyboard support)
- Button shows subtle visual feedback on hover (color shift)
- Remains enabled even after submission (user can submit again with new letters)
- No loading spinner; results appear instantly

**Accessibility:**
- Button has descriptive label ("Unscramble!")
- Accessible via Tab key navigation
- Focus state clearly visible (ring)
- No title attribute needed (label is clear)

**No Secondary Buttons:** This simple app has no other buttons.

---

### Feedback Patterns

**Success Feedback: Results Display**

**When to Use:** After user submits valid letters and API returns words.

**Visual Design:**
- Results appear below input in same location
- Card-based layout with left border accent
- Organized by word length
- Instant appearance (no animation, no delay messaging)

**Behavior:**
- Results replace any previous results
- No confirmation message (results *are* the confirmation)
- Results remain visible while user can immediately retry
- User can select/copy words from results

**Content:** Alphabetically sorted words grouped by length

---

**Error Feedback: "No Words Match" Message**

**When to Use:** After user submits letters that make no valid words.

**Visual Design:**
- Message appears in results area
- Text: "No words match those letters. Try different letters."
- Color: Soft coral/warm accent (#d4775f)
- Font-size: 16px, regular weight
- Styling: Plain text, no icon or special styling

**Behavior:**
- Input field remains focused (ready for retry)
- Field is not cleared (user can see what they entered)
- User can immediately type new letters or clear manually
- Message disappears when user starts typing new letters

**Tone:** Supportive, not judgmental. Frames it as "letters don't work" not "you failed"

---

**Error Feedback: Network/API Failure**

**When to Use:** If API times out or server error occurs.

**Visual Design:**
- Message in results area
- Text: "Something went wrong. Please try again."
- Color: Same soft coral (#d4775f)
- No technical details, no error codes

**Behavior:**
- Input field remains focused
- User can immediately retry with same letters
- If persistent, user can try different letters

---

### Form Patterns

**Input Field Pattern: Letter Entry**

**When to Use:** Single text input for users to enter scrambled letters.

**Visual Design:**
- Placeholder: "Enter 3-7 letters"
- Background: Dark (#1a1a1a)
- Border: 2px solid #3a3a3a (subtle, low contrast)
- Text color: Light (#e8e8e8)
- Font-size: 16px
- Padding: 16px
- Border-radius: 4px

**Focus State:**
- Border color: Change to Accent 2 (#20b2aa) or remove border
- Add 2-3px ring around field in Accent 2 color
- Ring glow optional (subtle, not harsh)

**Behavior:**
- Auto-focuses on page load (user doesn't need to click)
- Accepts a-z, A-Z, ? characters
- Rejects other characters silently (no error popup)
- Normalizes uppercase to lowercase internally
- Displays exactly what user types (including uppercase)
- Enter key submits form (if button is enabled)
- Tab key navigates to button
- **Button Disabled State:** "Unscramble!" button is disabled (grayed out, not clickable) unless input contains 3-7 letters. Button becomes enabled in real-time as user types. This provides immediate feedback without error messages.

**Hint Text:**
- Text: "3-7 letters accepted"
- Font-size: 12px
- Color: Text Secondary (#a0a0a0)
- Positioned below input field, margin-top: 8px
- Always visible (not hidden until focus)

**No Validation Messages:** Input accepts anything a-z/A-Z/?. Validation happens via button state.

---

### Empty State Pattern

**Empty Results State: "No Words Match" Message**

**When to Use:** User's letters make no valid words.

**Visual Design:**
- Message appears in results section
- Text: "No words match those letters. Try different letters."
- Font-size: 16px, regular weight
- Color: Soft coral (#d4775f)

**Placement:** Results area (same place where results cards would appear)

**Behavior:**
- Input field stays focused and ready
- User can immediately retry
- Message clears when user starts typing new letters

**Emotion:** Supportive, not frustrated. Tone: "Let's find different letters that work."

---

### Input Handling Pattern

**Character Input & Validation**

**Accepted Characters:**
- a-z (lowercase)
- A-Z (uppercase, normalized to lowercase)
- ? (wildcard, kept as-is)

**Rejected Characters:**
- Numbers (0-9)
- Special characters (!, @, #, etc.)
- Spaces

**Behavior:**
- Rejection is silent (no error message while typing)
- Characters simply don't appear if invalid
- Example: User types "abc123" → field shows "abc"

**Case Normalization:**
- User sees uppercase characters as they type
- Internally, all letters normalized to lowercase for API
- User doesn't need to think about this; tool handles it

**Length:**
- Accepts 1-10 characters (technically)
- Hint says "3-7 letters accepted"
- API rejects if < 3 or > 10
- Error message: "Letters must be 3-7 characters"

---

### Loading State Pattern

**Implicit Loading (No Spinner):**

**When to Use:** API request is in progress (typically < 1 second).

**Visual Design:**
- No spinner or progress bar
- No "Loading..." text
- Button may show subtle state change (optional: slight color shift or disabled appearance)
- Results area may dim slightly (optional)

**Behavior:**
- Results area remains ready but doesn't populate until response arrives
- If response takes > 2 seconds, consider adding a spinner (but aim for < 1 second)

**Rationale:** For typical fast responses, no loading indicator needed. Indicator slows perceived speed.

---

### Consistency Rules (Across All Patterns)

1. **Colors:** Always use design system colors (Accent 1, Accent 2, Text, Text Secondary, etc.)
2. **Spacing:** Use 8px base unit (8px, 16px, 24px, 32px)
3. **Typography:** System font stack, 3 sizes max (56px title, 16px body, 12px small)
4. **Focus States:** Always visible Accent 2 ring on interactive elements
5. **Error Tone:** Supportive, never blaming ("Try different letters" not "Invalid input")
6. **Feedback Speed:** Instant when possible (< 1 second); no delays
7. **Mobile:** All patterns work on touch (minimum 44px touch targets for buttons/inputs)

## Responsive Design & Accessibility

### Responsive Strategy

**Mobile-First Approach**

word-unscrambler uses a **mobile-first responsive strategy**, starting with mobile design and progressively enhancing for larger screens.

**Mobile (< 600px):**
- Single column layout
- Full-width hero section (with gradient background)
- Title reduced to 48px (from 56px) for smaller screens
- Input field full-width with comfortable padding (44px minimum height)
- Button full-width for easy touch targets
- Results cards full-width, stacked vertically
- Generous vertical spacing for touch navigation

**Tablet (600px - 1024px):**
- Hero section unchanged (still full-width)
- Title returns to 56px
- Input and button centered or left-aligned with max-width
- Results cards 60-70% width, centered
- Same card-based layout (no columns yet)

**Desktop (> 1024px):**
- Full viewport width with background gradient continuing
- Hero centered, content max-width ~600px
- Input/button centered
- Results cards 60-70% width, left or centered alignment
- Comfortable whitespace on left/right sides

**Key Principle:** Layout is fundamentally **single-column on all devices**. No major layout shifts; mostly spacing and sizing adjustments.

---

### Breakpoint Strategy

**Tailwind Breakpoints:**
- `sm: 640px` — Tablet breakpoint
- `md: 768px` — Optional secondary breakpoint
- `lg: 1024px` — Desktop breakpoint

**Responsive Considerations:**

1. **Touch Targets:** Minimum 44px × 44px on mobile
   - Button: 16px font × 12px padding (total ~48px height)
   - Input: 16px font × 16px padding (total ~52px height)
   - Both exceed 44px minimum ✓

2. **Text Sizing:**
   - Mobile: 48px title, 16px body, 12px small
   - Desktop: 56px title, 16px body, 12px small
   - No text shrinking; scaling focused on spacing

3. **Spacing:**
   - Mobile: 16px margins, 12px between sections
   - Tablet/Desktop: 24px margins, 16px between sections
   - Results cards: Same 20px padding all sizes (no reduction)

4. **Input Width:**
   - Mobile: Full width - 32px (margins)
   - Tablet/Desktop: Max-width 500px

5. **Results Width:**
   - Mobile: Full width - margins
   - Tablet/Desktop: 60-70% width (max ~600px)

---

### Accessibility Strategy

**WCAG AA Compliance (Industry Standard)**

word-unscrambler targets **WCAG 2.1 Level AA** compliance—the recommended accessibility level for public-facing applications.

**Core Accessibility Requirements:**

#### 1. Color Contrast
- Normal text (16px): 7:1+ contrast ratio (WCAG AAA, exceeds AA)
- Large text (18px+): 4.5:1 contrast ratio (WCAG AA)
- Current design: Dark background (#1a1a1a) + Light text (#e8e8e8) = 7:1+ ✓
- Button text on Accent 1: High contrast verified ✓

#### 2. Keyboard Navigation
- Tab key navigates to input field and button
- Enter key submits form (standard behavior)
- No elements require mouse-only interaction
- Focus states clearly visible (Accent 2 ring) ✓

#### 3. Semantic HTML
- Use `<input>` for text field (not custom div)
- Use `<button>` for submit button (not link or div)
- Use `<section>` for result cards
- Use `<h2>` or `<h3>` for result section titles
- Proper heading hierarchy (h1 for title, h3 for sections)

#### 4. Focus Management
- Input auto-focuses on page load (standard, accessible)
- Focus states always visible (Accent 2 ring on inputs/buttons)
- Focus ring width: 2-3px (visible, not overwhelming)
- Tab order is logical: Input → Button

#### 5. Screen Reader Support
- Input has associated label (implicit or via htmlFor)
- Button has descriptive text ("Unscramble!")
- Result section titles clearly indicate word length ("3-Letter Words")
- Result words are plain text (selectable, readable by screen readers)
- No hidden content that shouldn't be read
- No redundant ARIA labels (semantic HTML is sufficient)

#### 6. Touch Accessibility
- Minimum touch targets: 44px × 44px (buttons/inputs exceed this)
- No hover-only content (hover states are supplementary, not required)
- Touch gestures not required (all interactions via tap/keyboard)

#### 7. Motion & Animation
- No animations that could trigger motion sickness
- No flashing/blinking content (accessible to seizure-prone users)
- Optional smooth transitions (< 200ms, not disorienting)
- Respects `prefers-reduced-motion` media query (future: if animations added)

#### 8. Language & Clarity
- Clear, simple language (not jargon-heavy)
- Supportive error messages (not blaming)
- Consistent terminology ("Unscramble!" not "Search" or "Find")

---

### Testing Strategy

**Automated Testing:**
- Use axe DevTools or Lighthouse accessibility audit (browser extension)
- Run WAVE (WebAIM) accessibility checker
- Validate HTML structure (W3C Validator)
- Check contrast ratios (WCAG Color Contrast Checker)

**Manual Testing:**

**Keyboard Navigation:**
- Tab through all interactive elements (input, button)
- Verify focus states are visible
- Test Enter key submission
- Verify no keyboard traps

**Screen Reader Testing:**
- Test with VoiceOver (Mac/iOS) — free
- Test with NVDA (Windows) — free
- Verify all text is announced correctly
- No hidden content that shouldn't be read

**Device Testing:**
- iPhone (mobile, smaller screen)
- iPad (tablet, medium screen)
- Desktop browser (Chrome, Firefox, Safari)
- Test on actual devices, not just browser emulation
- Verify touch targets are comfortable (44px minimum)

**Color Blindness:**
- Use simulator (Chrome DevTools → Rendering → Emulate vision deficiencies)
- Test with Deuteranopia (red-green), Protanopia, Tritanopia
- Ensure no information conveyed by color alone

**Accessibility Audit:**
- Annual audit using professional accessibility tool
- Include users with disabilities in testing cohort
- Gather feedback on real devices/assistive tech

---

### Implementation Guidelines

**For Developers:**

**HTML Structure:**
```html
<body>
  <!-- Hero section -->
  <header class="hero">
    <h1>Word Unscrambler</h1>
    <p>Simple, fast, and easy</p>
    
    <!-- Form -->
    <form>
      <label htmlFor="letters">Enter letters</label>
      <input
        id="letters"
        type="text"
        placeholder="Enter 3-7 letters"
        autoFocus
        aria-label="Letter input"
      />
      <p className="hint">3-7 letters accepted</p>
      <button 
        type="submit"
        disabled={letters.length < 3 || letters.length > 7}
      >
        Unscramble!
      </button>
    </form>
  </header>
  
  <!-- Results -->
  <main class="results">
    {results.map((group) => (
      <section key={group.length} className="result-card">
        <h3>{group.length}-Letter Words</h3>
        <div class="words">{group.words.join(' ')}</div>
      </section>
    ))}
  </main>
</body>
```

**CSS Responsive Guidelines:**
- Use relative units: `rem`, `%`, viewport units (`vw`, `vh`)
- Mobile-first media queries: `@media (min-width: 600px)`
- Test on real devices (not just browser zoom)
- Verify images scale properly (use `max-width: 100%`)

**Keyboard Accessibility:**
- Tab order must be logical (input → button)
- Focus states always visible (outline or ring)
- Enter key submits form (automatic with `<form>`)
- No JavaScript required for basic form submission

**Screen Reader Accessibility:**
- Use semantic HTML (`<button>`, `<input>`, `<section>`)
- Add labels where needed
- Keep error messages clear and concise
- No hidden content (display: none, visibility: hidden)

**Touch Accessibility:**
- Minimum 44px × 44px touch targets
- No hover-only interactions
- Adequate spacing between touch targets
- Test with actual touch device (not just mouse)

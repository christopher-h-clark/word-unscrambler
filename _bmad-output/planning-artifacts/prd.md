---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
inputDocuments:
  - project-context.md
  - api-specification.md
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: greenfield
  specialContext: "Teaching/demonstration project for BMAD methodology"
workflowType: 'prd'
---

# Product Requirements Document - word-unscrambler

**Author:** Chris
**Date:** 2026-04-16

## Executive Summary

**word-unscrambler** is a web application that helps casual puzzle solvers instantly see all valid word combinations from a set of letters. Users experiencing frustration while playing Scrabble, Wordle, or other word games can enter their letters and immediately access a comprehensive list of valid options, allowing them to make informed choices and move forward in their game.

The product solves a specific emotional need: **frustration relief**. When players are stuck, they don't want complexity or to learn—they want fast, complete answers that get them unstuck and back to playing. word-unscrambler delivers exactly that.

### What Makes This Special

Two core attributes define the product:

1. **Simplicity**: Minimal interface, zero friction. Type letters → get words → done. No accounts, no features beyond the core need.
2. **Comprehensiveness**: Show *all* valid word combinations so users have complete information to make their choice.

This combination creates a clear differentiator: word-unscrambler is the fastest, most complete way to get unstuck—nothing more, nothing less.

The project also demonstrates a key BMAD principle: **ruthless scope discipline**. By solving one problem completely rather than adding multiple features, the product delivers maximum user value with minimal complexity.

## Project Classification

- **Project Type**: Web Application (Single Page Application)
- **Domain**: General / Utilities
- **Complexity Level**: Low (no regulatory, compliance, or specialized domain concerns)
- **Project Context**: Greenfield (building from scratch)

## Success Criteria

### User Success

Users successfully find words when stuck on word games (Scrabble, Wordle, letter puzzles). The core success moment is when they **see options they hadn't considered** and can pick one to move forward in their game.

**Measurable outcomes:**
- User enters letters → sees all valid word combinations within 10 seconds
- User selects a word (or multiple words) → returns to game with confidence they have options
- Users experience the "aha!" moment of discovering words they hadn't considered

### Business Success

word-unscrambler succeeds by being a useful tool that people find helpful when they need it.

**Measurable outcomes:**
- Tool is deployed and stable (available to users who find it)
- Tool serves any number of daily users (no minimum adoption target)
- Users return when they get stuck again (nice-to-have, not required for success)
- Tool is built once and maintained without significant ongoing effort

**Timeline:** MVP ready for deployment in 3 days

### Technical Success

The tool reliably returns accurate results from the word dictionary.

**Measurable outcomes:**
- Returns all valid words that can be formed from input letters within 10 seconds
- Supports letter combinations from 3 to 10 letters
- 99% uptime acceptable (downtime is not critical)
- Zero false positives (only returns words in the dictionary)

### Dictionary Source

**SCOWL (Spell Checker Oriented Word Lists)** is used for the word dictionary. SCOWL provides comprehensive, well-maintained English word lists across multiple sizes. The project uses the SCOWL 2024.11.24 release with the standard English word list, filtered to include only words with 3–10 characters.

## Product Scope

### MVP - Minimum Viable Product (3-day timeline)

**Core functionality only:**
- Web interface: Simple input field for letters (3-10 letter maximum)
- Letter validation: Accept only a-z and ? (wildcard)
- Word lookup: Query dictionary, return all valid words
- Display results: Show matching words in sortable list (alphabetical)
- Performance: All queries complete within 10 seconds
- No authentication, no accounts, no user tracking, no features beyond core lookup

**This is what launches in 3 days.**

### Growth Features (Post-MVP, optional)

- UI refinement: Polish design and responsive layout
- Advanced filtering: Sort by word frequency or length
- Suggested patterns: Quick suggestions for common letter patterns

### Vision (Future)

Keep the tool simple, fast, and useful. Maintain the dictionary and address any accuracy issues users discover. **No expansion beyond the core mission.**

## User Journeys

### Journey 1: Stuck Player - Success Path

**User Type:** Casual puzzle player (desktop or mobile)

**The Story:**

Sarah is playing Wordle on her phone during her lunch break. She's stuck—she has the letters "ARTE" and knows one is in the right position, but she can't think of any valid words. Frustrated, she opens a browser tab and goes to word-unscrambler.

She types "ARTE" into the text field. Within a second, she sees a list: "RATE, TEAR, TARE, ARTE." Her eyes light up—there are words she hadn't considered. She picks "RATE," types it into Wordle, and the game rewards her with a green. Back to Wordle, she continues playing.

Ten minutes later, she's stuck again with "HORSE." Back to word-unscrambler. Type, see options, pick one, return to game.

**Key Moments:**
- Entry: Feeling stuck, frustrated in the game
- Action: Type letters → see complete list within seconds
- Decision: Pick one or more words from the list
- Resolution: Return to game with confidence and options

**Requirements Revealed:**
- Fast text input with character validation (no numbers/special chars)
- Instant results (< 10 seconds)
- Complete word list display (alphabetically sorted)
- Mobile and desktop responsive design
- Clear, scannable presentation of results

### Journey 2: Stuck Player - No Results Edge Case

**User Type:** Same casual player

**The Story:**

Alex is playing Scrabble with friends. He's got "ZZZZZ" (terrible tiles). He tries word-unscrambler hoping for a miracle. He types "ZZZZZ" and hits enter.

The screen shows: "No words found. Try different letters."

He sighs, accepts defeat, and exchanges tiles.

**Key Moments:**
- Entry: Long shot attempt with unusual letter combos
- Action: Type letters → no results
- Feedback: Clear message that no words exist
- Resolution: User understands and moves on

**Requirements Revealed:**
- Empty state handling: Clear "no words found" message
- Prevents user confusion (not broken, just no matches)

### Journey 3: Stuck Player - Input Validation Edge Case

**User Type:** Same casual player, different moment

**The Story:**

Marcus is in a hurry. He types "AR" (too short) and tries to submit. The button is disabled—nothing happens. He adds another letter "ART" and the button enables. He clicks and gets results.

Later, he types "ARTFULLYY" (too long, 9 letters). The button is disabled. He deletes a letter, gets to 7 "ARTFULL," button enables, he submits.

**Key Moments:**
- Entry: User tries invalid combinations
- Feedback: UI prevents submission (disabled button, not error messages)
- Resolution: User self-corrects and tries again

**Requirements Revealed:**
- Text field accepts only a-z and ?
- Character count validation (3-7 letters)
- Submit button disabled until valid input
- No error messages needed (UI prevents invalid submission)

### Journey Requirements Summary

Across all journeys, the product must deliver:

**Core Capabilities:**
- Text input field with character filtering (a-z, ?)
- Real-time character count validation (enable/disable submit at 3-7 letters)
- Word lookup engine that queries dictionary within 10 seconds
- Results display: alphabetically sorted word list
- Empty state: "No words found" message when no matches

**User Experience:**
- Responsive design (mobile and desktop)
- Instant feedback (typing feels fast)
- Clear visual hierarchy (word list is scannable)
- Minimal interface (no distractions)

## Web App Specific Requirements

### Browser Support Matrix

**Supported Browsers:**
- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14+
- Brave 90+ (Chromium-based)

**Technical Approach:**
- Target ES2020+ JavaScript (covers all supported browsers)
- No polyfills needed (these browsers support modern JS natively)
- Test on latest versions of each browser
- Graceful degradation if newer features unavailable

### Responsive Design

**Device Coverage:**
- Desktop (1024px and up)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

**Design Approach:**
- Mobile-first responsive design
- Touch-friendly input field and buttons (minimum 44px tap targets)
- Readable on small screens (text scaling, proper spacing)
- Works with both portrait and landscape orientations

### Performance Targets

**User-Facing Performance:**
- Page load: < 2 seconds on 4G mobile
- Word lookup results: < 10 seconds (per success criteria)
- UI response: < 100ms (feels instant to user)

**Technical Targets:**
- Frontend bundle: < 100KB gzipped (per project-context)
- No render-blocking resources
- Lazy load if dictionary grows

### SEO Strategy

**Goal:** word-unscrambler shows up in Google search results for queries like "word unscrambler," "unscramble letters," etc.

**Implementation:**
- Semantic HTML (proper `<h1>`, `<meta>` tags, structured data)
- Meta description and title tags optimized for search
- Open Graph tags for social sharing
- Sitemap.xml and robots.txt for crawler guidance
- Fast page load (impacts SEO ranking)
- Mobile-responsive (Google mobile-first indexing)

### Accessibility Level

**Standard:** WCAG 2.1 Level AA compliance

**Requirements:**
- Keyboard navigation: All functionality accessible via keyboard (Tab, Enter, etc.)
- Screen reader support: Labels, ARIA attributes, semantic HTML
- Color contrast: 4.5:1 for normal text, 3:1 for large text (WCAG AA standard)
- Focus visible: Clear visual indicator when focused
- Form labels: Associated with inputs properly
- Error messages: Clear, descriptive, announced to screen readers

**Testing:** Automated and manual testing with accessibility tools (axe, WAVE) and screen readers (NVDA, JAWS)

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-solving MVP — deliver the minimum functionality that solves the core problem (users get unstuck on word games).

**MVP Philosophy:** Ruthless scope discipline. This project demonstrates how to ship genuine user value in 3 days by solving one problem completely rather than adding multiple features or over-engineering.

**Resource Requirements:** Small team (1-2 developers, 1 designer if separate), basic infrastructure for deployment.

### MVP Feature Set (Phase 1 - 3 Days)

**Core User Journeys Supported:**
- Stuck player enters letters → sees all valid word combinations → uses words in game
- Stuck player enters invalid input → UI prevents submission gracefully
- Stuck player enters letters with no valid words → sees clear message

**Must-Have Capabilities:**
- Text input field with real-time character validation (a-z, ?, 3-7 letters)
- Word lookup engine querying dictionary within 10 seconds
- Alphabetically sorted results display
- "No words found" message for empty results
- Responsive design (mobile-friendly and desktop)
- SEO optimization (shows up in Google search)
- WCAG AA accessibility compliance
- No authentication, no accounts, no user tracking

**Not in MVP:**
- Native mobile app (web site is mobile-friendly instead)
- Advanced filtering or sorting
- User accounts or saved searches
- Community features
- Alternative dictionaries

### Post-MVP Features

**Phase 2 (Growth - Post-Launch):**
- UI refinement and polish
- Advanced filtering (sort by word length or frequency)
- Suggested patterns for common letter combinations

**Phase 3 (Vision - Future):**
- Maintain dictionary accuracy
- Address user-discovered accuracy issues
- **No expansion beyond the core mission** (no mobile app, no game integrations, no community)

### Risk Mitigation Strategy

**Timeline Risk:**
- MVP scope is fixed and non-negotiable for 3-day launch
- If implementation runs over, Phase 2 features are deferred, not MVP
- Buffer: Start with absolute essentials first

**Technical Risks:**
- Word lookup performance < 10 seconds: Validate with test dictionary before launch
- Responsive design: Test on real devices (mobile, tablet, desktop) not just browser DevTools
- SEO: Basic setup (meta tags, sitemap) included in MVP

**Market Risks:**
- User validation: Product launches to real users immediately to gather feedback
- Learning: Measure how often people use the tool to validate problem exists

## Functional Requirements

### Input Management

- FR1: User can enter letters into a text input field
- FR2: Text input field accepts only letters (a-z, case-insensitive) and ? (wildcard character)
- FR3: Text input field rejects numbers and special characters automatically
- FR4: User can see real-time character count feedback (current/max)
- FR5: Submit button is disabled if fewer than 3 letters are entered
- FR6: Submit button is disabled if more than 7 letters are entered
- FR7: Submit button is enabled when 3-7 valid letters are entered

### Word Lookup & Search

- FR8: System accepts user input and queries the word dictionary
- FR9: System returns all valid words that can be formed from input letters, where each letter in the word uses only the available count from the input (e.g., if input is "CAT" with one C, one A, one T, the word "CAT" is valid but "CACA" is not because it requires two A's)
- FR10: Word lookup completes within 10 seconds
- FR11: System handles wildcard (?) by matching any single letter
- FR12: System returns zero or more matching words (never invalid words)
- FR13: System is case-insensitive (treats "ABC" same as "abc")

### Results Display

- FR14: User sees matching words displayed as a list
- FR15: Word list is sorted alphabetically
- FR16: System displays "No words found. Try different letters." when no matches exist
- FR17: User can view results and copy/use individual words
- FR18: Results display is cleared when user modifies input

### User Experience & Responsiveness

- FR19: Application loads on desktop browsers (Chrome 90+, Edge 90+, Firefox 88+, Safari 14+, Brave 90+)
- FR20: Application is fully responsive on mobile devices (320px and up)
- FR21: Application is fully responsive on tablet devices (768px and up)
- FR22: Application is fully responsive on desktop devices (1024px and up)
- FR23: Input field and buttons are touch-friendly (minimum 44px tap targets on mobile)
- FR24: Application supports both portrait and landscape orientations on mobile

### Search Engine Optimization

- FR25: Application has semantic HTML structure with proper heading hierarchy
- FR26: Application has meta description tag for search engine snippets
- FR27: Application has Open Graph tags for social media sharing
- FR28: Application provides sitemap.xml for search engine crawlers
- FR29: Application provides robots.txt for crawler guidance

### Accessibility

- FR30: All interactive elements (input, button) are keyboard accessible via Tab
- FR31: Submit button can be activated via Enter key
- FR32: Form labels are properly associated with inputs for screen readers
- FR33: Word list is announced to screen readers
- FR34: Error and empty states are announced to screen readers
- FR35: Text color contrast meets WCAG AA standard (4.5:1 normal text, 3:1 large text)
- FR36: Focus indicator is clearly visible on all interactive elements
- FR37: Application works with screen readers (NVDA, JAWS, VoiceOver)

## Non-Functional Requirements

### Performance

- NFR1: Word lookup query must complete within 10 seconds for valid input
- NFR2: Initial page load must complete within 2 seconds on 4G mobile networks
- NFR3: User input response (typing, button state updates) must feel instant (< 100ms visible feedback)
- NFR4: Frontend bundle size must not exceed 100KB gzipped
- NFR5: No render-blocking resources on critical path (CSS, synchronous JavaScript)

### Reliability

- NFR6: System uptime target is 99% (acceptable downtime ~7 hours/month)
- NFR7: Dictionary loading at server startup must complete within 5 seconds or service fails to start
- NFR8: Word lookup failures gracefully display error message instead of crashing
- NFR9: Network timeouts (API unreachable) display user-friendly error instead of hanging

### Security

- NFR10: All traffic between client and server uses HTTPS encryption
- NFR11: User input is validated and sanitized to prevent injection attacks
- NFR12: No sensitive user data is stored (no cookies, no tracking IDs)
- NFR13: Server responds to invalid input with 400 Bad Request, never exposing system details

### Documentation

- NFR14: Server-side REST API is documented in OpenAPI 3.1 specification format
- NFR15: OpenAPI documentation includes all endpoints, request/response schemas, error codes, and usage examples

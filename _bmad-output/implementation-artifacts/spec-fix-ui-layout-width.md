---
title: 'Constrain UI layout width on wider displays'
type: 'feature'
created: '2026-05-08'
status: 'done'
baseline_commit: 'cfb1ee4af3487cc8d6fa5cbb736d6918b1f6ad62'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The text field and unscramble button are full-width on all screen
sizes, appearing cramped and awkward on large displays (16" MacBook Pro and
larger).

**Approach:** Use Tailwind CSS responsive utilities to apply max-width
constraints on medium (md:) and larger breakpoints. The input field will be
constrained to ~1/3 width and the unscramble button to ~1/4 width on desktop,
while remaining full-width on mobile/narrow displays. The button will also be
~50% taller on larger screens.

## Boundaries & Constraints

**Always:**

- Maintain full-width behavior on mobile (< md breakpoint)
- Use Tailwind CSS responsive classes only (no custom CSS)
- Preserve all existing functionality and event handlers
- Button height increase should be proportional (e.g., from `h-10` to `h-16`)

**Ask First:**

- If custom breakpoints or width values are needed beyond standard Tailwind
  max-w classes
- If accessibility implications arise during implementation

**Never:**

- Add new CSS files or styled-components
- Change component props or event handling
- Modify the underlying component logic

## I/O & Edge-Case Matrix

| Scenario      | Input / State                         | Expected Output / Behavior                                                             | Error Handling |
| ------------- | ------------------------------------- | -------------------------------------------------------------------------------------- | -------------- |
| Mobile (< md) | Screen width < 768px                  | Input and button remain full-width                                                     | N/A            |
| Tablet (md)   | Screen width ≥ 768px                  | Input constrained, button constrained, full visual hierarchy maintained                | N/A            |
| Desktop (lg+) | Screen width ≥ 1024px                 | Input ~576px max (1/3 of 1728px), button ~448px max (1/4 of 1728px), button 50% taller | N/A            |
| Resize event  | Window resized from mobile to desktop | Layout smoothly transitions via responsive classes                                     | N/A            |

</frozen-after-approval>

## Code Map

- `packages/client/src/components/SearchForm.tsx` -- Main component containing
  the input and button; needs responsive width and height constraints
- `packages/client/src/App.tsx` -- Parent component; context shows the form is
  in a header; may need wrapper constraints

## Tasks & Acceptance

**Execution:**

- [x] `packages/client/src/components/SearchForm.tsx` -- Add responsive Tailwind
      classes to the flex container and button to constrain widths on md: and
      lg: breakpoints, and increase button height on larger screens -- This is
      the primary UI element needing layout constraints

**Acceptance Criteria:**

- Given the user views the app on a mobile device (< 768px width), when they see
  the search form, then both the input and button remain full-width
- Given the user views the app on a desktop (1024px+ width), when they see the
  search form, then the input is constrained to approximately max-w-lg and the
  button is constrained to approximately max-w-md
- Given the user views the app on a desktop, when they see the unscramble
  button, then it is approximately 50% taller than on mobile (e.g., h-16 vs
  h-10)
- Given the user resizes the browser window, when the viewport crosses a
  responsive breakpoint, then the layout smoothly transitions without layout
  shift or visual jarring

## Design Notes

The responsive design uses Tailwind's standard breakpoints:

- Mobile-first (default): `w-full` (full width)
- Medium (md:): 768px and up - apply `md:max-w-lg` to wrapper and `md:max-w-md`
  to button
- Large (lg:): 1024px and up - maintains same constraints (could adjust if
  needed)

For button height: default `h-10` (40px) on mobile, `md:h-16` (64px) on desktop
(~60% increase, close to the requested 50% increase).

## Spec Change Log

**Review Cycle 1 — Critical Patch (2026-05-08)**

- **Finding:** Constrained container lacked centering and intermediate
  breakpoint handling
- **Amendment:** Added `mx-auto` for center alignment and `sm:max-w-sm` for
  tablet (640px+) intermediate constraint
- **Avoided state:** Form left-alignment on desktop (breaking visual hierarchy)
  and awkward full-width layout on tablets
- **KEEP:** Responsive max-width constraints and button height increase — both
  working as intended

## Verification

**Manual checks:**

- Open the app on a mobile phone (portrait orientation, ~375px width) and verify
  the input and button are full-width
- Open the app on a desktop browser at 1024px+ width and verify the input is
  constrained to ~512px (max-w-lg) and the button to ~448px (max-w-md)
- Open the dev tools and resize the browser window to verify smooth transitions
  at breakpoints (640px, 768px)
- Verify button height visually increases on larger screens
- Verify the form is centered horizontally on desktop (not left-aligned)

## Suggested Review Order

**Responsive Layout Constraints**

- Form container width constraints with responsive breakpoints and centering
  [`SearchForm.tsx:82`](../../../../packages/client/src/components/SearchForm.tsx#L82)

- Button width and height responsive adjustments on medium+ screens
  [`SearchForm.tsx:101`](../../../../packages/client/src/components/SearchForm.tsx#L101)

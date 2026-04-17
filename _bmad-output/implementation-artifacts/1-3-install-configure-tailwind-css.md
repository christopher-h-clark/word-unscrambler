---
storyId: 1.3
storyKey: 1-3-install-configure-tailwind-css
epic: 1
status: ready-for-dev
title: Install and Configure Tailwind CSS + shadcn/ui for Styling
createdDate: 2026-04-17
lastUpdated: 2026-04-17
devAgentRecord: []
fileList: []
---

# Story 1.3: Install and Configure Tailwind CSS + shadcn/ui for Styling

## Story Overview

As a **developer**, I want to install Tailwind CSS and shadcn/ui components for the frontend, so that styling is lightweight, customizable, and doesn't exceed the 100KB bundle constraint.

**Story Value:** Establishes the styling system with minimal bundle footprint. shadcn/ui provides accessible, unstyled components that we customize. Tailwind provides utility-first styling without bloat.

**Dependencies:** Requires Story 1.1 (monorepo setup) and Story 1.2 (TypeScript config) to be complete.

---

## Acceptance Criteria

**AC1: Tailwind CSS Installed and Integrated**
- Install `tailwindcss` and `postcss` via npm in `packages/client`
- Create `tailwind.config.js` in `packages/client` with:
  - `content: ["./src/**/*.{js,jsx,ts,tsx}"]`
  - Dark theme defaults: `backgroundColor: "#1a1a1a"`, `textColor: "#e8e8e8"`
  - Soft blue accent: `#4a9eff`
  - Soft teal accent: `#20b2aa`
- Create `postcss.config.js` in `packages/client` with Tailwind plugin
- Integrate with Vite: `vite.config.ts` includes PostCSS processing
- Create `src/index.css` with Tailwind directives: `@tailwind base; @tailwind components; @tailwind utilities;`
- Import `index.css` in `src/main.tsx`

**AC2: shadcn/ui Initialized**
- Install `@shadcn/ui` package manager (CLI tool)
- Run initialization: `npx shadcn-ui@latest init`
- Choose Tailwind + TypeScript configuration
- Select neutral color scheme (grays, no strong primary color override yet)
- Verify `src/components/ui/` directory created

**AC3: Core Components Installed**
- Install Button component: `npx shadcn-ui@latest add button`
- Install Input component: `npx shadcn-ui@latest add input`
- Both components exist in `src/components/ui/button.tsx` and `src/components/ui/input.tsx`
- Components are copy-pasted (not imported from node_modules) — this is shadcn/ui default behavior

**AC4: Dark Theme Configuration**
- `tailwind.config.js` sets dark theme as default:
  ```javascript
  theme: {
    extend: {
      colors: {
        background: "#1a1a1a",
        text: "#e8e8e8",
        accent: "#4a9eff",
        accentAlt: "#20b2aa"
      }
    }
  }
  ```
- Tailwind variables (CSS custom properties) defined for dark theme
- All UI elements render with dark background by default

**AC5: Component Styling Applied**
- Button component styled with Tailwind utilities:
  - Background: soft blue (#4a9eff)
  - Text: white (#e8e8e8)
  - Padding: `px-4 py-2` (standard button padding)
  - Border radius: `rounded-md` (subtle rounding)
  - Hover state: darker blue or slight opacity change
  - Focus ring: soft teal (#20b2aa)
- Input component styled:
  - Background: slightly lighter than page (#2d2d2d)
  - Border: 1px subtle gray
  - Focus ring: soft teal accent
  - Placeholder text: muted gray
  - Padding: `px-3 py-2` (standard input padding)

**AC6: System Font Stack**
- `tailwind.config.js` includes system font stack (no web fonts):
  ```javascript
  fontFamily: {
    sans: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ]
  }
  ```
- Default font applied to all elements (via Tailwind base styles)
- No external font files loaded (saves bundle space)

**AC7: Bundle Size Validation**
- Run `npm run build` in `packages/client`
- Measure gzipped bundle size (output from build tool)
- Size must be < 100KB gzipped (excluding dictionary file)
- Report bundle size in build output
- If > 100KB, investigate and optimize (likely won't be issue at this stage)

**AC8: No Unused CSS**
- Tailwind is configured with PurgeCSS (default in modern Tailwind)
- `content: ["./src/**/*.{js,jsx,ts,tsx}"]` ensures only used utilities included
- Unused Tailwind classes automatically stripped from build

**AC9: TypeScript Support**
- Components have proper TypeScript types
- shadcn/ui components exported with types
- No `any` types in Button or Input components

**AC10: Vite Integration Verified**
- `npm run dev` in `packages/client` compiles Tailwind on-the-fly (HMR works)
- CSS changes reflect in browser instantly (< 1 second)
- No build step needed during development

---

## Technical Context

### Why Tailwind + shadcn/ui

**Traditional Approach (Material UI):** Pre-built components with pre-built styles. Heavy (100KB+ bundle), hard to customize without overriding styles.

**Tailwind Approach:** Low-level utility classes. You compose styles by combining utilities. Lightweight, tree-shakable, fully customizable.

**shadcn/ui Bridge:** Unstyled accessible components (using Radix UI primitives) + Tailwind utilities for styling. You own the code (copy-pasted) and customize as needed.

### Bundle Size Analysis

At this stage:
- Tailwind CSS (production): ~30KB gzipped
- shadcn/ui components (Button + Input): ~10KB combined (after tree-shaking)
- Other React + Vite overhead: ~50KB
- **Total: ~90KB** (leaves 10KB for application code, within 100KB constraint)

### Design System Colors

From UX Design Specification:
- **Background:** `#1a1a1a` (dark charcoal)
- **Text:** `#e8e8e8` (light gray, high contrast)
- **Accent (Primary):** `#4a9eff` (soft blue)
- **Accent (Secondary):** `#20b2aa` (soft teal)
- **Surfaces:** `#2d2d2d` (slightly lighter than background)

### File Structure

```
packages/client/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── button.tsx
│   │       └── input.tsx
│   ├── index.css              (new: Tailwind directives)
│   ├── main.tsx               (updated: import index.css)
│   └── App.tsx
├── tailwind.config.js          (new)
├── postcss.config.js           (new)
├── vite.config.ts              (may need HMR update)
├── tsconfig.json
└── package.json                (updated: tailwind, postcss, shadcn/ui)
```

### Installation Commands

```bash
cd packages/client

# Install Tailwind
npm install -D tailwindcss postcss

# Install shadcn/ui CLI
npm install -D @shadcn/ui

# Initialize shadcn/ui
npx shadcn-ui@latest init

# Add Button component
npx shadcn-ui@latest add button

# Add Input component
npx shadcn-ui@latest add input

# Build and check bundle size
npm run build
```

### Tailwind Config Template

```javascript
// packages/client/tailwind.config.js
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#1a1a1a',
        'bg-secondary': '#2d2d2d',
        'text-primary': '#e8e8e8',
        'accent-blue': '#4a9eff',
        'accent-teal': '#20b2aa',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
```

### PostCSS Config Template

```javascript
// packages/client/postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### Vite Config Update (may be needed)

```typescript
// packages/client/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    middlewareMode: false,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
  },
});
```

---

## Implementation Strategy

### Step 1: Install Dependencies
```bash
cd packages/client
npm install -D tailwindcss postcss
npm install -D @shadcn/ui
```

### Step 2: Create Tailwind Config
Create `packages/client/tailwind.config.js` with dark theme and custom colors.

### Step 3: Create PostCSS Config
Create `packages/client/postcss.config.js` with Tailwind plugin.

### Step 4: Create Base CSS
Create `packages/client/src/index.css` with Tailwind directives.

### Step 5: Initialize shadcn/ui
```bash
cd packages/client
npx shadcn-ui@latest init
# Select: TypeScript, Tailwind CSS, tailwind.config.js path
```

### Step 6: Add Components
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
```

### Step 7: Update App.tsx
Import `index.css` at top:
```typescript
import './index.css';
```

### Step 8: Test & Validate
```bash
npm run dev          # HMR should work
npm run build        # Check bundle size
```

---

## Testing Strategy

**Manual Validation:**

1. **Tailwind Integration:**
   ```bash
   npm run dev
   # Check: Browser shows styled text (should be light gray on dark background)
   ```

2. **Button Component Test:**
   ```typescript
   import { Button } from '@/components/ui/button';
   
   export default function App() {
     return <Button>Click me</Button>;
   }
   ```
   - Should render with soft blue background, white text, teal focus ring

3. **Input Component Test:**
   ```typescript
   import { Input } from '@/components/ui/input';
   
   export default function App() {
     return <Input placeholder="Type here..." />;
   }
   ```
   - Should render with light-on-dark styling, teal focus ring

4. **HMR Test:**
   - Edit `tailwind.config.js`, change a color
   - Browser updates instantly without full refresh
   - CSS changes reflect in < 1 second

5. **Bundle Size Test:**
   ```bash
   npm run build
   # Output should show: main.xxx.js X KB (gzipped: YY KB)
   # YY should be < 100KB
   ```

6. **Dark Theme Verification:**
   - Page background should be `#1a1a1a` (dark charcoal)
   - Text should be `#e8e8e8` (light gray, high contrast)
   - Buttons should be soft blue (`#4a9eff`)

**Acceptance:** All validation checks pass, bundle < 100KB, components styled correctly.

---

## Project Context Reference

This story aligns with:
- **Project Requirements:** PR1 (monorepo), PR5 (TypeScript)
- **Architecture Requirements:** AR2 (Replace Material UI with Tailwind + shadcn/ui), AR6 (Vite bundling)
- **UX Design:** Dark theme (#1a1a1a background, #e8e8e8 text), soft blue/teal accents, system font stack
- **Bundle Constraint:** NFR5 (< 100KB gzipped, excluding dictionary)
- **Code Quality:** All Tailwind utilities follow TypeScript strict mode

---

## Previous Story Learning

**From Story 1.1 (Clone Starter):**
- Vite is already configured with React
- `packages/client/main.tsx` exists as entry point
- Vite dev server runs on port 5173 with HMR enabled

**From Story 1.2 (TypeScript Config):**
- TypeScript strict mode enforced
- ESLint configured (may have opinions on CSS imports)
- shadcn/ui components will be TypeScript, no `any` types

**Action:** Leverage existing Vite/React setup, add PostCSS pipeline without breaking HMR.

---

## Potential Gotchas

**Gotcha 1: Tailwind Not Compiling**
- **Problem:** Styles not applied after installation
- **Check:** `postcss.config.js` exists and Tailwind plugin configured
- **Check:** `index.css` imported in `main.tsx`
- **Check:** Vite config includes PostCSS (usually automatic)

**Gotcha 2: Bundle Size Bloat**
- **Problem:** After adding Tailwind, bundle > 100KB
- **Cause:** Unused CSS not being purged
- **Solution:** Verify `content` field in `tailwind.config.js` includes all source files
- **Solution:** Build output should show "removed X unused CSS" message

**Gotcha 3: shadcn/ui Init Questions**
- When running `shadcn-ui init`, you'll be asked:
  - "Would you like to use TypeScript?" → Yes
  - "Which style would you like to use?" → Default
  - "Which color would you like as your primary color?" → Slate (neutral)
  - Path to `tailwind.config.js` → `./tailwind.config.js`
  - Path to `components` folder → `./src/components`
  - Path to `utils` folder → `./src/lib/utils`

**Gotcha 4: Color Customization**
- After shadcn/ui init, `tailwind.config.js` may be auto-updated with color variables
- Ensure dark theme colors are preserved (`#1a1a1a` background, etc.)
- If shadcn overwrites, manually restore custom colors

**Gotcha 5: ESLint CSS Import Warnings**
- ESLint from Story 1.2 may warn on CSS imports
- This is OK, CSS imports are valid in Vite
- Can suppress with `/* eslint-disable-next-line */` if needed

---

## Success Criteria

✅ **Done when:**
- Tailwind CSS installed and `tailwind.config.js` created with dark theme
- PostCSS configured with Tailwind plugin
- `src/index.css` contains Tailwind directives
- shadcn/ui initialized with Button and Input components
- Components styled with correct colors (soft blue, light text on dark)
- System font stack applied
- `npm run dev` shows styled components with HMR working
- `npm run build` shows bundle < 100KB gzipped
- TypeScript types present, no `any` types
- Dark theme is default (no light mode needed yet)

---

## Dependencies

- **Blocks:** Story 3.1 (SearchForm component will use Button + Input)
- **Blocked By:** Story 1.1 (monorepo), Story 1.2 (TypeScript)
- **Related:** Story 4.4 (accessibility audit will verify Tailwind colors meet WCAG AA)

---

## Dev Agent Record

_Filled in by implementing developer_

### Tasks Completed

- [ ] Install Tailwind CSS and PostCSS in packages/client
- [ ] Create tailwind.config.js with dark theme and custom colors
- [ ] Create postcss.config.js with Tailwind plugin
- [ ] Create src/index.css with Tailwind directives
- [ ] Initialize shadcn/ui with TypeScript + Tailwind
- [ ] Add Button component via shadcn/ui
- [ ] Add Input component via shadcn/ui
- [ ] Import index.css in src/main.tsx
- [ ] Verify Button and Input components render with correct styling
- [ ] Test HMR with CSS changes
- [ ] Run npm run build and verify bundle < 100KB gzipped
- [ ] Verify dark theme is default and colors match spec

### Code Changes

_List files created/modified:_

### Tests Created

_N/A for styling story (manual validation only)_

### Learnings & Notes

_To be filled by developer after implementation_

---

## File List

_Updated after implementation_

- ✅ packages/client/tailwind.config.js
- ✅ packages/client/postcss.config.js
- ✅ packages/client/src/index.css
- ✅ packages/client/src/main.tsx (updated: import index.css)
- ✅ packages/client/src/components/ui/button.tsx
- ✅ packages/client/src/components/ui/input.tsx
- ✅ packages/client/src/lib/utils.ts (created by shadcn/ui)
- ✅ packages/client/package.json (updated: dependencies)

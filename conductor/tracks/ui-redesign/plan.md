# Apple-Style UX/UI Redesign Plan

## 1. Objective

Redesign the UX/UI of the NPU NextGen platform to feature a modern, premium, minimalist aesthetic inspired by `apple.com`. This includes adopting the Apple system font stack (San Francisco), utilizing ample white space, high-contrast typography, and integrating high-quality generated imagery and a new logo to impress visitors.

## 2. Approach & Guidelines

- **Typography**: Replace current fonts with `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif`. For Thai text, we will ensure it gracefully falls back to the system's native modern Thai font (e.g., Sukhumvit Set on macOS/iOS) or use `Kanit` for a modern, geometric look if web fonts are preferred.
- **Color Palette**: Shift from heavy green/yellow to a more neutral, sophisticated palette (e.g., `#1d1d1f` for text, `#f5f5f7` for backgrounds) with the project's green used sparingly as a premium accent color for CTAs.
- **Layout**: Emphasize large, bold hero typography, edge-to-edge cinematic images with subtle gradients, and grid-based feature cards with soft shadows and rounded corners (border-radius: 1rem/2rem).

## 3. Implementation Steps

### Phase 1: Asset Generation (Mina + Nano Banana)

- Generate a sleek, modern, minimalist logo for "NPU NextGen Smart Agriculture".
- Generate cinematic, high-resolution hero background images depicting the fusion of technology (AI/IoT) and lush green agriculture.

### Phase 2: Core Styling Update (Benzaiten)

- Update `tailwind.config.ts` to include the Apple system font stack as the primary sans font.
- Update `src/app/globals.css` to redefine background colors, text colors, and selection colors to match the premium aesthetic.

### Phase 3: Component Redesign (Benzaiten)

- **Landing Page**:
  - Redesign `HeroSection` to feature the new cinematic background and a large, centered, bold headline.
  - Redesign `CourseDetails` and `OutcomesSection` into clean, Apple-like feature grids (like the iPhone feature highlights).
- **Application Form Flow**:
  - Simplify the multi-step form UI. Use floating labels or clean, separated input sections.
  - Update `ProgressStepper` to look like a modern checkout flow.

### Phase 4: Quality & Verification (Raijin)

- Audit the new UI for responsiveness across mobile and desktop.
- Verify accessibility (color contrast, tap targets) and Lighthouse performance.
- Ensure all TDD tests still pass.

## 4. Automation Strategy

Mina will act as the orchestrator, dispatching tasks to Nano Banana for images, Benzaiten for UI code, and Raijin for QA, running in a continuous loop until the redesign is complete and verified.

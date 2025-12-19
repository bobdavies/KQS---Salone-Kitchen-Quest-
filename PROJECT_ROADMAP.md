# THE CASSAVA LEAF EXPERIENCE: Project Roadmap & Vibe Context

**Project Vision:** A "mind-blowing," highly interactive, cinematic cooking application for the Sierra Leonean dish "Cassava Leaf Sauce." This is not a recipe blog; it is a playable, gamified cooking experience.

**Target Vibe:** Immersive, Tactile, Cultural, Cinematic, "Apple-style" smooth physics.

---

## 🛠 Tech Stack (Strict Requirement)
* **Framework:** Next.js 14+ (App Router)
* **Styling:** Tailwind CSS
* **Animation Engine:** `framer-motion` (Mandatory for all interactions)
* **UI Components:** Shadcn/UI (Base), Radix UI (Primitives)
* **Audio:** `use-sound`
* **Effects:** `canvas-confetti`
* **Icons:** `lucide-react`
* **Language:** TypeScript

## 🎨 Design System & Theming
* **Fonts:** `Inter` (UI/Body), `Ubuntu` (Headings/Titles).
* **Color Palette:**
    * `salone-green`: `#1EB53A` (Fresh Cassava Leaves)
    * `salone-white`: `#FFFFFF` (Rice)
    * `salone-blue`: `#0072C6` (Sea/Sky)
    * `palm-oil-red`: `#FF4500` (Rich Palm Oil)
    * `peanut-brown`: `#D2691E` (Groundnut paste)

---

## 🚀 Development Phases

### PHASE 1: Setup & Infrastructure
- [ ] Initialize Next.js project with TypeScript & Tailwind.
- [ ] Install dependencies: `framer-motion`, `use-sound`, `canvas-confetti`, `lucide-react`.
- [ ] Configure `tailwind.config.ts` with the custom "Salone" color palette.
- [ ] Set up asset folders (`/public/videos`, `/public/sounds`) and add placeholder assets.

### PHASE 2: Experience Architecture
- [ ] Define the Main Layout (`layout.tsx`) to handle full-screen immersive view.
- [ ] Create the State Machine structure (Intro -> Market -> Prep -> Cook -> Serve).
- [ ] Implement `AnimatePresence` for seamless transitions between these major stages.

### PHASE 3: The "Virtual Blender" (Interaction Core)
- [ ] Create `VirtualBlender` component.
- [ ] **Interaction:** Hold-to-blend button logic.
- [ ] **Animation:** Rapid x/y vibration (shake) using Framer Motion when held.
- [ ] **Visuals:** Ingredients inside blur and rotate; morph into green paste on completion.
- [ ] **Audio:** Trigger loud blender noise only while holding.

### PHASE 4: The "Palm Oil Simmer" (Video Integration)
- [ ] Create `SimmerTimer` component.
- [ ] **Visuals:** Background looping video of bubbling red oil (with blur overlay).
- [ ] **Interaction:** Heat Slider (Low to High).
- [ ] **Logic:** Sliding to "High" speeds up timer but flashes red warning. "Simmer" is the target zone.

### PHASE 5: The "Beef Drop" (Physics)
- [ ] Create `IngredientDrop` component.
- [ ] **Visuals:** Pot at bottom, Beef Cubes at top.
- [ ] **Interaction:** Drag and drop beef cubes into the pot.
- [ ] **Animation:** Spring physics on release; "splash" ripple effect when item hits the pot area.

### PHASE 6: Act 1 - "The Market" (Gamification)
- [ ] Create `MiseEnPlace` component.
- [ ] **Layout:** Split screen (Pantry Shelf vs. Prep Bowl).
- [ ] **Interaction:** Drag ingredients from shelf to bowl.
- [ ] **Feedback:** Bowl scales up when hovering; ingredients shrink and fall in upon drop; progress bar updates.
- [ ] **Transition:** Auto-advance to Blender phase when all 8 items are collected.

### PHASE 7: Act 4 - "The Plating" (Grand Reveal)
- [ ] Create `TheGrandReveal` component.
- [ ] **Initial State:** Top-down view of closed pot lid with animated steam particles.
- [ ] **Interaction:** Swipe-up gesture to lift lid.
- [ ] **Animation:** Lid slides off; Video of plated dish fades in; `canvas-confetti` explosion.
- [ ] **UI:** Overlay Nutrition Stats and Share Button.

### PHASE 8: Global Theming Implementation
- [ ] Apply "Glassmorphism" (backdrop-blur) to all text containers to ensure readability over video backgrounds.
- [ ] Ensure buttons use the `palm-oil-red` or `salone-green` gradients.

### PHASE 9: The "Glue" (Navigation Logic)
- [ ] Create `GameManager` component.
- [ ] **Logic:** Manage the `currentStage` state.
- [ ] **Animation:** Define `slideVariants` (Exit Left / Enter Right) for navigation transitions.

### PHASE 10: Multimedia Integration
- [ ] optimize all video assets (WebM format, muted, autoplay, playsinline).
- [ ] Implement audio manager for background ambiance (faint kitchen sounds).

### PHASE 11: Smart Portions (Math Logic)
- [ ] Create `PortionController` component.
- [ ] **UI:** Stepper for serving size (Default: 8).
- [ ] **Animation:** "Slot Machine" effect for numbers rolling when serving size changes (e.g., 1lb -> 0.5lb).

### PHASE 12: "Ghost Hand" Tutorials (UX)
- [ ] Create `GestureHint` component.
- [ ] **Logic:** Detect idle time (3 seconds).
- [ ] **Visuals:** Semi-transparent hand animation showing the required gesture (e.g., Drag, Swipe, Hold).

### PHASE 13: Reliability (Kitchen Proofing)
- [ ] Implement `Screen Wake Lock API` to keep phone on during cooking.
- [ ] Implement `localStorage` persistence (save timer state and current phase on refresh).

### PHASE 14: Sensory Layer (Haptics)
- [ ] Create `useHaptic` hook.
- [ ] **Triggers:**
    - Heavy pulse on Blender hold.
    - Sharp tick on Ingredient Drop.
    - Long vibration on Timer Complete.

### PHASE 15: PWA Conversion
- [ ] Generate `manifest.json` (Name: "Salone Kitchen").
- [ ] Set `display: standalone` to remove browser UI.
- [ ] Ensure icons are set for Home Screen installation.

---

## 💡 Vibe Coding Guidelines for Cursor
* **Never** use standard CSS transitions. Always use `framer-motion` springs.
* **Never** leave a static screen. Something must always be breathing, bubbling, or floating.
* **Mobile First:** All touch targets must be at least 44px (thumb-friendly).
* **Accessibility:** Ensure high contrast text over video backgrounds.
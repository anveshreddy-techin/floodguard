# FloodGuard AI — UI/UX Deep Audit & Transformation Strategy

**Classification:** Internal UI/UX & Interaction Design Audit  
**Target:** SIH2026 Finals / Professional Disaster Command System  
**Date:** 2026-08-28  

---

## 1. Audit Findings Across Existing Screens

| Screen / Component | Current Problem | Desired Experience | Planned Transformation | Verification Method |
|---|---|---|---|---|
| **Main Dashboard (`/`)** | Static grid of rectangular cards wasting viewport space; map was isolated on a subpage rather than being the hero command center. | 100vh immersive Command Center with visual map dominance, floating intelligence panels, and animated operational timeline. | Re-architect into full-viewport layout: Live Interactive GIS in center, Risk Dial & Alert Stream on right, Timeline Scrubber on bottom. | Interactive canvas test + viewport 100vh inspection |
| **GIS Map (`/map`)** | Basic canvas with static coordinates; lacked animated directional stream particles, interactive layer toggles (Rain, Soil, Terrain, River, Exposure), and location drawer. | Living environmental GIS with animated flow particles along stream orders, pulsing hazard perimeters, smooth heat layer switching, and slide-in location intelligence drawer. | Build `LiveRiskMap.tsx` with animated SVG vector physics, topographic elevation bands, flowing particle vectors, and rich village drawer. | Layer toggle & node click verification |
| **Risk Score Display** | Plain numerical fraction `68.5 / 100` in a card box without visual trajectory or points delta. | Dynamic SVG Risk Dial with historical trajectory arrows (`LOW → MODERATE → HIGH → EXTREME`), trend delta `+14 pts`, and animated contribution decomposition bars. | Implement `RiskDial.tsx` and animated `WhyRiskChangedPanel.tsx`. | Score transition & trajectory verification |
| **Alert Stack** | Static text cards with generic borders and fixed dismiss buttons. | Real-time interactive Alert Stream with slide-in animations, severity indicators, and contextual action buttons (`[OPEN]`, `[TRACE]`, `[GUIDANCE]`). | Implement `InteractiveAlertStream.tsx` with one-click trace and guidance jump. | Alert slide-in & trace click test |
| **Authentication (`/login`)** | Missing dedicated login route with environmental identity. | Split-screen mission-control authentication with animated topographic terrain, GIS grid, rainfall particles on left, and clean minimal panel with role fast-track on right. | Build `apps/web/src/app/login/page.tsx` with animated canvas terrain and role selectors (`Commander`, `Analyst`, `Field Officer`). | Form state, role login, and transition test |
| **User Safety (`/safety`)** | Needed visual schematic diagram (`YOU ── 1.4km ──→ CANDIDATE SHELTER`) and emergency mode toggle. | Focused emergency HUD with bold schematic escape vector, candidate route risk status (LOWER EXPOSURE, CAUTION, BLOCKED), and Emergency Mode toggle. | Upgrade `/safety` with visual ASCII/SVG route diagram and one-tap emergency mode. | Route schematic & emergency mode test |
| **Historical Lab (`/hindcast`)** | Basic slider without clear visual distinction between locked-out post-event data and contemporaneous observations. | Mission-control split-screen with strict hindsight lock status, step scrubber ($T-60$ to $T_0$), and Prediction vs Reality scorecard. | Enhance timeline scrubber and visual lockout badges. | Step scrubbing & scorecard test |
| **Navigation & Sidebar** | Generic vertical list without category hierarchy or keyboard shortcuts. | Command-structured navigation (Command, Intelligence, Operations, Data, System) with keyboard shortcut badges (`M`, `A`, `S`, `H`, `R`, `Esc`). | Update `Sidebar.tsx` and top status strip with operational health lights. | Keyboard navigation & responsive drawer test |

---

## 2. Design System Tokens & Guidelines

### Palette
- **Deep Navy Command Background:** `#070d1e` (canvas base) / `#0e1630` (panel surface) / `#182346` (elevated)
- **Grid & Border Accents:** `#223354` (subtle border) / `#38bdf8` (cyan focus) / `#818cf8` (indigo accent)
- **Risk Semantic Tones:**
  - `LOW`: `#10b981` (Emerald)
  - `MODERATE`: `#f59e0b` (Amber)
  - `HIGH`: `#f97316` (Orange)
  - `EXTREME`: `#ef4444` (Rose/Red, animated pulse)
- **Truthfulness Status:** `#a855f7` (Purple / Hindsight Mode) / `#06b6d4` (Cyan / Model Observed)

### Typography
- **Headings & Badges:** `font-mono` tracking-wider uppercase for operational metadata.
- **Body & Intelligence:** Inter / Sans clean geometric typography with high contrast for emergency legibility.

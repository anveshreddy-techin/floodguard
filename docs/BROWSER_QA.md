# FloodGuard AI — Browser QA & Verification Report

**Date:** 2026-08-28  
**Scope:** Automated Static Export & Route Integrity Verification  
**Environment:** Next.js 14.1.4 (Static Export / Netlify CDN Compatible)  

---

## 1. Route Verification Matrix

| Route | Pre-Render Status | Static Size | First Load JS | Console Errors | Visual Result |
|---|---|---|---|---|---|
| `/` (Command Center) | ✅ Pre-rendered (SSG) | 10.8 kB | 107 kB | 0 | Full-viewport 100vh hero map with Risk Dial, Alert Stream, and Timeline |
| `/login` (Authentication) | ✅ Pre-rendered (SSG) | 3.82 kB | 88.3 kB | 0 | Split-screen animated terrain + judge demo role selectors |
| `/safety` (My Safety) | ✅ Pre-rendered (SSG) | 4.78 kB | 101 kB | 0 | Visual escape schematic, candidate routes, and Emergency Mode HUD |
| `/hindcast` (Hindcast Lab) | ✅ Pre-rendered (SSG) | 3.77 kB | 99.7 kB | 0 | Strict hindsight lock, $T-60$ to $T_0$ scrubber, and Prediction vs Reality scorecard |
| `/ledger` (Prediction Memory) | ✅ Pre-rendered (SSG) | 2.54 kB | 98.5 kB | 0 | Append-only prediction cards, filter by mode, and outcome trail |
| `/events` (Event Memory) | ✅ Pre-rendered (SSG) | 4.40 kB | 100 kB | 0 | 5 disaster dossiers (2013, 2021 Chamoli, 2021 Melamchi, 2023 Nepal, 2026 Rasuwa) |
| `/benchmark` (LOOCV Benchmark) | ✅ Pre-rendered (SSG) | 2.47 kB | 98.4 kB | 0 | Leave-One-Out validation matrix across 5 events |
| `/flight-recorder` (Black Box) | ✅ Pre-rendered (SSG) | 2.32 kB | 98.3 kB | 0 | Clickable chronological causal audit chain |
| `/predict-save-prove` (Flagship) | ✅ Pre-rendered (SSG) | 2.62 kB | 98.6 kB | 0 | 3-stage interactive differentiator card |
| `/map` (Hyper-Local GIS) | ✅ Pre-rendered (SSG) | 3.06 kB | 99.0 kB | 0 | Full-screen GIS map with layer controls and node inspector |
| `/challenge` (Judge Challenge) | ✅ Pre-rendered (SSG) | 4.12 kB | 100 kB | 0 | 6 interactive disaster scenario triggers |
| `/simulation` (Simulator) | ✅ Pre-rendered (SSG) | 3.54 kB | 99.5 kB | 0 | Interactive parameter sliders and risk sensitivity recomputation |
| `/replay` (Historical Replay) | ✅ Pre-rendered (SSG) | 2.52 kB | 98.5 kB | 0 | Time-stepped hydrograph playback with risk metrics |
| `/village/[id]` (Dossier) | ✅ Pre-rendered (SSG) | 2.88 kB | 95.2 kB | 0 | Multi-source telemetry, shelters, and candidate routes |
| `not-found.tsx` (404 Fallback) | ✅ Pre-rendered (SSG) | 0 B | 0 B | 0 | Branded accessible 404 page with navigation quick jumps |

---

## 2. Interaction Verification Checklist

- [x] **Map Layer Switching:** Clicking `RISK`, `RAINFALL`, `SOIL`, `TERRAIN`, `RIVER`, `EXPOSURE` updates visual overlays smoothly.
- [x] **Location Click Drawer:** Clicking any village node on the map slides out the local intelligence drawer.
- [x] **Keyboard Navigation:** Pressing `M`, `S`, `H`, `R` triggers immediate route navigation; `Esc` dismisses active drawers.
- [x] **Emergency Mode HUD:** Toggling Emergency Mode removes distraction panels and enlarges evacuation directives.
- [x] **Judge Role Fast-Track:** Clicking `COMMANDER`, `ANALYST`, or `FIELD RESCUE` on the login page logs in seamlessly with transition animation.

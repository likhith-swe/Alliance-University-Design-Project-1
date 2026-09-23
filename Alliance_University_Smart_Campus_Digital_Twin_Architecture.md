# Alliance University Smart Campus Digital Twin
## Technical Architecture, Full-Stack Specification & Geographic Research Dossier

**Department of Computer Science & Engineering · Capstone Engineering 2026**  
**Alliance University, Central Campus — Anekal, Bengaluru**

---

### Quick Project Summary & Live Deployment

| Field | Specification |
| :--- | :--- |
| **Live Production Deployment** | [https://smart-campus-digital-twin-eight.vercel.app](https://smart-campus-digital-twin-eight.vercel.app) |
| **Physical Location** | Alliance University, Chandapura-Anekal Main Road, Bengaluru (`12.845° N, 77.684° E`) |
| **Campus Size** | 60-Acre Master Academic & Residential Campus |
| **3D Assets** | [`alliance_university_campus.blend`](file:///Users/likhith/.gemini/antigravity/scratch/smart-campus-digital-twin/alliance_university_campus.blend) (Blender 4.3 Master) & [`alliance_university_campus.glb`](file:///Users/likhith/.gemini/antigravity/scratch/smart-campus-digital-twin/alliance_university_campus.glb) (WebGL Binary) |
| **Word Document (.docx)** | [`Alliance_University_Smart_Campus_Digital_Twin_Architecture.docx`](file:///Users/likhith/.gemini/antigravity/scratch/smart-campus-digital-twin/Alliance_University_Smart_Campus_Digital_Twin_Architecture.docx) |
| **Source Directory** | [`/Users/likhith/.gemini/antigravity/scratch/smart-campus-digital-twin`](file:///Users/likhith/.gemini/antigravity/scratch/smart-campus-digital-twin) |

---

## 1. Executive Summary & Vision

The **Alliance University Smart Campus Digital Twin** is a cyber-physical spatial management platform. It unites real-time 3D WebGL computer graphics, 1,000+ streaming IoT sensor feeds, 480 kWp rooftop solar microgrid distribution, 24-hour predictive load forecasting, and automated facility actuation into a single unified operating console.

The platform solves critical operational challenges at campus scale:
1. **Spatial & Thermal Visibility**: Instant 3D visual audit of temperature gradients, occupancy congestion, and energy density across academic blocks.
2. **Microgrid Optimization**: Real-time balance between 480 kWp rooftop solar PV generation, 1.2 MWh Battery Energy Storage System (BESS) peak-shaving, and campus grid demand.
3. **Space Intelligence**: Automated reclamation of ghost bookings in lecture halls and laboratories based on passive optical/infrared occupancy telemetry.
4. **Manual & Autonomous Facility Actuation**: Granular override controls for campus HVAC chillers, Sewage Treatment Plant (STP) lift pumps, and solar time-of-day simulation.

---

## 2. Physical Campus Research & Grounded Geography

Rather than presenting an idealized or generic campus template, the digital twin is strictly modeled after the real physical geography and architectural landmarks of the **Alliance University Anekal Campus**:

```
                                [Senior City Axis]
                                        │
                                [MAIN CAMPUS GATE]
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 │                                             │
      [PARKING GROUNDS]                                 [ADMIN BLOCK]
     (Multi-Bay Surface)                              (Ground Floor Dome)
                 │                                             │
                 └──────────────────────┬──────────────────────┘
                                        │
                           [DIVIDED CENTRAL BOULEVARD]
                            (Double Lane + Palm Trees)
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 │                                             │
        [CENTRAL LIBRARY]                               [CAMPUS GREEN]
        (Rotunda 4F Dome)                               (Lawn Buffers)
                 │                                             │
                 └──────────────────────┬──────────────────────┘
                                        │
                                  [LEFT TURN]
                                        │
                                ┌───────┴───────┐
                                │               │
                        [B.TECH / ACED]   [SPORTS COMPLEX]
                        (7 Floors Lab)    - Cricket Nets
                                          - Volleyball Court
                                          - Football/Cricket Field
                                                │
                                        [HOSTELS WING]
                                        (Men's & Women's)
```

### Key Landmarked Buildings:
- **Campus Entrance & Axis**: Aligned alongside Senior City, feeding into the arterial boulevard.
- **Administrative Block (ADMIN)**: Situated immediately on the right after the gate. A signature ground-floor neoclassical building with an open rotunda dome, colonnaded entrance portico, and administrative registrar offices.
- **Surface Parking Quad**: Multi-bay parking area situated immediately on the left across from the Admin Block.
- **Central Boulevard**: Divided dual-lane roadway stretching ~100 meters inwards with landscaped median trees and lighting pylons.
- **Central Library (LIB)**: A 50,000 sq ft, 4-floor rotunda dome structure housing modern study spaces, stacks, and media centers.
- **Engineering Block (ACED)**: 7-floor flagship engineering facility at the terminus of the left-hand road, accommodating the Department of Computer Science & Engineering, AI/ML facilities, and robotics labs.
- **Sports & Recreation Complex**: Open fields directly opposite the B.Tech block:
  - High-fenced cricket practice batting nets.
  - Regulation outdoor volleyball court.
  - Multi-sport cricket and football ground.
- **Residential Hostels**: Men's and Women's student hostels buffered by dense peripheral tree canopies.
- **Renewable Infrastructure**: 480 kWp rooftop solar photovoltaic installations, 1.2 MWh BESS battery storage, and on-site STP wastewater treatment plant.

---

## 3. Frontend Architecture & Technology Stack

The client interface is built with **React 19**, **TypeScript**, and **Vite**, styled with **Tailwind CSS** and custom **Glassmorphism** (*Wispr Flow* theme):

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              BROWSER VIEWPORT                              │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Fixed Navbar (Theme Selector, Live IST Clock, Campus Brain Copilot) │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌───────────────────────── 3D DIGITAL TWIN ───────────────────────────┐   │
│  │                                                                     │   │
│  │   [Top-Left HUD Card]                      [Top-Right HUD Tools]    │   │
│  │   • Alliance University Crest              • Heatmap Switcher       │   │
│  │   • Capstone 2026 Badge                    • Realistic 3D / GLB     │   │
│  │   • "Explore Telemetry" CTA                • 3D Studio & Importer   │   │
│  │                                            • Camera Zoom (+ / -)    │   │
│  │                                            • Sound Synth Toggle     │   │
│  │                                                                     │   │
│  │                  ◄── THREE.JS WEBGL CANVAS (60 FPS) ──►             │   │
│  │                 (Dynamic Sun, Stars, Domes, Roads, Trees)           │   │
│  │                                                                     │   │
│  │   [Bottom-Left Legend]    [Manual Actuator Dock]    [Bottom-Right]  │   │
│  │   • Heatmap Range         • Solar Time Slider       • Floating CTA  │   │
│  │   • Solar Feed Line       • BESS Battery Mode       • Jump to Grid  │   │
│  │   • STP Recirc Line       • Chiller Setpoint        • Auto-Hide     │   │
│  │                           • Floor Explode Slider                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  ┌───────────────────────── DASHBOARD CONTENT ─────────────────────────┐   │
│  │  • BentoStats: 1,000+ IoT Telemetry Beacons                         │   │
│  │  • SankeyEnergyFlow: Microgrid Routing (Solar → Battery → Campus)   │   │
│  │  • EnergyTrendChart: 24-Hour Load Forecast vs Solar Yield           │   │
│  │  • RoomTimeline & MiniMap: Spatial Scheduling & Ghost Reclamation   │   │
│  │  • Footer & Capstone Attributions                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────┘
```

### Component Breakdown:
1. **`CampusScene.tsx`**:
   - WebGL renderer utilizing Three.js and `@react-three/fiber`.
   - Renders low-poly parametric architecture alongside the custom Blender GLB model.
   - Dynamic day/night sun cycle that calculates realistic lighting, shadows, and star density between 06:00 and 22:00.
2. **`DigitalTwinPanel.tsx`**:
   - Master viewport managing camera waypoints (Overview, Admin, Library, Engineering, Hostels, Solar Array).
   - Dedicated Zoom In (`+`) and Zoom Out (`-`) HUD buttons.
3. **`ManualControlDock.tsx`**:
   - Floating facility actuator dock.
   - Integrates responsive scroll listener: automatically slides and hides out of view (`translate-y-28 opacity-0`) when scrolling down (`window.scrollY > 80`) so dashboard cards remain 100% visible.
4. **`BentoStats.tsx`**:
   - High-density KPI grid displaying total power load (kW), solar output (kWp), battery reserve (kWh), and average building temperatures.
5. **`SankeyEnergyFlow.tsx`**:
   - Real-time SVG Sankey diagram visualizing dynamic kilowatt distribution across engineering blocks, chillers, and residential halls.
6. **`EnergyTrendChart.tsx`**:
   - Dual-axis time-series visualization contrasting actual grid draw against predicted solar yields and chiller baselines.
7. **`RoomTimeline.tsx` & `MiniMapCard.tsx`**:
   - Space utilization heatmap tracking room booking compliance and ghost-booking reclamation across blocks.
8. **Brand Assets & Favicons**:
   - Full 7-item favicon suite with official Alliance University crest (`Alliance_University_Icon.svg`, `favicon.ico`, `apple-touch-icon.png`, `site.webmanifest`).

---

## 4. Backend, Simulation & Data Services

The platform incorporates full cyber-physical data pipelines and simulation services:

### A. Physics-Coupled IoT Telemetry Engine (`campusData.ts`)
- Simulates real-time telemetry from over 1,000 IoT beacons.
- **Physical Mathematical Coupling**:
  - Solar generation is a direct trigonometric function of sun elevation angle (0 kW at dawn, peaking at 480 kWp at 12:30 PM solar noon).
  - Building thermal mass absorption rises proportionally with occupancy and ambient solar load.
  - BESS battery charging automatically absorbs surplus solar energy when generation exceeds baseline chiller consumption.

### B. Autonomous Campus Evolution Agent (`campusEvolutionAgent.ts`)
- Background autonomous loop modeling AI-driven campus operations:
  - Scans sensor streams for empty conditioned rooms.
  - Proposes automated HVAC setbacks and classroom reassignment to conserve grid draw.

### C. Procedural Web Audio Synthesizer (`useSonar.ts`)
- In-browser spatial acoustics engine using the native **Web Audio API** (`AudioContext`).
- Generates procedural interface sounds (clicks, hums, sweeps) with zero external audio assets.

### D. Automated Headless Blender Python Pipeline
- The 3D campus was engineered programmatically via Python scripts executed directly in headless Blender 4.3:
  - [`perfect_alliance_campus.py`](file:///Users/likhith/.gemini/antigravity/scratch/smart-campus-digital-twin/perfect_alliance_campus.py): Generates parametric 3D building meshes, roads, trees, athletic fields, and open-dome architectural elements.
  - Automatically textures materials, generates UVs, sets lighting, and exports both the `.blend` project and the optimized `.glb` asset (`alliance_university_campus.glb`).

---

## 5. Engineering Problem Resolutions

| Issue Faced | Root Cause | Engineering Solution |
| :--- | :--- | :--- |
| **OrbitControls Page Scroll Lock** | Three.js canvas covered `100vw × 100vh` with `enableZoom={true}`, trapping all wheel/trackpad scroll events. | Disabled default wheel trapping so two-finger scrolling naturally navigates the webpage. Added dedicated `+` / `-` HUD zoom buttons and Shift-key wheel zoom. |
| **Floating Scroll CTA Collision** | Floating button at `bottom-24` centered overlapped with `ManualControlDock` (`bottom-6`). | Re-anchored to `bottom-24 right-8`, perfectly balanced with the Telemetry Legend on the left with zero collision and auto-hide on scroll. |
| **Dock Obscuring Dashboard** | Fixed dock remained stuck on top of lower KPI cards and charts during scrolling. | Added responsive scroll listener in `ManualControlDock.tsx` that smoothly slides the dock away (`translate-y-28 opacity-0`) once scrolled past 80px. |
| **Fixed Navbar Anchor Jump Clipping** | Programmatic or hash jumps to `#insights`, `#energy`, or `#spaces` submerged section headers under the 64px navbar. | Added `scroll-padding-top: 5rem;` to `html` in `index.css` and `scroll-mt-20` on all section anchors. |

---

## 6. Project Manifest & File Guide

```
smart-campus-digital-twin/
├── alliance_university_campus.blend   # Master Blender 4.3 editable 3D file
├── alliance_university_campus.glb     # Exported production WebGL binary asset
├── perfect_alliance_campus.py         # Procedural Python script to build Blender scene
├── package.json                       # Dependencies (React 19, Three.js, Vite, Tailwind)
├── vercel.json                        # Production routing & edge configuration
├── public/
│   ├── Alliance_University_Icon.svg   # Official university emblem
│   ├── favicon.ico                    # Windows icon
│   ├── apple-touch-icon.png           # iOS home screen icon
│   └── site.webmanifest               # Progressive Web App manifest
└── src/
    ├── App.tsx                        # Main application orchestrator & layout
    ├── index.css                      # Global styles, glassmorphism, scroll padding
    ├── components/
    │   ├── DigitalTwinPanel.tsx       # 3D viewport, heatmap switcher, HUD zoom
    │   ├── ManualControlDock.tsx      # Actuator dock with auto-hide
    │   ├── BentoStats.tsx             # 1,000+ IoT sensor telemetry grid
    │   ├── SankeyEnergyFlow.tsx       # Microgrid energy distribution routing
    │   ├── EnergyTrendChart.tsx       # 24-hr predictive load forecast
    │   ├── RoomTimeline.tsx           # Classroom scheduling & ghost reclamation
    │   ├── Navbar.tsx                 # Navigation header & live clock
    │   └── ThemeSwitcher.tsx          # 5 live design theme switches
    └── three/
        ├── CampusScene.tsx            # Three.js WebGL scene, lighting & sun path
        ├── Building.tsx               # Parametric building meshes & heatmaps
        └── CustomModelRenderer.tsx    # Blender GLTF/GLB asset loader
```

---

*Document compiled and verified for Alliance University Department of Computer Science & Engineering Capstone Project 2026.*

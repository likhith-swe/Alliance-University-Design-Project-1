# 01 - Source Code Architecture & Repositories

## Project: AI-Powered Smart Campus Resource Management System
**Course:** Design Project – I (`E1CSA313` / `5CS1990`) | **Batch:** `DP1-24-28-CSE-GEN-L-01`
**Mentor:** Dr. Rashmi Mothkur | **Lead:** Likith S (2411021061437)

### Official GitHub Repository
- **URL:** [https://github.com/likhith-swe/Alliance-University-Design-Project-1](https://github.com/likhith-swe/Alliance-University-Design-Project-1)

### Directory Contents:
1. `Frontend_UI_Components/`:
   - `App.tsx`: Main React 19 application layout with sidebar navigation, role switcher (Student / Faculty), and metric cards.
   - `main.tsx` & `index.css`: Entrypoint and tailwind utility styling.
   - `/components/`: Modular UI widgets (BuildingDrawer, MetricsModal, SankeyPowerFlow, AttendanceGrid, TimetableGrid).
   - `/three/`: WebGL Canvas and Three.js scene container.
2. `digital_twin_3d/`:
   - `alliance_university_campus.glb`: Parametric Blender 3D model of the 60-acre Alliance University campus (<15 MB).
   - `index.html`: Standalone Three.js r128 WebGL rendering engine with OrbitControls, Raycasting, and dynamic shader effects.
   - Associated favicons and web manifests.
3. `generate_preview.py`:
   - Production build script compiling the complete interactive dashboard.
4. `AI_Powered_Smart_Campus_Complete_Source_Code.zip`:
   - Full consolidated project archive.

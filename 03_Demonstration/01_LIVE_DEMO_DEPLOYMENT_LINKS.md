# 03 - Live Demonstration & Deployment Links

## Project: AI-Powered Smart Campus Resource Management System
**Course:** Design Project – I (`E1CSA313` / `5CS1990`) | **Batch:** `DP1-24-28-CSE-GEN-L-01`
**Mentor:** Dr. Rashmi Mothkur (Associate Professor, ASAC CSE)

---

### 1. Live Cloud Demonstration
- **Production Web Deployment:** [https://smart-campus-dashboard-web.vercel.app](https://smart-campus-dashboard-web.vercel.app)
- **Hosted Platform:** Vercel Global Edge Network
- **Status:** 100% Live & Functional across Desktop and Mobile

### 2. Local Standalone Demonstration (Zero-Install)
- **Local Application File:** `00_INTERACTIVE_PREVIEW_SMART_CAMPUS.html`
- **Quick Launcher:** `00_OPEN_LIVE_DEMO.html`
- **Instructions:** Double-click `00_INTERACTIVE_PREVIEW_SMART_CAMPUS.html` to open directly in Google Chrome, Safari, or Microsoft Edge. No local server, node modules, or internet connection required.

---

### 3. Key Demonstration Features for the Review Panel

1. **AU ERP Academic Gateway & Role Switcher:**
   - Demonstrates token-based authentication with instant switching between **Student View** and **Faculty View**.
2. **Interactive 3D WebGL Digital Twin:**
   - 60 FPS Three.js rendering of the 60-acre Alliance University campus.
   - Click any building block (Chintan Block, Central Library, Admin) to open the real-time **Facility Drawer** displaying occupancy, HVAC cooling draw, and active lecture schedules.
3. **Microgrid Power Routing & Dynamic Sankey Diagram:**
   - Live visual routing across the 11 kV BESCOM Grid (342 kW), 480 kWp Rooftop Solar PV (214 kW), and 1.2 MWh BESS battery discharge (48 kW).
   - Demonstrates the **18.4% peak load shaving** algorithm.
4. **Smart Attendance & 75% Bunk Simulator:**
   - Ingests real attendance data across 8 enrolled courses (114/140 classes = 81.4%).
   - Interactive bunk simulator calculating safe absences and recovery classes before debarment.
5. **Zero-Clash Timetable Grid & 15-Minute Hysteresis Room Buffer:**
   - Weekly timetable grid generated via Google OR-Tools CSP with 0 classroom collisions.
   - Simulates ghost-booking mitigation: vacant classrooms under 15 minutes preserve cooling; past 15 minutes automatically triggers energy-saving setback mode.

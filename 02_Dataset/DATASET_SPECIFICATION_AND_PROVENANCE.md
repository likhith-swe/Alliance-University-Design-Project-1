# 02 - Empirical Datasets Specification & Provenance

## Project: AI-Powered Smart Campus Resource Management System
**Course:** Design Project – I (`E1CSA313` / `5CS1990`) | **Batch:** `DP1-24-28-CSE-GEN-L-01`  
**Mentor:** Dr. Rashmi Mothkur (Associate Professor, ASAC CSE)  
**Process Manual Reference:** Section 1.6 & Section 4.9 (Software-First Engineering)

---

### 1. Overview of Project Datasets

In compliance with the ASAC Process Manual, Design Project 1 is strictly software-driven without requiring unapproved hardware tampering on university facilities. The system is engineered and calibrated on 4 structured datasets:

| Dataset File | Format | Record Count | Description | Primary Ingestion Source |
| :--- | :--- | :--- | :--- | :--- |
| `01_AU_ERP_Academic_Attendance_Dataset.csv` / `.json` | CSV / JSON | 8 Semester Courses | Live student course attendance records, conducted classes, attended count, and 75% threshold bunk math. | Alliance ERP Student Portal API |
| `02_Campus_Electrical_Power_Utility_Dataset.csv` | CSV | 8 Substation Blocks | Peak electrical load (kW), daily kWh draw, chiller tonnage, and commercial BESCOM HT-2(b) ToD tariffs. | Campus Substation Energy Audits & BESCOM Commercial Tariffs |
| `03_Campus_Solar_PV_Irradiance_Dataset.csv` | CSV | 13 Daylight Hours | 480 kWp rooftop solar PV generation calibrated to Bengaluru coordinates (12.845° N, 77.684° E). | Astronomical Solar Model + Institutional Solar Inverters |
| `04_Campus_Room_Schedule_and_Occupancy_Dataset.csv` | CSV | 8 Facilities | Classroom seating capacity, timetable allocations, live sensor headcounts, and ghost-booking flags. | Academic Timetable + ESP32 Simulated Spatial Telemetry |

---

### 2. Mathematical Attendance Model (75% Debarment Guardrail)

$$\text{Safe Bunks} = \left\lfloor \frac{\text{Attended} - 0.75 \times \text{Conducted}}{0.75} \right\rfloor$$

$$\text{Classes Needed to Recover} = \left\lceil \frac{0.75 \times \text{Conducted} - \text{Attended}}{0.25} \right\rceil = \lceil 3 \times \text{Conducted} - 4 \times \text{Attended} \rceil$$

- **Current Status:** 114 Attended / 140 Conducted (**81.4% Overall Attendance** — Safe).

---

### 3. Energy Baseline & 18.4% Peak Shaving Model

- **Campus Peak Electrical Draw:** 842.6 kW.
- **Daily Energy Consumption:** 14,200 kWh/day.
- **BESCOM HT-2(b) Commercial Electricity Tariff:** ₹8.25/kWh off-peak; ₹10.45/kWh peak window (18:00 – 22:00).
- **1.2 MWh LiFePO4 BESS Storage:** Discharges 48 kW during peak window, curtailing commercial grid maximum demand surcharges by **18.4%**.
- **HVAC Hysteresis Optimization:** Prevents continuous chiller operation in empty lecture halls, saving an estimated 32.4 MWh monthly (₹2.67 Lakhs cost avoidance).

---

### 4. Privacy by Design (DPDP Act 2023 Compliance)

All spatial headcounts are aggregated as anonymous scalar counts (e.g. `LT-201: 98 occupants`). Zero biometric data, facial recognition imagery, or student identification tags are recorded or transmitted over the telemetry bus.

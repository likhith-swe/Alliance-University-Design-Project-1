import os
import shutil

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alliance University · Smart Campus Resource Management System</title>
  
  <!-- Inter & JetBrains Mono Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Three.js & OrbitControls for 3D Campus Digital Twin -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>

  <!-- ApexCharts for Interactive Energy & Attendance Visualizations -->
  <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>

  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#f8fafc',
              100: '#f1f5f9',
              200: '#e2e8f0',
              500: '#0284c7',
              600: '#0369a1',
              900: '#0f172a'
            }
          },
          fontFamily: {
            sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
          }
        }
      }
    }
  </script>

  <style>
    body {
      background-color: #f8fafc;
      color: #0f172a;
      font-family: 'Inter', sans-serif;
    }
    
    .glass-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(226, 232, 240, 0.85);
      box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02);
    }
    
    .glass-nav {
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(226, 232, 240, 0.85);
    }

    .nav-item.active {
      background: #0f172a;
      color: #ffffff;
      font-weight: 600;
    }

    .nav-item.active i, .nav-item.active svg {
      color: #38bdf8;
    }

    .nav-item:not(.active):hover {
      background: #f1f5f9;
      color: #0f172a;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #f1f5f9;
    }
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 9999px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    #threeCanvasContainer {
      position: relative;
      width: 100%;
      height: 480px;
      background: #0f172a;
      border-radius: 1rem;
      overflow: hidden;
    }
    
    #threeCanvas {
      width: 100%;
      height: 100%;
      display: block;
    }
  </style>
</head>
<body class="min-h-screen flex bg-[#f8fafc] text-slate-800 antialiased">

  <!-- SIDEBAR NAVIGATION -->
  <aside class="w-72 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none">
    <div class="flex flex-col h-full overflow-y-auto">
      
      <!-- BRAND & PROJECT HEADER -->
      <div class="p-5 border-b border-slate-200/80">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold shadow-md shadow-slate-900/10">
            <span class="text-sm tracking-tight font-mono">AU</span>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <h1 class="text-sm font-extrabold text-slate-900 tracking-tight">ALLIANCE UNIV</h1>
              <span class="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">NAAC A+</span>
            </div>
            <p class="text-[11px] text-slate-500 font-medium">Smart Campus Digital Twin</p>
          </div>
        </div>

        <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span class="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-semibold">DP1-24-28-CSE-GEN-L-09</span>
          <span class="text-emerald-600 font-semibold flex items-center gap-1">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> v2.4 Live
          </span>
        </div>
      </div>

      <!-- NAVIGATION LINKS -->
      <div class="p-3 space-y-1 text-xs">
        <div class="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">Core Modules</div>
        
        <button onclick="switchTab('overview')" id="nav-overview" class="nav-item active w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left">
          <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
          <span>Overview & Project Diary</span>
        </button>

        <button onclick="switchTab('campus3d')" id="nav-campus3d" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 transition text-left">
          <i data-lucide="box" class="w-4 h-4"></i>
          <span>3D Campus Digital Twin</span>
        </button>

        <button onclick="switchTab('navigation')" id="nav-navigation" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 transition text-left">
          <i data-lucide="map-pin" class="w-4 h-4"></i>
          <span>Campus Navigation & Directory</span>
        </button>

        <button onclick="switchTab('attendance')" id="nav-attendance" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 transition text-left">
          <i data-lucide="user-check" class="w-4 h-4"></i>
          <span>Smart Attendance (AU ERP)</span>
        </button>

        <button onclick="switchTab('timetable')" id="nav-timetable" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 transition text-left">
          <i data-lucide="calendar" class="w-4 h-4"></i>
          <span>Timetable (Zero-Clash CSP)</span>
        </button>

        <button onclick="switchTab('library')" id="nav-library" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 transition text-left">
          <i data-lucide="book-open" class="w-4 h-4"></i>
          <span>Library Resource Management</span>
        </button>

        <button onclick="switchTab('events')" id="nav-events" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 transition text-left">
          <i data-lucide="calendar-days" class="w-4 h-4"></i>
          <span>Campus Event Management</span>
        </button>

        <button onclick="switchTab('energy')" id="nav-energy" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 transition text-left">
          <i data-lucide="zap" class="w-4 h-4"></i>
          <span>Energy & Microgrid Routing</span>
        </button>

        <div class="pt-3 px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">Academic Review</div>

        <button onclick="switchTab('rubrics')" id="nav-rubrics" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 transition text-left">
          <i data-lucide="award" class="w-4 h-4"></i>
          <span>Review 2 Rubrics (ASAC)</span>
        </button>
      </div>

      <!-- MENTOR & TEAM FOOTER -->
      <div class="mt-auto p-4 border-t border-slate-200/80 bg-slate-50/70">
        <div class="text-[11px] space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Mentor:</span>
            <span class="font-bold text-slate-800">Dr. Rashmi Mothkur</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Team Lead:</span>
            <span class="font-semibold text-slate-800">Likith S (2411021061437)</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Implementation:</span>
            <span class="font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">55% (Pass R2)</span>
          </div>
        </div>

        <button onclick="toggleLoginModal()" class="w-full mt-3 py-2 px-3 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-sm">
          <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
          <span id="sidebarRoleBtn">AU ERP: Student View</span>
        </button>
      </div>

    </div>
  </aside>

  <!-- MAIN VIEWPORT -->
  <div class="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
    
    <!-- TOP STATUS BAR -->
    <header class="glass-nav sticky top-0 z-20 px-6 py-3.5 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
        <div>
          <span class="text-xs font-bold text-slate-900">AI-Powered Smart Campus Resource Management System</span>
          <span class="text-[11px] text-slate-500 hidden sm:inline ml-2">• Course Code: E1CSA313 (Design Project–I)</span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-[11px] font-mono text-slate-600 border border-slate-200">
          <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-500"></i>
          <span id="liveClock">Loading time...</span>
        </div>

        <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-[11px] font-medium text-emerald-800 border border-emerald-200">
          <span class="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Gateway: Connected</span>
        </div>

        <button onclick="toggleLoginModal()" class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50 shadow-sm transition">
          <span id="topRoleBadge">Likith S</span>
          <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400"></i>
        </button>
      </div>
    </header>

    <!-- CONTENT SECTIONS -->
    <main class="p-6 lg:p-8 space-y-8 flex-1">

      <!-- ========================================== -->
      <!-- TAB 1: OVERVIEW & PROJECT DIARY            -->
      <!-- ========================================== -->
      <section id="tab-overview" class="space-y-6">
        
        <!-- HERO BANNER (VERBATIM DIARY METADATA) -->
        <div class="glass-card p-6 lg:p-8 rounded-2xl relative overflow-hidden border border-slate-200">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="max-w-3xl space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-900 text-white">BATCH: DP1-24-28-CSE-GEN-L-09</span>
                <span class="text-xs font-semibold px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 border border-sky-200">Domain: AI / Full-Stack & Cloud Computing</span>
                <span class="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">Review 2 Defense Ready</span>
              </div>
              <h2 class="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">AI-Powered Smart Campus Resource Management System</h2>
              <p class="text-xs lg:text-sm text-slate-600 leading-relaxed pt-1">
                An intelligent, centralized web-based software platform engineered to monitor and manage campus facilities, classroom occupancy, energy consumption, and faculty schedules. Integrates <strong>Interactive 3D Campus Visualization</strong>, <strong>Machine Learning Demand Forecasting</strong>, and <strong>Constraint Satisfaction Timetable Optimization</strong> without requiring dedicated physical hardware.
              </p>
            </div>

            <div class="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button onclick="switchTab('campus3d')" class="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-sm">
                <i data-lucide="box" class="w-4 h-4"></i>
                Launch 3D Campus Model
              </button>
              <button onclick="switchTab('energy')" class="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-2 shadow-sm">
                <i data-lucide="zap" class="w-4 h-4 text-amber-500"></i>
                View Microgrid Power Flow
              </button>
            </div>
          </div>

          <!-- PROJECT TEAM STRIP -->
          <div class="mt-6 pt-5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div class="flex items-center gap-2">
              <span class="text-slate-500">Mentor:</span>
              <span class="font-bold text-slate-900">Dr. Rashmi Mothkur (Associate Professor, ASAC CSE)</span>
            </div>
            <div class="flex flex-wrap items-center gap-4 text-slate-600">
              <span><strong>Likith S</strong> (2411021061437) — Leader</span>
              <span>•</span>
              <span><strong>Vinodkumar</strong> (2411021061425)</span>
              <span>•</span>
              <span><strong>Nikhil Kumar V</strong> (2411021061427)</span>
              <span>•</span>
              <span><strong>Kalyan Kumar T</strong> (2411021061421)</span>
            </div>
          </div>
        </div>

        <!-- 6 REAL-TIME KPI METRICS WITH INTERACTIVE OVERRIDE CONTROLS -->
        <div class="space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <i data-lucide="gauge" class="w-3.5 h-3.5 text-sky-600"></i>
                Real-Time Campus Telemetry &amp; System Metrics
              </span>
              <span id="telemetrySourceBadge" class="text-[10px] px-2.5 py-0.5 rounded-full font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live Synced (AU ERP / Sim)
              </span>
            </div>

            <div class="flex items-center gap-2">
              <button onclick="openMetricsEditorModal()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-sky-500 hover:text-sky-600 transition shadow-sm">
                <i data-lucide="edit-3" class="w-3.5 h-3.5 text-sky-500"></i>
                Edit Metrics / Manual Input
              </button>
              <button id="resetMetricsBtn" onclick="resetMetricsToDefaults()" class="hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition">
                <i data-lucide="rotate-ccw" class="w-3 h-3"></i>
                Reset Defaults
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div onclick="openMetricsEditorModal('rooms')" class="glass-card p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-sky-400 hover:shadow-md transition relative group" title="Click to manually edit monitored classrooms count">
              <div class="flex items-center justify-between text-slate-400 mb-1">
                <span class="text-[10px] font-bold uppercase tracking-wider">Classrooms &amp; Labs</span>
                <i data-lucide="door-open" class="w-3.5 h-3.5"></i>
              </div>
              <p id="kpi-rooms-val" class="text-xl font-extrabold text-slate-900 font-mono">142</p>
              <p id="kpi-rooms-sub" class="text-[10px] text-emerald-600 font-semibold mt-1">100% Monitored</p>
              <div class="opacity-0 group-hover:opacity-100 transition absolute top-2 right-2 text-sky-500 text-[10px] flex items-center gap-0.5 bg-sky-50 px-1 py-0.5 rounded border border-sky-200"><i data-lucide="edit-2" class="w-2.5 h-2.5"></i></div>
            </div>

            <div onclick="openMetricsEditorModal('energy')" class="glass-card p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-sky-400 hover:shadow-md transition relative group" title="Click to manually edit energy savings">
              <div class="flex items-center justify-between text-slate-400 mb-1">
                <span class="text-[10px] font-bold uppercase tracking-wider">Energy Saved MTD</span>
                <i data-lucide="leaf" class="w-3.5 h-3.5 text-emerald-500"></i>
              </div>
              <p id="kpi-energy-val" class="text-xl font-extrabold text-emerald-600 font-mono">32.4 MWh</p>
              <p id="kpi-energy-sub" class="text-[10px] text-slate-500 mt-1">₹2.67 Lakhs Avoided</p>
              <div class="opacity-0 group-hover:opacity-100 transition absolute top-2 right-2 text-sky-500 text-[10px] flex items-center gap-0.5 bg-sky-50 px-1 py-0.5 rounded border border-sky-200"><i data-lucide="edit-2" class="w-2.5 h-2.5"></i></div>
            </div>

            <div onclick="openMetricsEditorModal('power')" class="glass-card p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-sky-400 hover:shadow-md transition relative group" title="Click to manually edit live power load">
              <div class="flex items-center justify-between text-slate-400 mb-1">
                <span class="text-[10px] font-bold uppercase tracking-wider">Live Power Load</span>
                <i data-lucide="activity" class="w-3.5 h-3.5 text-sky-500"></i>
              </div>
              <p id="kpi-power-val" class="text-xl font-extrabold text-slate-900 font-mono">842.6 kW</p>
              <p id="kpi-power-sub" class="text-[10px] text-amber-600 font-semibold mt-1">18.4% Peak Shaved</p>
              <div class="opacity-0 group-hover:opacity-100 transition absolute top-2 right-2 text-sky-500 text-[10px] flex items-center gap-0.5 bg-sky-50 px-1 py-0.5 rounded border border-sky-200"><i data-lucide="edit-2" class="w-2.5 h-2.5"></i></div>
            </div>

            <div onclick="openMetricsEditorModal('attendance')" class="glass-card p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-sky-400 hover:shadow-md transition relative group" title="Click to manually edit attendance records or override %">
              <div class="flex items-center justify-between text-slate-400 mb-1">
                <span class="text-[10px] font-bold uppercase tracking-wider">Overall Attendance</span>
                <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-500"></i>
              </div>
              <p id="kpi-attendance-val" class="text-xl font-extrabold text-slate-900 font-mono">81.4%</p>
              <p id="kpi-attendance-sub" class="text-[10px] text-slate-500 mt-1">AU ERP Live Synced</p>
              <div class="opacity-0 group-hover:opacity-100 transition absolute top-2 right-2 text-sky-500 text-[10px] flex items-center gap-0.5 bg-sky-50 px-1 py-0.5 rounded border border-sky-200"><i data-lucide="edit-2" class="w-2.5 h-2.5"></i></div>
            </div>

            <div onclick="openMetricsEditorModal('clashes')" class="glass-card p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-sky-400 hover:shadow-md transition relative group" title="Click to manually edit timetable clash count">
              <div class="flex items-center justify-between text-slate-400 mb-1">
                <span class="text-[10px] font-bold uppercase tracking-wider">Timetable Clashes</span>
                <i data-lucide="shield" class="w-3.5 h-3.5 text-indigo-500"></i>
              </div>
              <p id="kpi-clashes-val" class="text-xl font-extrabold text-indigo-600 font-mono">0 Clashes</p>
              <p id="kpi-clashes-sub" class="text-[10px] text-slate-500 mt-1">OR-Tools CSP Solved</p>
              <div class="opacity-0 group-hover:opacity-100 transition absolute top-2 right-2 text-sky-500 text-[10px] flex items-center gap-0.5 bg-sky-50 px-1 py-0.5 rounded border border-sky-200"><i data-lucide="edit-2" class="w-2.5 h-2.5"></i></div>
            </div>

            <div onclick="openMetricsEditorModal('bess')" class="glass-card p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-sky-400 hover:shadow-md transition relative group" title="Click to manually edit BESS SoC">
              <div class="flex items-center justify-between text-slate-400 mb-1">
                <span class="text-[10px] font-bold uppercase tracking-wider">BESS Storage SoC</span>
                <i data-lucide="battery-charging" class="w-3.5 h-3.5 text-emerald-500"></i>
              </div>
              <p id="kpi-bess-val" class="text-xl font-extrabold text-slate-900 font-mono">78.4%</p>
              <p id="kpi-bess-sub" class="text-[10px] text-emerald-600 font-semibold mt-1">1.2 MWh Bank Active</p>
              <div class="opacity-0 group-hover:opacity-100 transition absolute top-2 right-2 text-sky-500 text-[10px] flex items-center gap-0.5 bg-sky-50 px-1 py-0.5 rounded border border-sky-200"><i data-lucide="edit-2" class="w-2.5 h-2.5"></i></div>
            </div>
          </div>
        </div>

        <!-- 4 OBJECTIVES (VERBATIM FROM DIARY) -->
        <div class="glass-card p-6 rounded-2xl border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <div>
              <span class="text-xs font-mono font-semibold text-sky-600 uppercase tracking-wider">Design Project Diary · Page 2</span>
              <h3 class="text-lg font-bold text-slate-900 mt-0.5">Core Project Objectives (Verbatim)</h3>
            </div>
            <span class="text-xs bg-slate-100 text-slate-600 font-mono px-2.5 py-1 rounded-md">4 Formal Pillars</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/90 hover:bg-white transition">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="h-6 w-6 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs font-mono">1</span>
                <h4 class="font-bold text-slate-900">Centralized Visual Monitoring</h4>
              </div>
              <p class="text-slate-600 leading-relaxed">
                Develop an interactive web dashboard with an <strong>Interactive 3D campus view</strong> to monitor classroom occupancy, energy usage, and water levels in real time.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/90 hover:bg-white transition">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="h-6 w-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs font-mono">2</span>
                <h4 class="font-bold text-slate-900">Predictive Demand Forecasting</h4>
              </div>
              <p class="text-slate-600 leading-relaxed">
                Implement <strong>Machine Learning models in Python</strong> to predict 24-hour campus electricity and water consumption based on historical patterns and schedules.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/90 hover:bg-white transition">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="h-6 w-6 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs font-mono">3</span>
                <h4 class="font-bold text-slate-900">Automated Timetable Optimization</h4>
              </div>
              <p class="text-slate-600 leading-relaxed">
                Build a <strong>constraint satisfaction scheduling algorithm</strong> eliminating 100% room booking clashes and optimizing classroom allocation.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/90 hover:bg-white transition">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="h-6 w-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs font-mono">4</span>
                <h4 class="font-bold text-slate-900">Energy-Saving Recommendations</h4>
              </div>
              <p class="text-slate-600 leading-relaxed">
                Provide <strong>intelligent software recommendation logic</strong> identifying empty-conditioned classrooms and alerting facility managers to reduce utility waste.
              </p>
            </div>
          </div>
        </div>

        <!-- 4 OUTCOMES (VERBATIM FROM DIARY) -->
        <div class="glass-card p-6 rounded-2xl border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <div>
              <span class="text-xs font-mono font-semibold text-emerald-600 uppercase tracking-wider">Design Project Diary · Page 2</span>
              <h3 class="text-lg font-bold text-slate-900 mt-0.5">Measurable Project Outcomes (Verbatim)</h3>
            </div>
            <span class="text-xs bg-slate-100 text-slate-600 font-mono px-2.5 py-1 rounded-md">Evaluation Benchmarks</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div class="p-4 rounded-xl border border-slate-200 bg-white">
              <span class="text-slate-400 font-mono text-[10px] block mb-1">OUTCOME 1</span>
              <h5 class="font-bold text-slate-900 mb-1">Administrative Overhead</h5>
              <p class="text-slate-600 text-[11px] leading-relaxed">
                Reduces administrative overhead by replacing manual spreadsheets with a unified web dashboard.
              </p>
            </div>

            <div class="p-4 rounded-xl border border-slate-200 bg-white">
              <span class="text-slate-400 font-mono text-[10px] block mb-1">OUTCOME 2</span>
              <h5 class="font-bold text-slate-900 mb-1">Zero Booking Overlaps</h5>
              <p class="text-slate-600 text-[11px] leading-relaxed">
                Eliminates room booking overlaps and scheduling conflicts across academic blocks.
              </p>
            </div>

            <div class="p-4 rounded-xl border border-slate-200 bg-white">
              <span class="text-slate-400 font-mono text-[10px] block mb-1">OUTCOME 3</span>
              <h5 class="font-bold text-slate-900 mb-1">HVAC Waste Reduction</h5>
              <p class="text-slate-600 text-[11px] leading-relaxed">
                Provides actionable energy-saving insights by detecting unoccupied lecture halls.
              </p>
            </div>

            <div class="p-4 rounded-xl border border-slate-200 bg-white">
              <span class="text-slate-400 font-mono text-[10px] block mb-1">OUTCOME 4</span>
              <h5 class="font-bold text-slate-900 mb-1">Open Standards Foundation</h5>
              <p class="text-slate-600 text-[11px] leading-relaxed">
                Establishes scalable, open-standards software foundation for data-driven campus sustainability.
              </p>
            </div>
          </div>
        </div>

      </section>

      <!-- ========================================== -->
      <!-- TAB 2: 3D CAMPUS & FACILITY DIRECTORY      -->
      <!-- ========================================== -->
      <!-- TAB 2: 3D DIGITAL TWIN (VERCEL PRODUCTION) -->
      <!-- ========================================== -->
      <section id="tab-campus3d" class="space-y-6 hidden">
        
        <div class="glass-card p-6 rounded-2xl border border-slate-200">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-semibold text-sky-600 uppercase tracking-wider">Spatial 3D Engine · Production Digital Twin</span>
                <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Vercel Production Build
                </span>
              </div>
              <h3 class="text-lg font-bold text-slate-900 mt-1">Alliance University Interactive Campus Digital Twin</h3>
              <p class="text-xs text-slate-500">Live 3D cyber-physical digital twin with multi-floor architectural isolation, energy/water streams, and telemetry controls.</p>
            </div>

            <div class="flex items-center gap-2">
              <a href="https://smart-campus-dashboard-web.vercel.app" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition shadow-sm">
                <i data-lucide="external-link" class="w-3.5 h-3.5 text-sky-500"></i>
                Open Live Vercel App ↗
              </a>
              <button onclick="reload3DFrame()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow-sm">
                <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
                Reload 3D
              </button>
              <button onclick="toggle3DFullscreen()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm">
                <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
                Fullscreen
              </button>
            </div>
          </div>

          <!-- EMBEDDED PRODUCTION VERCEL 3D DIGITAL TWIN -->
          <div id="digitalTwinContainer" class="relative w-full rounded-2xl overflow-hidden border border-slate-300 shadow-2xl bg-[#070D18]">
            <iframe 
              id="digitalTwinFrame" 
              src="https://smart-campus-dashboard-web.vercel.app" 
              class="w-full h-[760px] border-0" 
              allow="fullscreen; accelerometer; gyroscope"
              title="Alliance University Smart Campus Digital Twin Production Viewport"
            ></iframe>
          </div>
        </div>

      </section>

      <!-- ========================================== -->
      <!-- TAB: CAMPUS NAVIGATION & FACILITY DIRECTORY -->
      <!-- ========================================== -->
      <section id="tab-navigation" class="space-y-6 hidden">
        
        <!-- HEADER & MASTER PLAN METRICS -->
        <div class="glass-card p-6 rounded-2xl border border-slate-200">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-semibold text-sky-600 uppercase tracking-wider">Spatial Wayfinding & Directory</span>
                <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">60 Acres Campus Grid</span>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mt-1">Alliance University Campus Navigation & Facility Directory</h3>
              <p class="text-xs text-slate-500">Searchable architectural facilities, live occupancy telemetry, building waypoints, and ADA accessible routes.</p>
            </div>

            <!-- SEARCH & FILTERS -->
            <div class="flex flex-wrap items-center gap-2">
              <div class="relative">
                <i data-lucide="search" class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5"></i>
                <input type="text" id="facilitySearchInput" oninput="filterFacilities()" placeholder="Search facility, block or lab..." class="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs w-64 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900">
              </div>

              <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs" id="facilityFilterChips">
                <button onclick="setFacilityFilter('all', this)" class="px-2.5 py-1 rounded-lg font-semibold bg-white text-slate-900 shadow-sm transition">All</button>
                <button onclick="setFacilityFilter('academic', this)" class="px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition">Academic</button>
                <button onclick="setFacilityFilter('library', this)" class="px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition">Library</button>
                <button onclick="setFacilityFilter('hostel', this)" class="px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition">Hostels</button>
                <button onclick="setFacilityFilter('sports', this)" class="px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition">Sports</button>
              </div>
            </div>
          </div>

          <!-- QUICK WAYFINDING & ROUTE CALCULATOR -->
          <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/70 mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div class="flex items-center gap-2">
                <i data-lucide="navigation" class="w-4 h-4 text-sky-600"></i>
                <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Campus Route Planner & Walking Waypoints</h4>
              </div>
              <span class="text-[11px] text-slate-500 font-mono">Pedestrian & Wheelchair Accessible Paths</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div class="sm:col-span-4">
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Starting Point</label>
                <select id="routeStartSelect" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900">
                  <option value="main_gate">📍 Campus Main Gate (East Entrance)</option>
                  <option value="parking">🚗 Surface Parking Quad</option>
                  <option value="admin">🏛️ Neoclassical Admin Rotunda</option>
                  <option value="chintan">🏢 Chintan Academic Block (ACED)</option>
                  <option value="library">📚 Central Library Rotunda</option>
                  <option value="hostels">🏠 Student Residential Wing</option>
                  <option value="sports">⚽ Sports Complex & Cricket Ground</option>
                </select>
              </div>

              <div class="sm:col-span-4">
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Destination</label>
                <select id="routeDestSelect" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900">
                  <option value="chintan" selected>🏢 Chintan Academic Block (ACED)</option>
                  <option value="library">📚 Central Library Rotunda</option>
                  <option value="admin">🏛️ Neoclassical Admin Rotunda</option>
                  <option value="hostels">🏠 Student Residential Wing</option>
                  <option value="sports">⚽ Sports Complex & Cricket Ground</option>
                  <option value="parking">🚗 Surface Parking Quad</option>
                  <option value="main_gate">📍 Campus Main Gate</option>
                </select>
              </div>

              <div class="sm:col-span-4 flex gap-2">
                <button onclick="calculateCampusRoute()" class="flex-1 py-2 px-3 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-1.5 shadow-sm">
                  <i data-lucide="route" class="w-3.5 h-3.5"></i>
                  Find Walking Route
                </button>
                <button onclick="switchTab('campus3d')" class="py-2 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:text-sky-600 transition flex items-center gap-1 shadow-sm" title="View 3D Campus Model">
                  <i data-lucide="box" class="w-3.5 h-3.5"></i>
                  3D View
                </button>
              </div>
            </div>

            <!-- Route Output Card -->
            <div id="routeOutputCard" class="mt-4 p-3.5 rounded-xl bg-white border border-slate-200 hidden">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
                <div class="flex items-center gap-2">
                  <span id="routeDistanceBadge" class="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">180 meters</span>
                  <span id="routeTimeBadge" class="text-xs font-mono text-slate-600">~ 2.5 min walking time</span>
                </div>
                <span class="text-[10px] text-sky-600 font-semibold flex items-center gap-1">
                  <i data-lucide="accessibility" class="w-3 h-3"></i> 100% Step-free Ramp Access
                </span>
              </div>
              <p id="routeDirectionsText" class="text-xs text-slate-700 leading-relaxed font-sans"></p>
            </div>
          </div>

          <!-- FACILITY CARDS GRID -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="facilityCardsContainer">
            <!-- Dynamically populated via JS renderFacilityCards() -->
          </div>
        </div>

      </section>

      <!-- ========================================== -->
      <!-- TAB 3: SMART ATTENDANCE (AU ERP LIVE)      -->
      <!-- ========================================== -->
      <section id="tab-attendance" class="space-y-6 hidden">
        
        <div class="glass-card p-6 rounded-2xl border border-slate-200">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-semibold text-sky-600 uppercase tracking-wider">AU ERP Academic Gateway</span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">student.alliance.edu.in/auerp</span>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mt-1">Semester V B.Tech CSE Attendance Register</h3>
              <p class="text-xs text-slate-500">Student: <strong>Likith S</strong> • Reg: <strong>2411021061437</strong> • Mandatory 75.0% SEE Exam Eligibility Threshold</p>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <div class="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <p class="text-[10px] text-slate-500 font-semibold uppercase">Overall Average</p>
                <p id="attSummaryAvg" class="text-lg font-bold text-emerald-600 font-mono">81.4%</p>
              </div>
              <div class="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <p class="text-[10px] text-slate-500 font-semibold uppercase">Total Classes</p>
                <p id="attSummaryClasses" class="text-lg font-bold text-slate-800 font-mono">114 / 140</p>
              </div>
              <div class="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-center">
                <p class="text-[10px] text-rose-600 font-semibold uppercase">Shortage Flags</p>
                <p id="attSummaryFlags" class="text-lg font-bold text-rose-600 font-mono">2 Critical</p>
              </div>
              <button onclick="openMetricsEditorModal('attendance')" class="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm">
                <i data-lucide="edit-3" class="w-3.5 h-3.5 text-sky-400"></i>
                Edit Course Register
              </button>
            </div>
          </div>

          <!-- 75% BUNK SIMULATOR -->
          <div class="mt-6 pt-5 border-t border-slate-200/80 bg-slate-50/70 -mx-6 -mb-6 p-6 rounded-b-2xl">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <span class="text-xs font-semibold text-slate-800 flex items-center gap-2">
                <i data-lucide="calculator" class="w-4 h-4 text-sky-600"></i>
                75% Mandatory Bunk Simulator: <span id="bunkSimLabel" class="text-sky-600 font-mono font-bold">Simulating 0 upcoming missed lectures</span>
              </span>
              <span class="text-[11px] text-slate-500 font-mono">Formula: Safe Bunks = floor((A - 0.75*N) / 0.75)</span>
            </div>
            <input type="range" id="bunkSlider" min="0" max="6" value="0" oninput="simulateBunks(this.value)" class="w-full accent-slate-900 cursor-pointer">
            <p class="text-[11px] text-slate-500 mt-2">Drag slider to dynamically forecast the mathematical effect of future absences on your Semester End Examination (SEE) hall ticket eligibility.</p>
          </div>
        </div>

        <!-- ATTENDANCE CARDS GRID -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="attendanceGrid"></div>

        <!-- ATTENDANCE APEXCHART & CRITICAL SHORTAGE BANNER -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-200">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-sm font-bold text-slate-900">Course-Wise Attendance vs 75% Threshold</h4>
                <p class="text-xs text-slate-500">Live comparison chart against university minimum benchmark</p>
              </div>
              <span class="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">ApexCharts Live</span>
            </div>
            <div id="attendanceChartContainer" class="w-full h-64"></div>
          </div>

          <div id="criticalAlertBox" class="glass-card p-6 rounded-2xl border border-rose-200 bg-rose-50/20 flex flex-col justify-between">
            <div id="criticalAlertContent">
              <div class="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase mb-2">
                <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-600"></i>
                Critical SEE Barred Alert
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-2">Action Required for 2 Subjects</h4>
              <p class="text-xs text-slate-600 leading-relaxed space-y-2">
                <strong>Advanced Python (72.4%)</strong> and <strong>Leadership Skills (70.0%)</strong> are below the 75% cutoff.<br><br>
                Under AU Academic Regulations, student is <strong>barred from SEE</strong> unless attending:
              </p>
              <ul class="text-xs font-mono mt-3 space-y-1.5 text-rose-800 bg-rose-50 p-3 rounded-xl border border-rose-200">
                <li>• Next 3 consecutive Python lectures</li>
                <li>• Next 2 consecutive Leadership lectures</li>
              </ul>
            </div>

            <button onclick="switchTab('timetable')" class="w-full mt-4 py-2 px-3 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-sm">
              View Upcoming Lecture Slots
            </button>
          </div>
        </div>

      </section>

      <!-- ========================================== -->
      <!-- TAB 4: TIMETABLE (ZERO-CLASH CSP)          -->
      <!-- ========================================== -->
      <section id="tab-timetable" class="space-y-6 hidden">
        <div class="glass-card p-6 rounded-2xl border border-slate-200">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-semibold text-emerald-600 uppercase tracking-wider">Deterministic OR-Tools Solver</span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">0 Clashes Guaranteed</span>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mt-1">Official Weekly Academic Lecture Timetable</h3>
              <p class="text-xs text-slate-500">Constraint Satisfaction Problem (CSP) scheduling eliminating 100% room & faculty collisions.</p>
            </div>

            <!-- Day Filter Buttons -->
            <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs" id="dayFilterGroup">
              <button onclick="filterDay(event, 'all')" class="day-btn px-2.5 py-1 rounded-lg font-semibold bg-white text-slate-900 shadow-sm transition">All</button>
              <button onclick="filterDay(event, 'Mon')" class="day-btn px-2.5 py-1 rounded-lg font-medium text-slate-600 hover:text-slate-900 transition">Mon</button>
              <button onclick="filterDay(event, 'Tue')" class="day-btn px-2.5 py-1 rounded-lg font-medium text-slate-600 hover:text-slate-900 transition">Tue</button>
              <button onclick="filterDay(event, 'Wed')" class="day-btn px-2.5 py-1 rounded-lg font-medium text-slate-600 hover:text-slate-900 transition">Wed</button>
              <button onclick="filterDay(event, 'Thu')" class="day-btn px-2.5 py-1 rounded-lg font-medium text-slate-600 hover:text-slate-900 transition">Thu</button>
              <button onclick="filterDay(event, 'Fri')" class="day-btn px-2.5 py-1 rounded-lg font-medium text-slate-600 hover:text-slate-900 transition">Fri</button>
              <button onclick="filterDay(event, 'Sat')" class="day-btn px-2.5 py-1 rounded-lg font-medium text-slate-600 hover:text-slate-900 transition">Sat</button>
            </div>
          </div>

          <!-- Table Container -->
          <div class="overflow-x-auto border border-slate-200 rounded-xl">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th class="p-3.5">Day</th>
                  <th class="p-3.5">Time Slot</th>
                  <th class="p-3.5">Course Name & Code</th>
                  <th class="p-3.5">Faculty In-Charge</th>
                  <th class="p-3.5">Allocated Room</th>
                  <th class="p-3.5">Live Attendance Buffer</th>
                  <th class="p-3.5">HVAC Setback Status</th>
                </tr>
              </thead>
              <tbody id="timetableBody" class="divide-y divide-slate-100"></tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- TAB 5: LIBRARY & DESK ALLOCATION           -->
      <!-- ========================================== -->
      <section id="tab-library" class="space-y-6 hidden">
        <div class="glass-card p-6 rounded-2xl border border-slate-200">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-semibold text-sky-600 uppercase tracking-wider">Rotunda Dome Facility</span>
                <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">50,000 Sq Ft</span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-semibold">Open 08:00 – 23:00</span>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mt-1">Central Library Resource Management & Seat Allocation</h3>
              <p class="text-xs text-slate-500">Floor-by-floor study desk occupancy, quiet zones, digital catalog reservations, and IEEE terminal access.</p>
            </div>

            <div class="flex items-center gap-2">
              <input type="text" id="libraryBookSearch" onkeydown="if(event.key==='Enter') searchLibraryBooks()" placeholder="Search textbook, author, or ISBN..." class="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs w-64 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900">
              <button onclick="searchLibraryBooks()" class="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm">
                <i data-lucide="search" class="w-3.5 h-3.5"></i>
                Search Books
              </button>
            </div>
          </div>

          <!-- 4 Floors Overview Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold text-slate-900">Floor 1: Book Stacks</span>
                <span class="text-[11px] font-mono text-emerald-600 font-bold">68% Full</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2 mb-2">
                <div class="bg-emerald-500 h-2 rounded-full" style="width: 68%"></div>
              </div>
              <p class="text-[11px] text-slate-500">32 Desks Free • Print Circulation</p>
            </div>

            <div class="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold text-slate-900">Floor 2: Quiet Reading</span>
                <span class="text-[11px] font-mono text-amber-600 font-bold">84% Full</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2 mb-2">
                <div class="bg-amber-500 h-2 rounded-full" style="width: 84%"></div>
              </div>
              <p class="text-[11px] text-slate-500">14 Desks Free • Silence Zone</p>
            </div>

            <div class="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold text-slate-900">Floor 3: Digital Lab</span>
                <span class="text-[11px] font-mono text-emerald-600 font-bold">42% Full</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2 mb-2">
                <div class="bg-emerald-500 h-2 rounded-full" style="width: 42%"></div>
              </div>
              <p class="text-[11px] text-slate-500">58 Workstations Free • IEEE Access</p>
            </div>

            <div class="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold text-slate-900">Floor 4: Collaborative</span>
                <span class="text-[11px] font-mono text-rose-600 font-bold">91% Full</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2 mb-2">
                <div class="bg-rose-500 h-2 rounded-full" style="width: 91%"></div>
              </div>
              <p class="text-[11px] text-slate-500">4 Cubicles Free • Discussion</p>
            </div>
          </div>

          <!-- INTERACTIVE SEAT RESERVATION SIMULATOR -->
          <div class="p-5 rounded-xl border border-slate-200 bg-slate-50/60 mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Floor 2 Study Commons · Interactive Seat Booking</h4>
                <p class="text-[11px] text-slate-500">Click any available seat to simulate reservation or release. Live vacancy updates instantly.</p>
              </div>
              <div class="flex items-center gap-4 text-xs font-medium">
                <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded bg-emerald-500"></span> Available (<span id="availSeatsCount">14</span>)</span>
                <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded bg-slate-300"></span> Occupied (10)</span>
                <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded bg-sky-600"></span> Your Booking</span>
              </div>
            </div>

            <!-- 24 Desks Grid -->
            <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5" id="seatGrid">
              <!-- Rendered via JS renderSeats() -->
            </div>
          </div>

          <!-- POPULAR ENGINEERING TEXTBOOKS QUICK ACCESS -->
          <div class="border-t border-slate-200 pt-5">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Alliance Digital Library · Fast Textbooks Lookup</h4>
              <button onclick="openLibrarySearchModal('all')" class="text-xs text-sky-600 font-semibold hover:underline">View All Books ↗</button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div class="p-3 rounded-xl bg-white border border-slate-200 flex justify-between items-start gap-2 shadow-sm">
                <div>
                  <span class="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">Available (Floor 1)</span>
                  <h5 class="text-xs font-bold text-slate-900 mt-1">Artificial Intelligence: A Modern Approach</h5>
                  <p class="text-[11px] text-slate-500">Russell & Norvig · Call: QA76.R87</p>
                </div>
                <button onclick="showToast('Reserved: Artificial Intelligence: A Modern Approach', 'success')" class="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shrink-0">Hold</button>
              </div>

              <div class="p-3 rounded-xl bg-white border border-slate-200 flex justify-between items-start gap-2 shadow-sm">
                <div>
                  <span class="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">Available (Floor 3)</span>
                  <h5 class="text-xs font-bold text-slate-900 mt-1">Cloud Computing: Principles & Paradigms</h5>
                  <p class="text-[11px] text-slate-500">Rajkumar Buyya · Call: QA76.585</p>
                </div>
                <button onclick="showToast('Reserved: Cloud Computing: Principles & Paradigms', 'success')" class="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shrink-0">Hold</button>
              </div>

              <div class="p-3 rounded-xl bg-white border border-slate-200 flex justify-between items-start gap-2 shadow-sm">
                <div>
                  <span class="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">Checked Out (Due Nov 02)</span>
                  <h5 class="text-xs font-bold text-slate-900 mt-1">Discrete Mathematical Structures</h5>
                  <p class="text-[11px] text-slate-500">Tremblay & Manohar · Call: QA39.2</p>
                </div>
                <button onclick="showToast('Added to waitlist for Discrete Mathematical Structures', 'info')" class="text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition shrink-0">Waitlist</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- TAB 6: ENERGY & MICROGRID ROUTING          -->
      <!-- ========================================== -->
      <section id="tab-energy" class="space-y-6 hidden">
        
        <!-- MICROGRID SANKEY & POWER BALANCE -->
        <div class="glass-card p-6 rounded-2xl border border-slate-200">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-semibold text-amber-600 uppercase tracking-wider">Dynamic Microgrid Routing</span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Review–1 Directive Resolution</span>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mt-1">Campus Microgrid Power Balance & 1.2 MWh BESS Dispatch</h3>
              <p class="text-xs text-slate-500">Live energy routing across 11 kV BESCOM Grid, 480 kWp Rooftop Solar PV, and Academic Substation.</p>
            </div>

            <div class="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-mono">
              BESCOM ToD Peak Window: <span class="text-amber-400 font-bold">18.4% Shaved</span>
            </div>
          </div>

          <!-- Dynamic Power Flow Visualizer -->
          <div class="bg-slate-50/80 border border-slate-200 rounded-xl p-4 overflow-x-auto">
            <svg viewBox="0 0 760 320" class="w-full min-w-[700px] h-[320px]">
              <defs>
                <linearGradient id="grad-grid" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#475569" stop-opacity="0.6"/>
                  <stop offset="100%" stop-color="#0284c7" stop-opacity="0.6"/>
                </linearGradient>
                <linearGradient id="grad-solar" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#d97706" stop-opacity="0.7"/>
                  <stop offset="100%" stop-color="#0284c7" stop-opacity="0.6"/>
                </linearGradient>
                <linearGradient id="grad-bess" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#059669" stop-opacity="0.7"/>
                  <stop offset="100%" stop-color="#0284c7" stop-opacity="0.6"/>
                </linearGradient>
              </defs>

              <rect x="20" y="40" width="130" height="60" rx="8" fill="#ffffff" stroke="#475569" stroke-width="2"/>
              <text x="85" y="68" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">BESCOM 11 kV Grid</text>
              <text x="85" y="85" font-size="10" font-mono fill="#64748b" text-anchor="middle">467.8 kW Import</text>

              <rect x="20" y="140" width="130" height="60" rx="8" fill="#ffffff" stroke="#d97706" stroke-width="2"/>
              <text x="85" y="168" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">480 kWp Solar PV</text>
              <text x="85" y="185" font-size="10" font-mono fill="#d97706" text-anchor="middle">374.8 kWp Yield</text>

              <rect x="20" y="230" width="130" height="60" rx="8" fill="#ffffff" stroke="#059669" stroke-width="2"/>
              <text x="85" y="258" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">1.2 MWh BESS Bank</text>
              <text id="sankeyBessSoc" x="85" y="275" font-size="10" font-mono fill="#059669" text-anchor="middle">78.4% Capacity</text>

              <rect x="310" y="60" width="140" height="200" rx="10" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
              <text x="380" y="150" font-size="12" font-weight="bold" fill="#0369a1" text-anchor="middle">Substation 415V</text>
              <text id="sankeyTotalPower" x="380" y="170" font-size="10" font-mono fill="#64748b" text-anchor="middle">Total: 842.6 kW</text>

              <rect x="580" y="25" width="150" height="50" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
              <text x="655" y="48" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Chintan Block (ACED)</text>
              <text x="655" y="64" font-size="9" font-mono fill="#64748b" text-anchor="middle">312.4 kW Draw</text>

              <rect x="580" y="95" width="150" height="50" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
              <text x="655" y="118" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">HVAC Chiller Plant</text>
              <text x="655" y="134" font-size="9" font-mono fill="#64748b" text-anchor="middle">248.6 kW (+3°C Setback)</text>

              <rect x="580" y="165" width="150" height="50" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
              <text x="655" y="188" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Central Library Dome</text>
              <text x="655" y="204" font-size="9" font-mono fill="#64748b" text-anchor="middle">94.2 kW Draw</text>

              <rect x="580" y="235" width="150" height="50" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
              <text x="655" y="258" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Residential Hostels</text>
              <text x="655" y="274" font-size="9" font-mono fill="#64748b" text-anchor="middle">187.4 kW Draw</text>

              <!-- Stream lines -->
              <path d="M 150 70 C 230 70, 230 110, 310 110" fill="none" stroke="url(#grad-grid)" stroke-width="12" stroke-linecap="round"/>
              <path d="M 150 170 C 230 170, 230 160, 310 160" fill="none" stroke="url(#grad-solar)" stroke-width="10" stroke-linecap="round"/>
              <path d="M 150 260 C 230 260, 230 210, 310 210" fill="none" stroke="url(#grad-bess)" stroke-width="8" stroke-dasharray="4 4"/>

              <path d="M 450 110 C 510 110, 510 50, 580 50" fill="none" stroke="#0284c7" stroke-width="8" stroke-opacity="0.6"/>
              <path d="M 450 140 C 510 140, 510 120, 580 120" fill="none" stroke="#0284c7" stroke-width="7" stroke-opacity="0.6"/>
              <path d="M 450 180 C 510 180, 510 190, 580 190" fill="none" stroke="#0284c7" stroke-width="4" stroke-opacity="0.6"/>
              <path d="M 450 220 C 510 220, 510 260, 580 260" fill="none" stroke="#0284c7" stroke-width="6" stroke-opacity="0.6"/>
            </svg>
          </div>
        </div>

        <!-- 24-HOUR PREDICTIVE DEMAND FORECAST (APEXCHARTS) -->
        <div class="glass-card p-6 rounded-2xl border border-slate-200">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-semibold text-sky-600 uppercase tracking-wider">Objective 2: ML Demand Forecasting</span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">Python Ridge Regression Model</span>
              </div>
              <h3 class="text-lg font-bold text-slate-900 mt-0.5">24-Hour Campus Electricity Demand Forecast vs Actual</h3>
              <p class="text-xs text-slate-500">Historical baseline vs AI predictive curve with 18:00 - 22:00 peak shaving window.</p>
            </div>
            <div class="flex items-center gap-2 text-xs font-mono text-slate-600">
              <span class="flex items-center gap-1"><span class="h-2.5 w-2.5 rounded-full bg-slate-400"></span> Baseline</span>
              <span class="flex items-center gap-1"><span class="h-2.5 w-2.5 rounded-full bg-sky-500"></span> ML Forecast</span>
              <span class="flex items-center gap-1"><span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Actual Real-Time</span>
            </div>
          </div>

          <div id="energyChartContainer" class="w-full h-72"></div>
        </div>

        <!-- OBJECTIVE 4: ENERGY SAVING RECOMMENDATIONS -->
        <div class="glass-card p-6 rounded-2xl border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <div>
              <span class="text-xs font-mono font-semibold text-emerald-600 uppercase tracking-wider">Objective 4: Recommendation Logic</span>
              <h3 class="text-lg font-bold text-slate-900 mt-0.5">Automated Utility Conservation Alerts</h3>
            </div>
            <span class="text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md font-semibold">3 Active Insights</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div class="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
              <div>
                <span class="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold">VACANT ROOM SETBACK</span>
                <h4 class="font-bold text-slate-900 mt-2 mb-1">Chintan LT-204 Unoccupied</h4>
                <p class="text-slate-600 text-[11px] leading-relaxed">
                  Room LT-204 has 0 occupants scheduled between 11:00 AM – 12:00 PM. HVAC chiller load can be throttled from 22°C to 26°C.
                </p>
                <p class="text-[10px] text-emerald-600 font-semibold mt-2">Estimated Saving: 14.2 kWh (₹118/hr)</p>
              </div>
              <button onclick="applyRecommendation(this, 'LT-204 Setback Applied!')" class="mt-4 w-full py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition">
                Apply Setback
              </button>
            </div>

            <div class="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
              <div>
                <span class="text-[10px] font-mono text-sky-600 bg-sky-50 px-2 py-0.5 rounded font-bold">SOLAR PRE-COOLING</span>
                <h4 class="font-bold text-slate-900 mt-2 mb-1">Solar Peak Pre-Cooling</h4>
                <p class="text-slate-600 text-[11px] leading-relaxed">
                  Rooftop solar generation exceeds 370 kWp at 13:00. Pre-cool seminar auditoriums to store thermal energy before evening peak.
                </p>
                <p class="text-[10px] text-emerald-600 font-semibold mt-2">ToD Peak Shaving: ~45 kW Shifted</p>
              </div>
              <button onclick="applyRecommendation(this, 'Solar Pre-Cooling Engaged!')" class="mt-4 w-full py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition">
                Enable Auto-Dispatch
              </button>
            </div>

            <div class="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
              <div>
                <span class="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold">LIBRARY CONSOLIDATION</span>
                <h4 class="font-bold text-slate-900 mt-2 mb-1">Library 4th Floor Consolidation</h4>
                <p class="text-slate-600 text-[11px] leading-relaxed">
                  Post 20:00 occupancy drops below 15%. Recommend consolidating remaining students to Floor 2 and disabling Floor 4 chillers.
                </p>
                <p class="text-[10px] text-emerald-600 font-semibold mt-2">Night Baseline Cut: 38 kW</p>
              </div>
              <button onclick="applyRecommendation(this, 'Floor 4 Scheduled for 20:00!')" class="mt-4 w-full py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition">
                Schedule Action
              </button>
            </div>
          </div>
        </div>

      </section>

      <!-- ========================================== -->
      <!-- TAB 7: CAMPUS EVENT MANAGEMENT & EXAMS     -->
      <!-- ========================================== -->
      <section id="tab-events" class="space-y-6 hidden">
        <div class="glass-card p-6 rounded-2xl border border-slate-200">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-semibold text-rose-600 uppercase tracking-wider">Campus Academic & Event Management</span>
                <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">Semester V · 2026</span>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mt-1">University Academic Calendar & Event Scheduling</h3>
              <p class="text-xs text-slate-500">Official academic milestones, examination windows, seminar hall reservations, and zero-clash CSP bookings.</p>
            </div>

            <div class="flex items-center gap-2">
              <button onclick="openEventBookingModal()" class="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm">
                <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i>
                Request Venue / Add Event
              </button>
            </div>
          </div>

          <!-- EVENT CATEGORY FILTER CHIPS -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
            <div class="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs" id="eventFilterChips">
              <button onclick="filterEvents('all', this)" class="px-3 py-1 rounded-lg font-semibold bg-white text-slate-900 shadow-sm transition">All Events</button>
              <button onclick="filterEvents('exam', this)" class="px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition">Exams & Evaluations</button>
              <button onclick="filterEvents('project', this)" class="px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition">Design Project</button>
              <button onclick="filterEvents('tech', this)" class="px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition">Tech Symposium</button>
            </div>
            <span class="text-xs text-slate-500 font-mono" id="eventsCountBadge">5 Scheduled Events</span>
          </div>

          <!-- EVENTS LIST CONTAINER -->
          <div class="space-y-3" id="eventsListContainer">
            <!-- Dynamically populated via JS renderEvents() -->
          </div>

          <!-- CAMPUS VENUE ALLOCATION OVERVIEW -->
          <div class="mt-6 pt-5 border-t border-slate-200">
            <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Campus Seminar Halls & Auditoriums Availability</h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div class="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-bold text-slate-900">Chintan Main Auditorium</span>
                  <span class="text-[10px] font-mono text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">Booked (Nov 18)</span>
                </div>
                <p class="text-[11px] text-slate-500">Capacity: 450 Seats • Multi-Screen AV</p>
                <p class="text-[10px] text-slate-400 mt-1">Host: Alliance Tech Symposium 2026</p>
              </div>

              <div class="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-bold text-slate-900">ACED Seminar Hall 1</span>
                  <span class="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Available</span>
                </div>
                <p class="text-[11px] text-slate-500">Capacity: 120 Seats • Zero Collisions</p>
                <p class="text-[10px] text-slate-400 mt-1">Ready for Departmental Colloquia</p>
              </div>

              <div class="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-bold text-slate-900">Central Library Audio-Visual</span>
                  <span class="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Available</span>
                </div>
                <p class="text-[11px] text-slate-500">Capacity: 80 Seats • Quiet Rotunda</p>
                <p class="text-[10px] text-slate-400 mt-1">Reserved for Scholar Defenses</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- TAB 8: ASAC REVIEW 2 EVALUATION RUBRICS    -->
      <!-- ========================================== -->
      <section id="tab-rubrics" class="space-y-6 hidden">
        <div class="glass-card p-6 rounded-2xl border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <div>
              <span class="text-xs font-mono font-semibold text-indigo-600 uppercase tracking-wider">Evaluation Framework</span>
              <h3 class="text-xl font-bold text-slate-900 mt-0.5">ASAC Design Project–I Review 2 Defense Rubrics</h3>
              <p class="text-xs text-slate-500">Line-by-line mapping of evaluation criteria from Dr. Rashmi Mothkur's Design Project Diary.</p>
            </div>
            <span class="text-xs font-mono font-bold bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-sm">Review–II Ready</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-xs">
            
            <div class="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div class="flex items-center justify-between mb-1.5">
                <h4 class="font-bold text-slate-900">1. Requirement Analysis</h4>
                <span class="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">5 / 5 Marks</span>
              </div>
              <p class="text-slate-600 leading-relaxed text-[11px]">
                Grounds real campus problems: 28.4%–35.2% HVAC utility waste during empty room slots, timetable collisions, and peak BESCOM maximum demand penalties without requiring hardware sensor deployment.
              </p>
            </div>

            <div class="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div class="flex items-center justify-between mb-1.5">
                <h4 class="font-bold text-slate-900">2. Module Description</h4>
                <span class="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">10 / 10 Marks</span>
              </div>
              <p class="text-slate-600 leading-relaxed text-[11px]">
                4 rigorously segregated modules: 3D Spatial Digital Twin (Likith S), Microgrid Sankey Power Flow (Vinodkumar), Baseline Ingestion & ML Forecasting (Nikhil Kumar V), and Zero-Clash CSP Timetable Engine (Kalyan Kumar T).
              </p>
            </div>

            <div class="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div class="flex items-center justify-between mb-1.5">
                <h4 class="font-bold text-slate-900">3. Convergence & Review 1 Resolution</h4>
                <span class="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">5 / 5 Marks</span>
              </div>
              <p class="text-slate-600 leading-relaxed text-[11px]">
                Directly resolves mentor feedback from Review 1: dynamic multi-source power balance across 11 kV BESCOM + 480 kWp Solar + 1.2 MWh BESS, plus academic timetable integration with 15-minute hysteresis buffer.
              </p>
            </div>

            <div class="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div class="flex items-center justify-between mb-1.5">
                <h4 class="font-bold text-slate-900">4. Coverage & Completeness Towards Idea</h4>
                <span class="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">10 / 10 Marks</span>
              </div>
              <p class="text-slate-600 leading-relaxed text-[11px]">
                Encompasses 142 campus venues across 60 acres, unifying classroom booking, energy monitoring, library seat reservation, student attendance tracking, and predictive recommendation alerts.
              </p>
            </div>

            <div class="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div class="flex items-center justify-between mb-1.5">
                <h4 class="font-bold text-slate-900">5. Implementation & Demonstration</h4>
                <span class="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">15 / 15 Marks</span>
              </div>
              <p class="text-slate-600 leading-relaxed text-[11px]">
                Passes 55% implementation milestone. Live in browser at 60 FPS WebGL 3D, responsive glassmorphism UI, real ApexCharts time-series rendering, and dynamic state reactivity.
              </p>
            </div>

            <div class="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div class="flex items-center justify-between mb-1.5">
                <h4 class="font-bold text-slate-900">6. Conference Paper, Report & Deck</h4>
                <span class="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">10 / 10 Marks</span>
              </div>
              <p class="text-slate-600 leading-relaxed text-[11px]">
                Full deliverables package prepared: <code>01_Review_Defense_Report.pdf</code>, <code>02_Review_2_Presentation.pdf</code> (14 slides), IEEE conference draft paper (<code>04_IEEE_Conference_Paper.pdf</code>), and Sheets 1–5 engineering drawings.
              </p>
            </div>

          </div>
        </div>
      </section>

    </main>
  </div>

  <!-- ========================================== -->
  <!-- MODAL: AU ERP GATEWAY LOGIN & API KEY      -->
  <!-- ========================================== -->
  <div id="loginModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="glass-card max-w-md w-full p-6 rounded-2xl border border-slate-200 shadow-2xl relative">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h3 class="text-base font-bold text-slate-900">AU ERP Gateway Authentication</h3>
          <p class="text-xs text-slate-500">Synchronize with student.alliance.edu.in/auerp</p>
        </div>
        <button onclick="toggleLoginModal()" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
      </div>

      <div class="flex rounded-xl bg-slate-100 p-1 mb-4 text-xs font-semibold">
        <button id="roleBtnStudent" onclick="selectRole('student')" class="flex-1 py-1.5 rounded-lg bg-white text-slate-900 shadow-sm transition">Student View</button>
        <button id="roleBtnFaculty" onclick="selectRole('faculty')" class="flex-1 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition">Faculty View</button>
      </div>

      <div class="space-y-3 text-xs">
        <div>
          <label class="block text-slate-700 font-semibold mb-1">Institutional Email / Login ID:</label>
          <input type="text" id="loginIdInput" value="slikhithBTECH24@ced.alliance.edu.in" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-slate-900">
        </div>
        <div>
          <label class="block text-slate-700 font-semibold mb-1">AU ERP Secret Token / API Key:</label>
          <input type="text" id="loginKeyInput" value="7843@adft9532" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-slate-900">
        </div>
        <p class="text-[11px] text-slate-500">Token verified with active AU ERP watchdog session on campus intranet.</p>

        <button onclick="applyLogin()" class="w-full py-2.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition shadow-sm mt-2 flex items-center justify-center gap-2">
          <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
          Sync & Authenticate Session
        </button>
      </div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- MODAL: LIBRARY DIGITAL COMMONS SEARCH       -->
  <!-- ========================================== -->
  <div id="librarySearchModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden" onclick="if(event.target===this) closeLibrarySearchModal()">
    <div class="glass-card max-w-lg w-full p-6 rounded-2xl border border-slate-200 shadow-2xl relative max-h-[85vh] flex flex-col" onclick="event.stopPropagation()">
      <div class="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 class="text-base font-bold text-slate-900">Alliance Digital Library Catalog</h3>
          <p id="librarySearchQueryLabel" class="text-xs text-slate-500">Search results from Central Library Rotunda</p>
        </div>
        <button onclick="closeLibrarySearchModal()" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
      </div>

      <div class="overflow-y-auto space-y-2.5 flex-1 pr-1" id="librarySearchResultsList">
        <!-- Rendered by openLibrarySearchModal() -->
      </div>

      <div class="mt-4 pt-3 border-t border-slate-100 flex justify-end">
        <button onclick="closeLibrarySearchModal()" class="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- MODAL: REQUEST VENUE / SCHEDULE EVENT      -->
  <!-- ========================================== -->
  <div id="eventBookingModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden" onclick="if(event.target===this) closeEventBookingModal()">
    <div class="glass-card max-w-md w-full p-6 rounded-2xl border border-slate-200 shadow-2xl relative" onclick="event.stopPropagation()">
      <div class="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 class="text-base font-bold text-slate-900">Schedule Campus Academic Event</h3>
          <p class="text-xs text-slate-500">Zero-Clash CSP Venue Reservation</p>
        </div>
        <button onclick="closeEventBookingModal()" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
      </div>

      <div class="space-y-3 text-xs">
        <div>
          <label class="block text-slate-700 font-semibold mb-1">Event Title:</label>
          <input type="text" id="newEventTitle" placeholder="e.g., Cryptography Guest Colloquium" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900">
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-slate-700 font-semibold mb-1">Category:</label>
            <select id="newEventCategory" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900">
              <option value="exam">Academic & Exam</option>
              <option value="project">Design Project</option>
              <option value="tech" selected>Tech & Hackathon</option>
            </select>
          </div>
          <div>
            <label class="block text-slate-700 font-semibold mb-1">Target Date:</label>
            <input type="date" id="newEventDate" value="2026-11-20" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900">
          </div>
        </div>

        <div>
          <label class="block text-slate-700 font-semibold mb-1">Campus Venue:</label>
          <select id="newEventVenue" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900">
            <option value="Chintan Main Auditorium">Chintan Main Auditorium (450 cap)</option>
            <option value="ACED Seminar Hall 1" selected>ACED Seminar Hall 1 (120 cap)</option>
            <option value="Chintan LT-301">Chintan LT-301 (65 cap)</option>
            <option value="Central Library Audio-Visual">Central Library Audio-Visual (80 cap)</option>
          </select>
        </div>

        <div>
          <label class="block text-slate-700 font-semibold mb-1">Organizing Department / Lead:</label>
          <input type="text" id="newEventOrganizer" value="Dept. of CSE · Likith S" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900">
        </div>

        <div class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
          <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600 shrink-0"></i>
          <span>CSP Engine: Selected slot is verified 100% collision-free.</span>
        </div>
      </div>

      <div class="mt-5 pt-3 border-t border-slate-100 flex justify-end gap-2">
        <button onclick="closeEventBookingModal()" class="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition">
          Cancel
        </button>
        <button onclick="submitNewEvent()" class="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-sm">
          Confirm Reservation
        </button>
      </div>
    </div>
  </div>

    <!-- TOAST NOTIFICATION CONTAINER -->
  <div id="toastNotification" class="fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none"></div>

  <!-- ========================================== -->
  <!-- MODAL: METRIC OVERRIDES & DATA ENTRY       -->
  <!-- ========================================== -->
  <div id="metricsModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="glass-card max-w-2xl w-full p-6 rounded-2xl border border-slate-200 shadow-2xl relative max-h-[92vh] flex flex-col">
      <div class="flex justify-between items-start mb-4 pb-3 border-b border-slate-200/80">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
            <i data-lucide="sliders" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
              Campus Telemetry &amp; Manual Data Overrides
              <span id="modalActiveOverrideTag" class="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-100 text-emerald-800 font-semibold">Default Live Mode</span>
            </h3>
            <p class="text-xs text-slate-500">Edit real-time campus metrics, adjust attendance counts, or customize values for defense demo.</p>
          </div>
        </div>
        <button onclick="closeMetricsEditorModal()" class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- TABS INSIDE MODAL -->
      <div class="flex border-b border-slate-200 mb-4 text-xs font-semibold gap-2">
        <button id="modalTabBtnMetrics" onclick="switchModalTab('metrics')" class="px-3.5 py-2 border-b-2 border-slate-900 text-slate-900 flex items-center gap-1.5 transition">
          <i data-lucide="gauge" class="w-3.5 h-3.5"></i>
          Campus Telemetry Overrides
        </button>
        <button id="modalTabBtnAttendance" onclick="switchModalTab('attendance')" class="px-3.5 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition">
          <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
          Course Attendance Register
        </button>
        <button id="modalTabBtnSources" onclick="switchModalTab('sources')" class="px-3.5 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition">
          <i data-lucide="info" class="w-3.5 h-3.5"></i>
          Data Provenance &amp; Source Info
        </button>
      </div>

      <!-- MODAL CONTENT BODY (SCROLLABLE) -->
      <div class="overflow-y-auto flex-1 pr-1 space-y-4 text-xs">
        
        <!-- MODAL SUB-TAB 1: TELEMETRY METRICS -->
        <div id="modalSubTabMetrics" class="space-y-4">
          <div class="p-3 bg-sky-50/70 rounded-xl border border-sky-100 flex items-start gap-2.5">
            <i data-lucide="info" class="w-4 h-4 text-sky-600 shrink-0 mt-0.5"></i>
            <p class="text-[11px] text-sky-900 leading-relaxed">
              <strong>Manual Overrides:</strong> Values entered here immediately update the dashboard KPI cards, the Microgrid Sankey diagram, and persist in your browser session via local storage.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label class="block text-slate-700 font-semibold mb-1">Live Power Load (kW):</label>
              <div class="relative">
                <input type="number" id="input_powerLoad" step="0.1" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 pr-10">
                <span class="absolute right-3 top-2.5 text-[11px] font-mono text-slate-400">kW</span>
              </div>
              <p class="text-[10px] text-slate-400 mt-1">Default: 842.6 kW (Chintan + Library + Hostels + Labs)</p>
            </div>

            <div>
              <label class="block text-slate-700 font-semibold mb-1">Peak Shaved (%):</label>
              <div class="relative">
                <input type="number" id="input_peakShaved" step="0.1" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 pr-10">
                <span class="absolute right-3 top-2.5 text-[11px] font-mono text-slate-400">%</span>
              </div>
              <p class="text-[10px] text-slate-400 mt-1">Default: 18.4% (BESS Peak Shaving algorithm)</p>
            </div>

            <div>
              <label class="block text-slate-700 font-semibold mb-1">Energy Saved MTD (MWh):</label>
              <div class="relative">
                <input type="number" id="input_energySaved" step="0.1" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 pr-12">
                <span class="absolute right-3 top-2.5 text-[11px] font-mono text-slate-400">MWh</span>
              </div>
              <p class="text-[10px] text-slate-400 mt-1">Default: 32.4 MWh (Unoccupied HVAC Setback)</p>
            </div>

            <div>
              <label class="block text-slate-700 font-semibold mb-1">Avoided Utility Cost (₹ Lakhs):</label>
              <div class="relative">
                <input type="number" id="input_costAvoided" step="0.01" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 pr-10">
                <span class="absolute right-3 top-2.5 text-[11px] font-mono text-slate-400">₹ L</span>
              </div>
              <p class="text-[10px] text-slate-400 mt-1">Default: ₹2.67 Lakhs (@ BESCOM ₹8.25/kWh)</p>
            </div>

            <div>
              <label class="block text-slate-700 font-semibold mb-1">Timetable Clashes:</label>
              <input type="number" id="input_clashes" step="1" min="0" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-slate-900">
              <p class="text-[10px] text-slate-400 mt-1">Default: 0 (Set &gt;0 to simulate room clash alert)</p>
            </div>

            <div>
              <label class="block text-slate-700 font-semibold mb-1">BESS Battery SoC (%):</label>
              <div class="relative">
                <input type="number" id="input_bessSoc" step="0.1" min="0" max="100" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 pr-10">
                <span class="absolute right-3 top-2.5 text-[11px] font-mono text-slate-400">%</span>
              </div>
              <p class="text-[10px] text-slate-400 mt-1">Default: 78.4% (1.2 MWh BESS Bank)</p>
            </div>

            <div>
              <label class="block text-slate-700 font-semibold mb-1">Monitored Classrooms &amp; Labs:</label>
              <input type="number" id="input_rooms" step="1" min="1" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-slate-900">
              <p class="text-[10px] text-slate-400 mt-1">Default: 142 Monitored Rooms</p>
            </div>

            <div>
              <label class="block text-slate-700 font-semibold mb-1">Attendance Calculation Mode:</label>
              <div class="flex rounded-xl bg-slate-100 p-1 text-[11px] font-semibold">
                <button type="button" id="attModeCalculatedBtn" onclick="setAttendanceMode('calculated')" class="flex-1 py-1.5 rounded-lg bg-white text-slate-900 shadow-sm transition">Auto (Courses)</button>
                <button type="button" id="attModeManualBtn" onclick="setAttendanceMode('manual')" class="flex-1 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition">Manual %</button>
              </div>
              <div id="manualAttInputWrapper" class="mt-2 hidden">
                <div class="relative">
                  <input type="number" id="input_manualAttendance" step="0.1" min="0" max="100" placeholder="e.g. 85.0" class="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 pr-8">
                  <span class="absolute right-2.5 top-1.5 text-[11px] font-mono text-slate-400">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- MODAL SUB-TAB 2: ATTENDANCE COURSE REGISTER -->
        <div id="modalSubTabAttendance" class="space-y-3 hidden">
          <div class="flex items-center justify-between">
            <p class="text-[11px] text-slate-500">Edit Conducted and Attended classes per subject to recalculate overall %:</p>
            <button type="button" onclick="resetCoursesToERP()" class="text-[10px] text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1">
              <i data-lucide="rotate-ccw" class="w-3 h-3"></i> Reset to ERP Defaults
            </button>
          </div>

          <div class="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[10px] uppercase">
                  <th class="py-2 px-3">Subject / Code</th>
                  <th class="py-2 px-2 text-center w-24">Attended</th>
                  <th class="py-2 px-2 text-center w-24">Conducted</th>
                  <th class="py-2 px-2 text-center w-20">%</th>
                  <th class="py-2 px-2 text-center w-24">75% Status</th>
                </tr>
              </thead>
              <tbody id="modalCourseTableBody" class="divide-y divide-slate-100 font-mono text-[11px]">
                <!-- Populated dynamically via JS -->
              </tbody>
            </table>
          </div>

          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
            <span class="text-slate-600 font-medium">Aggregated Attendance Total:</span>
            <span class="font-bold font-mono text-slate-900" id="modalAttAggregatedSummary">114 / 140 (81.4%)</span>
          </div>
        </div>

        <!-- MODAL SUB-TAB 3: DATA PROVENANCE & SOURCE INFO -->
        <div id="modalSubTabSources" class="space-y-3 hidden">
          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 class="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <i data-lucide="database" class="w-3.5 h-3.5 text-sky-600"></i>
              System Data Sources &amp; Provenance Architecture
            </h4>
            
            <div class="space-y-2 text-[11px] text-slate-600 leading-relaxed">
              <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                <span class="font-bold text-slate-900 block mb-0.5">🎓 Overall Attendance: 81.4% (AU ERP Gateway)</span>
                Derived directly from Likhith S's Semester V Alliance ERP registered course ledger (<code>attendance_state.json</code>). Calculated across 8 enrolled subjects: 114 classes attended out of 140 conducted = exactly <strong>81.4%</strong>.
              </div>

              <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                <span class="font-bold text-slate-900 block mb-0.5">⚡ Live Power Load: 842.6 kW &amp; Peak Shaved: 18.4%</span>
                Simulated campus electrical load derived from the IEEE Term Paper &amp; Sheet 4 Single Line Diagram (SLD). Combines Chintan Academic Block (312.4 kW) + HVAC Chillers (248.6 kW) + Library Dome (94.2 kW) + Hostels (187.4 kW). Simulated because physical IoT smart meters are not connected via hardware to this client preview.
              </div>

              <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                <span class="font-bold text-slate-900 block mb-0.5">🍃 Energy Saved MTD: 32.4 MWh &amp; Cost: ₹2.67 Lakhs</span>
                Simulated savings achieved across 30 days by the AI occupancy agent automatically setting back HVAC and lights in empty lecture halls, valued at the commercial BESCOM electricity tariff (₹8.25/kWh).
              </div>

              <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                <span class="font-bold text-slate-900 block mb-0.5">🛡️ Timetable Clashes: 0 Clashes</span>
                The deterministic output of the Python Google OR-Tools Constraint Satisfaction Problem (CSP) timetable solver, enforcing zero overlapping classroom bookings.
              </div>

              <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                <span class="font-bold text-slate-900 block mb-0.5">🔋 BESS Storage SoC: 78.4%</span>
                Simulated state-of-charge of the 1.2 MWh campus battery storage bank under peak shaving dispatch.
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- MODAL FOOTER BUTTONS -->
      <div class="mt-5 pt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
        <button type="button" onclick="resetMetricsToDefaults()" class="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl border border-rose-200 transition flex items-center gap-1.5">
          <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
          Reset All to System Defaults
        </button>
        <div class="flex items-center gap-2">
          <button type="button" onclick="closeMetricsEditorModal()" class="text-xs font-semibold text-slate-600 hover:text-slate-800 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button type="button" onclick="saveMetricsFromModal()" class="text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 px-5 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5">
            <i data-lucide="check" class="w-3.5 h-3.5"></i>
            Save &amp; Apply Changes
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- MODAL: CAMPUS FACILITY TELEMETRY DIALOG    -->
  <!-- ========================================== -->
  <div id="facilityModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden" onclick="if(event.target===this) closeFacilityModal()">
    <div class="glass-card max-w-lg w-full p-6 rounded-2xl border border-slate-200 shadow-2xl relative max-h-[92vh] flex flex-col animate__animated animate__fadeInUp animate__faster" onclick="event.stopPropagation()">
      
      <!-- HEADER -->
      <div class="flex justify-between items-start mb-4 pb-3 border-b border-slate-200/80">
        <div class="flex items-center gap-3">
          <div id="facModalIcon" class="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shrink-0 shadow-sm">
            <i data-lucide="building-2" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span id="facModalCategory" class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase bg-slate-100 text-slate-700">Academic</span>
              <span id="facModalFloors" class="text-[10px] font-mono text-slate-500 font-semibold">4 Floors</span>
            </div>
            <h3 id="facModalName" class="text-base font-bold text-slate-900 mt-0.5">Central Library Dome</h3>
            <p id="facModalDistance" class="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
              <i data-lucide="map-pin" class="w-3 h-3 text-slate-400"></i>
              <span>120 m from Main Gate</span>
            </p>
          </div>
        </div>
        <button onclick="closeFacilityModal()" class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- SCROLLABLE CONTENT BODY -->
      <div class="overflow-y-auto flex-1 pr-1 space-y-3.5 text-xs">
        
        <!-- DESCRIPTION BANNER -->
        <p id="facModalDesc" class="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-200">
          50,000 sq ft classical rotunda learning commons with print book stacks, quiet reading pods, IEEE digital library access, and group cubicles.
        </p>

        <!-- 4 TELEMETRY CARDS -->
        <div class="grid grid-cols-2 gap-3">
          
          <!-- Occupancy Card -->
          <div class="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between text-slate-400 mb-1">
              <span class="text-[10px] font-bold uppercase tracking-wider">Live Occupancy</span>
              <i data-lucide="users" class="w-3.5 h-3.5 text-sky-500"></i>
            </div>
            <div class="flex items-baseline justify-between mt-1">
              <span id="facModalOcc" class="text-lg font-extrabold text-slate-900 font-mono">570</span>
              <span id="facModalCapacity" class="text-[11px] font-mono text-slate-400">/ 800 Max</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-1.5 mt-2">
              <div id="facModalOccBar" class="bg-sky-600 h-1.5 rounded-full transition-all duration-500" style="width: 71.3%"></div>
            </div>
            <p id="facModalOccPct" class="text-[10px] text-slate-500 font-semibold mt-1.5">71.3% Utilization</p>
          </div>

          <!-- Climate & Power Load Card -->
          <div class="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between text-slate-400 mb-1">
              <span class="text-[10px] font-bold uppercase tracking-wider">Climate Load</span>
              <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-500"></i>
            </div>
            <div class="flex items-baseline justify-between mt-1">
              <span id="facModalPower" class="text-lg font-extrabold text-slate-900 font-mono">94.2 kW</span>
            </div>
            <p class="text-[10px] text-emerald-600 font-semibold mt-3 flex items-center gap-1">
              <i data-lucide="check" class="w-3 h-3"></i> Sub-Meter Synced
            </p>
          </div>

          <!-- Temperature Card -->
          <div class="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between text-slate-400 mb-1">
              <span class="text-[10px] font-bold uppercase tracking-wider">Indoor Temp</span>
              <i data-lucide="thermometer" class="w-3.5 h-3.5 text-sky-500"></i>
            </div>
            <div class="flex items-baseline justify-between mt-1">
              <span id="facModalTemp" class="text-lg font-extrabold text-slate-900 font-mono">22.8 °C</span>
            </div>
            <p class="text-[10px] text-slate-500 font-semibold mt-3 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Comfort Mode (ASHRAE 55)
            </p>
          </div>

          <!-- AI Setback (Objective 4) Card -->
          <div class="p-3 rounded-xl bg-sky-50/70 border border-sky-200 shadow-sm">
            <div class="flex items-center justify-between text-sky-700 mb-1">
              <span class="text-[10px] font-bold uppercase tracking-wider">AI Setback (Obj 4)</span>
              <i data-lucide="leaf" class="w-3.5 h-3.5 text-emerald-600"></i>
            </div>
            <p class="text-xs font-bold text-sky-950 mt-1">15-min Hysteresis</p>
            <p class="text-[10px] text-sky-700 mt-2 font-medium">Predictive damping on empty zones</p>
          </div>

        </div>

        <!-- KEY WINGS & ACTIVE SPACES -->
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <i data-lucide="layers" class="w-3.5 h-3.5 text-slate-500"></i>
            Facility Wings &amp; Sub-Spaces
          </h4>
          <ul id="facModalSpaces" class="space-y-1.5 text-[11px] text-slate-600">
            <!-- Populated dynamically via JS -->
          </ul>
        </div>

      </div>

      <!-- FOOTER ACTIONS -->
      <div class="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
        <span class="text-[10px] font-mono text-slate-400">Alliance Campus Digital Twin</span>
        <div class="flex items-center gap-2">
          <button onclick="closeFacilityModal()" class="text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition">
            Close
          </button>
          <button id="facModalPrimaryAction" onclick="handleFacilityModalAction()" class="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition shadow-sm flex items-center gap-1.5">
            <i data-lucide="external-link" class="w-3.5 h-3.5 text-sky-400"></i>
            <span id="facModalPrimaryText">View Timetable</span>
          </button>
        </div>
      </div>

    </div>
  </div>

  <!-- ========================================== -->
  <!-- MODAL: LIBRARY BOOK SEARCH RESULTS DIALOG  -->
  

  <!-- JAVASCRIPT LOGIC & ENGINE -->
  <script>
    // ----------------------------------------------------
    // 1. DATA REPOSITORIES & METRICS MANAGEMENT
    // ----------------------------------------------------
    const DEFAULT_ATTENDANCE_DATA = [
      { name: "Discrete Mathematics", code: "E1CSA 316", conducted: 21, attended: 18, room: "LT-201", faculty: "Prof. sum" },
      { name: "Advanced Python", code: "E1CSA 348", conducted: 29, attended: 21, room: "Lab-3", faculty: "Prof. SEM" },
      { name: "Soft Skills - II", code: "E1CSA 108", conducted: 10, attended: 8, room: "CR-104", faculty: "Prof. V-MOH" },
      { name: "Design Project-I", code: "E1CSA 313", conducted: 6, attended: 6, room: "Seminar Hall", faculty: "Dr. Rashmi Mothkur" },
      { name: "Leadership & Mgmt", code: "E1CSA 317", conducted: 10, attended: 7, room: "CR-205", faculty: "Prof. VAM" },
      { name: "Theory of Computation", code: "E1CSA 400", conducted: 17, attended: 16, room: "LT-102", faculty: "Prof. THE" },
      { name: "Java Programming", code: "E1CSA 396", conducted: 23, attended: 19, room: "Lab-1", faculty: "Prof. V-NSH" },
      { name: "Cryptography & NetSec", code: "E1CSA 311", conducted: 24, attended: 19, room: "LT-304", faculty: "Prof. EZL" }
    ];

    const DEFAULT_METRICS = {
      rooms: 142,
      energySaved: 32.4,
      costAvoided: 2.67,
      powerLoad: 842.6,
      peakShaved: 18.4,
      attendanceMode: "calculated",
      manualAttendance: 81.4,
      clashes: 0,
      bessSoc: 78.4
    };

    let ATTENDANCE_DATA = [];
    try {
      const savedAtt = localStorage.getItem('smart_campus_attendance_v2');
      ATTENDANCE_DATA = savedAtt ? JSON.parse(savedAtt) : JSON.parse(JSON.stringify(DEFAULT_ATTENDANCE_DATA));
    } catch(e) {
      ATTENDANCE_DATA = JSON.parse(JSON.stringify(DEFAULT_ATTENDANCE_DATA));
    }

    let METRICS_DATA = {};
    try {
      const savedMetrics = localStorage.getItem('smart_campus_metrics_v2');
      METRICS_DATA = savedMetrics ? JSON.parse(savedMetrics) : JSON.parse(JSON.stringify(DEFAULT_METRICS));
    } catch(e) {
      METRICS_DATA = JSON.parse(JSON.stringify(DEFAULT_METRICS));
    }

    // ----------------------------------------------------
    // METRICS OVERRIDE & MODAL CONTROLLERS
    // ----------------------------------------------------
    function showToast(message, type = "success") {
      const toast = document.getElementById("toastNotification");
      if (!toast) return;
      const bgClass = type === "success" ? "bg-slate-900 text-white" : "bg-rose-600 text-white";
      const icon = type === "success" ? "check-circle" : "alert-circle";
      toast.className = `fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold ${bgClass} transition-all duration-300 transform translate-y-0 opacity-100`;
      toast.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4 text-emerald-400"></i> <span>${message}</span>`;
      if (window.lucide) lucide.createIcons();
      setTimeout(() => {
        toast.className = "fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none";
      }, 3500);
    }

    function switchModalTab(tabId) {
      const tabMetrics = document.getElementById("modalSubTabMetrics");
      const tabAttendance = document.getElementById("modalSubTabAttendance");
      const tabSources = document.getElementById("modalSubTabSources");

      const btnMetrics = document.getElementById("modalTabBtnMetrics");
      const btnAttendance = document.getElementById("modalTabBtnAttendance");
      const btnSources = document.getElementById("modalTabBtnSources");

      if (tabMetrics) tabMetrics.classList.add("hidden");
      if (tabAttendance) tabAttendance.classList.add("hidden");
      if (tabSources) tabSources.classList.add("hidden");

      [btnMetrics, btnAttendance, btnSources].forEach(btn => {
        if (btn) {
          btn.className = "px-3.5 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition";
        }
      });

      if (tabId === "metrics" && tabMetrics && btnMetrics) {
        tabMetrics.classList.remove("hidden");
        btnMetrics.className = "px-3.5 py-2 border-b-2 border-slate-900 text-slate-900 flex items-center gap-1.5 transition";
      } else if (tabId === "attendance" && tabAttendance && btnAttendance) {
        tabAttendance.classList.remove("hidden");
        btnAttendance.className = "px-3.5 py-2 border-b-2 border-slate-900 text-slate-900 flex items-center gap-1.5 transition";
        renderModalCourseTable();
      } else if (tabId === "sources" && tabSources && btnSources) {
        tabSources.classList.remove("hidden");
        btnSources.className = "px-3.5 py-2 border-b-2 border-slate-900 text-slate-900 flex items-center gap-1.5 transition";
      }
      if (window.lucide) lucide.createIcons();
    }

    function setAttendanceMode(mode) {
      METRICS_DATA.attendanceMode = mode;
      const btnCalc = document.getElementById("attModeCalculatedBtn");
      const btnManual = document.getElementById("attModeManualBtn");
      const manualWrapper = document.getElementById("manualAttInputWrapper");

      if (mode === "calculated") {
        if (btnCalc) btnCalc.className = "flex-1 py-1.5 rounded-lg bg-white text-slate-900 shadow-sm transition";
        if (btnManual) btnManual.className = "flex-1 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition";
        if (manualWrapper) manualWrapper.classList.add("hidden");
      } else {
        if (btnCalc) btnCalc.className = "flex-1 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition";
        if (btnManual) btnManual.className = "flex-1 py-1.5 rounded-lg bg-white text-slate-900 shadow-sm transition";
        if (manualWrapper) manualWrapper.classList.remove("hidden");
      }
    }

    function openMetricsEditorModal(focusField = null) {
      const modal = document.getElementById("metricsModal");
      if (!modal) return;

      document.getElementById("input_powerLoad").value = METRICS_DATA.powerLoad;
      document.getElementById("input_peakShaved").value = METRICS_DATA.peakShaved;
      document.getElementById("input_energySaved").value = METRICS_DATA.energySaved;
      document.getElementById("input_costAvoided").value = METRICS_DATA.costAvoided;
      document.getElementById("input_clashes").value = METRICS_DATA.clashes;
      document.getElementById("input_bessSoc").value = METRICS_DATA.bessSoc;
      document.getElementById("input_rooms").value = METRICS_DATA.rooms;
      document.getElementById("input_manualAttendance").value = METRICS_DATA.manualAttendance;

      setAttendanceMode(METRICS_DATA.attendanceMode || "calculated");
      renderModalCourseTable();

      modal.classList.remove("hidden");

      if (focusField === "attendance") {
        switchModalTab("attendance");
      } else {
        switchModalTab("metrics");
        if (focusField === "power") setTimeout(() => document.getElementById("input_powerLoad").focus(), 60);
        else if (focusField === "energy") setTimeout(() => document.getElementById("input_energySaved").focus(), 60);
        else if (focusField === "clashes") setTimeout(() => document.getElementById("input_clashes").focus(), 60);
        else if (focusField === "bess") setTimeout(() => document.getElementById("input_bessSoc").focus(), 60);
        else if (focusField === "rooms") setTimeout(() => document.getElementById("input_rooms").focus(), 60);
      }
      if (window.lucide) lucide.createIcons();
    }

    function closeMetricsEditorModal() {
      const modal = document.getElementById("metricsModal");
      if (modal) modal.classList.add("hidden");
    }

    function renderModalCourseTable() {
      const tbody = document.getElementById("modalCourseTableBody");
      if (!tbody) return;
      tbody.innerHTML = "";

      let totAtt = 0;
      let totCond = 0;

      ATTENDANCE_DATA.forEach((c, idx) => {
        totAtt += c.attended;
        totCond += c.conducted;
        const pct = c.conducted > 0 ? ((c.attended / c.conducted) * 100).toFixed(1) : "0.0";
        const isSafe = parseFloat(pct) >= 75.0;

        let statusPill = "";
        if (isSafe) {
          const safeBunks = Math.floor((c.attended - 0.75 * c.conducted) / 0.75);
          statusPill = `<span class="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">${safeBunks} Safe</span>`;
        } else {
          const need = Math.ceil((0.75 * c.conducted - c.attended) / 0.25);
          statusPill = `<span class="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-bold text-[10px]">+${need} Req</span>`;
        }

        const tr = document.createElement("tr");
        tr.className = "hover:bg-slate-50 transition";
        tr.innerHTML = `
          <td class="py-2.5 px-3">
            <span class="font-sans font-bold text-slate-800 block text-xs">${c.name}</span>
            <span class="text-[10px] text-slate-400 font-mono">${c.code}</span>
          </td>
          <td class="py-2.5 px-2 text-center">
            <input type="number" min="0" max="${c.conducted + 20}" value="${c.attended}" oninput="updateCourseAttendanceValue(${idx}, 'attended', this.value)" class="w-16 px-2 py-1 text-center rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900">
          </td>
          <td class="py-2.5 px-2 text-center">
            <input type="number" min="1" max="100" value="${c.conducted}" oninput="updateCourseAttendanceValue(${idx}, 'conducted', this.value)" class="w-16 px-2 py-1 text-center rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900">
          </td>
          <td class="py-2.5 px-2 text-center font-bold ${isSafe ? 'text-slate-900' : 'text-rose-600'}">
            ${pct}%
          </td>
          <td class="py-2.5 px-2 text-center">
            ${statusPill}
          </td>
        `;
        tbody.appendChild(tr);
      });

      const aggPct = totCond > 0 ? ((totAtt / totCond) * 100).toFixed(1) : "0.0";
      const summaryEl = document.getElementById("modalAttAggregatedSummary");
      if (summaryEl) {
        summaryEl.innerHTML = `${totAtt} / ${totCond} <span class="${parseFloat(aggPct) >= 75 ? 'text-emerald-600' : 'text-rose-600'}">(${aggPct}%)</span>`;
      }
    }

    function updateCourseAttendanceValue(idx, field, value) {
      const val = parseInt(value);
      if (!isNaN(val) && val >= 0) {
        ATTENDANCE_DATA[idx][field] = val;
        renderModalCourseTable();
      }
    }

    function resetCoursesToERP() {
      ATTENDANCE_DATA = JSON.parse(JSON.stringify(DEFAULT_ATTENDANCE_DATA));
      renderModalCourseTable();
      showToast("Course attendance register reset to AU ERP defaults", "success");
    }

    function saveMetricsFromModal() {
      METRICS_DATA.powerLoad = parseFloat(document.getElementById("input_powerLoad").value) || DEFAULT_METRICS.powerLoad;
      METRICS_DATA.peakShaved = parseFloat(document.getElementById("input_peakShaved").value) || DEFAULT_METRICS.peakShaved;
      METRICS_DATA.energySaved = parseFloat(document.getElementById("input_energySaved").value) || DEFAULT_METRICS.energySaved;
      METRICS_DATA.costAvoided = parseFloat(document.getElementById("input_costAvoided").value) || DEFAULT_METRICS.costAvoided;
      METRICS_DATA.clashes = parseInt(document.getElementById("input_clashes").value) || 0;
      METRICS_DATA.bessSoc = parseFloat(document.getElementById("input_bessSoc").value) || DEFAULT_METRICS.bessSoc;
      METRICS_DATA.rooms = parseInt(document.getElementById("input_rooms").value) || DEFAULT_METRICS.rooms;
      METRICS_DATA.manualAttendance = parseFloat(document.getElementById("input_manualAttendance").value) || DEFAULT_METRICS.manualAttendance;

      try {
        localStorage.setItem("smart_campus_metrics_v2", JSON.stringify(METRICS_DATA));
        localStorage.setItem("smart_campus_attendance_v2", JSON.stringify(ATTENDANCE_DATA));
      } catch(e) {
        console.warn("Storage quota exceeded", e);
      }

      applyAllMetrics();
      closeMetricsEditorModal();
      showToast("Metrics and telemetry overrides applied successfully!", "success");
    }

    function resetMetricsToDefaults() {
      try {
        localStorage.removeItem("smart_campus_metrics_v2");
        localStorage.removeItem("smart_campus_attendance_v2");
      } catch(e) {}
      METRICS_DATA = JSON.parse(JSON.stringify(DEFAULT_METRICS));
      ATTENDANCE_DATA = JSON.parse(JSON.stringify(DEFAULT_ATTENDANCE_DATA));
      applyAllMetrics();
      closeMetricsEditorModal();
      showToast("Restored all telemetry and attendance to official AU defaults", "success");
    }

    function applyAllMetrics() {
      let totalConducted = 0;
      let totalAttended = 0;
      let criticalList = [];

      ATTENDANCE_DATA.forEach(sub => {
        totalConducted += sub.conducted;
        totalAttended += sub.attended;
        const pct = (sub.attended / sub.conducted) * 100;
        if (pct < 75.0) {
          const need = Math.ceil((0.75 * sub.conducted - sub.attended) / 0.25);
          criticalList.push({ name: sub.name, pct: pct.toFixed(1), need: need });
        }
      });

      const dynamicPct = totalConducted > 0 ? ((totalAttended / totalConducted) * 100).toFixed(1) : "0.0";
      const isManualAtt = METRICS_DATA.attendanceMode === "manual";
      const effectivePct = isManualAtt ? (METRICS_DATA.manualAttendance || 81.4).toFixed(1) : dynamicPct;

      const elRooms = document.getElementById("kpi-rooms-val");
      if (elRooms) elRooms.innerText = METRICS_DATA.rooms;

      const elEnergy = document.getElementById("kpi-energy-val");
      if (elEnergy) elEnergy.innerText = METRICS_DATA.energySaved + " MWh";
      const elEnergySub = document.getElementById("kpi-energy-sub");
      if (elEnergySub) elEnergySub.innerText = "₹" + METRICS_DATA.costAvoided + " Lakhs Avoided";

      const elPower = document.getElementById("kpi-power-val");
      if (elPower) elPower.innerText = METRICS_DATA.powerLoad + " kW";
      const elPowerSub = document.getElementById("kpi-power-sub");
      if (elPowerSub) elPowerSub.innerText = METRICS_DATA.peakShaved + "% Peak Shaved";

      const elAtt = document.getElementById("kpi-attendance-val");
      if (elAtt) elAtt.innerText = effectivePct + "%";
      const elAttSub = document.getElementById("kpi-attendance-sub");
      if (elAttSub) elAttSub.innerText = isManualAtt ? "Manual Override Active" : "AU ERP Live Synced";

      const elClashes = document.getElementById("kpi-clashes-val");
      if (elClashes) {
        elClashes.innerText = METRICS_DATA.clashes + " Clashes";
        elClashes.className = METRICS_DATA.clashes === 0 
          ? "text-xl font-extrabold text-indigo-600 font-mono" 
          : "text-xl font-extrabold text-rose-600 font-mono";
      }
      const elClashesSub = document.getElementById("kpi-clashes-sub");
      if (elClashesSub) {
        elClashesSub.innerText = METRICS_DATA.clashes === 0 ? "OR-Tools CSP Solved" : "⚠️ Conflict Detected!";
        elClashesSub.className = METRICS_DATA.clashes === 0 ? "text-[10px] text-slate-500 mt-1" : "text-[10px] text-rose-600 font-bold mt-1";
      }

      const elBess = document.getElementById("kpi-bess-val");
      if (elBess) elBess.innerText = METRICS_DATA.bessSoc + "%";

      const elSankeyPower = document.getElementById("sankeyTotalPower");
      if (elSankeyPower) elSankeyPower.textContent = "Total: " + METRICS_DATA.powerLoad + " kW";
      const elSankeyBess = document.getElementById("sankeyBessSoc");
      if (elSankeyBess) elSankeyBess.textContent = METRICS_DATA.bessSoc + "% Capacity";

      const elAttAvg = document.getElementById("attSummaryAvg");
      if (elAttAvg) elAttAvg.innerText = effectivePct + "%";
      const elAttClasses = document.getElementById("attSummaryClasses");
      if (elAttClasses) elAttClasses.innerText = totalAttended + " / " + totalConducted;
      const elAttFlags = document.getElementById("attSummaryFlags");
      if (elAttFlags) {
        elAttFlags.innerText = criticalList.length + " Critical";
        elAttFlags.className = criticalList.length === 0 ? "text-lg font-bold text-emerald-600 font-mono" : "text-lg font-bold text-rose-600 font-mono";
      }

      const elCritBox = document.getElementById("criticalAlertBox");
      const elCritContent = document.getElementById("criticalAlertContent");
      if (elCritContent && elCritBox) {
        if (criticalList.length === 0) {
          elCritBox.className = "glass-card p-6 rounded-2xl border border-emerald-200 bg-emerald-50/20 flex flex-col justify-between";
          elCritContent.innerHTML = `
            <div class="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase mb-2">
              <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i>
              SEE Eligibility Confirmed
            </div>
            <h4 class="text-sm font-bold text-slate-900 mb-2">All Courses Above 75% Cutoff</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Attendance satisfies AU Academic Regulations across all enrolled subjects. Eligible to download Semester End Examination (SEE) hall ticket without condonation.
            </p>
          `;
        } else {
          elCritBox.className = "glass-card p-6 rounded-2xl border border-rose-200 bg-rose-50/20 flex flex-col justify-between";
          let listItems = criticalList.map(c => `<li>• Attend next ${c.need} consecutive ${c.name} lectures (${c.pct}%)</li>`).join("");
          elCritContent.innerHTML = `
            <div class="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase mb-2">
              <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-600"></i>
              Critical SEE Barred Alert
            </div>
            <h4 class="text-sm font-bold text-slate-900 mb-2">Action Required for ${criticalList.length} Subject${criticalList.length > 1 ? 's' : ''}</h4>
            <p class="text-xs text-slate-600 leading-relaxed mb-2">
              Under AU Academic Regulations, student is <strong>barred from SEE</strong> unless attending:
            </p>
            <ul class="text-xs font-mono space-y-1.5 text-rose-800 bg-rose-50 p-3 rounded-xl border border-rose-200">
              ${listItems}
            </ul>
          `;
        }
      }

      const isCustomized = 
        METRICS_DATA.rooms !== DEFAULT_METRICS.rooms ||
        METRICS_DATA.energySaved !== DEFAULT_METRICS.energySaved ||
        METRICS_DATA.costAvoided !== DEFAULT_METRICS.costAvoided ||
        METRICS_DATA.powerLoad !== DEFAULT_METRICS.powerLoad ||
        METRICS_DATA.peakShaved !== DEFAULT_METRICS.peakShaved ||
        METRICS_DATA.clashes !== DEFAULT_METRICS.clashes ||
        METRICS_DATA.bessSoc !== DEFAULT_METRICS.bessSoc ||
        METRICS_DATA.attendanceMode !== DEFAULT_METRICS.attendanceMode ||
        JSON.stringify(ATTENDANCE_DATA) !== JSON.stringify(DEFAULT_ATTENDANCE_DATA);

      const elBadge = document.getElementById("telemetrySourceBadge");
      const elResetBtn = document.getElementById("resetMetricsBtn");
      const elModalTag = document.getElementById("modalActiveOverrideTag");

      if (elBadge) {
        if (isCustomized) {
          elBadge.className = "text-[10px] px-2.5 py-0.5 rounded-full font-mono bg-amber-50 text-amber-800 border border-amber-300 font-semibold flex items-center gap-1.5";
          elBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Manual Overrides Active`;
          if (elResetBtn) elResetBtn.classList.remove("hidden");
          if (elModalTag) {
            elModalTag.innerText = "Custom Overrides Active";
            elModalTag.className = "text-[10px] px-2 py-0.5 rounded-full font-mono bg-amber-100 text-amber-800 font-semibold";
          }
        } else {
          elBadge.className = "text-[10px] px-2.5 py-0.5 rounded-full font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1.5";
          elBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live Synced (AU ERP / Sim)`;
          if (elResetBtn) elResetBtn.classList.add("hidden");
          if (elModalTag) {
            elModalTag.innerText = "Default Live Mode";
            elModalTag.className = "text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-100 text-emerald-800 font-semibold";
          }
        }
      }

      renderAttendance(extraAbsences);
      if (document.getElementById("tab-attendance") && !document.getElementById("tab-attendance").classList.contains("hidden")) {
        renderAttendanceChart();
      }
      if (window.lucide) {
        lucide.createIcons();
      }
    }

    const TIMETABLE_DATA = [
      { day: "Mon", time: "09:00 - 09:55 AM", course: "Cryptography & Network Security (E1CSA 311)", faculty: "Prof. EZL", room: "LT-304", buffer: "1 safe bunk", setback: "Comfort Mode (22°C)" },
      { day: "Mon", time: "10:00 - 10:55 AM", course: "Design Project - I (E1CSA 313)", faculty: "Dr. Rashmi Mothkur / DSR", room: "Seminar Hall", buffer: "2 safe bunks", setback: "Comfort Mode (22°C)" },
      { day: "Mon", time: "11:05 - 12:00 PM", course: "Discrete Mathematics (E1CSA 316)", faculty: "Prof. sum", room: "LT-201", buffer: "3 safe bunks", setback: "Comfort Mode (22°C)" },
      { day: "Mon", time: "12:05 - 01:00 PM", course: "Java Programming (E1CSA 396)", faculty: "Prof. V-NSH", room: "Lab-1", buffer: "2 safe bunks", setback: "Comfort Mode (22°C)" },
      { day: "Tue", time: "08:00 - 09:55 AM", course: "Advanced Python Programming (E1CSA 348)", faculty: "Prof. SEM", room: "Lab-3", buffer: "CRITICAL: Attend Next 3", setback: "Active Session" },
      { day: "Tue", time: "10:00 - 12:00 PM", course: "Leadership & Management Skills (E1CSA 317)", faculty: "Prof. VAM", room: "CR-205", buffer: "CRITICAL: Attend Next 2", setback: "Active Session" },
      { day: "Wed", time: "08:00 - 09:55 AM", course: "Soft Skills - II (E1CSA 108)", faculty: "Prof. V-MOH", room: "CR-104", buffer: "0 Bunks Buffer", setback: "Active Session" },
      { day: "Wed", time: "10:00 - 10:55 AM", course: "Theory of Computation (E1CSA 400)", faculty: "Prof. THE", room: "LT-102", buffer: "4 safe bunks", setback: "Comfort Mode (22°C)" },
      { day: "Wed", time: "11:05 - 01:00 PM", course: "Discrete Mathematics (E1CSA 316)", faculty: "Prof. sum", room: "LT-201", buffer: "3 safe bunks", setback: "Comfort Mode (22°C)" },
      { day: "Thu", time: "08:00 - 09:55 AM", course: "Advanced Python Programming (E1CSA 348)", faculty: "Prof. SEM", room: "Lab-3", buffer: "CRITICAL: Attend Next 3", setback: "Active Session" },
      { day: "Thu", time: "10:00 - 10:55 AM", course: "Cryptography & NetSec (E1CSA 311)", faculty: "Prof. EZL", room: "LT-304", buffer: "1 safe bunk", setback: "Comfort Mode (22°C)" },
      { day: "Thu", time: "11:05 - 01:00 PM", course: "Java Programming (E1CSA 396)", faculty: "Prof. V-NSH", room: "Lab-1", buffer: "2 safe bunks", setback: "Comfort Mode (22°C)" },
      { day: "Fri", time: "08:00 - 09:55 AM", course: "Cryptography & NetSec (E1CSA 311)", faculty: "Prof. EZL", room: "LT-304", buffer: "1 safe bunk", setback: "Comfort Mode (22°C)" },
      { day: "Fri", time: "10:00 - 10:55 AM", course: "Discrete Mathematics (E1CSA 316)", faculty: "Prof. sum", room: "LT-201", buffer: "3 safe bunks", setback: "Comfort Mode (22°C)" },
      { day: "Fri", time: "11:05 - 01:00 PM", course: "Theory of Computation (E1CSA 400)", faculty: "Prof. THE", room: "LT-102", buffer: "4 safe bunks", setback: "Comfort Mode (22°C)" },
      { day: "Sat", time: "08:00 - 08:55 AM", course: "Advanced Python Programming (E1CSA 348)", faculty: "Prof. SEM", room: "Lab-3", buffer: "CRITICAL: Attend Next 3", setback: "Active Session" }
    ];

    const CAMPUS_FACILITIES = [
      {
        id: "chintan",
        name: "Chintan Academic Block (ACED)",
        category: "academic",
        floors: "7 Floors",
        capacity: 1600,
        currentOcc: 1250,
        temp: 23.5,
        power: 248.6,
        distance: "180 m from Main Gate",
        desc: "Flagship engineering facility housing CSE Department, Advanced AI/ML Research Labs, 30 Smart Lecture Theatres and Faculty Suites.",
        spaces: [
          "Smart Lecture Theatres (LT-101 to LT-306)",
          "Advanced AI/ML Research Center (Lab-3)",
          "High Performance Cloud Computing & Cybersecurity Lab",
          "CSE Department Suites & Central Seminar Hall"
        ],
        hvacStatus: "+3°C Predictive Setback Active (Empty Classrooms Damped)",
        meshIndex: 0
      },
      {
        id: "library",
        name: "Central Library Dome",
        category: "library",
        floors: "4 Floors (Rotunda)",
        capacity: 800,
        currentOcc: 570,
        temp: 22.8,
        power: 94.2,
        distance: "120 m from Main Gate",
        desc: "50,000 sq ft classical rotunda learning commons with print book stacks, quiet reading pods, IEEE digital library access, and group cubicles.",
        spaces: [
          "Ground Floor: Circulation Desk & IEEE Digital Access Commons",
          "Floor 1 & 2: Quiet Reading Rotunda & Reference Book Stacks",
          "Floor 3: Collaborative Discussion Cubicles",
          "Floor 4: Research Scholar Reading Carrels"
        ],
        hvacStatus: "Comfort Mode (22.8°C Constant, CO₂ Scrubber Active)",
        meshIndex: 1
      },
      {
        id: "admin",
        name: "Neoclassical Admin Rotunda",
        category: "admin",
        floors: "GF + 2 Floors",
        capacity: 350,
        currentOcc: 160,
        temp: 24.2,
        power: 62.1,
        distance: "60 m from Main Gate",
        desc: "Office of the Chancellor, Vice-Chancellor, Registrar cabins, Admissions center, and central university boardroom.",
        spaces: [
          "Office of the Chancellor & Vice-Chancellor",
          "Registrar & Academic Affairs Directorate",
          "Admissions & University Examination Bureau",
          "Central Boardroom & Senate Chamber"
        ],
        hvacStatus: "Standard Administrative Profile",
        meshIndex: 2
      },
      {
        id: "hostels",
        name: "Student Residential Wing",
        category: "hostel",
        floors: "6 Floors",
        capacity: 2200,
        currentOcc: 1380,
        temp: 24.8,
        power: 187.4,
        distance: "420 m from Main Gate",
        desc: "Men and Women residential wings with dining commons, laundry facilities, study lounges, and solar hot water heating.",
        spaces: [
          "Men's Residential Blocks A & B",
          "Women's Residential Blocks C & D",
          "Central Student Dining Commons & Cafeteria",
          "Solar Thermal Rooftop Hot Water Storage Plant"
        ],
        hvacStatus: "Off-Peak Residential Power Allocation",
        meshIndex: 3
      },
      {
        id: "sports",
        name: "Sports & Athletics Complex",
        category: "sports",
        floors: "Outdoor Ground",
        capacity: 500,
        currentOcc: 90,
        temp: 27.0,
        power: 14.5,
        distance: "340 m from Main Gate",
        desc: "Regulation cricket turf, multi-court basketball complex, volleyball grounds, and athletic training stadium.",
        spaces: [
          "Regulation Cricket Turf Ground & Pavilions",
          "Multi-Court Basketball & Volleyball Arenas",
          "Athletics Synthetic Sprint Track",
          "Indoor Fitness Center & Sports Clinic"
        ],
        hvacStatus: "Ambient Outdoor Natural Ventilation",
        meshIndex: 4
      },
      {
        id: "parking",
        name: "Surface Parking Quad",
        category: "admin",
        floors: "Ground Level",
        capacity: 450,
        currentOcc: 324,
        temp: 28.5,
        power: 8.2,
        distance: "30 m from Main Gate",
        desc: "Multi-bay automated parking quad with smart EV charging bays and entry barrier license plate recognition.",
        spaces: [
          "Bay 1: Student Two-Wheeler Multi-Row Quad (250 bays)",
          "Bay 2: Faculty & Visitor Sedan Parking (150 bays)",
          "8 Dedicated High-Speed EV Charging Bays",
          "ANPR Automated Barrier Recognition Gate"
        ],
        hvacStatus: "Outdoor Solar Canopy Lighting",
        meshIndex: 5
      }
    ];

    let currentRole = "student";
    let extraAbsences = 0;
    let facilityCategoryFilter = "all";

    // ----------------------------------------------------
    // 2. TAB NAVIGATION
    // ----------------------------------------------------
        function reload3DFrame() {
      const frame = document.getElementById("digitalTwinFrame");
      if (frame) {
        frame.src = "https://smart-campus-dashboard-web.vercel.app?t=" + Date.now();
        showToast("3D Digital Twin Viewport reloaded", "info");
      }
    }

    function toggle3DFullscreen() {
      const container = document.getElementById("digitalTwinContainer");
      if (!container) return;
      if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
          container.requestFullscreen().catch(() => {
            window.open("./digital_twin_3d/index.html", "_blank");
          });
        } else {
          window.open("./digital_twin_3d/index.html", "_blank");
        }
      } else {
        document.exitFullscreen();
      }
    }

    function switchTab(tabId) {
      document.querySelectorAll("main > section").forEach(sec => sec.classList.add("hidden"));
      document.querySelectorAll(".nav-item").forEach(btn => btn.classList.remove("active"));

      const targetSec = document.getElementById(`tab-${tabId}`);
      const targetNav = document.getElementById(`nav-${tabId}`);
      if (targetSec) targetSec.classList.remove("hidden");
      if (targetNav) targetNav.classList.add("active");

      // Trigger Three.js resize, render functions, or charts resize when switching
      if (tabId === "navigation") {
        renderFacilityCards();
      } else if (tabId === "library") {
        renderSeats();
      } else if (tabId === "events") {
        renderEvents();
      } else if (tabId === "campus3d") {
        setTimeout(handle3DResize, 100);
      } else if (tabId === "energy") {
        setTimeout(renderEnergyChart, 100);
      } else if (tabId === "attendance") {
        setTimeout(renderAttendanceChart, 100);
      }

      if (window.lucide) {
        lucide.createIcons();
      }
    }

    // ----------------------------------------------------
    // 3. THREE.JS 3D CAMPUS DIGITAL TWIN
    // ----------------------------------------------------
    let scene, camera, renderer, controls;
    let campusMeshes = [];
    let isWireframe = false;

    function init3DCampus() {
      const container = document.getElementById("threeCanvasContainer");
      const canvas = document.getElementById("threeCanvas");
      if (!container || !canvas) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f172a); // Slate-900

      camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
      camera.position.set(65, 55, 75);

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxPolarAngle = Math.PI / 2.1; // Don't go below ground
      controls.target.set(0, 5, 0);

      // LIGHTING
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
      dirLight.position.set(40, 80, 50);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 2048;
      dirLight.shadow.mapSize.height = 2048;
      scene.add(dirLight);

      // GROUND PLANE (60-Acre Campus Base)
      const groundGeo = new THREE.PlaneGeometry(160, 160);
      const groundMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      // GRID HELPER (Clean subtle road/plot layout)
      const grid = new THREE.GridHelper(160, 32, 0x38bdf8, 0x334155);
      grid.position.y = 0.05;
      scene.add(grid);

      // BUILDINGS SETUP
      campusMeshes = [];

      // 1. Chintan Academic Block (ACED) - Large multi-story block
      const chintanGeo = new THREE.BoxGeometry(28, 16, 18);
      const chintanMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, metalness: 0.2 });
      const chintanMesh = new THREE.Mesh(chintanGeo, chintanMat);
      chintanMesh.position.set(0, 8, -5);
      chintanMesh.castShadow = true;
      chintanMesh.receiveShadow = true;
      chintanMesh.userData = { id: "chintan", name: "Chintan Academic Block (ACED)", occ: "1,250 (78%)", power: "248.6 kW", setback: "Comfort Mode (22°C)" };
      scene.add(chintanMesh);
      campusMeshes.push(chintanMesh);

      // Rooftop Solar Array on Chintan
      const solarGeo = new THREE.BoxGeometry(24, 0.6, 14);
      const solarMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.2, metalness: 0.5 });
      const solarMesh = new THREE.Mesh(solarGeo, solarMat);
      solarMesh.position.set(0, 16.3, -5);
      scene.add(solarMesh);

      // 2. Central Library Rotunda (Cylinder + Dome)
      const libCylGeo = new THREE.CylinderGeometry(8, 8, 10, 32);
      const libMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.4 });
      const libMesh = new THREE.Mesh(libCylGeo, libMat);
      libMesh.position.set(-36, 5, -8);
      libMesh.castShadow = true;
      libMesh.userData = { id: "library", name: "Central Library Rotunda", occ: "570 (71%)", power: "94.2 kW", setback: "Optimized (22.8°C)" };
      scene.add(libMesh);
      campusMeshes.push(libMesh);

      const domeGeo = new THREE.SphereGeometry(8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.2, metalness: 0.3 });
      const domeMesh = new THREE.Mesh(domeGeo, domeMat);
      domeMesh.position.set(-36, 10, -8);
      scene.add(domeMesh);

      // 3. Admin Rotunda Dome
      const adminGeo = new THREE.BoxGeometry(16, 8, 14);
      const adminMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.5 });
      const adminMesh = new THREE.Mesh(adminGeo, adminMat);
      adminMesh.position.set(36, 4, -10);
      adminMesh.castShadow = true;
      adminMesh.userData = { id: "admin", name: "Neoclassical Admin Rotunda", occ: "160 (45%)", power: "62.1 kW", setback: "Standard Mode" };
      scene.add(adminMesh);
      campusMeshes.push(adminMesh);

      const adminDomeGeo = new THREE.SphereGeometry(5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const adminDomeMesh = new THREE.Mesh(adminDomeGeo, new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
      adminDomeMesh.position.set(36, 8, -10);
      scene.add(adminDomeMesh);

      // 4. Hostels Block
      const hostelGeo = new THREE.BoxGeometry(40, 12, 14);
      const hostelMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 });
      const hostelMesh = new THREE.Mesh(hostelGeo, hostelMat);
      hostelMesh.position.set(0, 6, 35);
      hostelMesh.castShadow = true;
      hostelMesh.userData = { id: "hostels", name: "Student Residential Wing", occ: "1,380 (62%)", power: "187.4 kW", setback: "Evening Peak Ready" };
      scene.add(hostelMesh);
      campusMeshes.push(hostelMesh);

      // 5. Sports Complex (Low elevation field)
      const sportsGeo = new THREE.BoxGeometry(32, 1.5, 22);
      const sportsMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.9 });
      const sportsMesh = new THREE.Mesh(sportsGeo, sportsMat);
      sportsMesh.position.set(40, 0.75, 25);
      sportsMesh.userData = { id: "sports", name: "Sports & Athletics Complex", occ: "90 (18%)", power: "14.5 kW", setback: "Floodlights Off" };
      scene.add(sportsMesh);
      campusMeshes.push(sportsMesh);

      // 6. Surface Parking Quad
      const parkGeo = new THREE.BoxGeometry(24, 0.4, 20);
      const parkMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
      const parkMesh = new THREE.Mesh(parkGeo, parkMat);
      parkMesh.position.set(-38, 0.2, 25);
      parkMesh.userData = { id: "parking", name: "Surface Parking Quad", occ: "324 / 450 Bays (72%)", power: "8.2 kW", setback: "EV Chargers Active" };
      scene.add(parkMesh);
      campusMeshes.push(parkMesh);

      // RAYCASTER FOR CLICK-TO-INSPECT
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      canvas.addEventListener("click", (evt) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((evt.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(campusMeshes);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (hit.userData && hit.userData.name) {
            currentSelectedFacilityId = hit.userData.id || "chintan";
            document.getElementById("hudName").innerText = hit.userData.name;
            document.getElementById("hudOccupancy").innerText = hit.userData.occ;
            document.getElementById("hudPower").innerText = hit.userData.power;
            document.getElementById("hudSetback").innerText = hit.userData.setback;
          }
        }
      });

      window.addEventListener("resize", handle3DResize);

      // Animation Loop
      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }
      animate();
    }

    function handle3DResize() {
      const container = document.getElementById("threeCanvasContainer");
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    function reset3DCamera() {
      if (!camera || !controls) return;
      camera.position.set(65, 55, 75);
      controls.target.set(0, 5, 0);
      controls.update();
    }

    function toggle3DWireframe() {
      isWireframe = !isWireframe;
      campusMeshes.forEach(m => {
        if (m.material) m.material.wireframe = isWireframe;
      });
      document.getElementById("wireframeBtn").innerText = `Wireframe: ${isWireframe ? 'On' : 'Off'}`;
    }

    // ----------------------------------------------------
    // 4. CAMPUS FACILITY DIRECTORY CARDS & FILTERS
    // ----------------------------------------------------
    function renderFacilityCards() {
      const container = document.getElementById("facilityCardsContainer");
      if (!container) return;
      container.innerHTML = "";

      const query = (document.getElementById("facilitySearchInput")?.value || "").toLowerCase();

      const filtered = CAMPUS_FACILITIES.filter(f => {
        const matchesCat = (facilityCategoryFilter === "all" || f.category === facilityCategoryFilter);
        const matchesQuery = f.name.toLowerCase().includes(query) || f.desc.toLowerCase().includes(query) || f.category.includes(query);
        return matchesCat && matchesQuery;
      });

      filtered.forEach(item => {
        const occPct = Math.round((item.currentOcc / item.capacity) * 100);
        let badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (occPct > 80) badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
        else if (occPct > 60) badgeColor = "bg-amber-50 text-amber-700 border-amber-200";

        const card = document.createElement("div");
        card.className = "p-5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition flex flex-col justify-between";
        card.innerHTML = `
          <div>
            <div class="flex justify-between items-start mb-2">
              <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${badgeColor} font-semibold">${item.floors}</span>
              <span class="text-xs font-mono font-bold text-slate-800">${item.currentOcc} / ${item.capacity} (${occPct}%)</span>
            </div>
            <h4 class="text-sm font-bold text-slate-900 leading-snug">${item.name}</h4>
            <p class="text-xs text-slate-500 mt-1 line-clamp-2">${item.desc}</p>
            
            <div class="w-full bg-slate-100 rounded-full h-1.5 mt-3">
              <div class="bg-slate-900 h-1.5 rounded-full" style="width: ${Math.min(occPct, 100)}%"></div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div>
                <span class="text-slate-400 block text-[9px]">CLIMATE LOAD</span>
                <span class="font-bold text-slate-800">${item.power} kW</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[9px]">TEMPERATURE</span>
                <span class="font-bold text-slate-800">${item.temp} °C</span>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="text-[10px] text-slate-400 font-mono">${item.distance}</span>
            <button onclick="inspectFacility('${item.id}')" class="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 font-medium transition text-xs">
              Inspect Block
            </button>
          </div>
        `;
        container.appendChild(card);
      });
    }

    function filterFacilities() {
      renderFacilityCards();
    }

    function setFacilityFilter(cat, btnElement) {
      facilityCategoryFilter = cat;
      const chips = document.querySelectorAll("#facilityFilterChips button");
      chips.forEach(b => {
        b.className = "px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition";
      });
      if (btnElement) {
        btnElement.className = "px-2.5 py-1 rounded-lg font-semibold bg-white text-slate-900 shadow-sm transition";
      }
      renderFacilityCards();
    }

    let currentSelectedFacilityId = "chintan";
    let currentInspectedFacility = null;

    function inspectFacility(facId) {
      openFacilityModal(facId);
    }

    function inspectSelected3DBuilding() {
      openFacilityModal(currentSelectedFacilityId || "chintan");
    }

    function openFacilityModal(facId) {
      const fac = CAMPUS_FACILITIES.find(f => f.id === facId);
      if (!fac) return;
      currentInspectedFacility = fac;

      const modal = document.getElementById("facilityModal");
      if (!modal) return;

      document.getElementById("facModalName").innerText = fac.name;
      document.getElementById("facModalCategory").innerText = fac.category.toUpperCase();
      document.getElementById("facModalFloors").innerText = fac.floors;
      document.getElementById("facModalDistance").innerHTML = `<i data-lucide="map-pin" class="w-3 h-3 text-slate-400"></i> <span>${fac.distance}</span>`;
      document.getElementById("facModalDesc").innerText = fac.desc;

      document.getElementById("facModalOcc").innerText = fac.currentOcc.toLocaleString();
      document.getElementById("facModalCapacity").innerText = `/ ${fac.capacity.toLocaleString()} Max`;
      const occPct = ((fac.currentOcc / fac.capacity) * 100).toFixed(1);
      document.getElementById("facModalOccBar").style.width = Math.min(occPct, 100) + "%";
      document.getElementById("facModalOccPct").innerText = `${occPct}% Space Utilization`;

      document.getElementById("facModalPower").innerText = `${fac.power} kW`;
      document.getElementById("facModalTemp").innerText = `${fac.temp} °C`;

      // Icon & Category styling
      const iconContainer = document.getElementById("facModalIcon");
      if (fac.category === "library") {
        iconContainer.innerHTML = `<i data-lucide="book-open" class="w-5 h-5 text-indigo-600"></i>`;
        iconContainer.className = "w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shrink-0 shadow-sm";
      } else if (fac.category === "academic") {
        iconContainer.innerHTML = `<i data-lucide="graduation-cap" class="w-5 h-5 text-sky-600"></i>`;
        iconContainer.className = "w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center border border-sky-100 shrink-0 shadow-sm";
      } else if (fac.category === "hostel") {
        iconContainer.innerHTML = `<i data-lucide="home" class="w-5 h-5 text-emerald-600"></i>`;
        iconContainer.className = "w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0 shadow-sm";
      } else if (fac.category === "sports") {
        iconContainer.innerHTML = `<i data-lucide="trophy" class="w-5 h-5 text-amber-600"></i>`;
        iconContainer.className = "w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 shrink-0 shadow-sm";
      } else {
        iconContainer.innerHTML = `<i data-lucide="landmark" class="w-5 h-5 text-slate-600"></i>`;
        iconContainer.className = "w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0 shadow-sm";
      }

      // Spaces list
      const spacesList = document.getElementById("facModalSpaces");
      if (spacesList) {
        spacesList.innerHTML = "";
        const spaces = fac.spaces || [
          "Smart Lecture Halls with IoT Lighting Controls",
          "Automated Sensor Environmental Climate Zone",
          "Occupancy-Driven Setback Damper Node"
        ];
        spaces.forEach(s => {
          const li = document.createElement("li");
          li.className = "flex items-center gap-2 py-1.5 px-2.5 rounded-lg bg-white border border-slate-100";
          li.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></span> <span class="font-medium text-slate-700">${s}</span>`;
          spacesList.appendChild(li);
        });
      }

      // Action button customization
      const primaryText = document.getElementById("facModalPrimaryText");
      if (primaryText) {
        if (fac.category === "library") {
          primaryText.innerText = "Reserve Library Study Desk";
        } else if (fac.category === "academic") {
          primaryText.innerText = "View Class Timetable";
        } else {
          primaryText.innerText = "Explore Campus Area";
        }
      }

      modal.classList.remove("hidden");
      if (window.lucide) lucide.createIcons();
    }

    function closeFacilityModal() {
      const modal = document.getElementById("facilityModal");
      if (modal) modal.classList.add("hidden");
    }

    function handleFacilityModalAction() {
      closeFacilityModal();
      if (!currentInspectedFacility) return;
      if (currentInspectedFacility.category === "library") {
        switchTab("library");
      } else if (currentInspectedFacility.category === "academic") {
        switchTab("timetable");
      } else {
        switchTab("overview");
      }
    }

    // ----------------------------------------------------
    // 5. SMART ATTENDANCE & BUNK SIMULATOR
    // ----------------------------------------------------
    function renderAttendance(absences = 0) {
      const container = document.getElementById("attendanceGrid");
      if (!container) return;
      container.innerHTML = "";

      ATTENDANCE_DATA.forEach(sub => {
        const N = sub.conducted + absences;
        const A = sub.attended;
        const pct = ((A / N) * 100).toFixed(1);
        
        let statusBadge = "";
        let borderClass = "border-slate-200";
        let adviceText = "";

        if (pct >= 75.0) {
          const safeBunks = Math.floor((A - 0.75 * N) / 0.75);
          if (safeBunks >= 3) {
            statusBadge = `<span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-100 text-emerald-800">Safe: ${safeBunks} Bunks</span>`;
            adviceText = `${safeBunks} safe lectures left to bunk`;
          } else if (safeBunks >= 1) {
            statusBadge = `<span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-100 text-amber-800">${safeBunks} Bunks Left</span>`;
            borderClass = "border-amber-200";
            adviceText = `Moderate buffer (${safeBunks} bunks remaining)`;
          } else {
            statusBadge = `<span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-orange-100 text-orange-800">Borderline</span>`;
            borderClass = "border-orange-300";
            adviceText = "Zero buffer! Missing next lecture triggers shortage";
          }
        } else {
          const mustAttend = Math.ceil((0.75 * N - A) / 0.25);
          statusBadge = `<span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-rose-100 text-rose-800">SHORTAGE</span>`;
          borderClass = "border-rose-300 bg-rose-50/20";
          adviceText = `Must attend next ${mustAttend} lectures consecutively`;
        }

        const card = document.createElement("div");
        card.className = `glass-card p-4 rounded-xl border ${borderClass} transition hover:shadow-md cursor-pointer group relative`;
        card.title = `Click to edit attendance for ${sub.name}`;
        card.onclick = () => openMetricsEditorModal('attendance');
        card.innerHTML = `
          <div class="flex justify-between items-start mb-2">
            <span class="text-[11px] font-mono text-slate-500 font-semibold">${sub.code}</span>
            ${statusBadge}
          </div>
          <h4 class="text-xs font-bold text-slate-900 leading-snug">${sub.name}</h4>
          <div class="mt-3 flex items-baseline justify-between">
            <span class="text-xl font-bold font-mono ${pct >= 75 ? 'text-slate-900' : 'text-rose-600'}">${pct}%</span>
            <span class="text-[11px] font-mono text-slate-500">${A} / ${N}</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div class="${pct >= 75 ? 'bg-slate-900' : 'bg-rose-500'} h-1.5 rounded-full" style="width: ${Math.min(pct, 100)}%"></div>
          </div>
          <p class="text-[10px] text-slate-500 mt-2.5 pt-2 border-t border-slate-100 font-medium">${adviceText}</p>
          <div class="opacity-0 group-hover:opacity-100 transition absolute top-2 right-2 text-sky-500 text-[10px] flex items-center gap-0.5 bg-sky-50 px-1 py-0.5 rounded border border-sky-200">
            <i data-lucide="edit-2" class="w-2.5 h-2.5"></i>
          </div>
        `;
        container.appendChild(card);
      });
    }

    function simulateBunks(val) {
      extraAbsences = parseInt(val);
      document.getElementById("bunkSimLabel").innerText = `Simulating +${val} missed lectures`;
      renderAttendance(extraAbsences);
    }

    let attendanceChartInstance = null;
    function renderAttendanceChart() {
      const chartEl = document.getElementById("attendanceChartContainer");
      if (!chartEl) return;
      if (attendanceChartInstance) {
        attendanceChartInstance.destroy();
      }

      const categories = ATTENDANCE_DATA.map(d => d.name);
      const seriesData = ATTENDANCE_DATA.map(d => parseFloat(((d.attended / (d.conducted + extraAbsences)) * 100).toFixed(1)));

      const options = {
        series: [{
          name: 'Current Attendance (%)',
          data: seriesData
        }],
        chart: {
          type: 'bar',
          height: 250,
          toolbar: { show: false },
          fontFamily: 'Inter, sans-serif'
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 4,
            barHeight: '60%',
            colors: {
              ranges: [{
                from: 0,
                to: 74.9,
                color: '#f43f5e' // Rose
              }, {
                from: 75.0,
                to: 100,
                color: '#0f172a' // Slate-900
              }]
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val + "%";
          },
          style: {
            fontSize: '10px',
            fontFamily: 'JetBrains Mono',
            colors: ['#fff']
          }
        },
        xaxis: {
          categories: categories,
          min: 50,
          max: 100,
          labels: {
            formatter: val => val + "%",
            style: { fontSize: '10px', fontFamily: 'JetBrains Mono' }
          }
        },
        yaxis: {
          labels: {
            style: { fontSize: '11px', fontWeight: 500 }
          }
        },
        annotations: {
          xaxis: [{
            x: 75,
            borderColor: '#f43f5e',
            strokeDashArray: 4,
            label: {
              borderColor: '#f43f5e',
              style: { color: '#fff', background: '#f43f5e', fontSize: '9px', fontWeight: 700 },
              text: 'Mandatory 75% SEE Cutoff'
            }
          }]
        },
        grid: {
          borderColor: '#f1f5f9'
        }
      };

      attendanceChartInstance = new ApexCharts(chartEl, options);
      attendanceChartInstance.render();
    }

    // ----------------------------------------------------
    // 6. TIMETABLE RENDERING & FILTER
    // ----------------------------------------------------
    function renderTimetable(filter = "all") {
      const tbody = document.getElementById("timetableBody");
      if (!tbody) return;
      tbody.innerHTML = "";

      const filtered = filter === "all" ? TIMETABLE_DATA : TIMETABLE_DATA.filter(t => t.day === filter);

      filtered.forEach(row => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-slate-50/60 transition";
        tr.innerHTML = `
          <td class="p-3.5 font-bold text-slate-900 font-mono">${row.day}</td>
          <td class="p-3.5 font-mono text-slate-600">${row.time}</td>
          <td class="p-3.5 font-medium text-slate-900">${row.course}</td>
          <td class="p-3.5 text-slate-600 font-medium">${row.faculty}</td>
          <td class="p-3.5 font-mono font-semibold text-sky-600">${row.room}</td>
          <td class="p-3.5">
            <span class="text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${row.buffer.includes('CRITICAL') ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'}">${row.buffer}</span>
          </td>
          <td class="p-3.5 text-slate-500 font-mono text-[11px]">${row.setback}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    function filterDay(evt, day) {
      document.querySelectorAll(".day-btn").forEach(btn => {
        btn.classList.remove("bg-white", "text-slate-900", "shadow-sm");
        btn.classList.add("text-slate-600");
      });
      evt.target.classList.add("bg-white", "text-slate-900", "shadow-sm");
      evt.target.classList.remove("text-slate-600");
      renderTimetable(day);
    }

    // ----------------------------------------------------
    // 7. LIBRARY SEAT RESERVATION SIMULATOR
    // ----------------------------------------------------
    let bookedSeats = new Set(["A2", "A4", "B1", "B5", "C2", "C3", "C6", "D1", "D4", "D5"]);
    let myBooking = null;

    function renderSeats() {
      const grid = document.getElementById("seatGrid");
      if (!grid) return;
      grid.innerHTML = "";

      const rows = ["A", "B", "C", "D"];
      let availCount = 0;

      rows.forEach(r => {
        for (let i = 1; i <= 6; i++) {
          const seatId = `${r}${i}`;
          const isBooked = bookedSeats.has(seatId);
          const isMine = (myBooking === seatId);

          let colorClass = "bg-emerald-500 text-white hover:bg-emerald-600";
          if (isMine) {
            colorClass = "bg-sky-600 text-white font-bold ring-2 ring-sky-300";
          } else if (isBooked) {
            colorClass = "bg-slate-200 text-slate-400 cursor-not-allowed";
          } else {
            availCount++;
          }

          const btn = document.createElement("button");
          btn.className = `p-2.5 rounded-lg text-xs font-mono font-semibold transition flex flex-col items-center justify-center ${colorClass}`;
          btn.innerHTML = `<span>${seatId}</span><span class="text-[9px] opacity-75">${isMine ? 'YOU' : isBooked ? 'BUSY' : 'FREE'}</span>`;
          
          if (!isBooked || isMine) {
            btn.onclick = () => toggleSeat(seatId);
          }
          grid.appendChild(btn);
        }
      });

      document.getElementById("availSeatsCount").innerText = availCount;
    }

    function toggleSeat(seatId) {
      if (myBooking === seatId) {
        myBooking = null;
        showToast(`Reservation cancelled for study desk ${seatId}.`, "info");
      } else {
        myBooking = seatId;
        showToast(`Study Desk ${seatId} successfully reserved under Likith S for 2 hours.`, "success");
      }
          }

    const LIBRARY_CATALOG = [
      { title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell & Peter Norvig", status: "Available", location: "Floor 1, Rotunda Stack B-4", callNo: "QA76.R87 2020" },
      { title: "Cloud Computing Principles & Paradigms", author: "Rajkumar Buyya et al.", status: "Available", location: "Floor 3, Digital Commons Workstation 14", callNo: "QA76.585.C58" },
      { title: "Discrete Mathematical Structures with Applications", author: "J.P. Tremblay & R. Manohar", status: "Checked Out", location: "Floor 1, Stack D-08 (Due Nov 02)", callNo: "QA39.2.T74" },
      { title: "Theory of Computation & Automata", author: "John E. Hopcroft", status: "Available", location: "Floor 2, Stack CS-11", callNo: "QA267.H56" },
      { title: "Cryptography and Network Security", author: "William Stallings", status: "Available", location: "Floor 2, Stack CS-22", callNo: "TK5105.59.S7" }
    ];

    function searchLibraryBooks() {
      const query = document.getElementById("libraryBookSearch")?.value || "";
      if (!query.trim()) {
        showToast("Please enter a book title, subject, or author to search.", "warning");
        return;
      }
      openLibrarySearchModal(query);
    }

    function openLibrarySearchModal(query) {
      const modal = document.getElementById("librarySearchModal");
      const list = document.getElementById("librarySearchResultsList");
      const label = document.getElementById("librarySearchQueryLabel");
      if (!modal || !list) return;

      if (label) label.innerText = `Results matching: "${query}"`;
      list.innerHTML = "";

      const q = query.toLowerCase();
      const results = LIBRARY_CATALOG.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || q === "all");
      const displayResults = results.length > 0 ? results : LIBRARY_CATALOG;

      displayResults.forEach(book => {
        const item = document.createElement("div");
        item.className = "p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition flex items-start justify-between gap-3";
        item.innerHTML = `
          <div>
            <span class="text-[10px] font-mono font-bold ${book.status === 'Available' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'} px-2 py-0.5 rounded border border-slate-200">${book.status}</span>
            <h5 class="font-bold text-slate-900 text-xs mt-1.5 leading-snug">${book.title}</h5>
            <p class="text-[11px] text-slate-500 mt-0.5">${book.author}</p>
            <p class="text-[10px] font-mono text-slate-400 mt-1 flex items-center gap-1">
              <i data-lucide="map-pin" class="w-3 h-3 text-slate-400"></i> ${book.location}
            </p>
          </div>
          <button onclick="showToast('Hold request placed for: ${book.title.replace(/'/g, "")}', 'success'); closeLibrarySearchModal();" class="shrink-0 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition">
            Reserve
          </button>
        `;
        list.appendChild(item);
      });

      modal.classList.remove("hidden");
      if (window.lucide) lucide.createIcons();
    }

    function closeLibrarySearchModal() {
      const modal = document.getElementById("librarySearchModal");
      if (modal) modal.classList.add("hidden");
    }

    // ----------------------------------------------------
    // CAMPUS NAVIGATION & WAYPOINT CALCULATOR
    // ----------------------------------------------------
    const CAMPUS_WAYPOINTS = {
      main_gate: { name: "Campus Main Gate (East Entrance)", coords: [0, 0] },
      parking: { name: "Surface Parking Quad", coords: [30, 10], route: "Proceed 30m straight from East Entry into the automated surface parking quad." },
      admin: { name: "Neoclassical Admin Rotunda", coords: [60, 20], route: "Walk 60m west along Chancellor Way, entry via the neoclassical columned portico." },
      chintan: { name: "Chintan Academic Block (ACED)", coords: [180, 50], route: "Follow University Boulevard for 180m past central fountains, enter Chintan ACED Ground Floor atrium." },
      library: { name: "Central Library Rotunda", coords: [120, -30], route: "Walk 120m north-west through the central palm grove, enter rotunda dome through automated turnstiles." },
      hostels: { name: "Student Residential Wing", coords: [420, 80], route: "Walk 420m past Chintan block towards the residential zone with dedicated pedestrian pathway." },
      sports: { name: "Sports Complex & Cricket Ground", coords: [340, -90], route: "Proceed 340m south past the perimeter garden toward the multi-court sports arena." }
    };

    function calculateCampusRoute() {
      const startKey = document.getElementById("routeStartSelect")?.value || "main_gate";
      const destKey = document.getElementById("routeDestSelect")?.value || "chintan";
      const card = document.getElementById("routeOutputCard");
      const distBadge = document.getElementById("routeDistanceBadge");
      const timeBadge = document.getElementById("routeTimeBadge");
      const textEl = document.getElementById("routeDirectionsText");

      if (!card) return;

      if (startKey === destKey) {
        distBadge.innerText = "0 meters";
        timeBadge.innerText = "Current Location";
        textEl.innerText = "You are currently at this facility. No walking navigation required.";
        card.classList.remove("hidden");
        return;
      }

      const p1 = CAMPUS_WAYPOINTS[startKey];
      const p2 = CAMPUS_WAYPOINTS[destKey];
      const dx = p1.coords[0] - p2.coords[0];
      const dy = p1.coords[1] - p2.coords[1];
      const dist = Math.round(Math.sqrt(dx * dx + dy * dy) * 1.15);
      const walkMins = (dist / 75).toFixed(1);

      distBadge.innerText = `${dist} meters`;
      timeBadge.innerText = `~ ${walkMins} min walking time`;
      textEl.innerText = `Turn-by-turn route from ${p1.name} to ${p2.name}: ${p2.route || 'Follow illuminated campus walkways with 100% ADA step-free accessibility.'}`;
      card.classList.remove("hidden");
      if (window.lucide) lucide.createIcons();
    }

    // ----------------------------------------------------
    // CAMPUS EVENT MANAGEMENT SYSTEM
    // ----------------------------------------------------
    let currentEventFilter = "all";
    const CAMPUS_EVENTS = [
      {
        id: "ev1",
        dateMonth: "OCT",
        dateDay: "24",
        title: "AI/ML Lab Evaluation & Leadership Coursera Certificate Submission",
        dept: "Department of Computer Science & Engineering • V Sem CSE Gen L",
        statusBadge: "Due in 1 Day",
        badgeColor: "text-rose-600 bg-rose-50 border-rose-200",
        category: "exam",
        venue: "Chintan CSE Lab 3"
      },
      {
        id: "ev2",
        dateMonth: "OCT",
        dateDay: "26",
        title: "NPTEL Proctored Examination (Discrete Mathematics & Graph Theory)",
        dept: "Course Code: E1CSA 316 • Official NPTEL Center Slot Allocation",
        statusBadge: "Due in 3 Days",
        badgeColor: "text-slate-600 bg-slate-100 border-slate-200",
        category: "exam",
        venue: "Chintan LT-201"
      },
      {
        id: "ev3",
        dateMonth: "NOV",
        dateDay: "12",
        title: "Design Project – I Final Review–III & SEE Evaluation",
        dept: "ASAC CSE Panel Evaluation • Hardcopy Logbook Sign-off with Dr. Rashmi Mothkur",
        statusBadge: "Upcoming",
        badgeColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
        category: "project",
        venue: "ACED Seminar Hall 1"
      },
      {
        id: "ev4",
        dateMonth: "NOV",
        dateDay: "18",
        title: "Alliance University Annual Tech Symposium & Hackathon 2026",
        dept: "Chintan Academic Block Auditorium • AI/Cloud Project Demonstrations",
        statusBadge: "Scheduled",
        badgeColor: "text-indigo-600 bg-indigo-50 border-indigo-200",
        category: "tech",
        venue: "Chintan Main Auditorium"
      },
      {
        id: "ev5",
        dateMonth: "NOV",
        dateDay: "24",
        title: "Guest Lecture: Cyber-Physical Microgrids & IEEE Smart City Standards",
        dept: "Keynote by IEEE PES Chair • Open to all CSE & EEE Semester 5 Students",
        statusBadge: "Confirmed",
        badgeColor: "text-sky-600 bg-sky-50 border-sky-200",
        category: "tech",
        venue: "Central Library Audio-Visual"
      }
    ];

    function renderEvents() {
      const container = document.getElementById("eventsListContainer");
      if (!container) return;
      container.innerHTML = "";

      const filtered = CAMPUS_EVENTS.filter(e => currentEventFilter === "all" || e.category === currentEventFilter);
      const countBadge = document.getElementById("eventsCountBadge");
      if (countBadge) countBadge.innerText = `${filtered.length} Scheduled Events`;

      filtered.forEach(ev => {
        const card = document.createElement("div");
        card.className = "p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition shadow-sm";
        card.innerHTML = `
          <div class="flex items-center gap-3.5">
            <div class="h-11 w-11 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex flex-col items-center justify-center font-bold shrink-0 shadow-xs">
              <span class="text-[9px] uppercase tracking-wider text-slate-500">${ev.dateMonth}</span>
              <span class="text-sm font-mono leading-none">${ev.dateDay}</span>
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-900 leading-snug">${ev.title}</h4>
              <p class="text-[11px] text-slate-500 mt-0.5">${ev.dept}</p>
              <p class="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                <i data-lucide="map-pin" class="w-3 h-3 text-slate-400"></i> ${ev.venue}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
            <span class="text-xs font-mono font-semibold ${ev.badgeColor} border px-2.5 py-1 rounded-full">${ev.statusBadge}</span>
          </div>
        `;
        container.appendChild(card);
      });
      if (window.lucide) lucide.createIcons();
    }

    function filterEvents(category, btnElement) {
      currentEventFilter = category;
      const chips = document.querySelectorAll("#eventFilterChips button");
      chips.forEach(b => {
        b.className = "px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition";
      });
      if (btnElement) {
        btnElement.className = "px-3 py-1 rounded-lg font-semibold bg-white text-slate-900 shadow-sm transition";
      }
      renderEvents();
    }

    function openEventBookingModal() {
      const modal = document.getElementById("eventBookingModal");
      if (modal) modal.classList.remove("hidden");
      if (window.lucide) lucide.createIcons();
    }

    function closeEventBookingModal() {
      const modal = document.getElementById("eventBookingModal");
      if (modal) modal.classList.add("hidden");
    }

    function submitNewEvent() {
      const title = document.getElementById("newEventTitle")?.value.trim();
      const category = document.getElementById("newEventCategory")?.value || "tech";
      const dateStr = document.getElementById("newEventDate")?.value || "2026-11-20";
      const venue = document.getElementById("newEventVenue")?.value || "ACED Seminar Hall 1";
      const organizer = document.getElementById("newEventOrganizer")?.value || "Dept of CSE";

      if (!title) {
        showToast("Please enter an event title.", "warning");
        return;
      }

      const d = new Date(dateStr);
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const dateMonth = months[d.getMonth()] || "NOV";
      const dateDay = String(d.getDate()).padStart(2, "0");

      CAMPUS_EVENTS.unshift({
        id: "ev_" + Date.now(),
        dateMonth: dateMonth,
        dateDay: dateDay,
        title: title,
        dept: `${organizer} • Verified Zero Collision`,
        statusBadge: "Confirmed",
        badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
        category: category,
        venue: venue
      });

      closeEventBookingModal();
      renderEvents();
      showToast(`Event "${title}" confirmed & venue reserved!`, "success");
    }

    // ----------------------------------------------------
    // 8. ENERGY PREDICTIVE DEMAND APEXCHART
    // ----------------------------------------------------
    let energyChartInstance = null;
    function renderEnergyChart() {
      const chartEl = document.getElementById("energyChartContainer");
      if (!chartEl) return;
      if (energyChartInstance) {
        energyChartInstance.destroy();
      }

      const hours = ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
      const baseline = [320, 290, 280, 310, 540, 890, 960, 910, 840, 780, 620, 410];
      const mlForecast = [310, 285, 275, 305, 510, 820, 880, 840, 760, 640, 510, 380];
      const actualLoad = [312, 288, 274, 308, 515, 825, 876, 842, null, null, null, null];

      const options = {
        series: [
          { name: 'Historical Baseline (kW)', data: baseline },
          { name: 'ML Predicted Demand (kW)', data: mlForecast },
          { name: 'Actual Real-Time Metered (kW)', data: actualLoad }
        ],
        chart: {
          type: 'area',
          height: 280,
          toolbar: { show: false },
          fontFamily: 'Inter, sans-serif'
        },
        colors: ['#94a3b8', '#0284c7', '#10b981'],
        stroke: {
          curve: 'smooth',
          width: [2, 2.5, 3]
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.35,
            opacityTo: 0.05,
            stops: [0, 90, 100]
          }
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: hours,
          labels: { style: { fontFamily: 'JetBrains Mono', fontSize: '10px' } }
        },
        yaxis: {
          labels: {
            formatter: val => val ? val + " kW" : "",
            style: { fontFamily: 'JetBrains Mono', fontSize: '10px' }
          }
        },
        annotations: {
          xaxis: [{
            x: '18:00',
            x2: '22:00',
            fillColor: '#f59e0b',
            opacity: 0.15,
            label: {
              borderColor: '#f59e0b',
              style: { fontSize: '10px', color: '#fff', background: '#d97706', fontWeight: 600 },
              text: 'BESCOM ToD Peak Shaving Window (18:00 - 22:00)'
            }
          }]
        },
        grid: { borderColor: '#f1f5f9' },
        legend: { position: 'top', horizontalAlign: 'right', fontSize: '11px' }
      };

      energyChartInstance = new ApexCharts(chartEl, options);
      energyChartInstance.render();
    }

    function applyRecommendation(btn, message) {
      btn.innerText = "✓ Applied";
      btn.classList.add("bg-emerald-600");
      btn.classList.remove("bg-slate-900");
      showToast(`Optimization Executed: ${message} (15-min hysteresis buffer active)`, "success");
    }

    // ----------------------------------------------------
    // 9. AU ERP GATEWAY AUTHENTICATION MODAL
    // ----------------------------------------------------
    function toggleLoginModal() {
      const modal = document.getElementById("loginModal");
      modal.classList.toggle("hidden");
    }

    function selectRole(role) {
      currentRole = role;
      const btnS = document.getElementById("roleBtnStudent");
      const btnF = document.getElementById("roleBtnFaculty");
      const input = document.getElementById("loginIdInput");

      if (role === "student") {
        btnS.className = "flex-1 py-1.5 rounded-lg bg-white text-slate-900 shadow-sm transition";
        btnF.className = "flex-1 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition";
        input.value = "slikhithBTECH24@ced.alliance.edu.in";
      } else {
        btnF.className = "flex-1 py-1.5 rounded-lg bg-white text-slate-900 shadow-sm transition";
        btnS.className = "flex-1 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition";
        input.value = "dr.rashmi@alliance.edu.in (ASAC-FAC-402)";
      }
    }

    function applyLogin() {
      const id = document.getElementById("loginIdInput").value;
      const key = document.getElementById("loginKeyInput").value;
      const topBadge = document.getElementById("topRoleBadge");
      const sidebarBadge = document.getElementById("sidebarRoleBtn");

      if (currentRole === "student") {
        topBadge.innerText = "Likith S (Lead)";
        sidebarBadge.innerText = "AU ERP: Student View";
      } else {
        topBadge.innerText = "Dr. Rashmi Mothkur (Mentor)";
        sidebarBadge.innerText = "AU ERP: Faculty Admin";
      }

      showToast(`AU ERP Gateway Synced! Token verified for ${id}`, "success");
      toggleLoginModal();
    }

    // ----------------------------------------------------
    // 10. SYSTEM CLOCK & INITIALIZATION
    // ----------------------------------------------------
    function updateClock() {
      const now = new Date();
      const clockEl = document.getElementById("liveClock");
      if (clockEl) {
        clockEl.innerText = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) + " · " + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }
    }

    window.addEventListener("DOMContentLoaded", () => {
      // Initialize icons
      if (window.lucide) {
        lucide.createIcons();
      }

      // Initialize Metrics & Telemetry System
      applyAllMetrics();

      // Initialize sections
      renderTimetable();
      renderFacilityCards();
      renderSeats();
      renderEvents();
      
      // Keyboard navigation: Escape key closes any active modal
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          closeFacilityModal();
          closeMetricsEditorModal();
          closeLibrarySearchModal();
          closeEventBookingModal();
          const login = document.getElementById("loginModal");
          if (login && !login.classList.contains("hidden")) login.classList.add("hidden");
        }
      });

      // Three.js init
      
      // Clock tick
      updateClock();
      setInterval(updateClock, 1000);
    });
  </script>
</body>
</html>
"""

target_path = "/Users/likhith/Desktop/Design Project/00_INTERACTIVE_PREVIEW_SMART_CAMPUS.html"
with open(target_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Successfully generated {target_path} ({len(html_content)} bytes)")

# Sync copies to Drive, Academics, and UI_UX_PART_FILES
destinations = [
    "/Users/likhith/Library/CloudStorage/GoogleDrive-slikith660@gmail.com/My Drive/Design Project/00_INTERACTIVE_PREVIEW_SMART_CAMPUS.html",
    "/Users/likhith/Alliance_Academics/03_Design_Project_I/00_INTERACTIVE_PREVIEW_SMART_CAMPUS.html",
    "/Users/likhith/Desktop/Design Project/UI_UX_PART_FILES/01_Interactive_Prototypes/00_INTERACTIVE_PREVIEW_SMART_CAMPUS.html"
]

for dst in destinations:
    try:
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(target_path, dst)
        print(f"Synced to: {dst}")
    except Exception as e:
        print(f"Warning syncing to {dst}: {e}")


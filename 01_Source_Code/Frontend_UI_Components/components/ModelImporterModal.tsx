import { useState } from "react";
import {
  X,
  Boxes,
  Compass,
  UploadCloud,
  FileCode2,
  CheckCircle2,
  Copy,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";

interface ModelImporterModalProps {
  open: boolean;
  onClose: () => void;
  onCustomModelLoaded?: (url: string, name: string) => void;
}

export default function ModelImporterModal({
  open,
  onClose,
  onCustomModelLoaded,
}: ModelImporterModalProps) {
  const [activeTab, setActiveTab] = useState<"blender" | "cad" | "upload" | "code">("blender");
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [loadedFileName, setLoadedFileName] = useState<string | null>(null);

  if (!open) return null;

  function handleFileDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".glb") || file.name.endsWith(".gltf"))) {
      const url = URL.createObjectURL(file);
      setLoadedFileName(file.name);
      if (onCustomModelLoaded) onCustomModelLoaded(url, file.name);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLoadedFileName(file.name);
      if (onCustomModelLoaded) onCustomModelLoaded(url, file.name);
    }
  }

  const codeSnippet = `// Add to CAMPUS_BUILDINGS in src/data/campusData.ts
{
  id: "innovation-hub",
  code: "AI-HUB",
  name: "Innovation & Robotics Hub",
  subtitle: "CSE Research & Incubation",
  type: "academic",
  position: [-18, 5],     // [X, Z] ground coordinates
  footprint: [9, 9],       // [width, depth]
  floors: 5,               // Number of architectural levels
  floorHeight: 1.15,
  occupancy: 0.85,         // Real-time telemetry defaults (0.0 to 1.0)
  thermal: 0.55,
  energy: 0.72,
  accent: "#e5b887",       // Warm Champagne
  students: 1200,
  labs: 16,
}`;

  function handleCopyCode() {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="glass-panel relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-[2rem] border border-[rgba(229,184,135,0.2)] bg-[#0d121e]/95 shadow-[0_24px_80px_rgba(0,0,0,0.8)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e5b887]/15 border border-[#e5b887]/30 text-[#e5b887]">
              <Boxes size={20} />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold text-white">
                3D Campus Creator &amp; Model Importer
              </h3>
              <p className="text-xs text-slate-400">
                Design in Blender / Autodesk / CAD or add buildings directly to the digital twin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 px-6 bg-white/[0.02] gap-2 overflow-x-auto">
          {[
            { id: "blender", label: "Blender + GIS (Best Free)", icon: Compass },
            { id: "cad", label: "Autodesk / Revit / CAD", icon: Layers },
            { id: "upload", label: "Live Drag & Drop (.glb)", icon: UploadCloud },
            { id: "code", label: "Add Buildings in Code", icon: FileCode2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-mono transition-all whitespace-nowrap ${
                  active
                    ? "border-[#e5b887] text-[#e5b887] font-semibold"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-300 space-y-4 leading-relaxed font-sans">
          {/* Quick 1-Click Load for Built Campus Model */}
          <div className="p-4 rounded-2xl bg-[#e5b887]/15 border border-[#e5b887]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div>
              <span className="text-xs font-mono text-[#e5b887] font-semibold block mb-0.5">
                🏫 UPDATED ALLIANCE UNIVERSITY 3D MODEL AVAILABLE
              </span>
              <p className="text-xs text-slate-200">
                The latest 3D digital twin with 7-floor B.Tech, Aromas, open dome admin block &amp; sports fields is ready.
              </p>
            </div>
            <button
              onClick={() => {
                if (onCustomModelLoaded) {
                  onCustomModelLoaded("/alliance_university_campus.glb", "alliance_university_campus.glb");
                }
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-[#e5b887] text-[#070d18] font-mono text-xs font-bold hover:bg-[#d99b5e] transition cursor-pointer whitespace-nowrap shadow-md"
            >
              Load 3D Campus Now
            </button>
          </div>

          {/* Tab 1: Blender + BlenderGIS */}
          {activeTab === "blender" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#e5b887]/10 border border-[#e5b887]/25">
                <span className="text-xs font-mono text-[#e5b887] font-semibold block mb-1">
                  ⭐ RECOMMENDED WORKFLOW FOR 100% ACCURACY
                </span>
                <p className="text-xs text-slate-200">
                  You can generate the entire 60-acre Alliance University campus (satellite terrain + real building footprint 3D meshes) automatically inside Blender in under 5 minutes using the free <strong>BlenderGIS</strong> plugin!
                </p>
              </div>

              <div className="space-y-3 font-sans text-xs">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="font-mono font-bold text-[#e5b887] bg-[#e5b887]/10 px-2 py-0.5 rounded">1</span>
                  <div>
                    <strong className="text-white">Download Blender</strong>: Free &amp; open-source at{" "}
                    <a href="https://www.blender.org" target="_blank" rel="noreferrer" className="text-[#e5b887] underline inline-flex items-center gap-1">
                      blender.org <ExternalLink size={11} />
                    </a>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="font-mono font-bold text-[#e5b887] bg-[#e5b887]/10 px-2 py-0.5 rounded">2</span>
                  <div>
                    <strong className="text-white">Install BlenderGIS addon</strong>: Download free zip from GitHub (
                    <a href="https://github.com/domlysz/BlenderGIS" target="_blank" rel="noreferrer" className="text-[#e5b887] underline inline-flex items-center gap-1">
                      github.com/domlysz/BlenderGIS <ExternalLink size={11} />
                    </a>). Go to Blender <em>Preferences &gt; Add-ons &gt; Install</em>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="font-mono font-bold text-[#e5b887] bg-[#e5b887]/10 px-2 py-0.5 rounded">3</span>
                  <div>
                    <strong className="text-white">Fetch Satellite Map &amp; Elevation</strong>: In Blender, click the top <em>GIS</em> menu &gt; <em>Web geodata</em> &gt; <em>Basemap</em>. Press <code>G</code> and type <code>Alliance University, Anekal, Bengaluru</code>. Zoom to the campus and press <code>E</code>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="font-mono font-bold text-[#e5b887] bg-[#e5b887]/10 px-2 py-0.5 rounded">4</span>
                  <div>
                    <strong className="text-white">Auto-generate 3D Buildings &amp; Roads</strong>: Click <em>GIS</em> &gt; <em>Web geodata</em> &gt; <em>Get OSM</em>. Check <strong>buildings</strong> and <strong>highway</strong>. OpenStreetMap will automatically create 3D extruded polygonal meshes for the Library, Engineering, and Business blocks!
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="font-mono font-bold text-[#e5b887] bg-[#e5b887]/10 px-2 py-0.5 rounded">5</span>
                  <div>
                    <strong className="text-white">Export to Digital Twin</strong>: Go to <em>File &gt; Export &gt; glTF 2.0 (.glb)</em>. Save as <code>campus.glb</code>.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: CAD / Autodesk */}
          {activeTab === "cad" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                If you have architectural floor plans or 3D models in <strong>Autodesk Revit</strong>, <strong>AutoCAD</strong>, <strong>SketchUp</strong>, or <strong>Rhino</strong>:
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <Layers size={14} className="text-[#e5b887]" /> From Autodesk Revit / AutoCAD
                  </h4>
                  <p className="text-slate-400">
                    Export your project as an <code>.FBX</code> or <code>.OBJ</code>. Open Blender and import the file, apply basic PBR materials, then click <em>File &gt; Export &gt; glTF 2.0 (.glb)</em>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <Compass size={14} className="text-[#d99b5e]" /> From SketchUp
                  </h4>
                  <p className="text-slate-400">
                    In SketchUp Pro, install the free <em>glTF / GLB Exporter</em> plugin from the Extension Warehouse, or export as <code>.DAE (Collada)</code> and convert with Blender.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <Sparkles size={14} className="text-[#86a397]" /> Web-based Alternative: Spline.design
                  </h4>
                  <p className="text-slate-400">
                    Use <a href="https://spline.design" target="_blank" rel="noreferrer" className="text-[#86a397] underline">spline.design</a> to visually build and texture 3D architectural scenes right in your web browser, with 1-click glTF/GLB export.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Upload Drag & Drop */}
          {activeTab === "upload" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Have a <code>.glb</code> or <code>.gltf</code> model of the campus or a new building? Drag and drop it below to load and inspect it immediately:
              </p>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                  dragOver
                    ? "border-[#e5b887] bg-[#e5b887]/10"
                    : "border-white/15 bg-white/[0.02] hover:border-[#e5b887]/40 hover:bg-white/[0.04]"
                }`}
                onClick={() => document.getElementById("glb-upload-input")?.click()}
              >
                <input
                  id="glb-upload-input"
                  type="file"
                  accept=".glb,.gltf"
                  className="hidden"
                  onChange={handleFileInput}
                />
                <UploadCloud size={36} className="text-[#e5b887] mb-3 animate-bounce" />
                <p className="font-mono text-xs font-semibold text-white">
                  Drop your campus.glb file here
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  or click to browse from your Mac / PC
                </p>
              </div>

              {loadedFileName && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
                  <CheckCircle2 size={16} />
                  <span>Model Loaded: <strong>{loadedFileName}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Add via Code */}
          {activeTab === "code" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Edit <code>src/data/campusData.ts</code>
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 font-mono text-xs text-[#e5b887] hover:bg-white/10 transition"
                >
                  {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-[11px] text-slate-300 overflow-x-auto">
                {codeSnippet}
              </pre>

              <p className="text-xs text-slate-400">
                You can easily duplicate this object to add as many academic departments, research centers, dormitories, or cafeteria complexes as you want. The 3D twin will automatically compute floor slabs, window illumination, and telemetry indicators!
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/[0.02]">
          <span className="text-[11px] font-mono text-slate-500">
            Alliance University · CSE Capstone Digital Twin
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#e5b887] text-[#090a0f] font-mono text-xs font-semibold hover:bg-[#d99b5e] transition shadow-md cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

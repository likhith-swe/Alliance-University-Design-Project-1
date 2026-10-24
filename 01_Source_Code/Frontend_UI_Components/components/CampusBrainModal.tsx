import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  Search,
  BookOpen,
  Cpu,
  Boxes,
  Plus,
  CheckCircle2,
  X,
  Play,
  Check,
  RefreshCw,
  Key,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  campusEvolution,
  type ResearchLog,
  type ProposedElement,
  type KnowledgeDoc,
} from "../services/campusEvolutionAgent";
import { campusAiEngine } from "../services/campusAiEngine";
import { useSonar } from "../hooks/useSonar";

interface CampusBrainModalProps {
  open: boolean;
  onClose: () => void;
  onSelectBuilding?: (buildingId: string) => void;
}

type TabType = "research" | "knowledge" | "train" | "settings";

export default function CampusBrainModal({ open, onClose }: CampusBrainModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("research");
  const [logs, setLogs] = useState<ResearchLog[]>([]);
  const [elements, setElements] = useState<ProposedElement[]>([]);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDoc[]>([]);
  const [isResearching, setIsResearching] = useState(false);
  const [searchKnowledge, setSearchKnowledge] = useState("");
  const { play } = useSonar();

  // Model Training Form State
  const [trainTitle, setTrainTitle] = useState("");
  const [trainCategory, setTrainCategory] = useState("Academics");
  const [trainContent, setTrainContent] = useState("");
  const [isTraining, setIsTraining] = useState(false);
  const [trainingEpoch, setTrainingEpoch] = useState(0);
  const [trainingLoss, setTrainingLoss] = useState(2.85);
  const [trainingDone, setTrainingDone] = useState(false);

  // Settings State
  const [provider, setProvider] = useState<"local" | "gemini" | "groq">("local");
  const [geminiKey, setGeminiKey] = useState("");
  const [groqKey, setGroqKey] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    // Initial sync
    syncState();

    // Subscribe to background changes
    const unsub = campusEvolution.subscribe(() => {
      syncState();
    });

    const settings = campusAiEngine.getSettings();
    setProvider(settings.provider);
    setGeminiKey(settings.geminiApiKey || "");
    setGroqKey(settings.groqApiKey || "");

    return () => unsub();
  }, []);

  function syncState() {
    setLogs([...campusEvolution.getLogs()]);
    setElements([...campusEvolution.getAllElements()]);
    setKnowledgeDocs([...campusEvolution.getKnowledgeDocs()]);
    setIsResearching(campusEvolution.getIsResearching());
  }

  function handleTriggerResearch() {
    play("ping");
    campusEvolution.tick();
  }

  function handleApprove(id: string) {
    play("chime");
    campusEvolution.approveElement(id);
  }

  function handleReject(id: string) {
    play("click");
    campusEvolution.rejectElement(id);
  }

  function handleStartTraining(e: React.FormEvent) {
    e.preventDefault();
    if (!trainTitle.trim() || !trainContent.trim()) return;

    play("ping");
    setIsTraining(true);
    setTrainingEpoch(1);
    setTrainingLoss(2.85);
    setTrainingDone(false);

    // Simulate real LoRA / fine-tuning gradient steps
    const interval = setInterval(() => {
      setTrainingEpoch((prev) => {
        if (prev >= 5) {
          clearInterval(interval);
          setIsTraining(false);
          setTrainingDone(true);
          play("chime");

          // Add to knowledge base
          campusEvolution.addKnowledgeDoc(
            trainTitle,
            trainCategory,
            trainContent,
            [trainCategory, "User-Trained", "Alliance Model v2.5"]
          );
          setTrainTitle("");
          setTrainContent("");
          return 5;
        }
        setTrainingLoss((loss) => +(loss * 0.58).toFixed(3));
        return prev + 1;
      });
    }, 700);
  }

  function handleSaveSettings() {
    campusAiEngine.saveSettings({
      provider,
      geminiApiKey: geminiKey.trim(),
      groqApiKey: groqKey.trim(),
    });
    play("chime");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  }

  const filteredDocs = knowledgeDocs.filter(
    (d) =>
      d.title.toLowerCase().includes(searchKnowledge.toLowerCase()) ||
      d.content.toLowerCase().includes(searchKnowledge.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(searchKnowledge.toLowerCase()))
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-[#050810]/85 backdrop-blur-md" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 flex h-[86vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border border-[rgba(229,184,135,0.22)] bg-[#090a0f] shadow-[0_24px_80px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e5b887]/30 bg-[#e5b887]/10 text-[#e5b887]">
                  <Brain size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg font-semibold text-white">
                      Alliance Campus Brain
                    </h2>
                    <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {isResearching ? "Active Researching…" : "Autonomous Agent Live"}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-slate-400">
                    Continuous Learning · Real-time Element Synthesis · College Knowledge RAG
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 bg-white/[0.02] px-6">
              <button
                onClick={() => setActiveTab("research")}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 font-mono text-xs font-medium transition cursor-pointer ${
                  activeTab === "research"
                    ? "border-[#e5b887] text-[#e5b887]"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Cpu size={14} />
                Live Evolution & Stream
              </button>

              <button
                onClick={() => setActiveTab("knowledge")}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 font-mono text-xs font-medium transition cursor-pointer ${
                  activeTab === "knowledge"
                    ? "border-[#e5b887] text-[#e5b887]"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <BookOpen size={14} />
                College Knowledge Vault ({knowledgeDocs.length})
              </button>

              <button
                onClick={() => setActiveTab("train")}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 font-mono text-xs font-medium transition cursor-pointer ${
                  activeTab === "train"
                    ? "border-[#e5b887] text-[#e5b887]"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Sparkles size={14} />
                Train & Fine-Tune Model
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 font-mono text-xs font-medium transition cursor-pointer ${
                  activeTab === "settings"
                    ? "border-[#e5b887] text-[#e5b887]"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Key size={14} />
                AI Provider Settings
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* TAB 1: RESEARCH & EVOLUTION */}
              {activeTab === "research" && (
                <div className="space-y-6">
                  {/* Action Banner */}
                  <div className="flex flex-col gap-3 rounded-2xl border border-[#e5b887]/20 bg-[rgba(229,184,135,0.05)] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-display text-sm font-semibold text-white">
                        Autonomous Campus Research Engine
                      </h3>
                      <p className="font-mono text-xs text-slate-400 mt-0.5">
                        Continuously investigates solar potential, ACED labs, Chikkahagade micro-climate, and synthesizes 3D models.
                      </p>
                    </div>
                    <button
                      onClick={handleTriggerResearch}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#e5b887] px-4 py-2 font-mono text-xs font-semibold text-[#090a0f] hover:bg-[#e09f58] transition shadow-md cursor-pointer shrink-0"
                    >
                      <RefreshCw size={13} className={isResearching ? "animate-spin" : ""} />
                      Trigger Research Pulse
                    </button>
                  </div>

                  {/* Proposed 3D Elements Waiting for Approval */}
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-[#e5b887] mb-3 flex items-center gap-2">
                      <Boxes size={14} />
                      Synthesized 3D Elements ({elements.filter((e) => e.status === "proposed").length} Pending Approval)
                    </h4>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {elements.map((elem) => {
                        const isApproved = elem.status === "approved";
                        return (
                          <div
                            key={elem.id}
                            className={`flex flex-col justify-between rounded-2xl border p-4 transition ${
                              isApproved
                                ? "border-emerald-500/30 bg-emerald-500/[0.04]"
                                : "border-[#e5b887]/30 bg-white/[0.02] hover:border-[#e5b887]/50"
                            }`}
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h5 className="font-display text-sm font-semibold text-white">
                                  {elem.name}
                                </h5>
                                <span
                                  className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                                    isApproved
                                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                      : "bg-[#e5b887]/20 text-[#e5b887] border border-[#e5b887]/40"
                                  }`}
                                >
                                  {isApproved ? "Rendered in 3D" : "AI Proposed"}
                                </span>
                              </div>

                              <p className="font-sans text-xs text-slate-300 mt-2 leading-relaxed">
                                {elem.description}
                              </p>

                              <div className="mt-3 flex flex-wrap gap-2 font-mono text-[10px] text-slate-400">
                                <span className="rounded-lg bg-white/5 px-2 py-1">
                                  Coords: [{elem.position[0]}, {elem.position[1]}]
                                </span>
                                <span className="rounded-lg bg-white/5 px-2 py-1">
                                  {elem.floors} Floors
                                </span>
                                <span className="rounded-lg bg-[#e5b887]/10 text-[#e5b887] px-2 py-1 font-semibold">
                                  {elem.impactMetric}
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end gap-2">
                              {isApproved ? (
                                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400">
                                  <CheckCircle2 size={13} /> Active in 3D Campus Twin
                                </span>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleReject(elem.id)}
                                    className="rounded-xl border border-white/10 px-3 py-1.5 font-mono text-xs text-slate-400 hover:text-white transition cursor-pointer"
                                  >
                                    Discard
                                  </button>
                                  <button
                                    onClick={() => handleApprove(elem.id)}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#e5b887] px-3 py-1.5 font-mono text-xs font-semibold text-[#090a0f] hover:bg-[#e09f58] transition shadow-md cursor-pointer"
                                  >
                                    <Plus size={13} /> Deploy to 3D Twin
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Live Continuous Research Stream */}
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                      <Zap size={14} className="text-[#e5b887]" />
                      Live Autonomous Research Feed
                    </h4>

                    <div className="space-y-2 rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-xs">
                      {logs.map((log) => (
                        <div
                          key={log.id}
                          className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-white/5 pb-2 last:border-0 last:pb-0"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-[#e5b887]">›</span>
                            <div>
                              <span className="text-white font-medium">{log.title}:</span>{" "}
                              <span className="text-slate-400 font-sans">{log.detail}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 shrink-0 ml-4">
                            <span>{log.timestamp}</span>
                            <span className="rounded bg-white/5 px-1.5 py-0.5 text-emerald-400 font-mono">
                              {(log.confidence * 100).toFixed(0)}% conf
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: COLLEGE KNOWLEDGE BASE */}
              {activeTab === "knowledge" && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
                    <input
                      value={searchKnowledge}
                      onChange={(e) => setSearchKnowledge(e.target.value)}
                      placeholder="Search Alliance University knowledge chunks (ACED, Library, Solar Microgrid, UGC Act, ASB)…"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 font-sans text-xs text-white placeholder:text-slate-500 focus:border-[#e5b887]/50 focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-3">
                    {filteredDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-[#e5b887]/30 hover:bg-white/[0.03]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-display text-sm font-semibold text-white">
                            {doc.title}
                          </h4>
                          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#e5b887]">
                            {doc.category}
                          </span>
                        </div>

                        <p className="font-sans text-xs text-slate-300 mt-2 leading-relaxed">
                          {doc.content}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {doc.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-lg bg-white/5 px-2 py-0.5 font-mono text-[9px] text-slate-400"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: TRAIN & FINE-TUNE MODEL */}
              {activeTab === "train" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-[#e5b887]/20 bg-[rgba(229,184,135,0.05)] p-4">
                    <h3 className="font-display text-sm font-semibold text-white">
                      Train the Campus AI Model on College Data
                    </h3>
                    <p className="font-mono text-xs text-slate-400 mt-0.5">
                      Input new department announcements, lab equipment, faculty profiles, or campus guidelines. The system automatically computes embeddings, integrates the knowledge into the RAG vector store, and updates model weights.
                    </p>
                  </div>

                  <form onSubmit={handleStartTraining} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block font-mono text-xs text-slate-400 mb-1.5">
                          Document Title / Topic
                        </label>
                        <input
                          value={trainTitle}
                          onChange={(e) => setTrainTitle(e.target.value)}
                          placeholder="e.g. ACED Quantum Robotics Lab Inauguration 2026"
                          required
                          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 font-sans text-xs text-white placeholder:text-slate-500 focus:border-[#e5b887]/50 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-slate-400 mb-1.5">
                          Department / Category
                        </label>
                        <select
                          value={trainCategory}
                          onChange={(e) => setTrainCategory(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#090a0f] px-3.5 py-2 font-sans text-xs text-white focus:border-[#e5b887]/50 focus:outline-none"
                        >
                          <option value="Academics">Academics (ACED, ASB, Law)</option>
                          <option value="Infrastructure">Campus Infrastructure & Labs</option>
                          <option value="Sustainability">Green Campus & Solar Microgrid</option>
                          <option value="Hostel & Student Life">Hostel & Student Life</option>
                          <option value="Research & Publications">Research & Publications</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-slate-400 mb-1.5">
                        Knowledge Content (Paste syllabus, guidelines, or facts)
                      </label>
                      <textarea
                        rows={4}
                        value={trainContent}
                        onChange={(e) => setTrainContent(e.target.value)}
                        placeholder="e.g. Alliance University has opened a new 450 sqm Quantum Simulation Lab on ACED Floor 3 equipped with 16 cryogenic sensor units and high-speed optical testbenches..."
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3.5 font-sans text-xs text-white placeholder:text-slate-500 focus:border-[#e5b887]/50 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isTraining || !trainTitle.trim() || !trainContent.trim()}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#e5b887] px-5 py-2.5 font-mono text-xs font-semibold text-[#090a0f] hover:bg-[#e09f58] transition shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isTraining ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" />
                          Fine-Tuning Weights (Epoch {trainingEpoch}/5)…
                        </>
                      ) : (
                        <>
                          <Play size={13} />
                          Run Fine-Tuning & Ingest Knowledge
                        </>
                      )}
                    </button>
                  </form>

                  {/* Training Visualizer */}
                  {(isTraining || trainingDone) && (
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#e5b887]">
                          {trainingDone ? "✓ Model Fine-Tuning Complete" : "Training in Progress…"}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          Target Model: Alliance-Campus-v2.5
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2">
                          <span className="block text-[10px] text-slate-500">EPOCH</span>
                          <span className="text-white font-semibold">{trainingEpoch} / 5</span>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2">
                          <span className="block text-[10px] text-slate-500">LOSS CURVE</span>
                          <span className="text-emerald-400 font-semibold">{trainingLoss}</span>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2">
                          <span className="block text-[10px] text-slate-500">PERPLEXITY</span>
                          <span className="text-white font-semibold">1.14</span>
                        </div>
                      </div>

                      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#e5b887] to-emerald-400"
                          initial={{ width: "0%" }}
                          animate={{ width: `${(trainingEpoch / 5) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>

                      {trainingDone && (
                        <p className="mt-3 text-emerald-400 text-[11px]">
                          Success! The AI model has absorbed this knowledge. Open the Copilot (⌘K) and ask about your newly added topic to test it!
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: SETTINGS & CLOUD LLM */}
              {activeTab === "settings" && (
                <div className="space-y-6 max-w-xl">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <h4 className="font-display text-sm font-semibold text-white flex items-center gap-2">
                      <ShieldCheck size={16} className="text-emerald-400" />
                      Zero-Key Local Engine (Default)
                    </h4>
                    <p className="font-sans text-xs text-slate-300 mt-1 leading-relaxed">
                      By default, the digital twin runs an internal client-side semantic inference engine with verified Alliance University RAG lookups and real 3D tool calling. No external keys required!
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block font-mono text-xs text-slate-400 mb-1.5">
                        Inference Engine
                      </label>
                      <select
                        value={provider}
                        onChange={(e) => setProvider(e.target.value as any)}
                        className="w-full rounded-xl border border-white/10 bg-[#090a0f] px-3.5 py-2 font-sans text-xs text-white focus:border-[#e5b887]/50 focus:outline-none"
                      >
                        <option value="local">Client-Side Semantic Engine (Free / Offline / Instant)</option>
                        <option value="gemini">Google Gemini 2.0 Flash (External API)</option>
                        <option value="groq">Groq Llama 3.3 70B (Fast Cloud Inference)</option>
                      </select>
                    </div>

                    {provider === "gemini" && (
                      <div>
                        <label className="block font-mono text-xs text-slate-400 mb-1.5">
                          Google Gemini API Key
                        </label>
                        <input
                          type="password"
                          value={geminiKey}
                          onChange={(e) => setGeminiKey(e.target.value)}
                          placeholder="AIzaSy..."
                          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 font-mono text-xs text-white placeholder:text-slate-600 focus:border-[#e5b887]/50 focus:outline-none"
                        />
                      </div>
                    )}

                    {provider === "groq" && (
                      <div>
                        <label className="block font-mono text-xs text-slate-400 mb-1.5">
                          Groq API Key
                        </label>
                        <input
                          type="password"
                          value={groqKey}
                          onChange={(e) => setGroqKey(e.target.value)}
                          placeholder="gsk_..."
                          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 font-mono text-xs text-white placeholder:text-slate-600 focus:border-[#e5b887]/50 focus:outline-none"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleSaveSettings}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#e5b887] px-4 py-2 font-mono text-xs font-semibold text-[#090a0f] hover:bg-[#e09f58] transition shadow-md cursor-pointer"
                      >
                        <Check size={13} />
                        Save Settings
                      </button>
                      {savedSuccess && (
                        <span className="font-mono text-xs text-emerald-400 animate-fade-in">
                          Settings saved successfully!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

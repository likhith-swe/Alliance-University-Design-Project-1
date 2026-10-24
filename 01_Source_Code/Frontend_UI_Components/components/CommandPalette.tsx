import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Search, ArrowUpRight, Loader2, CheckCircle2, TerminalSquare, X, Brain } from "lucide-react";
import { COPILOT_PROMPTS, type CopilotResponse } from "../data/campusData";
import { campusAiEngine } from "../services/campusAiEngine";
import { useSonar } from "../hooks/useSonar";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onFocusBuilding?: (buildingId: string) => void;
  onSetHeatmapMode?: (mode: "normal" | "thermal" | "energy" | "occupancy") => void;
  onOpenBrain?: () => void;
}

type Stage = "idle" | "reasoning" | "tools" | "answer";

export default function CommandPalette({
  open,
  onClose,
  onFocusBuilding,
  onSetHeatmapMode,
  onOpenBrain,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [visibleReasoning, setVisibleReasoning] = useState<string[]>([]);
  const [visibleTools, setVisibleTools] = useState<number>(0);
  const [response, setResponse] = useState<CopilotResponse | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { play } = useSonar();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 60);
      play("open");
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  function reset() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStage("idle");
    setVisibleReasoning([]);
    setVisibleTools(0);
    setResponse(null);
    setQuery("");
  }

  async function runQuery(prompt: string) {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setQuery(prompt);
    setVisibleReasoning([]);
    setVisibleTools(0);
    setStage("reasoning");
    play("ping");

    // Dynamic processing through our Semantic Campus AI Engine
    const matched = await campusAiEngine.processQuery(prompt, {
      onFocusBuilding: (bId) => {
        onFocusBuilding?.(bId);
      },
      onSetHeatmapMode: (m) => {
        onSetHeatmapMode?.(m);
      },
      onOpenStudio: () => {
        onOpenBrain?.();
      },
    });

    setResponse(matched);

    matched.reasoning.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleReasoning((prev) => [...prev, line]);
      }, 220 * (i + 1));
      timers.current.push(t);
    });

    const toolStart = 220 * matched.reasoning.length + 180;
    setTimeout(() => setStage("tools"), toolStart);
    matched.toolCalls.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleTools((prev) => prev + 1);
        play("click");
      }, toolStart + 350 * (i + 1));
      timers.current.push(t);
    });

    const answerStart = toolStart + 350 * matched.toolCalls.length + 220;
    const t = setTimeout(() => {
      setStage("answer");
      play("chime");
    }, answerStart);
    timers.current.push(t);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[8vh] sm:pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-[#050810]/80 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)] border border-[rgba(229,184,135,0.22)] bg-[#090a0f]"
          >
            <div
              className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[120%] -translate-x-1/2 opacity-40 blur-3xl"
              style={{ background: "radial-gradient(ellipse, rgba(229,184,135,0.25), transparent 70%)" }}
            />

            <div className="relative flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <Sparkles size={17} className="shrink-0 text-[#e5b887]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) runQuery(query.trim());
                }}
                placeholder="Ask Alliance Campus AI anything… 'hi', 'show library', 'tell me about ACED', 'spawn solar carport'"
                className="w-full bg-transparent text-[15px] text-white placeholder:text-slate-500 focus:outline-none font-sans"
              />
              <button onClick={onClose} className="rounded-lg p-1 text-slate-500 hover:bg-white/10 hover:text-white transition cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[62vh] overflow-y-auto px-5 py-4">
              {stage === "idle" && (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Suggested queries</p>
                    {onOpenBrain && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenBrain();
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#e5b887]/30 bg-[#e5b887]/10 px-2.5 py-1 font-mono text-[11px] text-[#e5b887] hover:bg-[#e5b887]/20 transition cursor-pointer"
                      >
                        <Brain size={12} />
                        Train Model / Knowledge Vault
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {[
                      "Tell me about Alliance University campus & history",
                      "Focus on the Neoclassical Central Library rotunda",
                      "Inspect Alliance College of Engineering & Design (ACED)",
                      "Switch heatmap layer to live occupancy",
                      "Synthesize and spawn a new solar carport",
                    ].map((p) => (
                      <button
                        key={p}
                        onClick={() => runQuery(p)}
                        className="group flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-left text-sm text-slate-300 transition hover:border-[#e5b887]/30 hover:bg-[#e5b887]/[0.06] hover:text-white cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5">
                          <Search size={13} className="text-slate-500 group-hover:text-[#e5b887]" />
                          {p}
                        </span>
                        <ArrowUpRight size={14} className="text-slate-600 opacity-0 transition group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-3 text-[11px] text-slate-500 font-mono">
                    <TerminalSquare size={12} />
                    Dynamic Semantic AI Engine · Real-Time 3D Tool Calling · Live Alliance RAG
                  </div>
                </>
              )}

              {stage !== "idle" && response && (
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#d99b5e]">Reasoning trace</p>
                    <div className="flex flex-col gap-1.5 rounded-xl border border-[#d99b5e]/20 bg-[#d99b5e]/[0.04] p-3 font-mono text-[12px] leading-relaxed text-slate-300">
                      {visibleReasoning.map((line, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-2"
                        >
                          <span className="text-[#d99b5e]">›</span>
                          {line}
                        </motion.div>
                      ))}
                      {stage === "reasoning" && (
                        <div className="flex items-center gap-2 text-slate-500">
                          <Loader2 size={11} className="animate-spin text-[#d99b5e]" /> analyzing campus telemetry…
                        </div>
                      )}
                    </div>
                  </div>

                  {(stage === "tools" || stage === "answer") && (
                    <div>
                      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#e5b887]">Structured tool calls</p>
                      <div className="flex flex-col gap-2">
                        {response.toolCalls.slice(0, Math.max(visibleTools, stage === "answer" ? response.toolCalls.length : 0)).map((tc, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-xl border border-[#e5b887]/20 bg-[#e5b887]/[0.04] p-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[12px] font-semibold text-[#e5b887]">{tc.name}()</span>
                              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                                <CheckCircle2 size={11} /> {tc.result}
                              </span>
                            </div>
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                              {Object.entries(tc.args).map(([k, v]) => (
                                <span
                                  key={k}
                                  className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[10px] text-slate-400"
                                >
                                  {k}: <span className="text-slate-200">{String(v)}</span>
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {stage === "answer" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4"
                    >
                      <p className="mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-emerald-400">
                        <Sparkles size={11} /> Campus AI Response
                      </p>
                      <p className="text-[14px] leading-relaxed text-slate-100 font-sans whitespace-pre-line">{response.answer}</p>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-5 py-2.5 font-mono text-[10px] text-slate-500">
              <span>Alliance Campus AI · Semantic Tool Calling & Continuous Learning</span>
              <span className="flex items-center gap-1.5">
                <kbd className="kbd">esc</kbd> close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

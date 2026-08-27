import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  Type as TypeIcon,
  Square,
  Circle as CircleIcon,
  Image as ImageIcon,
  Sparkles,
  Download,
  Undo2,
  Redo2,
  Copy,
  Trash2,
  Layers as LayersIcon,
  Palette,
  Upload,
  LayoutTemplate,
  Package,
  WandSparkles,
  Loader2,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronUp,
  ChevronDown,
  Share2,
  Save
} from "lucide-react";
import { AdminShell } from "../../components/admin/AdminShell.jsx";
import { Modal, GhostBtn } from "../../components/ui/Modal.jsx";
import { pushToast } from "../../lib/actionBus.js";
const BRAND = {
  navy: "#1E1B4B",
  deep: "#2D5FA8",
  sky: "#5BA4E8",
  coral: "#F4A261",
  lavender: "#D4C4E8",
  offwhite: "#F0F0F0",
  white: "#FFFFFF",
  ink: "#0F172A"
};
const PALETTE = [BRAND.navy, BRAND.deep, BRAND.sky, BRAND.coral, BRAND.lavender, BRAND.offwhite, BRAND.white, BRAND.ink];
const ASPECTS = [
  { label: "Instagram Post", w: 1080, h: 1080, hint: "1:1" },
  { label: "Story / Reel", w: 1080, h: 1920, hint: "9:16" },
  { label: "YouTube Thumb", w: 1280, h: 720, hint: "16:9" },
  { label: "A4 Brochure", w: 794, h: 1123, hint: "A4" },
  { label: "WhatsApp Status", w: 1080, h: 1920, hint: "9:16" },
  { label: "Web Banner", w: 1600, h: 600, hint: "wide" }
];
const uid = () => Math.random().toString(36).slice(2, 10);
function tmplCohort() {
  return {
    name: "Cohort Announcement",
    size: { w: 1080, h: 1080 },
    bg: BRAND.navy,
    elements: [
      { id: uid(), kind: "ellipse", x: 700, y: -180, w: 640, h: 640, fill: BRAND.deep, radius: 320, rotation: 0, opacity: 0.6, z: 0 },
      { id: uid(), kind: "ellipse", x: -140, y: 720, w: 480, h: 480, fill: BRAND.coral, radius: 240, rotation: 0, opacity: 0.35, z: 0 },
      { id: uid(), kind: "rect", x: 70, y: 120, w: 200, h: 42, fill: BRAND.coral, radius: 21, rotation: -2, opacity: 1, z: 1 },
      { id: uid(), kind: "text", x: 84, y: 128, w: 172, h: 30, text: "NEW COHORT", fontSize: 16, fontWeight: 800, color: BRAND.navy, align: "center", italic: false, font: "sans", rotation: -2, opacity: 1, z: 2 },
      { id: uid(), kind: "text", x: 70, y: 260, w: 940, h: 480, text: "Cohort 08\nAI Engineering", fontSize: 128, fontWeight: 800, color: "#FFFFFF", align: "left", italic: false, font: "display", rotation: 0, opacity: 1, z: 2 },
      { id: uid(), kind: "text", x: 70, y: 820, w: 940, h: 80, text: "Applications close Sunday \xB7 30 seats", fontSize: 36, fontWeight: 500, color: "#E0E7FF", align: "left", italic: false, font: "sans", rotation: 0, opacity: 1, z: 2 },
      { id: uid(), kind: "text", x: 70, y: 980, w: 940, h: 50, text: "tekschool.in", fontSize: 22, fontWeight: 700, color: BRAND.coral, align: "left", italic: false, font: "sans", rotation: 0, opacity: 1, z: 2 }
    ]
  };
}
function tmplPlacement() {
  return {
    name: "Placement Win",
    size: { w: 1080, h: 1080 },
    bg: BRAND.coral,
    elements: [
      { id: uid(), kind: "rect", x: 60, y: 60, w: 960, h: 960, fill: BRAND.navy, radius: 32, rotation: 0, opacity: 1, z: 0 },
      { id: uid(), kind: "text", x: 100, y: 120, w: 900, h: 60, text: "PLACEMENT WIN", fontSize: 26, fontWeight: 800, color: BRAND.coral, align: "left", italic: false, font: "sans", rotation: 0, opacity: 1, z: 1 },
      { id: uid(), kind: "text", x: 100, y: 240, w: 900, h: 400, text: "\u20B922 LPA\nat Meta India", fontSize: 148, fontWeight: 800, color: "#FFFFFF", align: "left", italic: false, font: "display", rotation: 0, opacity: 1, z: 1 },
      { id: uid(), kind: "text", x: 100, y: 720, w: 900, h: 100, text: "Priya S. \xB7 Cohort AI-06\nAI Engineering track", fontSize: 32, fontWeight: 500, color: "#D4C4E8", align: "left", italic: false, font: "sans", rotation: 0, opacity: 1, z: 1 },
      { id: uid(), kind: "text", x: 100, y: 940, w: 900, h: 40, text: "tekschool.in", fontSize: 22, fontWeight: 700, color: BRAND.coral, align: "left", italic: false, font: "sans", rotation: 0, opacity: 1, z: 1 }
    ]
  };
}
function tmplWorkshop() {
  return {
    name: "Weekend Workshop",
    size: { w: 1080, h: 1920 },
    bg: BRAND.deep,
    elements: [
      { id: uid(), kind: "ellipse", x: -200, y: 1400, w: 900, h: 900, fill: BRAND.lavender, radius: 450, rotation: 0, opacity: 0.9, z: 0 },
      { id: uid(), kind: "text", x: 80, y: 200, w: 920, h: 100, text: "FREE WORKSHOP", fontSize: 42, fontWeight: 800, color: BRAND.coral, align: "left", italic: false, font: "sans", rotation: 0, opacity: 1, z: 1 },
      { id: uid(), kind: "text", x: 80, y: 340, w: 920, h: 600, text: "Build an AI agent in 90 minutes", fontSize: 128, fontWeight: 800, color: "#FFFFFF", align: "left", italic: false, font: "display", rotation: 0, opacity: 1, z: 1 },
      { id: uid(), kind: "text", x: 80, y: 1200, w: 920, h: 120, text: "Saturday \xB7 10 AM\u201312 PM\nBengaluru campus + livestream", fontSize: 38, fontWeight: 500, color: BRAND.navy, align: "left", italic: false, font: "sans", rotation: 0, opacity: 1, z: 2 },
      { id: uid(), kind: "text", x: 80, y: 1780, w: 920, h: 50, text: "Register: tekschool.in/workshop", fontSize: 28, fontWeight: 700, color: BRAND.navy, align: "left", italic: false, font: "sans", rotation: 0, opacity: 1, z: 2 }
    ]
  };
}
function tmplBrochure() {
  return {
    name: "Program Brochure Cover",
    size: { w: 794, h: 1123 },
    bg: BRAND.offwhite,
    elements: [
      { id: uid(), kind: "rect", x: 0, y: 0, w: 794, h: 480, fill: BRAND.navy, radius: 0, rotation: 0, opacity: 1, z: 0 },
      { id: uid(), kind: "text", x: 60, y: 60, w: 400, h: 40, text: "TEKSCHOOL", fontSize: 22, fontWeight: 800, color: BRAND.coral, align: "left", italic: false, font: "sans", rotation: 0, opacity: 1, z: 1 },
      { id: uid(), kind: "text", x: 60, y: 240, w: 680, h: 220, text: "AI Engineering", fontSize: 84, fontWeight: 800, color: "#FFFFFF", align: "left", italic: false, font: "display", rotation: 0, opacity: 1, z: 1 },
      { id: uid(), kind: "text", x: 60, y: 540, w: 680, h: 60, text: "2026 Programme Guide", fontSize: 32, fontWeight: 500, color: BRAND.navy, align: "left", italic: false, font: "sans", rotation: 0, opacity: 1, z: 1 },
      { id: uid(), kind: "text", x: 60, y: 620, w: 680, h: 200, text: "Nine months. Six live projects.\nOne shipped capstone.\nOne cohort at a time.", fontSize: 24, fontWeight: 400, color: "#334155", align: "left", italic: false, font: "sans", rotation: 0, opacity: 1, z: 1 },
      { id: uid(), kind: "text", x: 60, y: 1050, w: 680, h: 40, text: "tekschool.in \xB7 Bengaluru", fontSize: 16, fontWeight: 600, color: "#64748B", align: "left", italic: false, font: "sans", rotation: 0, opacity: 1, z: 1 }
    ]
  };
}
const TEMPLATES = [
  { id: "cohort", label: "Cohort Announcement", build: tmplCohort },
  { id: "placement", label: "Placement Win", build: tmplPlacement },
  { id: "workshop", label: "Weekend Workshop", build: tmplWorkshop },
  { id: "brochure", label: "Program Brochure", build: tmplBrochure }
];
const MEDIA_LIB = [
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80"
];
export function StudioPage() {
  const [state, setState] = useState(() => tmplCohort());
  const [selectedId, setSelectedId] = useState(null);
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const [leftTab, setLeftTab] = useState("templates");
  const [uploads, setUploads] = useState([]);
  const [aiPrompt, setAiPrompt] = useState("Diwali offer poster for AI Engineering, navy and gold");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiImgBusy, setAiImgBusy] = useState(false);
  const [rewriteBusy, setRewriteBusy] = useState(false);
  const [rewrites, setRewrites] = useState([]);
  const [showShare, setShowShare] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const stageRef = useRef(null);
  const selected = state.elements.find((e) => e.id === selectedId) ?? null;
  const commit = useCallback((next) => {
    setPast((p) => [...p.slice(-49), state]);
    setFuture([]);
    setState(next);
  }, [state]);
  const undo = useCallback(() => {
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [state, ...f]);
    setState(prev);
  }, [past, state]);
  const redo = useCallback(() => {
    if (future.length === 0) return;
    const [next, ...rest] = future;
    setPast((p) => [...p, state]);
    setFuture(rest);
    setState(next);
  }, [future, state]);
  useEffect(() => {
    const onKey = (e) => {
      const inField = e.target?.matches("input, textarea, [contenteditable=true]");
      if (inField) return;
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.metaKey || e.ctrlKey) && (e.key === "y" || e.key === "z" && e.shiftKey)) {
        e.preventDefault();
        redo();
      } else if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        commit({ ...state, elements: state.elements.filter((el) => el.id !== selectedId) });
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, selectedId, past, future, commit, undo, redo]);
  const updateEl = (id, patch) => {
    setState((s) => ({ ...s, elements: s.elements.map((e) => e.id === id ? { ...e, ...patch } : e) }));
  };
  const commitEl = (id, patch) => {
    commit({ ...state, elements: state.elements.map((e) => e.id === id ? { ...e, ...patch } : e) });
  };
  const addEl = (el) => {
    commit({ ...state, elements: [...state.elements, { ...el, z: state.elements.length }] });
    setSelectedId(el.id);
  };
  const duplicateEl = () => {
    if (!selected) return;
    const cp = { ...selected, id: uid(), x: selected.x + 30, y: selected.y + 30, z: state.elements.length };
    commit({ ...state, elements: [...state.elements, cp] });
    setSelectedId(cp.id);
  };
  const deleteEl = () => {
    if (!selected) return;
    commit({ ...state, elements: state.elements.filter((e) => e.id !== selected.id) });
    setSelectedId(null);
  };
  const layerMove = (dir) => {
    if (!selected) return;
    const arr = [...state.elements].sort((a, b) => a.z - b.z);
    const idx = arr.findIndex((e) => e.id === selected.id);
    if (idx < 0) return;
    let target = idx;
    if (dir === "up") target = Math.min(arr.length - 1, idx + 1);
    else if (dir === "down") target = Math.max(0, idx - 1);
    else if (dir === "top") target = arr.length - 1;
    else target = 0;
    if (target === idx) return;
    const [it] = arr.splice(idx, 1);
    arr.splice(target, 0, it);
    commit({ ...state, elements: arr.map((e, i) => ({ ...e, z: i })) });
  };
  const addText = (preset = "heading") => {
    const cfg = preset === "heading" ? { fontSize: 96, fontWeight: 800, font: "display", text: "Add a headline" } : preset === "sub" ? { fontSize: 48, fontWeight: 700, font: "display", text: "Subheading" } : { fontSize: 24, fontWeight: 400, font: "sans", text: "Body copy \u2014 click to edit" };
    addEl({ id: uid(), kind: "text", x: 100, y: 120, w: 600, h: 160, ...cfg, color: BRAND.navy, align: "left", italic: false, rotation: 0, opacity: 1, z: 0 });
  };
  const addShape = (kind) => addEl({
    id: uid(),
    kind,
    x: 200,
    y: 200,
    w: 320,
    h: 240,
    fill: BRAND.deep,
    radius: kind === "ellipse" ? 160 : 24,
    rotation: 0,
    opacity: 1,
    z: 0
  });
  const addImage = (src) => addEl({
    id: uid(),
    kind: "image",
    x: 120,
    y: 120,
    w: 400,
    h: 400,
    src,
    radius: 24,
    rotation: 0,
    opacity: 1,
    z: 0
  });
  const onUpload = (files) => {
    if (!files) return;
    Array.from(files).slice(0, 5).forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result;
        setUploads((u) => [src, ...u]);
        pushToast(`Uploaded ${f.name}`);
      };
      reader.readAsDataURL(f);
    });
  };
  const aiGenerateDesign = () => {
    setAiBusy(true);
    setTimeout(() => {
      const p = aiPrompt.toLowerCase();
      let base;
      if (/placement|offer|hire|lpa/.test(p)) base = tmplPlacement();
      else if (/workshop|open house|meet|ama/.test(p)) base = tmplWorkshop();
      else if (/brochure|guide|program/.test(p)) base = tmplBrochure();
      else base = tmplCohort();
      if (/gold|amber|diwali/.test(p)) base.bg = "#1A0F2E";
      if (/pink|coral/.test(p)) base.bg = BRAND.coral;
      const heading = base.elements.find((e) => e.kind === "text" && e.fontSize >= 80);
      if (heading) {
        const cleaned = aiPrompt.replace(/[,.]/g, "").split(" ").slice(0, 4).join(" ");
        heading.text = cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
      }
      commit(base);
      setAiBusy(false);
      pushToast("AI drafted a design \u2014 tweak anything");
    }, 700);
  };
  const aiImage = async () => {
    if (!aiPrompt.trim()) {
      pushToast("Enter a prompt first");
      return;
    }
    setAiImgBusy(true);
    try {
      const res = await fetch("/api/ai-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: aiPrompt }) });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error || "Image failed");
      addImage(json.url);
      pushToast("AI image added to canvas");
    } catch {
      const msg = err instanceof Error ? err.message : "Image generation failed";
      pushToast(msg.slice(0, 80));
    } finally {
      setAiImgBusy(false);
    }
  };
  const aiRewrite = async () => {
    if (!selected || selected.kind !== "text") {
      pushToast("Select a text element first");
      return;
    }
    setRewriteBusy(true);
    try {
      const res = await fetch("/api/ai-copy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: selected.text, context: "TekSchool marketing" }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Rewrite failed");
      setRewrites(json.variants ?? []);
    } catch {
      const msg = err instanceof Error ? err.message : "Rewrite failed";
      pushToast(msg.slice(0, 80));
    } finally {
      setRewriteBusy(false);
    }
  };
  const applyRewrite = (t) => {
    if (!selected || selected.kind !== "text") return;
    commitEl(selected.id, { text: t });
    setRewrites([]);
    pushToast("Applied AI rewrite");
  };
  const magicResize = (target) => {
    const sx = target.w / state.size.w;
    const sy = target.h / state.size.h;
    const s = Math.min(sx, sy);
    const offX = (target.w - state.size.w * s) / 2;
    const offY = (target.h - state.size.h * s) / 2;
    commit({
      ...state,
      size: { w: target.w, h: target.h },
      elements: state.elements.map((e) => ({
        ...e,
        x: e.x * s + offX,
        y: e.y * s + offY,
        w: e.w * s,
        h: e.h * s,
        ...e.kind === "text" ? { fontSize: Math.max(10, e.fontSize * s) } : {}
      }))
    });
    pushToast(`Resized to ${target.label}`);
  };
  const exportPng = async () => {
    if (!stageRef.current) return;
    try {
      const dataUrl = await toPng(stageRef.current, { pixelRatio: 2, cacheBust: true, backgroundColor: state.bg });
      const a = document.createElement("a");
      a.download = `${state.name.replace(/\s+/g, "-").toLowerCase()}.png`;
      a.href = dataUrl;
      a.click();
      pushToast("Exported PNG to Downloads");
      setShowExport(false);
    } catch {
      pushToast("Export failed \u2014 some images may be blocked by CORS");
    }
  };
  const applyTemplate = (t) => {
    commit(t.build());
    setSelectedId(null);
    pushToast(`Loaded "${t.label}"`);
  };
  const [stageScale, setStageScale] = useState(1);
  const wrapRef = useRef(null);
  useEffect(() => {
    const compute = () => {
      const el = wrapRef.current;
      if (!el) return;
      const pad = 48;
      const availW = el.clientWidth - pad;
      const availH = el.clientHeight - pad;
      const s = Math.min(availW / state.size.w, availH / state.size.h, 1);
      setStageScale(s);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [state.size.w, state.size.h]);
  return <AdminShell title="Creative Studio" actions={<>
        <button onClick={undo} disabled={past.length === 0} title="Undo (⌘Z)" className="hidden h-9 w-9 place-items-center rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 disabled:opacity-40 md:grid"><Undo2 className="h-4 w-4" /></button>
        <button onClick={redo} disabled={future.length === 0} title="Redo (⌘⇧Z)" className="hidden h-9 w-9 place-items-center rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 disabled:opacity-40 md:grid"><Redo2 className="h-4 w-4" /></button>
        <button onClick={() => setShowExport(true)} className="hidden items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 md:inline-flex"><Download className="h-3.5 w-3.5" /> Export</button>
        <button onClick={() => setShowShare(true)} className="hidden items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#1E1B4B] to-[#2D5FA8] px-3 py-1.5 text-xs font-semibold text-white shadow-[0_6px_16px_-8px_#1E1B4B] md:inline-flex"><Share2 className="h-3.5 w-3.5" /> Publish</button>
      </>}>
      <div className="grid gap-3 lg:grid-cols-[240px_1fr_280px]" style={{ height: "calc(100vh - 160px)" }}>
        {
    /* LEFT PANEL */
  }
        <aside className="flex min-h-0 flex-col rounded-2xl bg-white shadow-[0_10px_30px_-20px_rgba(15,23,42,0.15)]">
          <div className="grid grid-cols-6 gap-0.5 p-1.5">
            {[
    { k: "templates", i: LayoutTemplate },
    { k: "elements", i: Package },
    { k: "text", i: TypeIcon },
    { k: "uploads", i: Upload },
    { k: "brand", i: Palette },
    { k: "ai", i: WandSparkles }
  ].map((t) => <button
    key={t.k}
    onClick={() => setLeftTab(t.k)}
    className={`grid h-9 place-items-center rounded-lg text-[10px] font-semibold ${leftTab === t.k ? "bg-[#1E1B4B] text-white" : "text-slate-500 hover:bg-slate-100"}`}
    title={t.k}
  >
                <t.i className="h-3.5 w-3.5" />
              </button>)}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-3 no-scrollbar">
            {leftTab === "templates" && <>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Start from a template</p>
                <div className="grid grid-cols-2 gap-2">
                  {TEMPLATES.map((t) => <button key={t.id} onClick={() => applyTemplate(t)} className="group overflow-hidden rounded-xl bg-slate-50 text-left hover:ring-2 hover:ring-[var(--accent-blue-deep)]/40">
                      <TemplateThumb build={t.build} />
                      <p className="p-1.5 text-[10px] font-semibold text-slate-600">{t.label}</p>
                    </button>)}
                </div>
                <p className="mb-2 mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Canvas size</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {ASPECTS.map((a) => <button key={a.label} onClick={() => magicResize(a)} className="rounded-lg bg-slate-50 px-2 py-1.5 text-left text-[10px] font-semibold hover:bg-slate-100">
                      <span className="block">{a.label}</span>
                      <span className="text-slate-400">{a.w}×{a.h} · {a.hint}</span>
                    </button>)}
                </div>
              </>}
            {leftTab === "elements" && <>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Shapes</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => addShape("rect")} className="grid h-16 place-items-center rounded-xl bg-slate-50 hover:bg-slate-100"><Square className="h-6 w-6 text-slate-500" /></button>
                  <button onClick={() => addShape("ellipse")} className="grid h-16 place-items-center rounded-xl bg-slate-50 hover:bg-slate-100"><CircleIcon className="h-6 w-6 text-slate-500" /></button>
                </div>
                <p className="mb-2 mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Media library</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {MEDIA_LIB.map((src) => <button key={src} onClick={() => addImage(src)} className="aspect-square overflow-hidden rounded-lg hover:ring-2 hover:ring-[var(--accent-blue-deep)]/50">
                      <img src={src} alt="" className="h-full w-full object-cover" crossOrigin="anonymous" />
                    </button>)}
                </div>
              </>}
            {leftTab === "text" && <>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Add text</p>
                <div className="space-y-2">
                  <button onClick={() => addText("heading")} className="w-full rounded-xl bg-slate-50 p-3 text-left hover:bg-slate-100">
                    <span className="block font-display text-2xl font-bold">Add a heading</span>
                  </button>
                  <button onClick={() => addText("sub")} className="w-full rounded-xl bg-slate-50 p-3 text-left hover:bg-slate-100">
                    <span className="block font-display text-lg font-bold">Add a subheading</span>
                  </button>
                  <button onClick={() => addText("body")} className="w-full rounded-xl bg-slate-50 p-3 text-left hover:bg-slate-100">
                    <span className="block text-sm">Add body copy</span>
                  </button>
                </div>
              </>}
            {leftTab === "uploads" && <>
                <label className="mb-2 grid cursor-pointer place-items-center rounded-xl border-2 border-dashed border-slate-200 p-6 text-center hover:border-[var(--accent-blue-deep)]/50">
                  <Upload className="mb-1 h-5 w-5 text-slate-400" />
                  <span className="text-[11px] font-semibold text-slate-600">Upload from device</span>
                  <span className="text-[10px] text-slate-400">PNG, JPG, SVG · up to 5 files</span>
                  <input type="file" accept="image/*" multiple onChange={(e) => onUpload(e.target.files)} className="hidden" />
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {uploads.map((src, i) => <button key={i} onClick={() => addImage(src)} className="aspect-square overflow-hidden rounded-lg hover:ring-2 hover:ring-[var(--accent-blue-deep)]/50">
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>)}
                  {uploads.length === 0 && <p className="col-span-2 text-center text-[10px] text-slate-400">Your uploads appear here</p>}
                </div>
              </>}
            {leftTab === "brand" && <>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Brand colors</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {PALETTE.map((c) => <button key={c} onClick={() => {
    if (selected && (selected.kind === "rect" || selected.kind === "ellipse")) commitEl(selected.id, { fill: c });
    else if (selected && selected.kind === "text") commitEl(selected.id, { color: c });
    else commit({ ...state, bg: c });
  }} className="aspect-square rounded-lg ring-1 ring-slate-200 hover:ring-2 hover:ring-[var(--accent-blue-deep)]" style={{ background: c }} title={c} />)}
                </div>
                <p className="mb-2 mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Approved fonts</p>
                <div className="space-y-1">
                  <button onClick={() => selected?.kind === "text" && commitEl(selected.id, { font: "display" })} className="w-full rounded-lg bg-slate-50 p-2 text-left font-display text-base font-bold hover:bg-slate-100">Space Grotesk — Display</button>
                  <button onClick={() => selected?.kind === "text" && commitEl(selected.id, { font: "sans" })} className="w-full rounded-lg bg-slate-50 p-2 text-left font-sans text-sm hover:bg-slate-100">Inter — Body</button>
                </div>
                <p className="mb-2 mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Logo</p>
                <button
    onClick={() => addEl({ id: uid(), kind: "text", x: 60, y: 60, w: 300, h: 40, text: "TEKSCHOOL", fontSize: 24, fontWeight: 800, color: BRAND.coral, align: "left", italic: false, font: "sans", rotation: 0, opacity: 1, z: 0 })}
    className="w-full rounded-lg bg-slate-50 p-3 text-left text-[11px] font-semibold hover:bg-slate-100"
  >
                  <span className="block font-sans text-lg font-black tracking-tight text-[#F4A261]">TEKSCHOOL</span>
                  <span className="text-[9px] text-slate-500">Click to add wordmark</span>
                </button>
              </>}
            {leftTab === "ai" && <>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Create with AI</p>
                <textarea
    value={aiPrompt}
    onChange={(e) => setAiPrompt(e.target.value)}
    rows={3}
    placeholder="Describe what you want to design…"
    className="w-full rounded-lg bg-slate-50 p-2 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent-blue-deep)]/30"
  />
                <button onClick={aiGenerateDesign} disabled={aiBusy} className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#1E1B4B] to-[#2D5FA8] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60">
                  {aiBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <WandSparkles className="h-3.5 w-3.5" />}
                  {aiBusy ? "Drafting\u2026" : "Generate design"}
                </button>
                <button onClick={aiImage} disabled={aiImgBusy} className="mt-1.5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-coral/15 px-3 py-2 text-xs font-semibold text-coral hover:bg-coral/25 disabled:opacity-60">
                  {aiImgBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageIcon className="h-3.5 w-3.5" />}
                  {aiImgBusy ? "Generating image\u2026" : "Generate image (add to canvas)"}
                </button>
                <p className="mt-3 text-[10px] text-slate-400">Uses AI · Gemini image model for images, GPT-5.5 for copy.</p>
              </>}
          </div>
        </aside>

        {
    /* STAGE */
  }
        <div ref={wrapRef} className="relative flex min-h-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 p-6">
          <div
    ref={stageRef}
    onPointerDown={(e) => {
      if (e.target === e.currentTarget) setSelectedId(null);
    }}
    style={{
      width: state.size.w,
      height: state.size.h,
      transform: `scale(${stageScale})`,
      transformOrigin: "center center",
      background: state.bg
    }}
    className="relative shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)]"
  >
            {[...state.elements].sort((a, b) => a.z - b.z).map((el) => <Element
    key={el.id}
    el={el}
    selected={el.id === selectedId}
    scale={stageScale}
    onSelect={() => setSelectedId(el.id)}
    onLive={(patch) => updateEl(el.id, patch)}
    onCommit={(patch) => commitEl(el.id, patch)}
  />)}
          </div>

          {
    /* Bottom quick bar */
  }
          <div className="pointer-events-auto absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-xl bg-white px-2 py-1.5 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.3)]">
            <span className="px-2 text-[10px] font-semibold text-slate-500">{state.size.w}×{state.size.h} · {Math.round(stageScale * 100)}%</span>
            <span className="mx-1 h-4 w-px bg-slate-200" />
            <button onClick={undo} disabled={past.length === 0} className="grid h-7 w-7 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"><Undo2 className="h-3.5 w-3.5" /></button>
            <button onClick={redo} disabled={future.length === 0} className="grid h-7 w-7 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"><Redo2 className="h-3.5 w-3.5" /></button>
          </div>
        </div>

        {
    /* RIGHT PANEL — properties */
  }
        <aside className="flex min-h-0 flex-col rounded-2xl bg-white shadow-[0_10px_30px_-20px_rgba(15,23,42,0.15)]">
          <div className="p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{selected ? `${selected.kind} properties` : "Design"}</p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 no-scrollbar">
            {!selected && <>
                <label className="block text-[10px] font-semibold uppercase text-slate-500">Design name
                  <input value={state.name} onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))} className="mt-1 w-full rounded-lg bg-slate-50 px-2 py-1.5 text-xs font-normal normal-case text-foreground outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent-blue-deep)]/30" />
                </label>
                <label className="mt-3 block text-[10px] font-semibold uppercase text-slate-500">Background
                  <div className="mt-1 grid grid-cols-4 gap-1.5">
                    {PALETTE.map((c) => <button key={c} onClick={() => commit({ ...state, bg: c })} className={`aspect-square rounded-lg ring-1 ring-slate-200 ${state.bg === c ? "ring-2 ring-[var(--accent-blue-deep)]" : ""}`} style={{ background: c }} />)}
                  </div>
                </label>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Magic resize</p>
                <div className="mt-1 grid gap-1">
                  {ASPECTS.map((a) => <button key={a.label} onClick={() => magicResize(a)} className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-left text-[11px] font-semibold hover:bg-slate-100">{a.label} <span className="text-slate-400">· {a.hint}</span></button>)}
                </div>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1"><LayersIcon className="h-3 w-3" /> Layers ({state.elements.length})</p>
                <div className="mt-1 space-y-1">
                  {[...state.elements].sort((a, b) => b.z - a.z).map((e) => <button key={e.id} onClick={() => setSelectedId(e.id)} className="flex w-full items-center gap-2 rounded-lg bg-slate-50 px-2 py-1.5 text-left text-[11px] font-semibold hover:bg-slate-100">
                      <span className="grid h-5 w-5 place-items-center rounded bg-white text-slate-400">
                        {e.kind === "text" ? <TypeIcon className="h-3 w-3" /> : e.kind === "image" ? <ImageIcon className="h-3 w-3" /> : e.kind === "ellipse" ? <CircleIcon className="h-3 w-3" /> : <Square className="h-3 w-3" />}
                      </span>
                      <span className="truncate flex-1">{e.kind === "text" ? e.text.split("\n")[0].slice(0, 24) : e.kind}</span>
                    </button>)}
                </div>
              </>}
            {selected && <>
                <div className="mb-2 flex flex-wrap gap-1">
                  <button onClick={duplicateEl} title="Duplicate" className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-[10px] font-semibold hover:bg-slate-100"><Copy className="h-3 w-3" /> Duplicate</button>
                  <button onClick={deleteEl} title="Delete" className="inline-flex items-center gap-1 rounded-lg bg-coral/15 px-2 py-1 text-[10px] font-semibold text-coral hover:bg-coral/25"><Trash2 className="h-3 w-3" /> Delete</button>
                </div>
                <div className="mb-3 grid grid-cols-4 gap-1 rounded-lg bg-slate-50 p-1">
                  <button onClick={() => layerMove("top")} title="To top" className="grid h-7 place-items-center rounded hover:bg-white"><ChevronUp className="h-3 w-3" /><ChevronUp className="-mt-2 h-3 w-3" /></button>
                  <button onClick={() => layerMove("up")} title="Forward" className="grid h-7 place-items-center rounded hover:bg-white"><ChevronUp className="h-3.5 w-3.5" /></button>
                  <button onClick={() => layerMove("down")} title="Backward" className="grid h-7 place-items-center rounded hover:bg-white"><ChevronDown className="h-3.5 w-3.5" /></button>
                  <button onClick={() => layerMove("bottom")} title="To bottom" className="grid h-7 place-items-center rounded hover:bg-white"><ChevronDown className="h-3 w-3" /><ChevronDown className="-mt-2 h-3 w-3" /></button>
                </div>

                {selected.kind === "text" && <TextProps el={selected} onLive={(p) => updateEl(selected.id, p)} onCommit={(p) => commitEl(selected.id, p)} onAiRewrite={aiRewrite} rewriteBusy={rewriteBusy} rewrites={rewrites} applyRewrite={applyRewrite} />}
                {(selected.kind === "rect" || selected.kind === "ellipse") && <ShapeProps el={selected} onLive={(p) => updateEl(selected.id, p)} onCommit={(p) => commitEl(selected.id, p)} />}
                {selected.kind === "image" && <ImageProps el={selected} onLive={(p) => updateEl(selected.id, p)} onCommit={(p) => commitEl(selected.id, p)} />}

                <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Transform</p>
                <div className="mt-1 grid grid-cols-2 gap-1.5">
                  <NumField label="X" value={Math.round(selected.x)} onChange={(v) => commitEl(selected.id, { x: v })} />
                  <NumField label="Y" value={Math.round(selected.y)} onChange={(v) => commitEl(selected.id, { y: v })} />
                  <NumField label="W" value={Math.round(selected.w)} onChange={(v) => commitEl(selected.id, { w: Math.max(20, v) })} />
                  <NumField label="H" value={Math.round(selected.h)} onChange={(v) => commitEl(selected.id, { h: Math.max(20, v) })} />
                </div>
                <label className="mt-3 block text-[10px] font-semibold uppercase text-slate-500">Rotation
                  <input type="range" min={-180} max={180} value={selected.rotation} onChange={(e) => updateEl(selected.id, { rotation: Number(e.target.value) })} onPointerUp={(e) => commitEl(selected.id, { rotation: Number(e.target.value) })} className="w-full accent-[var(--accent-blue-deep)]" />
                </label>
                <label className="mt-2 block text-[10px] font-semibold uppercase text-slate-500">Opacity
                  <input type="range" min={0} max={100} value={Math.round(selected.opacity * 100)} onChange={(e) => updateEl(selected.id, { opacity: Number(e.target.value) / 100 })} onPointerUp={(e) => commitEl(selected.id, { opacity: Number(e.target.value) / 100 })} className="w-full accent-[var(--accent-blue-deep)]" />
                </label>
              </>}
          </div>
        </aside>
      </div>

      <Modal open={showShare} onClose={() => setShowShare(false)} title="Publish to site" footer={<GhostBtn onClick={() => setShowShare(false)}>Close</GhostBtn>}>
        <p>Push this design directly to a TekSchool destination.</p>
        <div className="mt-3 grid gap-2">
          {[
    { label: "Program page \xB7 attach as brochure PDF", hint: "Auto-replaces the current brochure on the linked track" },
    { label: "Seasonal popup", hint: "Populates the home-page seasonal campaign card" },
    { label: "WhatsApp announcements", hint: "Posts to Cohort AI-02 + Announcements groups" },
    { label: "Instagram post queue", hint: "Adds to the pending @tekschool.in queue" }
  ].map((t) => <button key={t.label} onClick={() => {
    setShowShare(false);
    pushToast(`Published "${state.name}" \u2014 ${t.label}`);
  }} className="rounded-xl bg-slate-50 p-3 text-left hover:bg-slate-100">
              <p className="text-sm font-semibold">{t.label}</p>
              <p className="text-[11px] text-slate-500">{t.hint}</p>
            </button>)}
        </div>
      </Modal>
      <Modal open={showExport} onClose={() => setShowExport(false)} title="Export design" footer={<><GhostBtn onClick={() => setShowExport(false)}>Cancel</GhostBtn><button onClick={exportPng} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[var(--accent-blue-deep)] to-[var(--accent-blue)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_-12px_var(--accent-blue-deep)]"><Save className="h-3.5 w-3.5" /> Download PNG</button></>}>
        <p>Export the current design as a high-resolution PNG (2× pixel density).</p>
        <p className="mt-2 text-xs text-slate-500">External images loaded from the media library may fail if their host doesn't allow cross-origin export. Uploaded and AI-generated images always export cleanly.</p>
      </Modal>
    </AdminShell>;
}
function Element({ el, selected, scale, onSelect, onLive, onCommit }) {
  const dragRef = useRef(null);
  const onPointerDown = (e, mode) => {
    e.stopPropagation();
    onSelect();
    e.target.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, ex: el.x, ey: el.y, ew: el.w, eh: el.h, mode };
  };
  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = (e.clientX - d.startX) / scale;
    const dy = (e.clientY - d.startY) / scale;
    if (d.mode === "move") onLive({ x: d.ex + dx, y: d.ey + dy });
    else onLive({ w: Math.max(30, d.ew + dx), h: Math.max(30, d.eh + dy) });
  };
  const onPointerUp = (e) => {
    const d = dragRef.current;
    if (!d) return;
    dragRef.current = null;
    e.target.releasePointerCapture(e.pointerId);
    onCommit(d.mode === "move" ? { x: el.x, y: el.y } : { w: el.w, h: el.h });
  };
  const style = {
    position: "absolute",
    left: el.x,
    top: el.y,
    width: el.w,
    height: el.h,
    transform: `rotate(${el.rotation}deg)`,
    opacity: el.opacity,
    cursor: "grab",
    userSelect: "none"
  };
  return <div
    style={style}
    onPointerDown={(e) => onPointerDown(e, "move")}
    onPointerMove={onPointerMove}
    onPointerUp={onPointerUp}
    onDoubleClick={(e) => {
      if (el.kind !== "text") return;
      e.stopPropagation();
      const t = prompt("Edit text", el.text);
      if (t !== null) onCommit({ text: t });
    }}
    className={selected ? "outline outline-2 outline-offset-2 outline-[#5BA4E8]" : ""}
  >
      {el.kind === "text" && <TextRender el={el} />}
      {el.kind === "rect" && <div style={{ width: "100%", height: "100%", background: el.fill, borderRadius: el.radius }} />}
      {el.kind === "ellipse" && <div style={{ width: "100%", height: "100%", background: el.fill, borderRadius: "50%" }} />}
      {el.kind === "image" && <img src={el.src} alt="" draggable={false} crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: el.radius, pointerEvents: "none" }} />}
      {selected && <div
    onPointerDown={(e) => onPointerDown(e, "resize")}
    onPointerMove={onPointerMove}
    onPointerUp={onPointerUp}
    style={{ position: "absolute", right: -8 / scale, bottom: -8 / scale, width: 16 / scale, height: 16 / scale, background: "#5BA4E8", borderRadius: 999, cursor: "nwse-resize", border: `${2 / scale}px solid white` }}
  />}
    </div>;
}
function TextRender({ el }) {
  return <div
    style={{
      width: "100%",
      height: "100%",
      color: el.color,
      fontSize: el.fontSize,
      fontWeight: el.fontWeight,
      textAlign: el.align,
      fontStyle: el.italic ? "italic" : "normal",
      fontFamily: el.font === "display" ? "Space Grotesk, ui-sans-serif, sans-serif" : "Inter, ui-sans-serif, sans-serif",
      lineHeight: 1.1,
      whiteSpace: "pre-wrap",
      overflow: "hidden",
      letterSpacing: "-0.02em"
    }}
  >{el.text}</div>;
}
function TemplateThumb({ build }) {
  const state = useMemo(() => build(), [build]);
  const maxDim = 140;
  const s = Math.min(maxDim / state.size.w, maxDim / state.size.h);
  return <div style={{ width: state.size.w * s, height: state.size.h * s, background: state.bg, position: "relative", overflow: "hidden", margin: "0 auto" }}>
      {[...state.elements].sort((a, b) => a.z - b.z).map((el) => <div key={el.id} style={{
    position: "absolute",
    left: el.x * s,
    top: el.y * s,
    width: el.w * s,
    height: el.h * s,
    transform: `rotate(${el.rotation}deg)`,
    opacity: el.opacity
  }}>
          {el.kind === "text" && <div style={{ color: el.color, fontSize: el.fontSize * s, fontWeight: el.fontWeight, lineHeight: 1.1, fontFamily: el.font === "display" ? "Space Grotesk" : "Inter", overflow: "hidden", whiteSpace: "pre-wrap" }}>{el.text}</div>}
          {el.kind === "rect" && <div style={{ width: "100%", height: "100%", background: el.fill, borderRadius: el.radius * s }} />}
          {el.kind === "ellipse" && <div style={{ width: "100%", height: "100%", background: el.fill, borderRadius: "50%" }} />}
        </div>)}
    </div>;
}
function TextProps({ el, onLive, onCommit, onAiRewrite, rewriteBusy, rewrites, applyRewrite }) {
  return <>
      <label className="block text-[10px] font-semibold uppercase text-slate-500">Text
        <textarea value={el.text} onChange={(e) => onLive({ text: e.target.value })} onBlur={(e) => onCommit({ text: e.target.value })} rows={2} className="mt-1 w-full rounded-lg bg-slate-50 p-2 text-xs font-normal normal-case text-foreground outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent-blue-deep)]/30" />
      </label>
      <div className="mt-2 flex items-center gap-1">
        <button onClick={() => commitBold(el, onCommit)} className={`grid h-7 w-7 place-items-center rounded ${el.fontWeight >= 700 ? "bg-slate-200" : "bg-slate-50 hover:bg-slate-100"}`}><BoldIcon className="h-3.5 w-3.5" /></button>
        <button onClick={() => onCommit({ italic: !el.italic })} className={`grid h-7 w-7 place-items-center rounded ${el.italic ? "bg-slate-200" : "bg-slate-50 hover:bg-slate-100"}`}><ItalicIcon className="h-3.5 w-3.5" /></button>
        <div className="ml-2 flex rounded bg-slate-50 p-0.5">
          {["left", "center", "right"].map((a) => {
    const Icon = a === "left" ? AlignLeft : a === "center" ? AlignCenter : AlignRight;
    return <button key={a} onClick={() => onCommit({ align: a })} className={`grid h-6 w-6 place-items-center rounded ${el.align === a ? "bg-white shadow-sm" : ""}`}><Icon className="h-3 w-3" /></button>;
  })}
        </div>
      </div>
      <label className="mt-3 block text-[10px] font-semibold uppercase text-slate-500">Font size ({el.fontSize})
        <input type="range" min={10} max={220} value={el.fontSize} onChange={(e) => onLive({ fontSize: Number(e.target.value) })} onPointerUp={(e) => onCommit({ fontSize: Number(e.target.value) })} className="w-full accent-[var(--accent-blue-deep)]" />
      </label>
      <label className="mt-2 block text-[10px] font-semibold uppercase text-slate-500">Color
        <div className="mt-1 grid grid-cols-4 gap-1.5">
          {PALETTE.map((c) => <button key={c} onClick={() => onCommit({ color: c })} className={`aspect-square rounded-lg ring-1 ring-slate-200 ${el.color === c ? "ring-2 ring-[var(--accent-blue-deep)]" : ""}`} style={{ background: c }} />)}
        </div>
      </label>
      <div className="mt-3 rounded-xl bg-lavender/25 p-2.5">
        <button onClick={onAiRewrite} disabled={rewriteBusy} className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#1E1B4B] hover:bg-white/80 disabled:opacity-60">
          {rewriteBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          {rewriteBusy ? "Rewriting\u2026" : "AI rewrite (3 tones)"}
        </button>
        {rewrites.length > 0 && <div className="mt-2 space-y-1">
            {rewrites.map((r) => <button key={r.tone} onClick={() => applyRewrite(r.text)} className="block w-full rounded-lg bg-white p-2 text-left text-[11px] hover:ring-2 hover:ring-[var(--accent-blue-deep)]/40">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-[var(--accent-blue-deep)]">{r.tone}</span>
                {r.text}
              </button>)}
          </div>}
      </div>
    </>;
}
function commitBold(el, onCommit) {
  onCommit({ fontWeight: el.fontWeight >= 700 ? 400 : 800 });
}
function ShapeProps({ el, onLive, onCommit }) {
  return <>
      <label className="block text-[10px] font-semibold uppercase text-slate-500">Fill
        <div className="mt-1 grid grid-cols-4 gap-1.5">
          {PALETTE.map((c) => <button key={c} onClick={() => onCommit({ fill: c })} className={`aspect-square rounded-lg ring-1 ring-slate-200 ${el.fill === c ? "ring-2 ring-[var(--accent-blue-deep)]" : ""}`} style={{ background: c }} />)}
        </div>
      </label>
      {el.kind === "rect" && <label className="mt-3 block text-[10px] font-semibold uppercase text-slate-500">Corner radius ({el.radius})
          <input type="range" min={0} max={200} value={el.radius} onChange={(e) => onLive({ radius: Number(e.target.value) })} onPointerUp={(e) => onCommit({ radius: Number(e.target.value) })} className="w-full accent-[var(--accent-blue-deep)]" />
        </label>}
    </>;
}
function ImageProps({ el, onLive, onCommit }) {
  return <>
      <label className="block text-[10px] font-semibold uppercase text-slate-500">Corner radius ({el.radius})
        <input type="range" min={0} max={400} value={el.radius} onChange={(e) => onLive({ radius: Number(e.target.value) })} onPointerUp={(e) => onCommit({ radius: Number(e.target.value) })} className="w-full accent-[var(--accent-blue-deep)]" />
      </label>
      <label className="mt-3 block text-[10px] font-semibold uppercase text-slate-500">Image URL
        <input value={el.src} onChange={(e) => onLive({ src: e.target.value })} onBlur={(e) => onCommit({ src: e.target.value })} className="mt-1 w-full rounded-lg bg-slate-50 px-2 py-1.5 text-[11px] font-normal normal-case text-foreground outline-none focus:bg-white" />
      </label>
    </>;
}
function NumField({ label, value, onChange }) {
  return <label className="block text-[10px] font-semibold uppercase text-slate-500">{label}
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-0.5 w-full rounded-lg bg-slate-50 px-2 py-1.5 text-xs font-normal normal-case text-foreground outline-none focus:bg-white" />
    </label>;
}

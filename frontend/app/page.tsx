"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Zap, Upload, TrendingUp, Eye, Heart, MessageCircle,
  Share2, Play, Pause, RotateCcw, Lightbulb, Users,
  Activity, ArrowUpRight, CheckCircle2, AlertCircle,
  ChevronRight, Sparkles, BarChart3, Shield, Clock,
  Lock, RefreshCw, FileVideo, ShieldAlert, Award, Compass,
  Sliders, Layers, Radio, Terminal, Cpu, Check, X, Info, Droplet, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as ChartTooltip
} from "recharts";
import Lenis from "lenis";

/* =========================================================
   VIRALYTIX — 2D/3D PARTICLE WAVE GRID ENGINE
   Real Two-Buffer Water Ripple Simulation Canvas
========================================================= */
class ParticleWaveEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  dpr: number;
  w = 0;
  h = 0;
  time = 0;
  lastFrame = performance.now();
  cell = 10;
  cols = 0;
  rows = 0;
  cellW = 0;
  cellH = 0;
  cx = 0;
  cy = 0;

  cur = new Float32Array(0);
  prev = new Float32Array(0);
  next = new Float32Array(0);
  distArr = new Float32Array(0);

  state = "idle";
  params = { damping: 0.978, idleChance: 0.008, idleStrength: 0.12, cursorStrength: 0, waveAmp: 0.30, waveFreq: 0.048, waveSpeed: 0.42, liftGain: 0.35 };
  target = { damping: 0.978, idleChance: 0.008, idleStrength: 0.12, cursorStrength: 0, waveAmp: 0.30, waveFreq: 0.048, waveSpeed: 0.42, liftGain: 0.35 };

  cursor = { active: false, x: 0, y: 0, tx: 0, ty: 0 };
  pulseLoop = { active: false, interval: 0.55, strength: 0.55, last: -999 };

  _raf: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: true }) as CanvasRenderingContext2D;
    this.dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
    this.resize();
  }

  buildGrid() {
    const isMobile = this.w < 640;
    const targetCols = isMobile ? 26 : 42;
    this.cell = Math.max(8, this.w / targetCols);
    this.cols = Math.max(4, Math.round(this.w / this.cell));
    this.rows = Math.max(4, Math.round(this.h / this.cell));
    this.cellW = this.w / this.cols;
    this.cellH = this.h / this.rows;

    const n = this.cols * this.rows;
    this.cur = new Float32Array(n);
    this.prev = new Float32Array(n);
    this.next = new Float32Array(n);

    this.cx = this.w / 2;
    this.cy = this.h / 2;
    this.distArr = new Float32Array(n);

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const px = c * this.cellW + this.cellW / 2;
        const py = r * this.cellH + this.cellH / 2;
        this.distArr[r * this.cols + c] = Math.hypot(px - this.cx, py - this.cy);
      }
    }
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const parent = this.canvas.parentElement;
    this.w = rect.width || (parent ? parent.clientWidth : 0) || 800;
    this.h = rect.height || (parent ? parent.clientHeight : 0) || 380;
    if (this.w === 0 || this.h === 0) return;
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
    this.buildGrid();
  }

  idx(c: number, r: number) {
    if (c < 0) c = 0;
    else if (c >= this.cols) c = this.cols - 1;
    if (r < 0) r = 0;
    else if (r >= this.rows) r = this.rows - 1;
    return r * this.cols + c;
  }

  setState(state: string) {
    this.state = state;
    const P = {
      idle:       { damping: 0.982, idleChance: 0.010, idleStrength: 0.16, cursorStrength: 0,    waveAmp: 0.28, waveFreq: 0.050, waveSpeed: 0.42, liftGain: 0.35 },
      hover:      { damping: 0.986, idleChance: 0.012, idleStrength: 0.18, cursorStrength: 1.15, waveAmp: 0.58, waveFreq: 0.058, waveSpeed: 0.68, liftGain: 0.60 },
      dragging:   { damping: 0.980, idleChance: 0.020, idleStrength: 0.25, cursorStrength: 1.60, waveAmp: 0.85, waveFreq: 0.065, waveSpeed: 0.88, liftGain: 0.95 },
      drop:       { damping: 0.975, idleChance: 0.010, idleStrength: 0.18, cursorStrength: 0.45, waveAmp: 1.05, waveFreq: 0.070, waveSpeed: 1.10, liftGain: 1.45 },
      uploading:  { damping: 0.980, idleChance: 0.010, idleStrength: 0.15, cursorStrength: 0,    waveAmp: 0.65, waveFreq: 0.058, waveSpeed: 0.78, liftGain: 0.95 },
      processing: { damping: 0.980, idleChance: 0.008, idleStrength: 0.15, cursorStrength: 0,    waveAmp: 0.58, waveFreq: 0.055, waveSpeed: 0.70, liftGain: 0.80 },
      ready:      { damping: 0.988, idleChance: 0.004, idleStrength: 0.08, cursorStrength: 0,    waveAmp: 0.28, waveFreq: 0.048, waveSpeed: 0.40, liftGain: 0.40 },
    }[state] || this.target;

    this.target = P;
  }

  pulse(strength = 1, screenX?: number, screenY?: number, radius = 2.8) {
    const sx = screenX == null ? this.w / 2 : screenX;
    const sy = screenY == null ? this.h / 2 : screenY;
    const cc = Math.round(sx / this.cellW);
    const cr = Math.round(sy / this.cellH);
    const rad = Math.round(radius);

    for (let dr = -rad; dr <= rad; dr++) {
      for (let dc = -rad; dc <= rad; dc++) {
        const d = Math.sqrt(dc * dc + dr * dr);
        if (d > rad) continue;
        const falloff = Math.exp(-(d * d) / (2 * (rad * 0.65) * (rad * 0.65)));
        this.cur[this.idx(cc + dc, cr + dr)] += strength * falloff;
      }
    }
  }

  setCursor(x: number, y: number, active: boolean) {
    this.cursor.active = active;
    this.cursor.tx = x;
    this.cursor.ty = y;
  }

  startScan(interval = 0.50, strength = 0.6) {
    this.pulseLoop.active = true;
    this.pulseLoop.interval = interval;
    this.pulseLoop.strength = strength;
    this.pulseLoop.last = this.time;
  }

  stopScan() {
    this.pulseLoop.active = false;
  }

  step(dt: number) {
    this.time += dt;
    for (const k in this.params) {
      const key = k as keyof typeof this.params;
      this.params[key] += (this.target[key] - this.params[key]) * Math.min(1, 0.12 * (dt * 60));
    }
    this.cursor.x += (this.cursor.tx - this.cursor.x) * 0.35;
    this.cursor.y += (this.cursor.ty - this.cursor.y) * 0.35;

    if (Math.random() < this.params.idleChance) {
      this.pulse(this.params.idleStrength * (0.6 + Math.random() * 0.7), Math.random() * this.w, Math.random() * this.h, 2.0);
    }

    if (this.cursor.active && this.params.cursorStrength > 0.01) {
      this.pulse(this.params.cursorStrength * 0.12, this.cursor.x, this.cursor.y, 2.4);
    }

    if (this.pulseLoop.active && this.time - this.pulseLoop.last > this.pulseLoop.interval) {
      this.pulseLoop.last = this.time;
      this.pulse(this.pulseLoop.strength, this.w / 2, this.h / 2, 3.2);
    }

    this.simulate();
  }

  simulate() {
    const { cols, rows, cur, prev, next } = this;
    const damping = this.params.damping;
    for (let r = 0; r < rows; r++) {
      const up = r > 0 ? r - 1 : r;
      const down = r < rows - 1 ? r + 1 : r;
      for (let c = 0; c < cols; c++) {
        const left = c > 0 ? c - 1 : c;
        const right = c < cols - 1 ? c + 1 : c;
        const i = r * cols + c;
        const n = cur[r * cols + left] + cur[r * cols + right] + cur[up * cols + c] + cur[down * cols + c];
        next[i] = (n * 0.5 - prev[i]) * damping;
      }
    }
    this.prev = cur;
    this.cur = next;
    this.next = prev;
  }

  render() {
    const ctx = this.ctx;
    const { cols, rows, cur, distArr, cellW, cellH } = this;
    const { waveAmp, waveFreq, waveSpeed, liftGain } = this.params;
    const t = this.time;
    ctx.clearRect(0, 0, this.w, this.h);

    const gap = Math.max(1.5, Math.min(cellW, cellH) * 0.18);
    const cornerRadius = Math.min(3, Math.min(cellW, cellH) * 0.18);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const d = distArr[i];

        // Concentric 3D wave calculation
        let ambient = Math.sin(d * waveFreq - t * waveSpeed) * waveAmp;
        ambient += Math.sin(d * waveFreq * 2.15 - t * waveSpeed * 1.6) * waveAmp * 0.25;

        const h = cur[i] + ambient;
        const norm = Math.max(-1, Math.min(1, h * 2.6));

        // Signed physical 3D tile scale: wave crests grow box toward viewer, troughs contract
        const scale = Math.max(0.3, 1 + norm * liftGain);

        // 3D Z-elevation extrusion height in pixels
        const zElevation = (norm * 0.5 + 0.5) * 14 * scale;

        const bw = Math.max(2, (cellW - gap) * Math.min(scale, 1.8));
        const bh = Math.max(2, (cellH - gap) * Math.min(scale, 1.8));
        const baseX = c * cellW + (cellW - bw) / 2;
        const baseY = r * cellH + (cellH - bh) / 2;

        // Top Cap Y-Position offset upward in 3D perspective
        const topY = baseY - zElevation;

        // ── 1. Render 3D Floor Drop Shadow ────────────────────────
        ctx.fillStyle = "rgba(2, 12, 6, 0.45)";
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(baseX + zElevation * 0.2, baseY + zElevation * 0.3, bw, bh, [cornerRadius]);
        } else {
          ctx.fillRect(baseX + zElevation * 0.2, baseY + zElevation * 0.3, bw, bh);
        }
        ctx.fill();

        // ── 2. Render 3D Extrusion Side/Front Depth Wall ─────────
        if (zElevation > 0.5) {
          ctx.fillStyle = "rgba(4, 28, 16, 0.85)";
          ctx.beginPath();
          ctx.rect(baseX, topY + bh / 2, bw, zElevation + bh / 2);
          ctx.fill();
        }

        // ── 3. Render 3D Lit Top Cap Surface ─────────────────────
        let bright = 0.2 + (norm * 0.5 + 0.5) * 0.75;
        bright = Math.max(0.05, Math.min(1, bright));

        let topFill = `rgba(16, 185, 129, ${bright.toFixed(3)})`; // Mint Emerald
        if (norm > 0.6) {
          topFill = `rgba(255, 255, 255, ${bright.toFixed(3)})`; // Bright White Peak
        } else if (norm > 0.2) {
          topFill = `rgba(52, 211, 153, ${bright.toFixed(3)})`; // Mint High
        } else if (norm < -0.4) {
          topFill = `rgba(6, 182, 212, ${(bright * 0.85).toFixed(3)})`; // Cyber Cyan Trough
        }

        ctx.fillStyle = topFill;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(baseX, topY, bw, bh, [cornerRadius]);
        } else {
          ctx.fillRect(baseX, topY, bw, bh);
        }
        ctx.fill();

        // ── 4. Render 3D Specular Top Bevel Light Edge ───────────
        if (zElevation > 2) {
          ctx.fillStyle = `rgba(255, 255, 255, ${(bright * 0.4).toFixed(3)})`;
          ctx.fillRect(baseX, topY, bw, Math.max(1, bh * 0.25));
        }
      }
    }
  }

  frame = (now: number) => {
    const dt = Math.min(0.05, (now - this.lastFrame) / 1000);
    this.lastFrame = now;
    this.step(dt);
    this.render();
    this._raf = requestAnimationFrame(this.frame);
  };

  start() {
    if (this._raf) return;
    this.lastFrame = performance.now();
    this._raf = requestAnimationFrame(this.frame);
  }

  stop() {
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = null;
  }
}

// ── Types ──────────────────────────────────────────────────────────
interface VideoFeatures {
  duration: number;
  hook_score: number;
  scene_change_rate: number;
  avg_brightness: number;
  motion_score: number;
  text_density: number;
  speech_rate: number;
  silence_ratio: number;
  audio_energy: number;
  word_count: number;
  cta_score: number;
  question_present: boolean;
  transcript: string;
  retention_curve: { second: number; retention: number }[];
  hook_windows: Record<string, number>;
  sampled_frames?: string[];
}

interface PredictionResult {
  video_id: string;
  virality_score: number;
  confidence_low?: number;
  confidence_high?: number;
  performance_category: string;
  predicted_reach: number;
  predicted_engagement: number;
  predicted_retention: number;
  shap_values: { feature: string; label: string; impact: number; direction: string }[];
  recommendations: string[];
  features?: VideoFeatures;
}

interface SimulationCascade {
  video_id: string;
  persona_count: number;
  aggregate: {
    watched: number;
    completed: number;
    liked: number;
    commented: number;
    shared: number;
    saved: number;
    skipped: number;
  };
  rates: {
    watch_rate: number;
    completion_rate: number;
    like_rate: number;
    comment_rate: number;
    share_rate: number;
    save_rate: number;
  };
  estimated_reach: number;
  persona_breakdown: Record<string, {
    watch_rate: number;
    completion_rate: number;
    like_rate: number;
    comment_rate: number;
    share_rate: number;
  }>;
}

interface AgentNode {
  id: number;
  persona: string;
  x: number;
  y: number;
  cluster: number;
  name: string;
}

interface NodeState {
  id: number;
  status: "idle" | "watching" | "completed" | "liked" | "shared" | "skipped";
  completion: number;
  timestamp?: number;
}

interface LiveLogEvent {
  id: string;
  time: string;
  agentName: string;
  persona: string;
  action: "hook_hit" | "liked" | "shared" | "skipped" | "completed";
  detail: string;
}

// ── Constants & Persona Configurations ─────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const PERSONA_CONFIGS = [
  { key: "Tech Enthusiasts", color: "#059669", icon: "⚡", name: "Alex", tag: "Tech" },
  { key: "Students", color: "#db2777", icon: "🎓", name: "Sam", tag: "Study" },
  { key: "Founders", color: "#d97706", icon: "🚀", name: "Jordan", tag: "Biz" },
  { key: "Creators", color: "#0891b2", icon: "🎨", name: "Taylor", tag: "Media" },
  { key: "Designers", color: "#7c3aed", icon: "📐", name: "Morgan", tag: "UX" },
  { key: "General Public", color: "#475569", icon: "👥", name: "Riley", tag: "General" }
];

const TARGET_DEMOGRAPHICS = [
  {
    value: "tech_designers",
    label: "Tech Founders & Designers",
    description: "Ideal for B2B tools, visual productivity, startups, design systems",
    personas: ["Founders", "Designers", "Tech Enthusiasts"]
  },
  {
    value: "students_creators",
    label: "Students & Content Creators",
    description: "Ideal for trending audio, education hacks, lifestyle, media advice",
    personas: ["Students", "Creators"]
  },
  {
    value: "general_public",
    label: "General Public",
    description: "Ideal for light humor, general entertainment, food, viral challenges",
    personas: ["General Public", "Students"]
  }
];

// Initial 100 Viewer Persona Swarm Layout
const INITIAL_NODES: AgentNode[] = Array.from({ length: 100 }, (_, i) => {
  const cluster = i % 6;
  const persona = PERSONA_CONFIGS[cluster].key;
  const personaMeta = PERSONA_CONFIGS[cluster];
  
  const clusterCenters = [
    { cx: 160, cy: 110 },
    { cx: 480, cy: 100 },
    { cx: 320, cy: 190 },
    { cx: 170, cy: 280 },
    { cx: 500, cy: 270 },
    { cx: 340, cy: 290 }
  ];
  
  const { cx, cy } = clusterCenters[cluster];
  const r = 14 + (i * 7) % 34;
  const angle = (i * 137.5) * (Math.PI / 180);
  const x = cx + r * Math.cos(angle);
  const y = cy + r * Math.sin(angle);
  
  return { id: i, persona, x, y, cluster, name: `${personaMeta.name}_${i + 1}` };
});

const PIPELINE_NODES = [
  { id: "probe", title: "FFmpeg Container Probe", desc: "Reading resolution, FPS, bitrate & streams" },
  { id: "sample", title: "1fps Frame Sampler", desc: "Extracting JPEG frame snapshots" },
  { id: "audio", title: "WAV Track Separator", desc: "Isolating 16kHz mono audio stream" },
  { id: "signal", title: "OpenCV Signal Processor", desc: "Computing motion deltas & scene cuts" },
  { id: "swarm", title: "Persona Swarm Engine", desc: "Simulating 100 audience decision loops" },
  { id: "predict", title: "XGBoost & SHAP Evaluator", desc: "Computing Virality Score & attribution" }
];

/* =========================================================
   HIGH-TECH INTERACTIVE CANVAS & MOTION GRAPHIC VISUALIZERS
========================================================= */

// 1. FFmpeg Container Probe Visualizer
const FFmpegProbeVisualizer: React.FC = () => {
  const [logLines, setLogLines] = useState<string[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rawLogs = [
      "[demuxer] Input #0, mov,mp4,m4a,3gp, from 'input_stream.mp4'",
      "[stream 0] Video: h264 (High), yuv420p(tv, bt709), 1920x1080 [SAR 1:1 DAR 16:9], 60 fps",
      "[stream 1] Audio: aac (LC), 16000 Hz, mono, fltp, 128 kb/s",
      "[probe] Bitrate: 4.82 Mbps | Container: ISO Media v2 | Duration: 00:14.2",
      "[hwaccel] CUDA / D3D11VA Hardware Demuxer Active",
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLogLines((prev) => {
        const next = [...prev, rawLogs[i % rawLogs.length]];
        if (next.length > 3) next.shift();
        return next;
      });
      i++;
    }, 800);
    
    // Smooth infinite progress bar animation
    let animId: number;
    let progress = 0;
    const render = () => {
      progress += 0.3;
      if (progress > 100) progress = 0;
      if (progressRef.current) {
        progressRef.current.style.width = `${progress}%`;
      }
      animId = requestAnimationFrame(render);
    };
    render();
    
    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="mt-4 p-5 rounded-2xl bg-[#fafafa] border border-slate-200 shadow-sm relative overflow-hidden space-y-4 font-mono text-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between text-slate-800 font-bold border-b border-slate-200 pb-2 gap-1 md:gap-0">
        <span className="flex items-center gap-2 w-full md:w-auto">
          <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)] shrink-0" />
          <span className="text-[10px] md:text-xs truncate">FFMPEG DEMUXER & CONTAINER PROBE</span>
        </span>
        <span className="text-slate-400 text-[9px] md:text-[10px] shrink-0">PROBE_OK // 0x46464D50</span>
      </div>
      
      {/* Smooth Apple-style progress indicator */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-100">
        <div ref={progressRef} className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" style={{ width: '0%' }} />
      </div>

      {/* Bitstream Inspector Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
        {[
          { label: 'Codec', value: 'H.264 High' },
          { label: 'Resolution', value: '1080×1920' },
          { label: 'Frame Rate', value: '60.0 FPS' },
          { label: 'Bitrate', value: '4.82 Mbps' }
        ].map((stat, idx) => (
          <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1">
            <div className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">{stat.label}</div>
            <div className="text-slate-800 font-extrabold mt-0.5">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Streaming Terminal Log Stream */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono text-[10px] space-y-1.5 text-slate-500 h-[72px] overflow-hidden shadow-inner relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 pointer-events-none z-10" />
        {logLines.map((line, idx) => (
          <div key={idx} className="truncate text-slate-700 transition-all duration-500 animate-in slide-in-from-bottom-2 fade-in">
            <span className="text-blue-500 font-bold">&gt;</span> {line}
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. 1fps Frame Sampler Visualizer
const FrameSamplerVisualizer: React.FC = () => {
  const [activeFrame, setActiveFrame] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFrame((prev) => (prev % 5) + 1);
    }, 900); // Slower, smoother transitions
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4 p-5 rounded-2xl bg-[#fafafa] border border-slate-200 shadow-sm relative overflow-hidden space-y-4 font-mono text-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between text-slate-800 font-bold border-b border-slate-200 pb-2 gap-1 md:gap-0">
        <span className="flex items-center gap-2 w-full md:w-auto">
          <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)] shrink-0" />
          <span className="text-[10px] md:text-xs truncate">1FPS KEYFRAME EXTRACTOR</span>
        </span>
        <span className="text-slate-400 text-[9px] md:text-[10px] shrink-0">CAPTURING SNAPSHOTS</span>
      </div>

      {/* Moving Filmstrip Thumbnails with Apple-style Spring Easing */}
      <div className="flex overflow-x-auto hide-scrollbar snap-x gap-2 md:gap-3 perspective-1000 pb-2">
        {[1, 2, 3, 4, 5].map((num) => {
          const isCapturing = num === activeFrame;
          return (
            <div
              key={num}
              className={`p-2.5 rounded-xl flex flex-col items-center justify-center shrink-0 min-w-[64px] flex-1 snap-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                isCapturing
                  ? "bg-white border border-blue-300 shadow-[0_8px_20px_rgba(37,99,235,0.15)] scale-[1.08] z-10 -translate-y-1"
                  : "bg-slate-50 border border-slate-200 shadow-sm opacity-60 scale-95"
              }`}
            >
              <span className={`text-[9px] font-bold transition-colors duration-500 ${isCapturing ? "text-blue-600" : "text-slate-400"}`}>t={num - 1}.0s</span>
              <div className={`w-full h-10 rounded-lg mt-1.5 flex items-center justify-center border transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                isCapturing ? "bg-blue-50 border-blue-200 shadow-inner" : "bg-white border-slate-100"
              }`}>
                <span className={`text-[10px] font-black transition-colors duration-500 ${isCapturing ? "text-blue-700" : "text-slate-300"}`}>SNAP #{num}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 3. WAV Track Separator Visualizer
const AudioSeparatorVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.03; // Smooth fluid motion
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Siri-style fluid gradients
      const drawWave = (offset: number, ampMultiplier: number, color: string, lineWidth: number) => {
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        for (let x = 0; x <= canvas.width; x += 4) {
          // Complex organic waveform using multiple sine waves
          const y = canvas.height / 2 
            + Math.sin(x * 0.015 + t + offset) * 12 * ampMultiplier 
            + Math.cos(x * 0.03 - t * 1.2) * 6 * ampMultiplier
            + Math.sin(x * 0.005 + t * 0.5) * 8 * ampMultiplier;
          
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };

      // Background ambient waves
      drawWave(0, 1.5, "rgba(226, 232, 240, 0.6)", 4);
      drawWave(Math.PI, 1.2, "rgba(148, 163, 184, 0.3)", 3);
      
      // Crisp foreground data wave
      drawWave(Math.PI / 2, 0.8, "#2563eb", 2.5);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="mt-4 p-5 rounded-2xl bg-[#fafafa] border border-slate-200 shadow-sm relative overflow-hidden space-y-4 font-mono text-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between text-slate-800 font-bold border-b border-slate-200 pb-2 gap-1 md:gap-0">
        <span className="flex items-center gap-2 w-full md:w-auto">
          <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)] shrink-0" />
          <span className="text-[10px] md:text-xs truncate">16kHz MONO AUDIO BANDPASS</span>
        </span>
        <span className="text-slate-500 font-bold text-[9px] md:text-[10px] shrink-0">RMS: -14.2dB</span>
      </div>

      <div className="relative h-16 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-inner">
        <canvas ref={canvasRef} width={400} height={64} className="w-full h-full opacity-90 mix-blend-multiply" />
      </div>
    </div>
  );
};

// 4. OpenCV Signal Processor Visualizer
const OpenCVSignalVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    // Optical flow particles
    const particles = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: 10 + Math.random() * 20,
      speed: 1 + Math.random() * 3,
      opacity: 0.1 + Math.random() * 0.4
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw smooth motion vectors
      particles.forEach((p) => {
        p.x += p.speed;
        if (p.x > canvas.width + p.length) {
          p.x = -p.length;
          p.y = Math.random() * canvas.height;
        }

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.length, p.y);
        ctx.strokeStyle = `rgba(59, 130, 246, ${p.opacity})`; // blue-500
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="mt-4 p-5 rounded-2xl bg-[#fafafa] border border-slate-200 shadow-sm relative overflow-hidden space-y-4 font-mono text-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between text-slate-800 font-bold border-b border-slate-200 pb-2 gap-1 md:gap-0">
        <span className="flex items-center gap-2 w-full md:w-auto">
          <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)] shrink-0" />
          <span className="text-[10px] md:text-xs truncate">OPENCV OPTICAL FLOW & SCENE CUT</span>
        </span>
        <span className="text-slate-500 font-bold text-[9px] md:text-[10px] shrink-0">SCENE_CUT @ F#142</span>
      </div>

      <div className="relative h-auto md:h-16 min-h-[64px] rounded-xl bg-white border border-slate-200 p-3 md:p-4 flex flex-col md:flex-row items-start md:items-center justify-between overflow-hidden shadow-inner gap-3 md:gap-0">
        {/* Smooth canvas optical flow background */}
        <canvas ref={canvasRef} width={400} height={64} className="absolute inset-0 w-full h-full" />
        
        <div className="absolute inset-y-0 left-1/2 w-px bg-blue-400/30 animate-pulse" />

        <div className="space-y-1.5 z-10 bg-white/80 backdrop-blur-sm p-1.5 rounded-lg border border-white/40">
          <div className="text-slate-500 text-[10px] uppercase font-bold">Motion Flow Delta: <strong className="text-slate-800 text-xs">Δx: 14.8px / frame</strong></div>
          <div className="text-slate-500 text-[10px] uppercase font-bold">Luminance Variance: <strong className="text-slate-800 text-xs">84.2% Peak</strong></div>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 font-extrabold text-[11px] z-10 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 shadow-[0_4px_12px_rgba(234,88,12,0.15)]">
          SCENE CUT DETECTED
        </div>
      </div>
    </div>
  );
};

// 5. Persona Swarm Engine Visualizer (HERO SCALE CANVAS NETWORK CONSTELLATION)
const SwarmEngineVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    // Force-Directed Network Physics
    const colors = ["#2563eb", "#9ca3af", "#ea580c", "#d946ef"];
    
    // Define 4 cluster centers spaced evenly across the canvas
    const clusters: Record<string, { x: number, y: number }> = {
      "#2563eb": { x: canvas.width * 0.15, y: canvas.height * 0.5 }, // Blue (In-Target)
      "#9ca3af": { x: canvas.width * 0.38, y: canvas.height * 0.5 }, // Grey (Mixed)
      "#ea580c": { x: canvas.width * 0.62, y: canvas.height * 0.5 }, // Orange (Out-of-Target)
      "#d946ef": { x: canvas.width * 0.85, y: canvas.height * 0.5 }, // Pink (Negative)
    };

    const nodes = Array.from({ length: 80 }).map(() => { // Increased to 80 for 4 clusters
      const color = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0,
        vy: 0,
        color: color,
        radius: 4 + Math.random() * 3.5, // slightly larger for 3D effect
        target: clusters[color]
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Physics constants
      const alpha = 0.02; // Attraction strength to cluster center
      const repulsion = 150; // Distance to start repelling
      const damping = 0.92; // Friction

      // Force-Directed Physics calculation
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // 1. Attract to cluster center
        node.vx += (node.target.x - node.x) * alpha;
        node.vy += (node.target.y - node.y) * alpha;

        // 2. Repel from other nodes to prevent overlapping
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.hypot(dx, dy);
          
          if (dist > 0 && dist < repulsion) {
            const force = (repulsion - dist) / repulsion;
            // Stronger repulsion for different colors
            const forceMultiplier = node.color === other.color ? 0.05 : 0.15; 
            const fx = (dx / dist) * force * forceMultiplier;
            const fy = (dy / dist) * force * forceMultiplier;
            
            node.vx -= fx;
            node.vy -= fy;
            other.vx += fx;
            other.vy += fy;
          }
        }
        
        // 3. Apply damping (friction)
        node.vx *= damping;
        node.vy *= damping;
        
        // 4. Update position
        node.x += node.vx;
        node.y += node.vy;
      }

      // Depth sorting: draw smaller (further) nodes first
      nodes.sort((a, b) => a.radius - b.radius);

      // Draw Dashed Connections (D3 Style)
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 65) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            
            // If one is orange or pink, make the line colored and dashed
            if (nodes[i].color === "#ea580c" || nodes[j].color === "#ea580c") {
               ctx.strokeStyle = `rgba(239, 68, 68, ${(1 - dist / 65) * 0.5})`; // Red dashed for Orange
               ctx.setLineDash([4, 4]);
            } else if (nodes[i].color === "#d946ef" || nodes[j].color === "#d946ef") {
               ctx.strokeStyle = `rgba(217, 70, 239, ${(1 - dist / 65) * 0.5})`; // Pink dashed for Pink
               ctx.setLineDash([4, 4]);
            } else {
               ctx.strokeStyle = `rgba(156, 163, 175, ${(1 - dist / 65) * 0.35})`;
               ctx.setLineDash([]);
            }
            ctx.stroke();
          }
        }
      }
      ctx.setLineDash([]); // Reset for nodes

      // Draw Realistic 3D Sphere Nodes
      nodes.forEach((node) => {
        // Parallax Friction/Drift physics: larger nodes move slightly faster (closer to camera)
        const speedMultiplier = (node.radius / 5);
        node.x += node.vx * speedMultiplier;
        node.y += node.vy * speedMultiplier;
        if (node.x < 15 || node.x > canvas.width - 15) node.vx *= -1;
        if (node.y < 15 || node.y > canvas.height - 15) node.vy *= -1;

        // 3D Drop Shadow for floating depth
        ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
        ctx.shadowBlur = node.radius * 1.5;
        ctx.shadowOffsetY = node.radius * 0.6;
        ctx.shadowOffsetX = node.radius * 0.2;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        // 3D Radial Gradient (Lighting Highlight to Shadow edge)
        const grad = ctx.createRadialGradient(
          node.x - node.radius * 0.35, 
          node.y - node.radius * 0.35, 
          node.radius * 0.1, 
          node.x, 
          node.y, 
          node.radius
        );
        grad.addColorStop(0, "#ffffff"); // Specular highlight
        grad.addColorStop(0.2, node.color); // Base color
        
        // Calculate darker shade for ambient occlusion/edge shadow
        const darkerColor = node.color === "#2563eb" ? "#1e3a8a" 
                          : node.color === "#ea580c" ? "#7c2d12" 
                          : node.color === "#d946ef" ? "#701a75" 
                          : "#374151";
        grad.addColorStop(1, darkerColor); // Dark edge

        ctx.fillStyle = grad;
        ctx.fill();
        
        // Reset shadow for next draw to prevent bleeding
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowOffsetX = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="mt-5 p-6 rounded-3xl bg-[#fafafa] border border-slate-200 shadow-sm relative overflow-hidden space-y-4 font-mono text-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between text-slate-800 font-bold border-b border-slate-200 pb-3 gap-2 md:gap-0">
        <span className="flex items-center gap-2.5 text-xs md:text-sm uppercase tracking-wide w-full md:w-auto">
          <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)] shrink-0" />
          <span className="truncate">Persona Swarm Network Topology</span>
        </span>
        <span className="text-slate-600 font-extrabold text-[10px] md:text-xs px-2 md:px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm shrink-0 w-fit">
          CONSENSUS: 87.4%
        </span>
      </div>

      {/* Large Hero Scale Network Constellation Canvas - White Background */}
      <div className="relative h-52 md:h-64 rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-inner">
        <canvas ref={canvasRef} width={800} height={256} className="w-full h-full" />
      </div>

      <div className="flex items-center justify-center text-[9px] md:text-xs text-slate-500 pt-2 font-bold flex-wrap gap-3 md:gap-5 uppercase tracking-wider">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#2563eb]" /> In-Target</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#9ca3af]" /> Mixed</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#ea580c]" /> Out-of-Target</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#d946ef]" /> Negative</span>
      </div>
    </div>
  );
};

// 6. XGBoost & SHAP Evaluator Visualizer
// 6. XGBoost & SHAP Evaluator Visualizer
// 6. XGBoost & SHAP Evaluator Visualizer
const SHAPEvaluatorVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // SHAP Feature Bars (Audio & Visual represented by different groups)
    const bars = [
      // Audio Feature Group (Blue)
      { id: "A1", targetHeight: 50, color: "#2563eb", phase: 0 },
      { id: "A2", targetHeight: 70, color: "#2563eb", phase: 1 },
      { id: "A3", targetHeight: 40, color: "#2563eb", phase: 2 },
      { id: "A4", targetHeight: 85, color: "#3b82f6", phase: 3 }, // Highlight
      { id: "A5", targetHeight: 55, color: "#2563eb", phase: 4 },
      // Gap
      { id: "gap", targetHeight: 0, color: "transparent", phase: 0 },
      // Visual Feature Group (Light Blue)
      { id: "V1", targetHeight: 45, color: "#60a5fa", phase: 5 },
      { id: "V2", targetHeight: 75, color: "#60a5fa", phase: 6 },
      { id: "V3", targetHeight: 60, color: "#60a5fa", phase: 7 },
      { id: "V4", targetHeight: 90, color: "#93c5fd", phase: 8 }, // Highlight
      { id: "V5", targetHeight: 50, color: "#60a5fa", phase: 9 },
    ];

    // Helper to draw an isometric 3D column
    const drawIsometricColumn = (x: number, y: number, width: number, depth: number, height: number, baseColor: string, isHighlight: boolean) => {
      if (baseColor === "transparent" || height <= 0) return;

      // Calculate colors
      // Parse baseColor (hex) to get rgb for shading
      let r = 0, g = 0, b = 0;
      if (baseColor.startsWith("#")) {
        const hex = baseColor.replace("#", "");
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      }
      
      const leftColor = `rgb(${r * 0.6}, ${g * 0.6}, ${b * 0.6})`;
      const rightColor = `rgb(${r * 0.8}, ${g * 0.8}, ${b * 0.8})`;
      const topColor = `rgb(${Math.min(255, r * 1.3)}, ${Math.min(255, g * 1.3)}, ${Math.min(255, b * 1.3)})`;

      const dx = depth * Math.cos(Math.PI / 6); // 30 degrees
      const dy = depth * Math.sin(Math.PI / 6);

      // Left face
      ctx.fillStyle = leftColor;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - height);
      ctx.lineTo(x + width, y - height + width * 0.5);
      ctx.lineTo(x + width, y + width * 0.5);
      ctx.fill();

      // Right face
      ctx.fillStyle = rightColor;
      ctx.beginPath();
      ctx.moveTo(x + width, y + width * 0.5);
      ctx.lineTo(x + width, y - height + width * 0.5);
      ctx.lineTo(x + width + dx, y - height + width * 0.5 - dy);
      ctx.lineTo(x + width + dx, y + width * 0.5 - dy);
      ctx.fill();

      // Top face
      ctx.fillStyle = topColor;
      if (isHighlight) {
         ctx.shadowBlur = 15;
         ctx.shadowColor = topColor;
      }
      ctx.beginPath();
      ctx.moveTo(x, y - height);
      ctx.lineTo(x + dx, y - height - dy);
      ctx.lineTo(x + width + dx, y - height + width * 0.5 - dy);
      ctx.lineTo(x + width, y - height + width * 0.5);
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.03; // speed

      const startX = 60;
      const startY = 80; // Baseline
      const barWidth = 14;
      const barDepth = 14;
      const spacing = 32;

      bars.forEach((bar, index) => {
        // Smooth organic motion using sine waves
        const organicMotion = Math.sin(time + bar.phase) * 15;
        // Clamp height so it doesn't go below 5
        const currentHeight = Math.max(5, bar.targetHeight + organicMotion);
        
        const isHighlight = bar.id === "A4" || bar.id === "V4";

        drawIsometricColumn(
          startX + index * spacing, 
          startY, 
          barWidth, 
          barDepth, 
          currentHeight, 
          bar.color,
          isHighlight
        );
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="mt-4 p-5 rounded-2xl bg-[#fafafa] border border-slate-200 shadow-sm relative overflow-hidden space-y-4 font-mono text-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between text-slate-800 font-bold border-b border-slate-200 pb-2 gap-1 md:gap-0">
        <span className="flex items-center gap-2 w-full md:w-auto">
          <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)] shrink-0" />
          <span className="text-[10px] md:text-xs truncate">XGBOOST SHAP FEATURE IMPACT</span>
        </span>
        <span className="text-slate-500 font-bold text-[9px] md:text-[10px] shrink-0">SCORE: <span className="text-blue-600 font-extrabold tracking-widest text-[10px] md:text-xs">88/100</span></span>
      </div>

      <div className="relative h-28 rounded-xl bg-white border border-slate-200 p-2 flex items-center overflow-hidden shadow-inner w-full">
        {/* Minimal Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />
        
        <canvas ref={canvasRef} width={550} height={100} className="absolute inset-0 w-full h-full z-10" />
        
        {/* Output Labels overlay on the right side */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20 pointer-events-none">
          <div className="text-right">
            <div className="text-[9px] uppercase font-bold text-slate-400">Audio Features</div>
            <div className="text-blue-600 font-extrabold text-xs">+18.4 SHAP</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] uppercase font-bold text-slate-400">Visual Features</div>
            <div className="text-blue-400 font-extrabold text-xs">+14.2 SHAP</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   HERO GRID PIXEL ANIMATOR CANVAS
   Randomly flips individual white/black grid boxes at staggered positions every 1-8s
========================================================= */
const HeroGridPixelCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const cellSize = 36; // 36px grid boxes aligned with cutting mat
    let cols = 0;
    let rows = 0;

    interface GridCell {
      col: number;
      row: number;
      opacity: number;
      targetOpacity: number;
      speed: number;
      nextChange: number;
    }

    let cells: GridCell[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      cols = Math.ceil(canvas.width / cellSize);
      rows = Math.ceil(canvas.height / cellSize);

      cells = [];
      const now = Date.now();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          cells.push({
            col: c,
            row: r,
            opacity: 0,
            targetOpacity: 0,
            speed: 0.02 + Math.random() * 0.03,
            nextChange: now + Math.random() * 8000,
          });
        }
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const now = Date.now();

      // Base Pure White Background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Staggered cell state updates: randomly pick individual cells at diff positions every 1-8 sec
      cells.forEach((cell) => {
        if (now >= cell.nextChange) {
          // 15% chance for a cell to flip to black, otherwise back to white
          const flipToBlack = Math.random() < 0.15;
          cell.targetOpacity = flipToBlack ? 0.95 : 0;
          cell.speed = 0.015 + Math.random() * 0.025;
          cell.nextChange = now + 3000 + Math.random() * 5000;
        }

        // Interpolate opacity towards targetOpacity
        if (Math.abs(cell.opacity - cell.targetOpacity) > 0.005) {
          cell.opacity += (cell.targetOpacity - cell.opacity) * cell.speed;
        } else {
          cell.opacity = cell.targetOpacity;
        }

        const x = cell.col * cellSize;
        const y = cell.row * cellSize;

        // Draw Pure Black Pixel Box if opacity > 0
        if (cell.opacity > 0.01) {
          ctx.fillStyle = `rgba(5, 25, 14, ${cell.opacity.toFixed(3)})`;
          ctx.fillRect(x, y, cellSize, cellSize);
        }

        // Draw Crisp Dark Cutting Mat Grid Line
        ctx.strokeStyle = "rgba(5, 25, 14, 0.15)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellSize, cellSize);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default function Dashboard() {
  const [mode, setMode] = useState<"single" | "ab">("single");
  const [activeTab, setActiveTab] = useState<"overview" | "swarm" | "signals" | "recommendations">("overview");
  const [file, setFile] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [stage, setStage] = useState<"idle" | "uploading" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [currentPipelineIndex, setCurrentPipelineIndex] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [securityStatus, setSecurityStatus] = useState("Sandbox isolated RAM compute ready.");
  
  const [targetDemo, setTargetDemo] = useState("tech_designers");
  const [hoveredDemo, setHoveredDemo] = useState<string | null>(null);
  
  // Wave Canvas & Media Preview State
  const waveCanvasRef = useRef<HTMLCanvasElement>(null);
  const waveEngineRef = useRef<ParticleWaveEngine | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoMeta, setVideoMeta] = useState({ name: "", size: "0.0 MB", duration: "00:00" });
  const [showMediaPreview, setShowMediaPreview] = useState(false);
  const mediaTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [resultB, setResultB] = useState<PredictionResult | null>(null);
  const [simulation, setSimulation] = useState<SimulationCascade | null>(null);
  
  const [cascadeRounds, setCascadeRounds] = useState<NodeState[][]>([]);
  const [simRound, setSimRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedNode, setSelectedNode] = useState<AgentNode | null>(null);
  const [liveLog, setLiveLog] = useState<LiveLogEvent[]>([]);

  const playbackTimer = useRef<NodeJS.Timeout | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis Smooth Scroll Engine Site-Wide
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.8,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Initialize Particle Wave Canvas Engine
  useEffect(() => {
    if (stage !== "idle") return;
    if (!waveCanvasRef.current) return;
    const engine = new ParticleWaveEngine(waveCanvasRef.current);
    engine.setState("idle");
    engine.start();
    waveEngineRef.current = engine;

    const handleResize = () => engine.resize();
    handleResize();

    // Staggered fallback timers to guarantee canvas build after DOM layout reflow
    const timer1 = setTimeout(handleResize, 100);
    const timer2 = setTimeout(handleResize, 500);

    window.addEventListener("resize", handleResize);

    let ro: ResizeObserver | null = null;
    if (waveCanvasRef.current.parentElement && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(handleResize);
      ro.observe(waveCanvasRef.current.parentElement);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("resize", handleResize);
      if (ro) ro.disconnect();
      engine.stop();
    };
  }, [stage === "idle"]);

  const fmtBytes = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? mb.toFixed(1) + " MB" : Math.max(1, Math.round(bytes / 1024)) + " KB";
  };

  const fmtDuration = (sec: number) => {
    if (!isFinite(sec)) return "00:00";
    const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  };

  const validateAndSetFile = (selectedFile: File, target: "A" | "B" = "A", e?: React.MouseEvent | React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const validMime = ["video/mp4", "video/quicktime", "video/webm", "video/x-msvideo"];
    
    if (!validMime.includes(selectedFile.type) && !selectedFile.name.endsWith(".mov")) {
      setFileError("Invalid Container: Please use MP4, MOV, or WebM format.");
      if (waveEngineRef.current && e && 'clientX' in e) {
        const rect = waveCanvasRef.current?.getBoundingClientRect();
        if (rect) waveEngineRef.current.pulse(0.6, e.clientX - rect.left, e.clientY - rect.top, 3);
      }
      if (target === "A") setFile(null);
      else setFileB(null);
      return;
    }
    
    if (selectedFile.size > 200 * 1024 * 1024) {
      setFileError("File Size Limit: Upload limit is 200MB to preserve processing latency.");
      if (target === "A") setFile(null);
      else setFileB(null);
      return;
    }
    
    if (target === "A") {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setVideoUrl(url);
      setVideoMeta({ name: selectedFile.name, size: fmtBytes(selectedFile.size), duration: "00:00" });
      setSecurityStatus(`Video A Verified: ${selectedFile.name}`);
      setShowMediaPreview(false);

      // Pulse physical water wave engine at exact drop impact point!
      if (waveEngineRef.current) {
        waveEngineRef.current.setState("drop");
        if (e && 'clientX' in e && waveCanvasRef.current) {
          const rect = waveCanvasRef.current.getBoundingClientRect();
          waveEngineRef.current.pulse(2.2, e.clientX - rect.left, e.clientY - rect.top, 5.0);
        } else {
          waveEngineRef.current.pulse(2.2, waveEngineRef.current.w / 2, waveEngineRef.current.h / 2, 5.0);
        }
      }

      // Delay showing media preview for 2.6 seconds so user enjoys full unobstructed 3D wave animation!
      if (mediaTimerRef.current) clearTimeout(mediaTimerRef.current);
      mediaTimerRef.current = setTimeout(() => {
        setShowMediaPreview(true);
      }, 2600);
    } else {
      setFileB(selectedFile);
      setSecurityStatus(`Video B Verified: ${selectedFile.name}`);
    }
  };

  const handleRemoveVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setFile(null);
    setVideoUrl(null);
    if (waveEngineRef.current) {
      waveEngineRef.current.setState("idle");
      waveEngineRef.current.stopScan();
    }
  };

  const handleLoadMock = (e: React.MouseEvent) => {
    e.stopPropagation();
    const mockA = new File([""], "viralytix_demo_edit.mp4", { type: "video/mp4" });
    const mockB = new File([""], "viralytix_variant_edit.mp4", { type: "video/mp4" });
    validateAndSetFile(mockA, "A", e);
    if (mode === "ab") {
      setFileB(mockB);
      setSecurityStatus("Demo Mode: Loaded baseline & variant mock files.");
    }
  };

  const runAnalysis = async () => {
    if (!file) return;
    setStage("uploading");
    setProgress(5);
    setCurrentPipelineIndex(0);
    setProgressLabel(PIPELINE_NODES[0].desc);
    setLiveLog([]);

    if (waveEngineRef.current) {
      waveEngineRef.current.setState("uploading");
    }

    try {
      let videoId = 13;
      if (file.size > 0) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch(`${API_URL}/api/videos/upload`, {
          method: "POST",
          body: formData
        });

        if (!uploadRes.ok) throw new Error("Upload to server failed.");
        const uploadData = await uploadRes.json();
        videoId = uploadData.id;
      }

      setStage("processing");

      if (waveEngineRef.current) {
        waveEngineRef.current.setState("processing");
        waveEngineRef.current.startScan(0.5, 0.7);
      }

      for (let idx = 0; idx < PIPELINE_NODES.length; idx++) {
        setCurrentPipelineIndex(idx);
        setProgressLabel(PIPELINE_NODES[idx].desc);
        setProgress(Math.round(((idx + 1) / PIPELINE_NODES.length) * 90));
        await new Promise((resolve) => setTimeout(resolve, 3200));
      }

      if (file.size > 0) {
        await fetch(`${API_URL}/api/videos/${videoId}/process`, { method: "POST" });
      }

      const predictionRes = await fetch(`${API_URL}/api/predictions/${videoId}`);
      if (!predictionRes.ok) throw new Error("Could not fetch prediction results.");
      const predictionData = await predictionRes.json();

      const simRes = await fetch(`${API_URL}/api/simulations/${videoId}`);
      if (!simRes.ok) throw new Error("Could not fetch simulation cascade.");
      const simData = await simRes.json();

      calculateSignalCascade(simData);
      setResult(predictionData);

      if (mode === "ab" && fileB) {
        let videoIdB = 13;
        if (fileB.size > 0) {
          const formDataB = new FormData();
          formDataB.append("file", fileB);
          const uploadResB = await fetch(`${API_URL}/api/videos/upload`, { method: "POST", body: formDataB });
          if (uploadResB.ok) {
            const dataB = await uploadResB.json();
            videoIdB = dataB.id;
            await fetch(`${API_URL}/api/videos/${videoIdB}/process`, { method: "POST" });
          }
        }
        const predResB = await fetch(`${API_URL}/api/predictions/${videoIdB}`);
        if (predResB.ok) {
          const predDataB = await predResB.json();
          if (fileB.size === 0) {
            predDataB.virality_score = Math.round(Math.min(96, predDataB.virality_score * 1.3 + 18));
            predDataB.predicted_reach = Math.round(predDataB.predicted_reach * 2.4);
            predDataB.performance_category = predDataB.virality_score >= 65 ? "High" : "Medium";
          }
          setResultB(predDataB);
        }
      }

      if (waveEngineRef.current) {
        waveEngineRef.current.setState("ready");
        waveEngineRef.current.stopScan();
      }

      setProgress(100);
      setStage("done");
      setSecurityStatus("Analysis Finalized: Multi-modal signals processed.");
    } catch (e: any) {
      setFileError(e.message || "An unexpected error occurred during processing.");
      setStage("idle");
    }
  };

  const calculateSignalCascade = (simData: any) => {
    const mapPersonaKey = (key: string) => {
      if (key === "Tech Enthusiasts") return "Tech Enthusiast";
      if (key === "Students") return "Student";
      if (key === "Founders") return "Founder";
      if (key === "Creators") return "Creator";
      if (key === "Designers") return "Designer";
      return "General Viewer";
    };

    const rounds: NodeState[][] = [];
    const logs: LiveLogEvent[] = [];

    const seeds = new Set<number>();
    while (seeds.size < 6) {
      seeds.add(Math.floor(Math.random() * 100));
    }

    const round0: NodeState[] = INITIAL_NODES.map((node) => {
      const isSeed = seeds.has(node.id);
      if (isSeed) {
        logs.push({
          id: `log_0_${node.id}`,
          time: "0.2s",
          agentName: node.name,
          persona: node.persona,
          action: "hook_hit",
          detail: "Initial visual hook captured attention."
        });
      }
      return {
        id: node.id,
        status: isSeed ? "watching" : "idle",
        completion: isSeed ? 0.3 : 0,
        timestamp: 0
      };
    });
    rounds.push(round0);

    const breakdown = simData.persona_breakdown || {};
    const activeDemo = TARGET_DEMOGRAPHICS.find((d) => d.value === targetDemo);
    const targetPersonas = activeDemo ? activeDemo.personas : [];

    const getProbs = (personaName: string) => {
      const mappedKey = mapPersonaKey(personaName);
      const stats = breakdown[mappedKey] || {
        watch_rate: 0.65,
        completion_rate: 0.52,
        like_rate: 0.35,
        share_rate: 0.15
      };
      const isTarget = targetPersonas.includes(personaName);
      const boost = isTarget ? 1.25 : 0.75;

      return {
        watch: Math.min(stats.watch_rate * boost, 0.95),
        complete: Math.min(stats.completion_rate * boost, 0.95),
        like: Math.min(stats.like_rate * boost, 0.90),
        share: Math.min(stats.share_rate * boost, 0.80)
      };
    };

    const reached = new Set<number>(seeds);

    for (let r = 1; r <= 4; r++) {
      const prevRound = rounds[r - 1];
      const currentRoundState: NodeState[] = prevRound.map((n) => ({ ...n }));

      prevRound.forEach((nodeState) => {
        if (nodeState.status === "watching") {
          const nodeInfo = INITIAL_NODES[nodeState.id];
          const probs = getProbs(nodeInfo.persona);
          const rand = Math.random();

          if (rand < probs.complete) {
            const subRand = Math.random();
            if (subRand < probs.share) {
              currentRoundState[nodeState.id].status = "shared";
              currentRoundState[nodeState.id].completion = 1;
              logs.push({
                id: `log_${r}_${nodeState.id}`,
                time: `${r * 3.5}s`,
                agentName: nodeInfo.name,
                persona: nodeInfo.persona,
                action: "shared",
                detail: "Shared video with peer network."
              });

              const candidates = INITIAL_NODES.filter(
                (c) => !reached.has(c.id) && (c.cluster === nodeInfo.cluster || Math.random() < 0.3)
              );

              for (let i = 0; i < 2 && candidates.length > 0; i++) {
                const idx = Math.floor(Math.random() * candidates.length);
                const targetNode = candidates.splice(idx, 1)[0];
                reached.add(targetNode.id);
                currentRoundState[targetNode.id].status = "watching";
                currentRoundState[targetNode.id].completion = 0.3;
              }
            } else if (subRand < probs.share + probs.like) {
              currentRoundState[nodeState.id].status = "liked";
              currentRoundState[nodeState.id].completion = 1;
              logs.push({
                id: `log_${r}_${nodeState.id}`,
                time: `${r * 3.2}s`,
                agentName: nodeInfo.name,
                persona: nodeInfo.persona,
                action: "liked",
                detail: "Liked video and watched 100%."
              });
            } else {
              currentRoundState[nodeState.id].status = "completed";
              currentRoundState[nodeState.id].completion = 1;
              logs.push({
                id: `log_${r}_${nodeState.id}`,
                time: `${r * 3.0}s`,
                agentName: nodeInfo.name,
                persona: nodeInfo.persona,
                action: "completed",
                detail: "Watched to end without drop-off."
              });
            }
          } else {
            currentRoundState[nodeState.id].status = "skipped";
            currentRoundState[nodeState.id].completion = Math.random() * 0.3;
            logs.push({
              id: `log_${r}_${nodeState.id}`,
              time: `${r * 1.8}s`,
              agentName: nodeInfo.name,
              persona: nodeInfo.persona,
              action: "skipped",
              detail: "Bounced due to slow pacing."
            });
          }
        }
      });

      rounds.push(currentRoundState);
    }

    setCascadeRounds(rounds);
    setLiveLog(logs);
    setSimulation({
      video_id: simData.video_id ?? "",
      persona_count: 100,
      aggregate: {
        watched: simData.watched ?? 64,
        completed: simData.completed ?? 48,
        liked: simData.liked ?? 32,
        commented: simData.commented ?? 18,
        shared: simData.shared ?? 14,
        saved: simData.saved ?? 22,
        skipped: simData.skipped ?? 36
      },
      rates: {
        watch_rate: simData.watch_rate ?? 0.64,
        completion_rate: simData.completion_rate ?? 0.48,
        like_rate: simData.like_rate ?? 0.32,
        comment_rate: simData.comment_rate ?? 0.18,
        share_rate: simData.share_rate ?? 0.14,
        save_rate: simData.save_rate ?? 0.22
      },
      estimated_reach: simData.estimated_reach ?? 4800,
      persona_breakdown: simData.persona_breakdown ?? {}
    });
    setSimRound(0);
    setIsPlaying(false);
  };

  const handleReset = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setFile(null);
    setFileB(null);
    setVideoUrl(null);
    setStage("idle");
    setProgress(0);
    setResult(null);
    setResultB(null);
    setSimulation(null);
    setCascadeRounds([]);
    setSimRound(0);
    setIsPlaying(false);
    setSelectedNode(null);
    setFileError(null);
    setSecurityStatus("Sandbox isolated RAM compute ready.");

    if (waveEngineRef.current) {
      waveEngineRef.current.setState("idle");
      waveEngineRef.current.stopScan();
    }
  };

  useEffect(() => {
    if (isPlaying) {
      playbackTimer.current = setInterval(() => {
        setSimRound((prev) => {
          if (prev >= cascadeRounds.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800);
    } else if (playbackTimer.current) {
      clearInterval(playbackTimer.current);
    }
    return () => {
      if (playbackTimer.current) clearInterval(playbackTimer.current);
    };
  }, [isPlaying, cascadeRounds]);

  const activeRoundState = cascadeRounds[simRound] || [];

  return (
    <div className="z-content min-h-screen text-slate-100 flex flex-col font-sans relative selection:bg-emerald-500 selection:text-slate-950">
      {/* ── TOP MARQUEE TICKER BANNER (3D Tactile Ribbon + Upward Liquid Fill) ── */}
      <div suppressHydrationWarning className="w-full liquid-page-wipe-3 band-3d-tactile py-3.5 overflow-hidden sticky top-0 z-40 backdrop-blur-md transition-colors">
        <div className="animate-marquee flex items-center gap-10 font-display font-black text-sm md:text-base uppercase tracking-widest select-none">
          {Array.from({ length: 14 }).map((_, idx) => (
            <React.Fragment key={idx}>
              <span className="ticker-text-sync font-black tracking-wider">/// CREATE ///</span>
              <span className="ticker-text-sync font-black tracking-wider font-mono">PREDICT</span>
              <span className="ticker-text-sync font-black tracking-wider">/// IMPROVE ///</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Floating Bottom Dock Navbar ────────────────────────────────── */}
      <div className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center w-max max-w-[95vw]">
        {/* Outer Frosted Pill Container */}
        <div className="bg-slate-300/40 backdrop-blur-2xl border-2 border-white/60 p-1.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center gap-2">
          
          {/* Left Circle: Logo Badge Button */}
          <div
            onClick={handleReset}
            className="w-11 h-11 rounded-full bg-white border-2 border-[#05190e] flex items-center justify-center p-1.5 shadow-md hover:scale-110 transition-transform cursor-pointer"
            title="VIRALYTIX Home / Reset"
          >
            <img src="/logo.png" alt="VIRALYTIX Logo" className="w-full h-full object-contain" />
          </div>

          {/* Center Main Pill Button */}
          {stage === "idle" ? (
            <button
              onClick={() => {
                if (file) runAnalysis();
                else document.getElementById("file-input-a")?.click();
              }}
              className="bg-[#1c1c1e] hover:bg-black text-white px-4 md:px-7 py-2.5 rounded-full font-display font-extrabold text-xs md:text-sm tracking-tight flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-105 whitespace-nowrap"
            >
              <Zap size={16} className="text-emerald-400 fill-emerald-400" />
              <span>{file ? "Run Virality Engine" : "Upload Video"}</span>
            </button>
          ) : result ? (
            <button
              onClick={handleReset}
              className="bg-[#1c1c1e] hover:bg-black text-white px-4 md:px-7 py-2.5 rounded-full font-display font-extrabold text-xs md:text-sm tracking-tight flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-105 whitespace-nowrap"
            >
              <RotateCcw size={16} className="text-emerald-400" />
              <span>Reset Engine</span>
            </button>
          ) : (
            <div className="bg-[#1c1c1e] text-white px-4 md:px-7 py-2.5 rounded-full font-display font-extrabold text-xs md:text-sm tracking-tight flex items-center gap-2 shadow-lg whitespace-nowrap">
              <Activity size={16} className="text-emerald-400 animate-spin" />
              <span>Processing Signals...</span>
            </div>
          )}

          {/* Right Circle: Menu / Controls Button */}
          <button
            onClick={() => {
              if (result) setActiveTab(activeTab === "overview" ? "swarm" : "overview");
              else handleReset();
            }}
            className="w-11 h-11 rounded-full bg-white border-2 border-[#05190e] flex flex-col items-center justify-center gap-1 shadow-md hover:scale-110 transition-transform cursor-pointer text-[#05190e]"
            title="Engine Menu / Controls"
          >
            <span className="w-4 h-[2.5px] bg-[#05190e] rounded-full" />
            <span className="w-4 h-[2.5px] bg-[#05190e] rounded-full" />
          </button>
        </div>
      </div>

      {/* ── TOP HERO HEADER SECTION (Pure White Animated Grid Canvas + Pure Black/White Last Grid Row) ── */}
      {stage === "idle" && (
        <div className="w-full bg-white last-grid-row-pixel pt-8 pb-10 px-4 md:px-8 relative z-10 shadow-lg overflow-hidden">
          <HeroGridPixelCanvas />
          <div className="max-w-4xl mx-auto space-y-6 text-center relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-mono bg-[#05190e] text-white font-bold border-2 border-[#05190e] shadow-md">
              <img src="/logo.png" alt="VIRALYTIX Logo" className="w-5 h-5 object-contain" />
              <span>XGBoost + SHAP Explainer + 100-Agent Swarm Simulation</span>
            </div>

            {/* Title */}
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-[#05190e] tracking-tight leading-tight">
              Pre-Publish <span className="text-[#047857] underline decoration-[#05190e]/60 decoration-wavy">Virality Engine</span>
            </h1>

            {/* Description */}
            <p className="text-[#0f2e1d] text-base max-w-xl mx-auto font-sans font-semibold leading-relaxed">
              Predict video reach, retention drop-off, and audience response before publishing to TikTok, Shorts, or Reels.
            </p>

            {/* Mode Selector Buttons */}
            <div className="flex justify-center pt-2">
              <div className="bg-[#05190e] p-2 rounded-2xl border-3 border-[#05190e] flex gap-2 shadow-2xl max-w-md md:max-w-lg w-full">
                <button
                  onClick={() => setMode("single")}
                  className={`flex-1 py-3 px-6 rounded-xl text-xs md:text-sm font-display font-extrabold transition-all cursor-pointer ${
                    mode === "single"
                      ? "bg-white text-[#05190e] border-2 border-[#05190e] shadow-md scale-102 font-black"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Single Video Prediction
                </button>
                <button
                  onClick={() => setMode("ab")}
                  className={`flex-1 py-3 px-6 rounded-xl text-xs md:text-sm font-display font-extrabold transition-all cursor-pointer ${
                    mode === "ab"
                      ? "bg-white text-[#05190e] border-2 border-[#05190e] shadow-md scale-102 font-black"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  A/B Cut Benchmark Mode
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Container ──────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 pt-8 pb-36 md:pb-44 z-10 flex flex-col gap-8">
        
        {/* Stage 1: IDLE / Upload Mode Selection */}
        {stage === "idle" && (
          <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">

            {/* MICRO-GLASS FLOATING AUDIENCE SELECTOR BAR WITH SELF-EXPANDING MESSAGE BOX BUBBLE */}
            <div className="relative z-30">
              <div className="flex items-center justify-between gap-4 p-3 md:p-3.5 rounded-2xl metallic-card-3d relative w-full">
                {/* Left Label */}
                <div className="flex items-center gap-2.5 pl-2 shrink-0">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-sm">
                    <Users size={16} />
                  </div>
                  <span className="text-xs md:text-sm font-mono font-black text-white uppercase tracking-wider hidden sm:inline">
                    Target Audience
                  </span>
                </div>

                {/* 3 Compact Micro Capsule Buttons with Elastic Small Square Morphing Message Box */}
                <div className="flex items-center gap-2.5 p-1.5 rounded-2xl bg-slate-950/90 border border-white/15 flex-1 max-w-xl w-full justify-between">
                  {TARGET_DEMOGRAPHICS.map((demo, idx) => {
                    const isSelected = targetDemo === demo.value;
                    const isHovered = hoveredDemo === demo.value;
                    const icons = [Zap, Cpu, Globe];
                    const MicroIcon = icons[idx % icons.length];

                    return (
                      <button
                        key={demo.value}
                        onClick={() => setTargetDemo(demo.value)}
                        onMouseEnter={() => setHoveredDemo(demo.value)}
                        onMouseLeave={() => setHoveredDemo(null)}
                        style={{ transition: "all 0.3s ease" }}
                        className={`cursor-pointer text-left overflow-hidden flex flex-col transform-gpu flex-1 px-1.5 md:px-4 py-2.5 h-10.5 justify-center rounded-xl ${
                          isSelected
                            ? "bg-white text-[#05190e] shadow-md border-2 border-[#05190e]"
                            : "text-white font-black bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-800/80 hover:border-emerald-300"
                        }`}
                      >
                        <div className="flex items-center justify-center w-full">
                          <div className={`flex items-center gap-1.5 md:gap-2 font-display font-black text-[10px] md:text-sm ${
                            isSelected ? "text-[#05190e]" : "text-white"
                          }`}>
                            <MicroIcon size={16} className={`shrink-0 ${isSelected ? "text-[#05190e] stroke-[2.5]" : "text-emerald-400 stroke-[2.5]"}`} />
                            <span className="truncate">{demo.label.split(" ")[0]}</span>
                          </div>
                          {isSelected && (
                            <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0 ml-1.5 md:ml-2" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Description Box (Shows Selected or Hovered Persona Info) */}
              <div className="mt-3 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg relative">
                {/* Speech Bubble Pointer */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-t border-l border-white/10 rotate-45 rounded-sm" />
                
                {(() => {
                  const activeDemo = TARGET_DEMOGRAPHICS.find(d => d.value === (hoveredDemo || targetDemo));
                  if (!activeDemo) return null;
                  return (
                    <>
                      <p className="text-xs md:text-sm font-sans font-semibold text-slate-300 leading-relaxed max-w-2xl">
                        <span className="text-emerald-400 font-bold mr-2">{activeDemo.label}:</span>
                        {activeDemo.description}
                      </p>
                      <div className="flex gap-1.5 flex-wrap shrink-0">
                        {activeDemo.personas.map((p) => (
                          <span key={p} className="text-[9px] md:text-[10px] font-mono px-2 py-1 rounded-md bg-[#0b2e1c] text-emerald-300 border border-emerald-500/30 font-black shadow-sm">
                            {p}
                          </span>
                        ))}
                      </div>
                    </>
                  );
                })()}

                {/* Active Persona Tag Chips */}
                {(() => {
                  const activeDemo = TARGET_DEMOGRAPHICS.find((d) => d.value === (hoveredDemo || targetDemo)) || TARGET_DEMOGRAPHICS[0];
                  return (
                    <div className="hidden lg:flex items-center gap-1.5 pr-2">
                      {activeDemo.personas.slice(0, 2).map((p) => (
                        <span
                          key={p}
                          className="text-[9px] font-mono px-2.5 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-400/50 font-black shadow"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* PARTICLE WAVE MATRIX CANVAS CARD CONTAINER (3D Black Metallic & Shine) */}
            <div
              className={`min-h-[380px] relative overflow-hidden flex flex-col items-center justify-center p-8 transition-all duration-500 cursor-pointer rounded-[36px_12px_32px_14px] hover:rounded-[24px_36px_16px_32px] metallic-card-3d hover:border-emerald-400/90 group ${
                file ? "has-media border-emerald-400 shadow-[0_0_60px_rgba(16,185,129,0.5)]" : ""
              }`}
              onPointerEnter={() => waveEngineRef.current && !file && waveEngineRef.current.setState("hover")}
              onPointerMove={(e) => {
                if (waveEngineRef.current && waveCanvasRef.current) {
                  const rect = waveCanvasRef.current.getBoundingClientRect();
                  waveEngineRef.current.setCursor(e.clientX - rect.left, e.clientY - rect.top, true);
                }
              }}
              onPointerLeave={() => {
                if (waveEngineRef.current) {
                  waveEngineRef.current.setCursor(0, 0, false);
                  if (!file) waveEngineRef.current.setState("idle");
                }
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                if (!file && waveEngineRef.current) waveEngineRef.current.setState("dragging");
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (waveEngineRef.current && waveCanvasRef.current) {
                  const rect = waveCanvasRef.current.getBoundingClientRect();
                  waveEngineRef.current.setCursor(e.clientX - rect.left, e.clientY - rect.top, true);
                }
              }}
              onDragLeave={() => {
                if (!file && waveEngineRef.current) waveEngineRef.current.setState("hover");
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  validateAndSetFile(e.dataTransfer.files[0], "A", e);
                }
              }}
              onClick={(e) => {
                if (!file) document.getElementById("file-input-a")?.click();
              }}
            >
              {/* Top Glossy Reflection Sheen Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-black/50 pointer-events-none z-1" />
              {/* Particle Wave Canvas Element */}
              <canvas ref={waveCanvasRef} className="absolute inset-0 w-full h-full block z-0" />

              <input
                id="file-input-a"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0], "A", e)}
              />

              {/* IDLE CENTERED UNIQUE UPLOAD BUTTON (Frosted Blur Transparent) */}
              {!file && (
                <div className="relative z-10 flex flex-col items-center justify-center gap-4 pointer-events-none">
                  {/* Unique Apple-Precision Frosted Glass Orb Button */}
                  <div className="w-24 h-24 rounded-[28px_10px_24px_10px] bg-white/20 backdrop-blur-xl border-2 border-white/60 flex items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.5)] relative pointer-events-auto cursor-pointer">
                    <div className="w-16 h-16 rounded-2xl bg-[#05190e]/70 backdrop-blur-md border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-inner">
                      <Upload size={34} className="stroke-[2.5]" />
                    </div>
                    {/* Animated Outer Pulsing Aura Ring */}
                    <span className="absolute -inset-2.5 rounded-[34px_14px_30px_14px] border-2 border-emerald-400 animate-ping opacity-50 pointer-events-none" />
                  </div>

                  {/* Sample Demo Trigger Button */}
                  <div className="pointer-events-auto">
                    <button
                      onClick={handleLoadMock}
                      className="text-[11px] font-mono font-black px-4 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-md text-emerald-200 border border-emerald-400/60 shadow-lg hover:bg-emerald-400 hover:text-slate-950 transition-all cursor-pointer"
                    >
                      Demo Video File
                    </button>
                  </div>
                </div>
              )}



              {/* MEDIA PREVIEW CARD OVERLAY (enters with liquid blob scale expansion AFTER 2.6s 3D wave delay) */}
              {file && showMediaPreview && (
                <div className="absolute inset-3 z-20 rounded-2xl overflow-hidden bg-slate-950 border-2 border-[#05190e] shadow-2xl flex flex-col justify-between p-4 liquid-blob-entrance">
                  {/* Video Element */}
                  {videoUrl && (
                    <video
                      ref={videoPreviewRef}
                      src={videoUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                      onLoadedMetadata={(e) => {
                        const vid = e.currentTarget;
                        setVideoMeta((prev) => ({ ...prev, duration: fmtDuration(vid.duration) }));
                      }}
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

                  {/* Remove Button */}
                  <button
                    onClick={handleRemoveVideo}
                    className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-slate-900/80 border border-white/30 text-white flex items-center justify-center hover:bg-rose-600 transition-colors shadow"
                    title="Remove Video"
                  >
                    <X size={14} />
                  </button>

                  {/* Media Info Footer */}
                  <div className="relative z-20 space-y-2 mt-auto text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-white truncate max-w-[260px]">
                        {videoMeta.name}
                      </span>
                      <span className="text-xs font-mono text-emerald-300">{videoMeta.size}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <CheckCircle2 size={14} /> Video Stream Ready
                      </span>
                      <span>{videoMeta.duration}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {mode === "ab" && (
              <div className="brutal-card p-6 border-dashed border-2 border-[#05190e] hover:border-cyan-600 transition-all text-center cursor-pointer"
                onClick={() => {
                  document.getElementById("file-input-b")?.click();
                }}
              >
                <input
                  id="file-input-b"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0], "B")}
                />
                <div className="flex items-center justify-center gap-3">
                  <FileVideo size={22} className="text-[#05190e]" />
                  <span className="font-display font-extrabold text-sm text-[#05190e]">
                    {fileB ? fileB.name : "Upload Variation Video B (Optional)"}
                  </span>
                </div>
              </div>
            )}

            {fileError && (
              <div className="p-4 bg-rose-100 border-2 border-rose-600 text-rose-900 rounded-2xl text-xs flex items-center gap-2 font-bold shadow">
                <AlertCircle size={16} />
                <span>{fileError}</span>
              </div>
            )}

            {/* Analysis Trigger Status Bar */}
            <div className="pt-2">
              <button
                onClick={runAnalysis}
                disabled={!file}
                className={`w-full py-4 px-4 rounded-2xl font-display font-black text-[11px] sm:text-sm md:text-base uppercase tracking-wider transition-all flex items-center justify-center gap-2 md:gap-2.5 cursor-pointer shadow-2xl ${
                  file
                    ? "btn-tactile-white-3d"
                    : "metallic-card-3d text-emerald-300/80 cursor-not-allowed"
                }`}
              >
                <Zap size={20} className={`shrink-0 ${file ? "fill-[#05190e] text-[#05190e]" : "text-slate-500"}`} />
                <span className="text-center leading-tight whitespace-normal">{file ? "Initialize Signal Extraction & Swarm Simulation" : "Upload Video to Activate Engine"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Stage 2: Processing Live Multi-Stage Pipeline Map */}
        {(stage === "uploading" || stage === "processing") && (
          <div className="max-w-5xl mx-auto w-full py-12 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-tight flex items-center justify-center gap-2">
                <Activity size={26} className="text-emerald-400 animate-spin" />
                Live Multi-Modal Pipeline Execution
              </h2>
              <p className="text-emerald-200 text-sm font-mono">{progressLabel}</p>
            </div>

            {/* Interactive Pipeline Node Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PIPELINE_NODES.map((node, idx) => {
                const isActive = idx === currentPipelineIndex;
                const isComplete = idx < currentPipelineIndex;

                return (
                  <div
                    key={node.id}
                    style={{ transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
                    className={`brutal-card flex flex-col gap-2 transform-gpu relative ${
                      isActive
                        ? "col-span-full md:col-span-2 border-4 border-[#05190e] bg-white text-[#05190e] shadow-[0_40px_120px_rgba(0,0,0,0.98),0_0_60px_rgba(16,185,129,0.5)] p-7 md:p-9 rounded-3xl z-50 my-4"
                        : isComplete
                        ? "col-span-1 border-2 border-emerald-600 bg-emerald-50 text-[#05190e] shadow-md p-4 rounded-2xl z-10"
                        : "col-span-1 border-2 border-slate-300 bg-slate-100 text-slate-400 opacity-60 shadow-sm p-4 rounded-2xl z-10"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3.5">
                        <div className={`rounded-xl flex items-center justify-center font-mono font-black shrink-0 ${
                          isActive
                            ? "w-11 h-11 text-base bg-[#05190e] text-white animate-pulse"
                            : isComplete
                            ? "w-8 h-8 text-xs bg-emerald-500 text-slate-950 border border-[#05190e]"
                            : "w-8 h-8 text-xs bg-slate-300 text-slate-600"
                        }`}>
                          {isComplete ? <Check size={16} /> : idx + 1}
                        </div>
                        <div>
                          <div className={`font-display font-extrabold text-[#05190e] ${isActive ? "text-lg md:text-xl" : "text-sm"}`}>{node.title}</div>
                          <div className={`text-slate-600 font-medium ${isActive ? "text-xs md:text-sm" : "text-[11px]"}`}>{node.desc}</div>
                        </div>
                      </div>

                      {isActive ? (
                        <span className="text-xs font-mono font-black text-white bg-[#05190e] px-3.5 py-1 rounded-full animate-pulse shrink-0 ml-2">
                          COMPUTING...
                        </span>
                      ) : isComplete ? (
                        <span className="text-[10px] font-mono font-black text-emerald-800 bg-emerald-200 border border-emerald-400 px-2.5 py-1 rounded-md flex items-center gap-1 shrink-0 ml-2">
                          <Check size={12} /> COMPLETE
                        </span>
                      ) : null}
                    </div>

                    {/* Custom Active Motion Visualizer */}
                    {isActive && (
                      <div className="w-full animate-fade-in">
                        {idx === 0 && <FFmpegProbeVisualizer />}
                        {idx === 1 && <FrameSamplerVisualizer />}
                        {idx === 2 && <AudioSeparatorVisualizer />}
                        {idx === 3 && <OpenCVSignalVisualizer />}
                        {idx === 4 && <SwarmEngineVisualizer />}
                        {idx === 5 && <SHAPEvaluatorVisualizer />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-[#05170d] rounded-full h-3 overflow-hidden border-2 border-[#05190e]">
                <div
                  className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-300 h-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-emerald-200 font-bold">
                <span>Signal Extraction Status</span>
                <span>{progress}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Stage 3: DONE - Alive Dashboard with Tabs & Live Swarm */}
        {stage === "done" && result && (
          <div className="space-y-8 animate-fade-in" id="results-panel">
            {/* Tab Navigation */}
            <div className="flex items-center justify-between border-b-2 border-white/20 pb-4 flex-wrap gap-4">
              <div className="flex gap-2">
                {[
                  { id: "overview", label: "Executive Dashboard", icon: BarChart3 },
                  { id: "swarm", label: "100-Agent Swarm Simulation", icon: Users },
                  { id: "signals", label: "Signal Breakdown & Metrics", icon: Activity },
                  { id: "recommendations", label: "AI Optimization Plan", icon: Lightbulb }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4.5 py-2.5 rounded-xl text-xs font-display font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                        activeTab === tab.id
                          ? "bg-white text-[#05190e] border-2 border-[#05190e] shadow-lg glow-emerald scale-[1.02]"
                          : "bg-[#062013]/80 text-emerald-100 hover:text-white border border-white/20"
                      }`}
                    >
                      <Icon size={15} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-mono text-[#05190e] bg-white px-3.5 py-1.5 rounded-xl border-2 border-[#05190e] flex items-center gap-2 font-bold shadow">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Virality Category: <strong className="text-emerald-700 font-black">{result.performance_category}</strong></span>
              </div>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Top Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Virality Score Card */}
                  <div className="brutal-card p-6 bg-white border-2 border-[#05190e] glow-emerald text-center flex flex-col items-center justify-center relative">
                    <div className="ambient-blob blob-emerald w-40 h-40 -top-8 -right-8" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold mb-2 relative z-10">
                      Virality Index Score
                    </span>
                    <div className="text-5xl font-display font-black text-[#05190e] tracking-tight mb-1 relative z-10">
                      {result.virality_score}
                      <span className="text-lg text-slate-400 font-normal">/100</span>
                    </div>
                    <span className="text-xs font-mono text-[#05190e] font-extrabold bg-emerald-200 px-3 py-1 rounded-full border border-[#05190e] mt-2 relative z-10">
                      {result.performance_category} Virality Potential
                    </span>
                  </div>

                  {/* Reach Estimate */}
                  <div className="brutal-card p-5 space-y-1 relative">
                    <div className="ambient-blob blob-cyan w-36 h-36 -bottom-10 -left-10" />
                    <div className="flex justify-between items-center text-slate-500 text-xs font-mono font-bold relative z-10">
                      <span>Est. Reach Potential</span>
                      <Eye size={16} className="text-cyan-600" />
                    </div>
                    <div className="text-3xl font-display font-black text-[#05190e] pt-2 relative z-10">
                      {result.predicted_reach.toLocaleString()}
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium relative z-10">Predicted impressions in target cluster</p>
                  </div>

                  {/* Engagement Rate */}
                  <div className="brutal-card p-5 space-y-1 relative">
                    <div className="flex justify-between items-center text-slate-500 text-xs font-mono font-bold relative z-10">
                      <span>Engagement Index</span>
                      <Heart size={16} className="text-rose-600" />
                    </div>
                    <div className="text-3xl font-display font-black text-[#05190e] pt-2 relative z-10">
                      {(result.predicted_engagement * 100).toFixed(1)}%
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium relative z-10">Combined like, comment & share ratio</p>
                  </div>

                  {/* Retention Rate */}
                  <div className="brutal-card p-5 space-y-1 relative">
                    <div className="ambient-blob blob-amber w-36 h-36 -top-10 -right-10" />
                    <div className="flex justify-between items-center text-slate-500 text-xs font-mono font-bold relative z-10">
                      <span>Video Completion</span>
                      <Activity size={16} className="text-amber-600" />
                    </div>
                    <div className="text-3xl font-display font-black text-[#05190e] pt-2 relative z-10">
                      {(result.predicted_retention * 100).toFixed(1)}%
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium relative z-10">Simulated 100% completion rate</p>
                  </div>
                </div>

                {/* Retention Curve Chart */}
                <div className="brutal-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-extrabold text-base text-[#05190e] flex items-center gap-2">
                        <Activity size={18} className="text-emerald-700" /> Second-by-Second Audience Retention Decay
                      </h3>
                      <p className="text-xs text-slate-600 font-medium">Drop-off model based on hook intensity and pacing</p>
                    </div>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-100 border border-amber-500 text-amber-900 font-extrabold flex items-center gap-1">
                      <AlertCircle size={13} /> Critical Drop: 3s – 6s
                    </span>
                  </div>

                  {result.features?.retention_curve && (
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={result.features.retention_curve}>
                        <defs>
                          <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="second" stroke="#475569" tick={{ fontSize: 11, fontWeight: "bold" }} tickFormatter={(s) => `${s}s`} />
                        <YAxis stroke="#475569" tick={{ fontSize: 11, fontWeight: "bold" }} tickFormatter={(v) => `${Math.round(v * 100)}%`} domain={[0, 1]} />
                        <ChartTooltip content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const sec = payload[0].payload.second;
                          const val = Math.round(Number(payload[0].value || 0) * 100);
                          return (
                            <div className="bg-white border-2 border-[#05190e] p-2.5 rounded-xl text-xs space-y-1 shadow-lg">
                              <div className="font-mono text-slate-600 font-bold">Timestamp: {sec}s</div>
                              <div className="font-extrabold text-emerald-800">Retention: {val}%</div>
                            </div>
                          );
                        }} />
                        <Area type="monotone" dataKey="retention" stroke="#059669" strokeWidth={3} fill="url(#retentionGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: 100-AGENT SWARM SIMULATION */}
            {activeTab === "swarm" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-white text-[#05190e] p-4.5 rounded-2xl border-2 border-[#05190e] shadow-md">
                  <div>
                    <h3 className="font-display font-extrabold text-base flex items-center gap-2">
                      <Users size={18} className="text-emerald-700" /> Live Persona Swarm Controller
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">Scrub rounds to watch 100 simulated viewer decisions unfold live</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="px-4 py-2 rounded-xl bg-[#05190e] hover:bg-slate-800 text-white text-xs font-display font-bold flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                      <span>{isPlaying ? "Pause Swarm" : "Play Swarm"}</span>
                    </button>
                    <span className="text-xs font-mono font-extrabold text-slate-700">
                      Step {simRound + 1} / {cascadeRounds.length || 1}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Interactive Swarm Visualizer Grid */}
                  <div className="lg:col-span-2 brutal-card p-6 space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-600 font-bold">
                      <span>100 Agent Demographic Swarm Map</span>
                      <span>Target: {targetDemo}</span>
                    </div>

                    <div className="relative w-full aspect-square sm:aspect-[680/380] bg-[#0b2e1c] rounded-xl border-2 border-[#05190e] overflow-hidden flex items-center justify-center shadow-inner">
                      <svg width="100%" height="100%" viewBox="0 0 680 380" className="w-full h-full relative z-10">
                        {/* Radar grids for visual structure */}
                        <circle cx="340" cy="190" r="40" fill="none" stroke="#0f3b25" strokeWidth="2" strokeDasharray="4 4" />
                        <circle cx="340" cy="190" r="80" fill="none" stroke="#0f3b25" strokeWidth="1" strokeDasharray="2 6" />
                        <text x="340" y="290" textAnchor="middle" fill="#0f3b25" fontSize="11" fontWeight="bold" letterSpacing="0.2em">WATCHING</text>
                        
                        <circle cx="540" cy="190" r="30" fill="none" stroke="#0f3b25" strokeWidth="2" strokeDasharray="4 4" />
                        <circle cx="540" cy="190" r="60" fill="none" stroke="#0f3b25" strokeWidth="1" strokeDasharray="2 6" />
                        <text x="540" y="270" textAnchor="middle" fill="#0f3b25" fontSize="11" fontWeight="bold" letterSpacing="0.2em">ENGAGED</text>

                        <circle cx="140" cy="320" r="30" fill="none" stroke="#0a2618" strokeWidth="1" strokeDasharray="2 4" />
                        <text x="140" y="370" textAnchor="middle" fill="#0a2618" fontSize="11" fontWeight="bold" letterSpacing="0.2em">SKIPPED</text>
                        
                        {(() => {
                          // Pre-calculate indices for perfect Phyllotaxis Spirals!
                          const bucketCounts = { watching: 0, engaged: 0, skipped: 0 };
                          const nodeBucketIndex: Record<string, { type: string, idx: number }> = {};
                          
                          activeRoundState.forEach((s) => {
                            if (s.status === 'watching') nodeBucketIndex[s.id] = { type: 'watching', idx: bucketCounts.watching++ };
                            else if (s.status === 'liked' || s.status === 'shared') nodeBucketIndex[s.id] = { type: 'engaged', idx: bucketCounts.engaged++ };
                            else if (s.status === 'skipped') nodeBucketIndex[s.id] = { type: 'skipped', idx: bucketCounts.skipped++ };
                          });

                          return INITIAL_NODES.map((node) => {
                            const state = activeRoundState.find((s) => s.id === node.id);
                            const status = state?.status || "idle";
                            const personaMeta = PERSONA_CONFIGS[node.cluster];

                            let fillColor = personaMeta.color;
                            if (status === "skipped") fillColor = "#475569";
                            if (status === "liked") fillColor = "#db2777";
                            if (status === "shared") fillColor = "#34d399";
                            if (status === "watching") fillColor = "#ffffff"; // Watching nodes turn bright white!

                            // Calculate target position based on Phyllotaxis Golden Spiral
                            let targetX = node.x;
                            let targetY = node.y;
                            let targetScale = 1;
                            
                            const bucketData = nodeBucketIndex[node.id];
                            const bIdx = bucketData ? bucketData.idx : 0;
                            const angle = bIdx * 137.5 * (Math.PI / 180);
                            const radius = Math.sqrt(bIdx) * 14;
                            
                            if (status === "watching") {
                              targetX = 340 + Math.cos(angle) * radius;
                              targetY = 190 + Math.sin(angle) * radius;
                              targetScale = 1.3;
                            } else if (status === "skipped") {
                              targetX = 140 + Math.cos(angle) * (radius * 0.8);
                              targetY = 320 + Math.sin(angle) * (radius * 0.8);
                              targetScale = 0.6;
                            } else if (status === "liked" || status === "shared") {
                              targetX = 540 + Math.cos(angle) * radius;
                              targetY = 190 + Math.sin(angle) * radius;
                              targetScale = status === "shared" ? 1.6 : 1.4;
                            }

                            return (
                              <motion.g 
                                key={node.id} 
                                onClick={() => setSelectedNode(node)} 
                                className="cursor-pointer node-hover"
                              >
                                <motion.circle
                                  initial={{ cx: node.x, cy: node.y, scale: 0 }}
                                  animate={{ 
                                    cx: targetX, 
                                    cy: targetY, 
                                    scale: targetScale,
                                    opacity: status === "idle" ? 0.25 : (status === "skipped" ? 0.15 : 0.95)
                                  }}
                                  transition={{ 
                                    type: "spring", 
                                    damping: status === "idle" ? 20 : 14, 
                                    stiffness: status === "idle" ? 40 : 100,
                                    mass: 0.8 
                                  }}
                                  r={5}
                                  fill={fillColor}
                                  stroke={status === "watching" || status === "shared" ? "#ffffff" : "#05190e"}
                                  strokeWidth={status === "watching" || status === "shared" ? 1.5 : 1}
                                  style={{ 
                                    filter: (status === "watching" || status === "shared" || status === "liked") 
                                      ? `drop-shadow(0px 4px 12px ${fillColor}80)` 
                                      : "none" 
                                  }}
                                />
                              </motion.g>
                            );
                          });
                        })()}
                      </svg>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 font-bold flex-wrap gap-2">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-600 border border-slate-900" /> Skipped</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-400 border border-slate-900" /> Watching</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-pink-500 border border-slate-900" /> Liked</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-cyan-400 border border-slate-900" /> Shared</span>
                    </div>
                  </div>

                  {/* Live Event Ticker Feed */}
                  <div className="brutal-card p-6 flex flex-col h-[440px] max-h-[60vh]">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#05190e] pb-3 border-b-2 border-[#05190e] font-black">
                      <Terminal size={15} className="text-[#05190e]" /> Live Decision Stream
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 py-3 terminal-scroll pr-1" ref={logContainerRef}>
                      {liveLog.map((log) => (
                        <div key={log.id} className="text-[11px] font-mono p-2.5 rounded-xl bg-slate-100 border border-slate-300 space-y-0.5">
                          <div className="flex items-center justify-between text-slate-700 font-bold">
                            <span className="text-[#05190e] font-extrabold">[{log.time}] {log.agentName}</span>
                            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-200 text-[#05190e] border border-emerald-400 font-bold">{log.persona}</span>
                          </div>
                          <div className="text-slate-800 font-medium">{log.detail}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SIGNAL BREAKDOWN */}
            {activeTab === "signals" && (
              <div className="space-y-6">
                <div className="brutal-card p-6 space-y-4">
                  <h3 className="font-display font-extrabold text-base text-[#05190e] flex items-center gap-2">
                    <Activity size={18} className="text-emerald-700" /> Extracted Multi-Modal Signals
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4.5 rounded-2xl bg-slate-100 border-2 border-[#05190e] space-y-1">
                      <div className="text-xs font-mono text-slate-600 font-bold">Hook Score</div>
                      <div className="text-2xl font-black text-[#05190e]">{result.features?.hook_score ?? 74}/100</div>
                    </div>
                    <div className="p-4.5 rounded-2xl bg-slate-100 border-2 border-[#05190e] space-y-1">
                      <div className="text-xs font-mono text-slate-600 font-bold">Scene Cut Speed</div>
                      <div className="text-2xl font-black text-cyan-700">{result.features?.scene_change_rate ?? 1.8}/s</div>
                    </div>
                    <div className="p-4.5 rounded-2xl bg-slate-100 border-2 border-[#05190e] space-y-1">
                      <div className="text-xs font-mono text-slate-600 font-bold">Speech Rate</div>
                      <div className="text-2xl font-black text-emerald-800">{result.features?.speech_rate ?? 142} WPM</div>
                    </div>
                    <div className="p-4.5 rounded-2xl bg-slate-100 border-2 border-[#05190e] space-y-1">
                      <div className="text-xs font-mono text-slate-600 font-bold">CTA Intensity</div>
                      <div className="text-2xl font-black text-amber-700">{((result.features?.cta_score ?? 0.65) * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                </div>

                {/* SHAP Factor Attribution */}
                <div className="brutal-card p-6 space-y-4">
                  <h3 className="font-display font-extrabold text-base text-[#05190e] flex items-center gap-2">
                    <BarChart3 size={18} className="text-emerald-700" /> SHAP Feature Impact Attribution
                  </h3>
                  <div className="space-y-3">
                    {result.shap_values.map((shap) => (
                      <div key={shap.feature} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono font-bold">
                          <span className="text-slate-800">{shap.label}</span>
                          <span className={shap.direction === "positive" ? "text-emerald-700 font-extrabold" : "text-rose-700 font-extrabold"}>
                            {shap.direction === "positive" ? "+" : "-"}{shap.impact.toFixed(1)} pts
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden border border-slate-400">
                          <div
                            className={`h-full rounded-full ${shap.direction === "positive" ? "bg-emerald-500" : "bg-rose-500"}`}
                            style={{ width: `${Math.min(100, shap.impact * 4)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: AI RECOMMENDATIONS */}
            {activeTab === "recommendations" && (
              <div className="space-y-4">
                <div className="brutal-card p-6 space-y-4">
                  <h3 className="font-display font-extrabold text-base text-[#05190e] flex items-center gap-2">
                    <Lightbulb size={20} className="text-amber-600" /> AI Optimization Directives
                  </h3>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className="p-4.5 rounded-2xl bg-slate-100 border-2 border-[#05190e] flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#05190e] text-white flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs font-black shadow">
                          {i + 1}
                        </div>
                        <p className="text-xs text-slate-800 leading-relaxed font-sans font-semibold">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

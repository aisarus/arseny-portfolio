import { useEffect, useMemo, useRef, useState } from "react";

import {
  GRAIN_URL,
  clamp,
  makeRng,
  smoothstep,
  stepPointer,
  usePointerField,
  useReducedMotion,
} from "@/components/concepts/shared";

type Rect = { x: number; y: number; w: number; h: number };

function makeMosaic(depth: number, rng: () => number) {
  let rects: Rect[] = [{ x: 0, y: 0, w: 1, h: 1 }];
  for (let depthIndex = 0; depthIndex < depth; depthIndex += 1) {
    const next: Rect[] = [];
    for (const rect of rects) {
      if (rng() < 0.16 && depthIndex > 1) {
        next.push(rect);
        continue;
      }
      const horizontal = rect.w / 1.6 > rect.h ? true : rect.h / 1.6 > rect.w ? false : rng() > 0.5;
      const split = 0.32 + rng() * 0.36;
      if (horizontal) {
        next.push(
          { ...rect, w: rect.w * split },
          { ...rect, x: rect.x + rect.w * split, w: rect.w * (1 - split) },
        );
      } else {
        next.push(
          { ...rect, h: rect.h * split },
          { ...rect, y: rect.y + rect.h * split, h: rect.h * (1 - split) },
        );
      }
    }
    rects = next;
  }
  return rects;
}

function useSceneVisible<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), {
      rootMargin: "20% 0px",
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

const FIELD_WORDS = [
  "GOAL",
  "CONTRACT",
  "PLAN",
  "BUILD",
  "FAILURE",
  "REPLAN",
  "VERIFIED",
  "AEGIS",
  "EVIDENCE",
  "AMBIGUOUS",
  "DECOMPOSE",
  "BREAK",
  "DIAGNOSE",
  "ACCEPTANCE",
  "SYSTEM",
  "OWNER",
  "TRACE",
  "STATE",
  "SHIP",
];

export function OperatorField() {
  const reduced = useReducedMotion();
  const [narrow, setNarrow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { ref: hostRef, visible } = useSceneVisible<HTMLDivElement>();
  const cellRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pointer = usePointerField(mounted && visible && !reduced);

  useEffect(() => {
    const measure = () => setNarrow(window.innerWidth < 700);
    measure();
    setMounted(true);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const cells = useMemo(() => {
    const rng = makeRng(40262026);
    return makeMosaic(narrow ? 4 : 6, rng).map((rect, index) => ({
      ...rect,
      text: FIELD_WORDS[index % FIELD_WORDS.length] ?? "EVIDENCE",
      lag: 0.55 + rng() * 0.75,
      seed: rng(),
    }));
  }, [narrow]);

  useEffect(() => {
    if (!mounted || reduced || !visible) return;
    const host = hostRef.current;
    if (!host) return;
    const clarity = new Float32Array(cells.length);
    const pushX = new Float32Array(cells.length);
    const pushY = new Float32Array(cells.length);
    let frame = 0;
    const draw = () => {
      const point = pointer.current;
      stepPointer(point, 0.14);
      const bounds = host.getBoundingClientRect();
      const px = point.sx - bounds.left;
      const py = point.sy - bounds.top;
      const boost = clamp(point.speed / 26);
      const radius = Math.min(bounds.width, bounds.height) * (0.26 + boost * 0.2);
      cells.forEach((cell, index) => {
        const node = cellRefs.current[index];
        if (!node) return;
        const dx = (cell.x + cell.w / 2) * bounds.width - px;
        const dy = (cell.y + cell.h / 2) * bounds.height - py;
        const distance = Math.hypot(dx, dy) || 0.001;
        const target = point.active ? 1 - smoothstep(radius * 0.12, radius, distance) : 0;
        const current = clarity[index] ?? 0;
        clarity[index] = current + (target - current) * (target > current ? 0.22 * cell.lag : 0.018 * cell.lag);
        const magnitude = target * (8 + 36 * boost) * (0.65 + cell.seed * 0.7);
        const currentX = pushX[index] ?? 0;
        const currentY = pushY[index] ?? 0;
        pushX[index] = currentX + ((dx / distance) * magnitude - currentX) * 0.1;
        pushY[index] = currentY + ((dy / distance) * magnitude - currentY) * 0.1;
        node.style.setProperty("--field-clarity", (clarity[index] ?? 0).toFixed(3));
        node.style.setProperty("--field-x", `${(pushX[index] ?? 0).toFixed(2)}px`);
        node.style.setProperty("--field-y", `${(pushY[index] ?? 0).toFixed(2)}px`);
      });
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [cells, hostRef, mounted, pointer, reduced, visible]);

  return (
    <div ref={hostRef} className="operator-field" data-static={reduced ? "true" : undefined} aria-hidden>
      {mounted
        ? cells.map((cell, index) => (
            <div
              key={`${cell.text}-${index}`}
              ref={(node) => {
                cellRefs.current[index] = node;
              }}
              className="operator-cell"
              style={{
                left: `${cell.x * 100}%`,
                top: `${cell.y * 100}%`,
                width: `${cell.w * 100}%`,
                height: `${cell.h * 100}%`,
              }}
            >
              <span className="operator-word operator-word-red">{cell.text}</span>
              <span className="operator-word operator-word-blue">{cell.text}</span>
              <span className="operator-word operator-word-main">{cell.text}</span>
              <span className="operator-slice">{cell.text}</span>
              <i className="operator-grain" style={{ backgroundImage: GRAIN_URL }} />
            </div>
          ))
        : null}
    </div>
  );
}

type Shard = { x: number; y: number; w: number; h: number; amp: number; axis: 0 | 1; phase: number; rate: number };

function makeShards(rows: number, rng: () => number) {
  const shards: Shard[] = [];
  let y = 0;
  for (let row = 0; row < rows; row += 1) {
    const h = row === rows - 1 ? 1 - y : Math.min((1 / rows) * (0.64 + rng() * 0.72), 1 - y);
    const columns = 1 + Math.floor(rng() * 3);
    let x = 0;
    for (let column = 0; column < columns; column += 1) {
      const w = column === columns - 1 ? 1 - x : Math.min((1 / columns) * (0.6 + rng() * 0.8), 1 - x);
      shards.push({ x, y, w, h, amp: 10 + rng() * 48, axis: rng() > 0.76 ? 1 : 0, phase: rng() * Math.PI * 2, rate: 0.35 + rng() * 1.1 });
      x += w;
      if (x >= 0.999) break;
    }
    y += h;
    if (y >= 0.999) break;
  }
  return shards;
}

function AegisPlane() {
  return (
    <div className="aegis-plane">
      <div className="aegis-plane-meta"><span>Aegis / orchestration</span><span>evidence before verdict</span></div>
      <p className="aegis-plane-title">The model says done.<br />I check.</p>
      <div className="aegis-chain"><span>Goal</span><b>→</b><span>Contract</span><b>→</b><span>Plan</span><b>→</b><span>Execution</span><b>→</b><span>Failure</span><b>→</b><span>Replan</span><b>→</b><span>Verified</span></div>
      <div className="aegis-plane-rule" />
      <div className="aegis-plane-meta"><span>accept / reject</span><span>owner control</span><span>regression evidence</span></div>
    </div>
  );
}

export function AegisShardScene() {
  const reduced = useReducedMotion();
  const [narrow, setNarrow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { ref: hostRef, visible } = useSceneVisible<HTMLDivElement>();
  const shardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pointer = usePointerField(mounted && visible && !reduced);
  useEffect(() => {
    const measure = () => setNarrow(window.innerWidth < 700);
    measure();
    setMounted(true);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const shards = useMemo(() => makeShards(narrow ? 7 : 11, makeRng(770423)), [narrow]);

  useEffect(() => {
    if (!mounted || reduced || !visible) return;
    const host = hostRef.current;
    if (!host) return;
    const offset = new Float32Array(shards.length);
    const velocity = new Float32Array(shards.length);
    let elapsed = 0;
    let frame = 0;
    const draw = () => {
      elapsed += 1 / 60;
      const point = pointer.current;
      stepPointer(point, 0.28);
      const bounds = host.getBoundingClientRect();
      const px = point.sx - bounds.left;
      const py = point.sy - bounds.top;
      const boost = clamp(point.speed / 24);
      const reach = Math.min(bounds.width, bounds.height) * 0.38;
      shards.forEach((shard, index) => {
        const node = shardRefs.current[index];
        if (!node) return;
        const distance = Math.hypot((shard.x + shard.w / 2) * bounds.width - px, (shard.y + shard.h / 2) * bounds.height - py);
        const near = point.active ? clamp(1 - distance / reach) : 0;
        const lock = near * near;
        const drift = Math.sin(elapsed * shard.rate + shard.phase) * shard.amp;
        const target = drift * (1 - lock) + (1 - lock) * boost * 15 * Math.sign(drift || 1);
        const previousVelocity = velocity[index] ?? 0;
        const previousOffset = offset[index] ?? 0;
        velocity[index] = (previousVelocity + (target - previousOffset) * (0.055 + lock * 0.3)) * (0.82 - lock * 0.15 - boost * 0.05);
        offset[index] = previousOffset + (velocity[index] ?? 0);
        const value = offset[index] ?? 0;
        node.style.transform = shard.axis === 0 ? `translate3d(${value.toFixed(2)}px,0,0)` : `translate3d(0,${value.toFixed(2)}px,0)`;
        node.style.setProperty("--shard-lock", lock.toFixed(3));
        node.style.setProperty("--shard-ghost", (clamp(Math.abs(value) / 36) * (1 - lock)).toFixed(3));
      });
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [hostRef, mounted, pointer, reduced, shards, visible]);

  return (
    <div ref={hostRef} className="aegis-shards" data-static={reduced ? "true" : undefined} aria-hidden>
      {mounted ? shards.map((shard, index) => (
        <div
          key={index}
          ref={(node) => { shardRefs.current[index] = node; }}
          className="aegis-shard"
          style={{ left: `${shard.x * 100}%`, top: `${shard.y * 100}%`, width: `${shard.w * 100}%`, height: `${shard.h * 100}%` }}
        >
          <div className="aegis-window" style={{ transform: `translate3d(${-shard.x * 100}vw, ${-shard.y * 100}%, 0)` }}><AegisPlane /></div>
          <div className="aegis-window aegis-ghost" style={{ transform: `translate3d(${-shard.x * 100}vw, ${-shard.y * 100}%, 0)` }}><AegisPlane /></div>
          <i className="aegis-scan" />
        </div>
      )) : <AegisPlane />}
    </div>
  );
}

const TRACE_LINES = [
  "The model says done — the log decides",
  "Concurrency stabilised after resource isolation",
  "Secrets moved out of tracked config",
  "Diagnosis before patch",
  "Observation changed the observed state",
  "First call created, never resumed",
  "Dead reservations released conservatively",
  "Regression captured as executable evidence",
];

export function EvidenceTraceScene() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [columns, setColumns] = useState(4);
  const { ref: hostRef, visible } = useSceneVisible<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cellRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pointer = usePointerField(mounted && visible && !reduced);
  useEffect(() => {
    const measure = () => setColumns(window.innerWidth < 700 ? 2 : window.innerWidth < 1100 ? 3 : 4);
    measure();
    setMounted(true);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const rows = columns === 2 ? 4 : columns === 3 ? 3 : 2;
  const cells = useMemo(() => Array.from({ length: columns * rows }, (_, index) => ({ id: index, line: TRACE_LINES[index % TRACE_LINES.length] ?? "Evidence before verdict" })), [columns, rows]);

  useEffect(() => {
    if (!mounted || reduced || !visible) return;
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const style = getComputedStyle(host);
    const beamColor = style.getPropertyValue("--trace-beam").trim();
    const proofColor = style.getPropertyValue("--trace-proof").trim();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const bounds = host.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(bounds.width * ratio));
      canvas.height = Math.max(1, Math.floor(bounds.height * ratio));
      canvas.style.width = `${bounds.width}px`;
      canvas.style.height = `${bounds.height}px`;
    };
    resize();
    window.addEventListener("resize", resize);
    type TrailPoint = { x: number; y: number; time: number };
    const trail: TrailPoint[] = [];
    const proof: Array<{ x: number; y: number }> = [];
    const clarity = new Float32Array(cells.length);
    const verified = new Uint8Array(cells.length);
    let frame = 0;
    const draw = () => {
      const now = performance.now();
      const point = pointer.current;
      stepPointer(point, 0.38);
      const bounds = host.getBoundingClientRect();
      const px = point.sx - bounds.left;
      const py = point.sy - bounds.top;
      if (point.active && px >= 0 && py >= 0 && px <= bounds.width && py <= bounds.height) {
        const last = trail[trail.length - 1];
        if (!last || Math.hypot(px - last.x, py - last.y) > 6) trail.push({ x: px, y: py, time: now });
      }
      while (trail.length && now - (trail[0]?.time ?? now) > 4200) trail.shift();
      cells.forEach((_, index) => {
        const node = cellRefs.current[index];
        if (!node) return;
        const cellBounds = node.getBoundingClientRect();
        const cx = cellBounds.left - bounds.left + cellBounds.width / 2;
        const cy = cellBounds.top - bounds.top + cellBounds.height / 2;
        let best = 0;
        for (let trailIndex = trail.length - 1; trailIndex >= 0; trailIndex -= 1) {
          const trailPoint = trail[trailIndex];
          if (!trailPoint) continue;
          const spatial = clamp(1 - Math.hypot(trailPoint.x - cx, trailPoint.y - cy) / (Math.max(cellBounds.width, cellBounds.height) * 0.95));
          const age = clamp(1 - (now - trailPoint.time) / 4200);
          best = Math.max(best, spatial * (0.35 + age * 0.65));
        }
        const current = clarity[index] ?? 0;
        clarity[index] = current + (best - current) * (best > current ? 0.3 : 0.025);
        const value = clarity[index] ?? 0;
        node.style.setProperty("--trace-clarity", value.toFixed(3));
        if (!(verified[index] ?? 0) && value > 0.7) {
          verified[index] = 1;
          node.dataset["state"] = "verified";
          proof.push({ x: cx / bounds.width, y: cy / bounds.height });
        }
      });
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, bounds.width, bounds.height);
      if (proof.length > 1) {
        const first = proof[0];
        if (first) {
          context.beginPath();
          context.moveTo(first.x * bounds.width, first.y * bounds.height);
          proof.slice(1).forEach((item) => context.lineTo(item.x * bounds.width, item.y * bounds.height));
          context.strokeStyle = proofColor;
          context.lineWidth = 1;
          context.setLineDash([3, 5]);
          context.stroke();
          context.setLineDash([]);
        }
      }
      context.lineCap = "round";
      for (let index = 1; index < trail.length; index += 1) {
        const start = trail[index - 1];
        const end = trail[index];
        if (!start || !end) continue;
        const age = clamp(1 - (now - end.time) / 4200);
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.globalAlpha = age * 0.56;
        context.strokeStyle = beamColor;
        context.lineWidth = 1 + age * 7;
        context.stroke();
      }
      context.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [cells, hostRef, mounted, pointer, reduced, visible]);

  return (
    <div ref={hostRef} className="evidence-trace" data-static={reduced ? "true" : undefined} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }} aria-hidden>
      {cells.map((cell, index) => (
        <div key={cell.id} ref={(node) => { cellRefs.current[index] = node; }} className="trace-cell" data-state={reduced ? "verified" : "rejected"}>
          <div className="trace-cell-meta"><span>EV-{String(index + 41).padStart(3, "0")}</span><span className="trace-state"><i>rejected</i><b>verified</b></span></div>
          <p><span className="trace-duplicate trace-red">{cell.line}</span><span className="trace-duplicate trace-green">{cell.line}</span><span className="trace-main">{cell.line}</span></p>
          <i className="trace-grain" style={{ backgroundImage: GRAIN_URL }} />
        </div>
      ))}
      <canvas ref={canvasRef} className="trace-canvas" />
    </div>
  );
}
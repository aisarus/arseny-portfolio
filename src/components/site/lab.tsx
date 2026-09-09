import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { Shell } from "./primitives";
import { SignalField } from "./signal-field";
import { useStaticMode } from "./effects";

function TwinPreview() {
  const [time, setTime] = useState(12.8);
  return (
    <div
      className="lab-twin-toy"
      tabIndex={0}
      role="slider"
      aria-label="TWIN motion timeline"
      aria-valuemin={0}
      aria-valuemax={32}
      aria-valuenow={Number(time.toFixed(1))}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        setTime(Math.max(0, Math.min(32, ((event.clientX - bounds.left) / bounds.width) * 32)));
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") setTime((value) => Math.min(32, value + 1));
        if (event.key === "ArrowLeft") setTime((value) => Math.max(0, value - 1));
      }}
    >
      <svg viewBox="0 0 600 210" preserveAspectRatio="none" aria-hidden>
        {Array.from({ length: 65 }, (_, index) => (
          <line
            key={index}
            x1={8 + index * 9.1}
            x2={8 + index * 9.1}
            y1="184"
            y2={index % 8 === 0 ? "122" : "163"}
            data-past={index / 2 <= time}
          />
        ))}
        <path d={`M 8 105 C ${60 + time * 4} ${20 + time * 2}, ${220 + time * 3} ${185 - time * 3}, ${8 + time * 18.25} 64`} />
        <circle cx={8 + time * 18.25} cy="64" r="8" />
      </svg>
      <span>{time.toFixed(1)}s / 32s</span>
    </div>
  );
}

function BrainPreview() {
  const [point, setPoint] = useState({ x: 50, y: 50 });
  const points = Array.from({ length: 52 }, (_, index) => {
    const angle = index * 2.399;
    const radius = 8 + (index % 13) * 3.1;
    return { x: 50 + Math.cos(angle) * radius * 1.4, y: 50 + Math.sin(angle) * radius * 0.8 };
  });
  return (
    <div
      className="lab-brain-toy"
      tabIndex={0}
      aria-label="Djbrain spatial probe"
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        setPoint({
          x: ((event.clientX - bounds.left) / bounds.width) * 100,
          y: ((event.clientY - bounds.top) / bounds.height) * 100,
        });
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") setPoint((p) => ({ ...p, x: Math.min(100, p.x + 6) }));
        if (event.key === "ArrowLeft") setPoint((p) => ({ ...p, x: Math.max(0, p.x - 6) }));
        if (event.key === "ArrowDown") setPoint((p) => ({ ...p, y: Math.min(100, p.y + 6) }));
        if (event.key === "ArrowUp") setPoint((p) => ({ ...p, y: Math.max(0, p.y - 6) }));
      }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {points.map((node, index) => {
          const distance = Math.hypot(node.x - point.x, node.y - point.y);
          return (
            <g key={index}>
              {distance < 28 ? (
                <line x1={point.x} y1={point.y} x2={node.x} y2={node.y} opacity={Math.max(0.08, 1 - distance / 28)} />
              ) : null}
              <circle cx={node.x} cy={node.y} r={distance < 22 ? 1.6 : 0.7} />
            </g>
          );
        })}
        <circle className="brain-probe" cx={point.x} cy={point.y} r="3" />
      </svg>
      <span>spatial probe</span>
    </div>
  );
}

const TRI_ROLES = ["Proposer", "Critic", "Verifier"];
function TriPreview() {
  const isStatic = useStaticMode();
  const [active, setActive] = useState(2);
  const [frozen, setFrozen] = useState(false);
  useEffect(() => {
    if (isStatic || frozen) return;
    const id = window.setInterval(() => setActive((value) => (value + 1) % 3), 1500);
    return () => window.clearInterval(id);
  }, [frozen, isStatic]);
  return (
    <div className="lab-tri-toy">
      <svg viewBox="0 0 600 240" preserveAspectRatio="none" aria-hidden>
        <path d="M100 120 C190 25 255 25 300 120 S430 215 500 120" />
        <path className="tri-return" d="M500 120 C420 20 210 220 100 120" />
      </svg>
      {TRI_ROLES.map((role, index) => (
        <button
          key={role}
          type="button"
          data-active={index === active}
          onMouseEnter={() => {
            setActive(index);
            setFrozen(true);
          }}
          onMouseLeave={() => setFrozen(false)}
          onFocus={() => {
            setActive(index);
            setFrozen(true);
          }}
          onBlur={() => setFrozen(false)}
          onClick={() => {
            setActive(index);
            setFrozen(true);
          }}
        >
          <i />
          <strong>{role}</strong>
          <span>{index === 0 ? "generate" : index === 1 ? "challenge" : "accept / reject"}</span>
        </button>
      ))}
    </div>
  );
}

const RECEPTION: Array<[string, string]> = [
  ["QR", "Link expires before the session is established."],
  ["Session", "Reconnect must restore state without duplicating work."],
  ["Incoming", "Duplicate messages need an idempotent guard."],
  ["Decide", "The automation boundary must remain explicit."],
  ["Reply", "Delivery and failure need inspectable logs."],
];
function ReceptionPreview() {
  const isStatic = useStaticMode();
  const [active, setActive] = useState(2);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (isStatic || held) return;
    const id = window.setInterval(() => setActive((value) => (value + 1) % RECEPTION.length), 1350);
    return () => window.clearInterval(id);
  }, [held, isStatic]);
  return (
    <div className="lab-reception-toy">
      <div>
        {RECEPTION.map(([stage], index) => (
          <button
            key={stage}
            type="button"
            data-active={index === active}
            onMouseEnter={() => {
              setActive(index);
              setHeld(true);
            }}
            onMouseLeave={() => setHeld(false)}
            onFocus={() => {
              setActive(index);
              setHeld(true);
            }}
            onBlur={() => setHeld(false)}
            onClick={() => {
              setActive(index);
              setHeld(true);
            }}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{stage}</strong>
          </button>
        ))}
      </div>
      <p>
        <span className="label-mono">Failure mode / {RECEPTION[active]?.[0]}</span>
        {RECEPTION[active]?.[1]}
      </p>
    </div>
  );
}

type Item = { id: string; name: string; kicker: string; body: string; preview: ReactNode; cable: string };

const ITEMS: Item[] = [
  {
    id: "twin",
    name: "TWIN",
    kicker: "Motion / determinism",
    body: "A 32-second scroll-film built from CSS and SVG with a deterministic JavaScript motion timeline. The same position always produces the same frame.",
    preview: <TwinPreview />,
    cable: "M18 0 C 18 42, 74 26, 74 100",
  },
  {
    id: "djbrain",
    name: "Djbrain",
    kicker: "3D / interaction",
    body: "An interactive procedural brain in Three.js — raycasting for pointer picking, touch support, and a visualization that stays responsive on small screens.",
    preview: <BrainPreview />,
    cable: "M82 0 C 82 50, 30 34, 30 100",
  },
  {
    id: "tri",
    name: "TRI·TFM",
    kicker: "Prompt optimization research",
    body: "Experiments on proposer / critic / verifier loops: diversification, stabilization, convergence behaviour and quality control.",
    preview: <TriPreview />,
    cable: "M30 0 C 30 46, 66 30, 66 100",
  },
  {
    id: "receptionist",
    name: "WhatsApp Receptionist",
    kicker: "Messaging / automation",
    body: "A prototype architecture for QR-linked session/auth, inbound handling, an AI/autoresponder decision and outbound reply. No finished booking, CRM or quoting claims.",
    preview: <ReceptionPreview />,
    cable: "M62 0 C 62 44, 22 28, 22 100",
  },
];

export function Lab() {
  return (
    <section id="lab" className="on-ink signal-section crt-wall scroll-mt-16 py-20 sm:py-28">
      <SignalField variant="playground" intensity="low" words={["SCRUB", "PROBE", "ROUTE", "INSPECT"]} />
      <Shell className="signal-content">
        <div className="crt-intro">
          <span className="label-mono">04 / Lab · Small machines</span>
          <h2 className="display-xl mt-8 max-w-[16ch] text-[clamp(2.1rem,6.5vw,4.6rem)]">The signal ends up somewhere.</h2>
          <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-foreground/70 sm:text-lg">
            Focused technical exercises in deterministic motion, spatial interaction, prompt optimization and messaging
            automation — each one running on its own set.
          </p>
        </div>

        <div className="crt-room mt-16">
          {ITEMS.map((item) => (
            <figure key={item.id} className="crt" data-crt={item.id}>
              <svg className="crt-cable" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                <path d={item.cable} />
              </svg>
              <div className="crt-set">
                <div className="crt-screen">
                  {item.preview}
                  <i className="crt-noise" aria-hidden />
                  <i className="crt-glass" aria-hidden />
                </div>
                <div className="crt-chassis" aria-hidden>
                  <span className="crt-vent" />
                  <span className="crt-knob" />
                  <span className="crt-knob crt-knob-sm" />
                </div>
                <span className="crt-plate">{item.name}</span>
              </div>
              <figcaption className="crt-label">
                <span className="label-mono">{item.kicker}</span>
                <p>{item.body}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Shell>
    </section>
  );
}

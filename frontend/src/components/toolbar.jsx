"use client";
import { useState, useEffect } from "react";
import PresentationControls from "./PresentationControls";

export default function Toolbar({
  setTool,
  setColor,
  clearCanvas,
  save,
  load,
  onMapChange,
  addPhase,
  prevPhase,
  nextPhase,
  undo,
  redo,
  currentPhaseMap,

  // Phase UX
  phaseIndex,
  totalPhases,
  phaseName,
  renamePhase
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(phaseName);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 20,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: 8,
        padding: 10,
        background: "rgba(0,0,0,0.75)",
        borderRadius: 8,
        maxWidth: isMobile ? "95vw" : "auto"
      }}
    >
      {/* Phase Indicator */}
      <div style={{ color: "#fff", fontWeight: 600 }}>
        Phase {phaseIndex + 1} / {totalPhases} —
        {editing ? (
          <input
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              renamePhase(name);
              setEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                renamePhase(name);
                setEditing(false);
              }
            }}
            style={{ marginLeft: 6 }}
          />
        ) : (
          <span style={{ marginLeft: 6 }}>{phaseName}</span>
        )}
        <button
          onClick={() => {
            setName(phaseName);
            setEditing(true);
          }}
          style={{ marginLeft: 6 }}
        >
          ✏️
        </button>
      </div>

      {/* Tool Row */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button onClick={() => setTool("pen")}>Pen</button>
        <button onClick={() => setTool("eraser")}>Eraser</button>
        <input type="color" onChange={(e) => setColor(e.target.value)} />
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
      </div>

      {/* Control Row */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <select
          value={currentPhaseMap}
          onChange={(e) => onMapChange(e.target.value)}
        >
          <option value="/maps/bermuda.jpg">Bermuda</option>
          <option value="/maps/purgatory.jpg">Purgatory</option>
        </select>

        <button onClick={save}>Save</button>

        <input
          type="file"
          accept=".json"
          id="load-strategy"
          onChange={load}
          style={{ display: "none" }}
        />
        <button
          onClick={() =>
            document.getElementById("load-strategy").click()
          }
        >
          Load
        </button>

        <button onClick={addPhase}>+ Phase</button>
        <button onClick={prevPhase} disabled={phaseIndex === 0}>
          ◀
        </button>
        <button
          onClick={nextPhase}
          disabled={phaseIndex === totalPhases - 1}
        >
          ▶
        </button>

        <PresentationControls />
      </div>
    </div>
  );
}

















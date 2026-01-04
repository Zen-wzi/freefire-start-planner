"use client";
import { useState } from "react";
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
  phaseIndex,
  totalPhases,
  phaseName,
  renamePhase
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(phaseName);

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 20,
        display: "flex",
        gap: 8,
        padding: 10,
        background: "rgba(0,0,0,0.75)",
        borderRadius: 8,
        flexWrap: "wrap",
        alignItems: "center"
      }}
    >
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

      <button onClick={() => setTool("pen")}>Pen</button>
      <button onClick={() => setTool("eraser")}>Eraser</button>
      <input type="color" onChange={(e) => setColor(e.target.value)} />
      <button onClick={clearCanvas}>Clear</button>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>

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
      <button onClick={() => document.getElementById("load-strategy").click()}>
        Load
      </button>

      <button onClick={addPhase}>+ Phase</button>
      <button onClick={prevPhase} disabled={phaseIndex === 0}>◀</button>
      <button onClick={nextPhase} disabled={phaseIndex === totalPhases - 1}>▶</button>

      <PresentationControls />
    </div>
  );
}
















"use client";
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
  currentPhaseMap   // ✅ NEW (controlled select)
}) {
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
        flexWrap: "wrap"
      }}
    >
      {/* Drawing tools */}
      <button onClick={() => setTool("pen")}>Pen</button>
      <button onClick={() => setTool("eraser")}>Eraser</button>

      <input type="color" onChange={(e) => setColor(e.target.value)} />

      <button onClick={clearCanvas}>Clear</button>

      {/* Undo / Redo */}
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>

      {/* Map selector (FIXED & CONTROLLED) */}
      <select
        value={currentPhaseMap}
        onChange={(e) => onMapChange(e.target.value)}
      >
        <option value="/maps/bermuda.jpg">Bermuda</option>
        <option value="/maps/purgatory.jpg">Purgatory</option>
      </select>

      {/* Save / Load */}
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

      {/* Phase controls */}
      <button onClick={addPhase}>+ Phase</button>
      <button onClick={prevPhase}>◀</button>
      <button onClick={nextPhase}>▶</button>

      {/* Presentation */}
      <PresentationControls />
    </div>
  );
}













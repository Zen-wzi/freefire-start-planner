"use client";
import PresentationControls from "./PresentationControls";

export default function Toolbar({ setTool, setColor, clearCanvas, save, load, setMap }) {
  return (
    <div
      style={{
        padding: "10px",
        background: "#111",
        display: "flex",
        gap: "10px",
        alignItems: "center",
        flexWrap: "wrap",
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 20
      }}
    >
      <button onClick={() => setTool("pen")}>Pen</button>
      <button onClick={() => setTool("eraser")}>Eraser</button>
      <input type="color" onChange={(e) => setColor(e.target.value)} />
      <button onClick={clearCanvas}>Clear</button>
      
      {/* Map selector */}
      <select onChange={(e) => setMap(e.target.value)}>
        <option value="/map.png">Default Map</option>
        <option value="/maps/bermuda.jpg">Bermuda</option>
        <option value="/maps/purgatory.jpg">Purgatory</option>
      </select>

      <button onClick={save}>Save</button>
      <input type="file" accept=".json" onChange={load} />
      <PresentationControls />
    </div>
  );
}










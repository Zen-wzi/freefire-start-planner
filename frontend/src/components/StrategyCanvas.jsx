"use client";
import { useRef, useState } from "react";
import PlayerLayer from "./PlayerLayer";
import RotationLayer from "./RotationLayer";
import Toolbar from "./Toolbar";

const initialPlayers = [
  { id: 1, name: "IGL", x: 120, y: 120, color: "#ff4757", locked: false },
  { id: 2, name: "P2", x: 260, y: 140, color: "#1e90ff", locked: false },
  { id: 3, name: "P3", x: 180, y: 260, color: "#2ed573", locked: false },
  { id: 4, name: "P4", x: 320, y: 260, color: "#ffa502", locked: false }
];

export default function StrategyCanvas() {
  const [players, setPlayers] = useState(initialPlayers);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [rotations, setRotations] = useState([]);
  const [tool, setTool] = useState("pen");
  const [penColor, setPenColor] = useState("yellow");
  const [lines, setLines] = useState([]);
  const [map, setMap] = useState("/map.png");

  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  // ---------------- PLAYER CLICK ----------------
  const handlePlayerClick = (player) => {
    if (!selectedPlayer) {
      setSelectedPlayer(player);
    } else if (selectedPlayer.id !== player.id) {
      setRotations((prev) => [
        ...prev,
        { fromId: selectedPlayer.id, toId: player.id }
      ]);
      setSelectedPlayer(null);
    }
  };

  const handleClear = () => {
  setLines([]);
  const ctx = canvasRef.current?.getContext("2d");
  if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // ---------------- CANVAS DRAWING ----------------
  const handleMouseDown = (e) => {
    if (!canvasRef.current) return;
    isDrawingRef.current = true;
    const rect = canvasRef.current.getBoundingClientRect();
    lastPosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseMove = (e) => {
    if (!isDrawingRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvasRef.current.getContext("2d");
    if (tool === "pen") {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      setLines((prev) => [
        ...prev,
        { x1: lastPosRef.current.x, y1: lastPosRef.current.y, x2: x, y2: y, color: penColor }
      ]);
    } else if (tool === "eraser") {
      ctx.clearRect(x - 10, y - 10, 20, 20);
    }

    lastPosRef.current = { x, y };
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  // ---------------- SAVE & LOAD ----------------
  const handleSave = () => {
    const data = { players, rotations, lines };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "strategy.json";
    a.click();
  };

  const handleLoad = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.players) setPlayers(data.players);
        if (data.rotations) setRotations(data.rotations);
        if (data.lines) setLines(data.lines);
        setSelectedPlayer(null);
      } catch (err) {
        console.error("Failed to load strategy:", err);
        alert("Invalid file!");
      }
    };
    reader.readAsText(file);
  };

  // ---------------- RENDER ----------------
  return (
    <div
  style={{
    position: "relative",
    width: 1000,
    height: 600,
    border: "2px solid #333",
    backgroundImage: `url('${map}')`,   // <-- dynamic map
    backgroundSize: "cover"
  }}
>
      
      {/* Toolbar */}
     <Toolbar
      setTool={setTool}
      setColor={setPenColor}
      clearCanvas={handleClear}  // <-- use this
      save={handleSave}
      load={handleLoad}
      setMap={setMap}            // <-- add map functionality
/>

      {/* Canvas for pen/eraser */}
      <canvas
        ref={canvasRef}
        width={1000}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
      />

      {/* Rotations */}
      <RotationLayer rotations={rotations} players={players} />

      {/* Players */}
      <PlayerLayer
        players={players}
        setPlayers={setPlayers}
        onPlayerClick={handlePlayerClick}
        selectedPlayer={selectedPlayer}
      />
    </div>
  );
}



















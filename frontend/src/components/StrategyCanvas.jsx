"use client";
import { useRef, useState, useEffect } from "react";
import PlayerLayer from "./PlayerLayer";
import RotationLayer from "./RotationLayer";
import Toolbar from "./Toolbar";

export default function StrategyCanvas() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  // ---------------- STATE ----------------
  const [containerSize, setContainerSize] = useState({ width: 1000, height: 600 });
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [players, setPlayers] = useState([
    { id: 1, name: "IGL", x: 120, y: 120, color: "#ff4757", locked: false },
    { id: 2, name: "P2", x: 260, y: 140, color: "#1e90ff", locked: false },
    { id: 3, name: "P3", x: 180, y: 260, color: "#2ed573", locked: false },
    { id: 4, name: "P4", x: 320, y: 260, color: "#ffa502", locked: false }
  ]);
  const [rotations, setRotations] = useState([]);
  const [tool, setTool] = useState("pen");
  const [penColor, setPenColor] = useState("yellow");
  const [lines, setLines] = useState([]);
  const [map, setMap] = useState("/maps/bermuda.jpg");

  // ---------------- HANDLE RESIZE ----------------
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

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

  // ---------------- CANVAS DRAWING ----------------
  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (1000 / rect.width),
      y: (e.clientY - rect.top) * (600 / rect.height)
    };
  };

  const handleMouseDown = (e) => {
    if (!canvasRef.current) return;
    isDrawingRef.current = true;
    lastPosRef.current = getMousePos(e);
  };

  const handleMouseMove = (e) => {
    if (!isDrawingRef.current || !canvasRef.current) return;
    const pos = getMousePos(e);
    const ctx = canvasRef.current.getContext("2d");

    if (tool === "pen") {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      setLines((prev) => [
        ...prev,
        { x1: lastPosRef.current.x, y1: lastPosRef.current.y, x2: pos.x, y2: pos.y, color: penColor }
      ]);
    } else if (tool === "eraser") {
      ctx.clearRect(pos.x - 10, pos.y - 10, 20, 20);
    }

    lastPosRef.current = pos;
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
    reader.onload = () => {
      const data = JSON.parse(reader.result);
      if (data.players) setPlayers(data.players);
      if (data.rotations) setRotations(data.rotations);
      if (data.lines) setLines(data.lines);
      setSelectedPlayer(null);
    };
    reader.readAsText(file);
  };

  
  // ---------------- CLEAR ----------------
const clearCanvas = () => {
  setLines([]); // clear lines state
  if (canvasRef.current) {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // clear actual canvas
  }
};


  // ---------------- RENDER ----------------
  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundImage: `url('${map}')`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center"
      }}
    >
      {/* ---------------- TOOLBAR ---------------- */}
      <Toolbar
        setTool={setTool}
        setColor={setPenColor}
        clearCanvas={clearCanvas}
        save={handleSave}
        load={handleLoad}
        setMap={setMap}
      />

      {/* ---------------- DRAWING CANVAS ---------------- */}
      <canvas
        ref={canvasRef}
        width={1000}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1
        }}
      />

      {/* ---------------- ROTATION ARROWS ---------------- */}
      <RotationLayer rotations={rotations} players={players} />

      {/* ---------------- PLAYER LAYER ---------------- */}
      <PlayerLayer
        players={players}
        setPlayers={setPlayers}
        onPlayerClick={handlePlayerClick}
        selectedPlayer={selectedPlayer}
        containerSize={containerSize} // pass size for scaling
      />
    </div>
  );
}




























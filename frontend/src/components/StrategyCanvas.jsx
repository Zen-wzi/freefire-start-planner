"use client";
import { useRef, useState, useEffect } from "react";
import PlayerLayer from "./PlayerLayer";
import RotationLayer from "./RotationLayer";
import Toolbar from "./Toolbar";

const deepCopy = (v) => JSON.parse(JSON.stringify(v));

export default function StrategyCanvas() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const currentStrokeRef = useRef([]);

  // ---------------- STATE ----------------
  const [containerSize, setContainerSize] = useState({ width: 1000, height: 600 });
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [tool, setTool] = useState("pen");
  const [penColor, setPenColor] = useState("yellow");

  const [phases, setPhases] = useState([
    {
      id: 1,
      name: "Phase 1 - Drop",
      map: "/maps/bermuda.jpg",
      players: [
        { id: 1, name: "IGL", x: 120, y: 120, color: "#ff4757", locked: false },
        { id: 2, name: "P2", x: 260, y: 140, color: "#1e90ff", locked: false },
        { id: 3, name: "P3", x: 180, y: 260, color: "#2ed573", locked: false },
        { id: 4, name: "P4", x: 320, y: 260, color: "#ffa502", locked: false }
      ],
      lines: [],
      rotations: [],
      undoStack: [],
      redoStack: []
    }
  ]);

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const currentPhase = phases[currentPhaseIndex];

  // ---------------- RESIZE ----------------
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // ---------------- CANVAS HELPERS ----------------
  const redrawCanvas = (phase) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    phase.lines.forEach((l) => {
      ctx.strokeStyle = l.color;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(l.x1, l.y1);
      ctx.lineTo(l.x2, l.y2);
      ctx.stroke();
    });
  };

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvasRef.current.width,
      y: ((e.clientY - rect.top) / rect.height) * canvasRef.current.height
    };
  };

  // ---------------- HISTORY ----------------
  const pushHistory = () => {
    setPhases((prev) => {
      const updated = deepCopy(prev);
      const p = updated[currentPhaseIndex];
      p.undoStack.push(
        deepCopy({
          map: p.map,
          players: p.players,
          lines: p.lines,
          rotations: p.rotations
        })
      );
      p.redoStack = [];
      return updated;
    });
  };

  const undo = () => {
    setPhases((prev) => {
      const updated = deepCopy(prev);
      const p = updated[currentPhaseIndex];
      if (!p.undoStack.length) return prev;

      p.redoStack.unshift(
        deepCopy({
          map: p.map,
          players: p.players,
          lines: p.lines,
          rotations: p.rotations
        })
      );

      Object.assign(p, p.undoStack.pop());
      requestAnimationFrame(() => redrawCanvas(p));
      return updated;
    });
  };

  const redo = () => {
    setPhases((prev) => {
      const updated = deepCopy(prev);
      const p = updated[currentPhaseIndex];
      if (!p.redoStack.length) return prev;

      p.undoStack.push(
        deepCopy({
          map: p.map,
          players: p.players,
          lines: p.lines,
          rotations: p.rotations
        })
      );

      Object.assign(p, p.redoStack.shift());
      requestAnimationFrame(() => redrawCanvas(p));
      return updated;
    });
  };

  // ---------------- PLAYER CLICK ----------------
  const handlePlayerClick = (player) => {
    if (!selectedPlayer) {
      setSelectedPlayer(player);
    } else if (selectedPlayer.id !== player.id) {
      pushHistory();
      setPhases((prev) => {
        const updated = deepCopy(prev);
        updated[currentPhaseIndex].rotations.push({
          fromId: selectedPlayer.id,
          toId: player.id
        });
        return updated;
      });
      setSelectedPlayer(null);
    }
  };

  // ---------------- DRAWING ----------------
  const handleMouseDown = (e) => {
    if (!canvasRef.current) return;
    pushHistory();
    isDrawingRef.current = true;
    currentStrokeRef.current = [];
    lastPosRef.current = getMousePos(e);
  };

  const handleMouseMove = (e) => {
    if (!isDrawingRef.current || !canvasRef.current) return;

    const pos = getMousePos(e);
    const ctx = canvasRef.current.getContext("2d");

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 3;

    if (tool === "pen") {
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      currentStrokeRef.current.push({
        x1: lastPosRef.current.x,
        y1: lastPosRef.current.y,
        x2: pos.x,
        y2: pos.y,
        color: penColor
      });
    }

    if (tool === "eraser") {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    lastPosRef.current = pos;
  };

  const handleMouseUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    if (tool === "pen" && currentStrokeRef.current.length) {
      setPhases((prev) => {
        const updated = deepCopy(prev);
        updated[currentPhaseIndex].lines.push(
          ...currentStrokeRef.current
        );
        return updated;
      });
    }

    currentStrokeRef.current = [];
  };

  // ---------------- CLEAR ----------------
  const clearCanvas = () => {
    pushHistory();
    setPhases((prev) => {
      const updated = deepCopy(prev);
      updated[currentPhaseIndex].lines = [];
      requestAnimationFrame(() => redrawCanvas(updated[currentPhaseIndex]));
      return updated;
    });
  };

  // ---------------- SAVE / LOAD ----------------
  const handleSave = () => {
    const blob = new Blob([JSON.stringify({ phases }, null, 2)], {
      type: "application/json"
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "strategy.json";
    a.click();
  };

  const handleLoad = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = JSON.parse(ev.target.result);
      if (Array.isArray(data.phases)) {
        setPhases(data.phases);
        setCurrentPhaseIndex(0);
        requestAnimationFrame(() => redrawCanvas(data.phases[0]));
      }
    };
    reader.readAsText(file);
  };

  // ---------------- RENDER ----------------
  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundImage: `url('${currentPhase.map}')`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center"
      }}
    >
      <Toolbar
        setTool={setTool}
        setColor={setPenColor}
        clearCanvas={clearCanvas}
        save={handleSave}
        load={handleLoad}
        undo={undo}
        redo={redo}
        currentPhaseMap={currentPhase.map}
        onMapChange={(map) => {
          pushHistory();
          setPhases((prev) => {
            const updated = deepCopy(prev);
            updated[currentPhaseIndex].map = map;
            return updated;
          });
        }}
        addPhase={() => {
          setPhases((p) => [
            ...p,
            {
              id: p.length + 1,
              name: `Phase ${p.length + 1}`,
              map: currentPhase.map,
              players: deepCopy(currentPhase.players),
              lines: [],
              rotations: [],
              undoStack: [],
              redoStack: []
            }
          ]);
          setCurrentPhaseIndex(phases.length);
        }}
        prevPhase={() => {
          setCurrentPhaseIndex((i) => {
            const next = Math.max(0, i - 1);
            requestAnimationFrame(() => redrawCanvas(phases[next]));
            return next;
          });
        }}
        nextPhase={() => {
          setCurrentPhaseIndex((i) => {
            const next = Math.min(phases.length - 1, i + 1);
            requestAnimationFrame(() => redrawCanvas(phases[next]));
            return next;
          });
        }}
      />

      <canvas
        ref={canvasRef}
        width={1000}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 1
        }}
      />

      <RotationLayer
        rotations={currentPhase.rotations}
        players={currentPhase.players}
        containerSize={containerSize}
      />

      <PlayerLayer
        players={currentPhase.players}
        setPlayers={(updater) => {
          pushHistory();
          setPhases((prev) => {
            const updated = deepCopy(prev);
            updated[currentPhaseIndex].players =
              typeof updater === "function"
                ? updater(updated[currentPhaseIndex].players)
                : updater;
            return updated;
          });
        }}
        onPlayerClick={handlePlayerClick}
        selectedPlayer={selectedPlayer}
        containerSize={containerSize}
      />
    </div>
  );
}














































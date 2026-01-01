"use client";
import { useRef, useEffect } from "react";

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 600;
const SIZE = 36;

export default function PlayerLayer({ players, setPlayers, onPlayerClick, selectedPlayer }) {
  const draggingRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  // ---------------- DRAG ----------------
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggingRef.current) return;
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id === draggingRef.current) {
            const newX = e.clientX - offsetRef.current.x;
            const newY = e.clientY - offsetRef.current.y;
            return { ...p, x: Math.max(0, Math.min(MAP_WIDTH - SIZE, newX)), y: Math.max(0, Math.min(MAP_HEIGHT - SIZE, newY)) };
          }
          return p;
        })
      );
    };
    const handleMouseUp = () => {
      draggingRef.current = null;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setPlayers]);

  const handleMouseDown = (e, player) => {
    if (player.locked) return;
    draggingRef.current = player.id;
    const rect = e.currentTarget.getBoundingClientRect();
    offsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.stopPropagation();
  };

  const renamePlayer = (id) => {
    const name = prompt("Enter player name / role:");
    if (!name) return;
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const toggleLock = (id) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, locked: !p.locked } : p)));
  };

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: MAP_WIDTH, height: MAP_HEIGHT, pointerEvents: "none" }}>
      {players.map((p) => (
        <div
          key={p.id}
          onClick={() => onPlayerClick(p)}
          onDoubleClick={() => renamePlayer(p.id)}
          onContextMenu={(e) => { e.preventDefault(); toggleLock(p.id); }}
          onMouseDown={(e) => handleMouseDown(e, p)}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: SIZE,
            height: SIZE,
            borderRadius: "50%",
            backgroundColor: p.color,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: "bold",
            cursor: p.locked ? "not-allowed" : "grab",
            border: selectedPlayer?.id === p.id ? "3px solid yellow" : "2px solid #111",
            pointerEvents: "auto",
            userSelect: "none",
            zIndex: 10
          }}
        >
          {p.name}
        </div>
      ))}
    </div>
  );
}



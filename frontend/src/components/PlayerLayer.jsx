"use client";
import { useRef, useEffect } from "react";

const SIZE = 36;

export default function PlayerLayer({
  players,
  setPlayers,
  selectedPlayer,
  onPlayerClick = () => {},   // ✅ SAFETY DEFAULT (FIX)
  containerSize
}) {
  const safePlayers = Array.isArray(players) ? players : [];
  const draggingRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggingRef.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id === draggingRef.current) {
            const newX =
              (e.clientX - rect.left) * (1000 / containerSize.width) -
              offsetRef.current.x;

            const newY =
              (e.clientY - rect.top) * (600 / containerSize.height) -
              offsetRef.current.y;

            return {
              ...p,
              x: Math.max(0, Math.min(1000 - SIZE, newX)),
              y: Math.max(0, Math.min(600 - SIZE, newY))
            };
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
  }, [setPlayers, containerSize]);

  const handleMouseDown = (e, player) => {
    if (player.locked || !containerRef.current) return;

    draggingRef.current = player.id;

    const rect = containerRef.current.getBoundingClientRect();
    offsetRef.current = {
      x:
        (e.clientX - rect.left) * (1000 / containerSize.width) -
        player.x,
      y:
        (e.clientY - rect.top) * (600 / containerSize.height) -
        player.y
    };

    e.stopPropagation();
  };

  const renamePlayer = (id) => {
    const name = prompt("Enter player name / role:");
    if (!name) return;

    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name } : p))
    );
  };

  const toggleLock = (id) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, locked: !p.locked } : p
      )
    );
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none"
      }}
    >
      {safePlayers.map((p) => (
        <div
          key={p.id}
          onClick={() => onPlayerClick(p)}
          onDoubleClick={() => renamePlayer(p.id)}
          onContextMenu={(e) => {
            e.preventDefault();
            toggleLock(p.id);
          }}
          onMouseDown={(e) => handleMouseDown(e, p)}
          style={{
            position: "absolute",
            left: (p.x / 1000) * containerSize.width,
            top: (p.y / 600) * containerSize.height,
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
            border:
              selectedPlayer?.id === p.id
                ? "3px solid yellow"
                : "2px solid #111",
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















"use client";
import { useRef, useEffect } from "react";

const SIZE = 36;

export default function PlayerLayer({
  players,
  setPlayers,
  selectedPlayer,
  onPlayerClick = () => {},
  containerSize
}) {
  const draggingRef = useRef(null);
  const movedRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggingRef.current) return;
      movedRef.current = true;

      setPlayers((prev) =>
        prev.map((p) =>
          p.id === draggingRef.current
            ? {
                ...p,
                x: Math.max(0, Math.min(1000 - SIZE, p.x + e.movementX)),
                y: Math.max(0, Math.min(600 - SIZE, p.y + e.movementY))
              }
            : p
        )
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

  return (
    <>
      {players.map((p) => (
        <div
          key={p.id}
          onMouseDown={(e) => {
            if (p.locked || e.button !== 0) return;
            draggingRef.current = p.id;
            movedRef.current = false;
            e.stopPropagation();
          }}
          onClick={() => !movedRef.current && onPlayerClick(p)}
          style={{
            position: "absolute",
            left: (p.x / 1000) * containerSize.width,
            top: (p.y / 600) * containerSize.height,
            width: SIZE,
            height: SIZE,
            borderRadius: "50%",
            background: p.color,
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
            userSelect: "none",
            zIndex: 10
          }}
        >
          {p.name}
          <span
            onClick={(e) => {
              e.stopPropagation();
              setPlayers((prev) =>
                prev.map((pl) =>
                  pl.id === p.id ? { ...pl, locked: !pl.locked } : pl
                )
              );
            }}
            style={{
              position: "absolute",
              bottom: -6,
              right: -6,
              background: "#000",
              color: "#fff",
              fontSize: 10,
              padding: 2,
              borderRadius: "50%",
              cursor: "pointer"
            }}
          >
            🔒
          </span>
        </div>
      ))}
    </>
  );
}



















"use client";
import { useRef, useEffect } from "react";

const SIZE = 36;
const HIT_SIZE = 56;
const MAP_WIDTH = 1000;
const MAP_HEIGHT = 600;

export default function PlayerLayer({
  players,
  setPlayers,
  selectedPlayer,
  onPlayerClick = () => {},
  containerSize
}) {
  const safePlayers = Array.isArray(players) ? players : [];
  const containerRef = useRef(null);

  const draggingRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  // -------- mapRect (matches background-size: contain) --------
  const getMapRect = () => {
    const { width, height } = containerSize;
    const mapAspect = MAP_WIDTH / MAP_HEIGHT;
    const containerAspect = width / height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (containerAspect > mapAspect) {
      drawHeight = height;
      drawWidth = height * mapAspect;
      offsetX = (width - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = width;
      drawHeight = width / mapAspect;
      offsetX = 0;
      offsetY = (height - drawHeight) / 2;
    }

    return { drawWidth, drawHeight, offsetX, offsetY };
  };

  // -------- drag loop (throttled) --------
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggingRef.current || !containerRef.current) return;

      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;

        const rect = containerRef.current.getBoundingClientRect();
        const { drawWidth, drawHeight, offsetX, offsetY } = getMapRect();

        const mouseX = e.clientX - rect.left - offsetX;
        const mouseY = e.clientY - rect.top - offsetY;

        setPlayers((prev) =>
          prev.map((p) => {
            if (p.id !== draggingRef.current) return p;

            const newX =
              (mouseX / drawWidth) * MAP_WIDTH - offsetRef.current.x;
            const newY =
              (mouseY / drawHeight) * MAP_HEIGHT - offsetRef.current.y;

            return {
              ...p,
              x: Math.max(0, Math.min(MAP_WIDTH - SIZE, newX)),
              y: Math.max(0, Math.min(MAP_HEIGHT - SIZE, newY))
            };
          })
        );
      });
    };

    const handleMouseUp = () => {
      draggingRef.current = null;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [containerSize, setPlayers]);

  const handleMouseDown = (e, player) => {
    if (player.locked || !containerRef.current) return;

    draggingRef.current = player.id;

    const rect = containerRef.current.getBoundingClientRect();
    const { drawWidth, drawHeight, offsetX, offsetY } = getMapRect();

    const mouseX = e.clientX - rect.left - offsetX;
    const mouseY = e.clientY - rect.top - offsetY;

    offsetRef.current = {
      x: (mouseX / drawWidth) * MAP_WIDTH - player.x,
      y: (mouseY / drawHeight) * MAP_HEIGHT - player.y
    };

    e.stopPropagation();
  };

  const toggleLock = (id) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, locked: !p.locked } : p
      )
    );
  };

  // -------- render --------
  return (
    <div
      ref={containerRef}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {safePlayers.map((p) => {
        const { drawWidth, drawHeight, offsetX, offsetY } = getMapRect();

        const left =
          offsetX + (p.x / MAP_WIDTH) * drawWidth;
        const top =
          offsetY + (p.y / MAP_HEIGHT) * drawHeight;

        return (
          <div
            key={p.id}
            onMouseDown={(e) => handleMouseDown(e, p)}
            onClick={() => onPlayerClick(p)}
            style={{
              position: "absolute",
              left: left - (HIT_SIZE - SIZE) / 2,
              top: top - (HIT_SIZE - SIZE) / 2,
              width: HIT_SIZE,
              height: HIT_SIZE,
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10
            }}
          >
            <div
              style={{
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
                userSelect: "none",
                position: "relative"
              }}
            >
              {p.name}

              {/* 🔒 Per-player lock */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLock(p.id);
                }}
                style={{
                  position: "absolute",
                  bottom: -6,
                  right: -6,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#111",
                  color: "#fff",
                  fontSize: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
              >
                {p.locked ? "🔒" : "🔓"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}






















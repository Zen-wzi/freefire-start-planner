"use client";

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 600;
const MAP_ASPECT = MAP_WIDTH / MAP_HEIGHT;

export default function RotationLayer({
  rotations = [],
  players = [],
  containerSize
}) {
  if (!containerSize || !players) return null;
  const safePlayers = Array.isArray(players) ? players : [];

  // ---------- SAME mapRect logic as PlayerLayer ----------
  const getMapRect = () => {
    const { width, height } = containerSize;
    const containerAspect = width / height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (containerAspect > MAP_ASPECT) {
      drawHeight = height;
      drawWidth = height * MAP_ASPECT;
      offsetX = (width - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = width;
      drawHeight = width / MAP_ASPECT;
      offsetX = 0;
      offsetY = (height - drawHeight) / 2;
    }

    return { drawWidth, drawHeight, offsetX, offsetY };
  };

  const { drawWidth, drawHeight, offsetX, offsetY } = getMapRect();

  const getPos = (p) => ({
    x: offsetX + (p.x / MAP_WIDTH) * drawWidth,
    y: offsetY + (p.y / MAP_HEIGHT) * drawHeight
  });

  return (
    <svg
      width={containerSize.width}
      height={containerSize.height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 5
      }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="yellow" />
        </marker>
      </defs>

      {rotations.map((r, i) => {
        const from = safePlayers.find((p) => p.id === r.fromId);
        const to = safePlayers.find((p) => p.id === r.toId);
        if (!from || !to) return null;

        const start = getPos(from);
        const end = getPos(to);
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2 - 30;

        return (
          <path
            key={i}
            d={`M${start.x},${start.y} Q${midX},${midY} ${end.x},${end.y}`}
            stroke="yellow"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
          />
        );
      })}
    </svg>
  );
}
















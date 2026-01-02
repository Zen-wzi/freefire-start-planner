// File: src/components/RotationLayer.jsx
"use client";

export default function RotationLayer({ rotations, players }) {
  return (
    <svg
      width="100vw"
      height="100vh"
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
    >
      <defs>
        <marker
          id="arrow"
          markerWidth="10"
          markerHeight="10"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="yellow" />
        </marker>
      </defs>

      {rotations.map((r, i) => {
        const from = players.find((p) => p.id === r.fromId);
        const to = players.find((p) => p.id === r.toId);
        if (!from || !to) return null;

        return (
          <line
            key={i}
            x1={from.x + 18}
            y1={from.y + 18}
            x2={to.x + 18}
            y2={to.y + 18}
            stroke="yellow"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
        );
      })}
    </svg>
  );
}








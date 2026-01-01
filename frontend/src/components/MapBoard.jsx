"use client";
import StrategyCanvas from "./StrategyCanvas";
import PlayerLayer from "./PlayerLayer";

export default function MapBoard(props) {
  return (
    <div
      style={{
        position: "relative",
        width: 1000,
        height: 600
      }}
    >
      <StrategyCanvas {...props} />
      <PlayerLayer />
    </div>
  );
}

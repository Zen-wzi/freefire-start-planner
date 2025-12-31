"use client";

import { useState } from "react";
import StrategyCanvas from "../components/StrategyCanvas";
import Toolbar from "../components/Toolbar";

export default function Home() {
  const [canvas, setCanvas] = useState(null);

  return (
    <div>
      <Toolbar />
      <StrategyCanvas />
    </div>
  );
}






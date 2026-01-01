"use client";
import { useState } from "react";
import StrategyCanvas from "../components/StrategyCanvas";
import Toolbar from "../components/Toolbar";

export default function Home() {
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#ff0000");
  const [clearSignal, setClearSignal] = useState(false);
  const [map, setMap] = useState("/maps/bermuda.jpg");

  const [saveRequest, setSaveRequest] = useState(false);
  const [loadData, setLoadData] = useState(null);

  const handleLoad = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setLoadData(JSON.parse(reader.result));
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <Toolbar
        setTool={setTool}
        setColor={setColor}
        clearCanvas={() => setClearSignal(!clearSignal)}
        setMap={setMap}
        save={() => setSaveRequest(!saveRequest)}
        load={handleLoad}
      />

      <StrategyCanvas
        tool={tool}
        color={color}
        clearSignal={clearSignal}
        map={map}
        saveRequest={saveRequest}
        loadData={loadData}
      />
    </div>
  );
}











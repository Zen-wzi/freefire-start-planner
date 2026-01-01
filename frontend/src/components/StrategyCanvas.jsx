"use client";
import { useRef, useState, useEffect } from "react";

export default function StrategyCanvas({
  tool,
  color,
  clearSignal,
  map,
  saveRequest,
  loadData
}) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const currentStroke = useRef([]);

  // Load map
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = map;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      imgRef.current = img;
    };
  }, [map]);

  // Clear drawings
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (imgRef.current) ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
    setStrokes([]);
  }, [clearSignal]);

  // Save request
  useEffect(() => {
    if (!saveRequest) return;
    const data = {
      map,
      strokes
    };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "strategy.json";
    a.click();
  }, [saveRequest]);

  // Load strategy
  useEffect(() => {
    if (!loadData) return;
    redraw(loadData.strokes);
    setStrokes(loadData.strokes);
  }, [loadData]);

  const redraw = (allStrokes) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (imgRef.current) ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);

    allStrokes.forEach((stroke) => {
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;

      stroke.points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    });
  };

  const startDrawing = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    currentStroke.current = {
      color: tool === "eraser" ? "#0b0b0b" : color,
      width: tool === "eraser" ? 20 : 2,
      points: []
    };

    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");

    const point = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    };

    currentStroke.current.points.push(point);

    ctx.strokeStyle = currentStroke.current.color;
    ctx.lineWidth = currentStroke.current.width;
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setStrokes((prev) => [...prev, currentStroke.current]);
  };

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={600}
      style={{ border: "2px solid #444" }}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  );
}











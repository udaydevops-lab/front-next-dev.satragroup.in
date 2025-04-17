"use client";
import React, { useRef, useEffect } from "react";

const Canvas = (props: any) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "40px calibri";
    context.fillText(props.text, 30, 40);
  }, [props.text]);

  return (
    <div className="captchLines">
      <canvas ref={canvasRef} width="180px" height="60px" />
    </div>
  );
};

export default Canvas;

import React, { useRef, useEffect } from "react";
import bottomCardImage from "./bottom_card.jpg";

const ScratchCard = ({ width, height, onComplete }) => {
  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    ctx.current = canvas.getContext("2d");
    ctx.current.fillStyle = "darkgray";
    ctx.current.fillRect(0, 0, width, height);
  }, [width, height]);

  const handleMouseDown = () => {
    isDrawing.current = true;
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.current.globalCompositeOperation = "destination-out";
    ctx.current.beginPath();
    ctx.current.arc(x, y, 20, 0, Math.PI * 2);
    ctx.current.fill();

    if (isCanvasTransparent()) {
      onComplete();
    }
  };

  const isCanvasTransparent = () => {
    const imageData = ctx.current.getImageData(0, 0, width, height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] !== 0) {
        return false;
      }
    }
    return true;
  };

  return (
    <div>
      <div style={{ position: "relative", width, height }}>
        <img
          src={bottomCardImage}
          alt="Bottom Card"
          style={{ position: "absolute", width, height }}
        />
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ position: "absolute" }}
        />
      </div>
    </div>
  );
};

export default ScratchCard;

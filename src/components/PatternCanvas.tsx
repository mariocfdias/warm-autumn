import { useEffect, useRef } from "react";
import { drawPattern } from "../utils/drawPattern";

interface PatternCanvasProps {
  type: string;
  colors: string[];
  width: number;
  height: number;
  scale?: number;
  style?: React.CSSProperties;
  className?: string;
}

export function PatternCanvas({
  type,
  colors,
  width,
  height,
  scale = 1,
  style = {},
  className = "",
}: PatternCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawPattern(canvasRef.current, type, colors, scale);
    }
  }, [type, colors, scale]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: "block", width, height, ...style }}
      className={className}
    />
  );
}

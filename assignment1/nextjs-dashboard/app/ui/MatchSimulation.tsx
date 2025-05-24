// MatchSimulation.tsx
import React, { useRef, useEffect } from 'react';

interface MatchStep {
  step: number;
  ball_x: number;
  ball_y: number;
  paddle1_x: number;
  paddle2_x: number;
  bot1_action: string;
  bot2_action: string;
  score_bot1: number;
  score_bot2: number;
}

interface MatchSimulationProps {
  matchLog: MatchStep[];
}

const MatchSimulation: React.FC<MatchSimulationProps> = ({ matchLog }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!matchLog || matchLog.length === 0) return;



    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const GRID_SIZE = 30;
    const PADDLE_WIDTH = 2;
    const CELL_SIZE = 20;

    canvas.width = GRID_SIZE * CELL_SIZE;
    canvas.height = GRID_SIZE * CELL_SIZE;

    let stepIndex = 0;
    const intervalDelay = 260; // milliseconds between frames (increase to slow down)

    function drawFrame() {
      if (stepIndex >= matchLog.length) return;

      const step = matchLog[stepIndex];
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ball
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(
        step.ball_x * CELL_SIZE + CELL_SIZE / 2,
        step.ball_y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 3,
        0,
        2 * Math.PI
      );
      ctx.fill();

      // Paddle 1 (bottom)
      ctx.fillStyle = 'blue';
      ctx.fillRect(
        step.paddle1_x * CELL_SIZE,
        (GRID_SIZE - 1) * CELL_SIZE,
        PADDLE_WIDTH * CELL_SIZE,
        CELL_SIZE / 2
      );

      // Paddle 2 (top)
      ctx.fillStyle = 'green';
      ctx.fillRect(
        step.paddle2_x * CELL_SIZE,
        0,
        PADDLE_WIDTH * CELL_SIZE,
        CELL_SIZE / 2
      );

      // Scores
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial';
      ctx.fillText(`Score Bot1: ${step.score_bot1}`, 10, canvas.height - 20);
      ctx.fillText(`Score Bot2: ${step.score_bot2}`, 10, 20);

      stepIndex++;
    //   requestAnimationFrame(drawFrame);
    }
    const animationInterval = setInterval(drawFrame, intervalDelay);
    return () => clearInterval(animationInterval);

    // drawFrame();
  }, [matchLog]);

  return (
    <div>
      <h3 className="text-lg font-semibold my-2">Match Simulation</h3>
      <canvas ref={canvasRef} className="border border-gray-400" />
    </div>
  );
};

export default MatchSimulation;

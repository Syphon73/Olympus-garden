import React, { useRef, useEffect, useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
const TILE_SIZE = 250;
const GRID_SIZE = 2;

const SlidingPuzzle = () => {
    const canvasRef = useRef(null);
    const [board, setBoard] = useState([]);
    const [dragTile, setDragTile] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
      // Initialize shuffled board [1, 2, ..., 15, 0]
      const initial = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i).sort(() => Math.random() - 0.5);
      setBoard(initial);
    }, []);

    useEffect(() => {
      drawBoard();
    }, [board, dragTile]);

    const drawBoard = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, TILE_SIZE * GRID_SIZE, TILE_SIZE * GRID_SIZE);

      board.forEach((value, i) => {
        if (value === 0) return; // skip empty tile

        const x = (i % GRID_SIZE) * TILE_SIZE;
        const y = Math.floor(i / GRID_SIZE) * TILE_SIZE;

        // If dragging, skip drawing dragged tile here
        if (dragTile?.index === i) return;

        drawTile(ctx, value, x, y);
      });

      // Draw dragged tile if exists
      if (dragTile) {
        drawTile(ctx, dragTile.value, dragTile.x, dragTile.y, 0.5);
      }
    };

    const drawTile = (ctx, value, x, y, alpha = 1) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(value, x + TILE_SIZE / 2, y + TILE_SIZE / 2);
      ctx.strokeStyle = 'black';
      ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.globalAlpha = 1;
    };

    const getTileIndexAt = (x, y) => {
      const col = Math.floor(x / TILE_SIZE);
      const row = Math.floor(y / TILE_SIZE);
      return row * GRID_SIZE + col;
    };

    const handleMouseDown = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const index = getTileIndexAt(x, y);
      const value = board[index];

      if (value === 0) return;

      // Only allow drag if adjacent to empty
      const emptyIndex = board.indexOf(0);
      const allowed = [index - 1, index + 1, index - GRID_SIZE, index + GRID_SIZE];
      if (!allowed.includes(emptyIndex)) return;

      setDragTile({ index, value, x, y });
      setOffset({ x: x % TILE_SIZE, y: y % TILE_SIZE });
    };

    const handleMouseMove = (e) => {
      if (!dragTile) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setDragTile(prev => ({ ...prev, x: x - offset.x, y: y - offset.y }));
    };

    const handleMouseUp = () => {
      if (!dragTile) return;

      const emptyIndex = board.indexOf(0);
      const newBoard = [...board];
      newBoard[dragTile.index] = 0;
      newBoard[emptyIndex] = dragTile.value;
      setBoard(newBoard);
      setDragTile(null);
    };

    return (
      <canvas
        ref={canvasRef}
        width={TILE_SIZE * GRID_SIZE}
        height={TILE_SIZE * GRID_SIZE}
        style={{ border: '2px solid black', touchAction: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    );
  };
function App() {
  return (
    <div className="App">
      <h1>Sliding Puzzle Game</h1>
      <SlidingPuzzle />
    </div>
  );
  
}
export default SlidingPuzzle;

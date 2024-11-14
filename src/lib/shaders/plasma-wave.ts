export const plasmaWave = (ctx: CanvasRenderingContext2D, time: number) => {
    const { width, height } = ctx.canvas;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const value = Math.sin(x * 0.01 + time) + Math.sin(y * 0.01 + time);
        const r = Math.sin(value * Math.PI) * 127 + 128;
        const g = Math.sin(value * Math.PI + 2 * Math.PI / 3) * 127 + 128;
        const b = Math.sin(value * Math.PI + 4 * Math.PI / 3) * 127 + 128;
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  };
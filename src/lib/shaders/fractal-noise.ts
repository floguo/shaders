export const fractalNoise = (ctx: CanvasRenderingContext2D, time: number) => {
    const { width, height } = ctx.canvas;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const value = (Math.sin(x * 0.01) + Math.sin(y * 0.01) + Math.sin(time)) * 0.33;
        const intensity = (value + 1) * 127.5;
        ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  };
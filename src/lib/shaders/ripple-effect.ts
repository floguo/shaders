export const rippleEffect = (ctx: CanvasRenderingContext2D, time: number) => {
    const { width, height } = ctx.canvas;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const dx = x - width / 2;
        const dy = y - height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const intensity = Math.sin(distance * 0.1 - time * 5) * 127 + 128;
        ctx.fillStyle = `rgb(${intensity}, ${intensity}, 255)`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  };
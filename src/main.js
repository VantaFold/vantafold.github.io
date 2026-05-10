const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("[data-home-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = new URL(link.getAttribute("href"), window.location.href);
    const samePage = target.pathname === window.location.pathname && target.hash === "#top";

    if (!samePage) {
      return;
    }

    event.preventDefault();
    window.history.replaceState(null, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });
});

const canvas = document.querySelector("#signal-canvas");

if (canvas) {
  const context = canvas.getContext("2d", { alpha: true });

  if (!context) {
    throw new Error("Canvas rendering is not available.");
  }

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let frame = 0;

  const resizeCanvas = () => {
    const bounds = canvas.getBoundingClientRect();
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.floor(bounds.width));
    height = Math.max(1, Math.floor(bounds.height));
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#151515";
    context.fillRect(0, 0, width, height);

    const grid = Math.max(44, Math.min(72, width / 9));
    const time = frame * 0.01;

    context.lineWidth = 1;

    for (let y = -grid; y < height + grid; y += grid) {
      context.strokeStyle = "rgba(245,245,240,0.07)";
      context.beginPath();
      for (let x = -grid; x < width + grid; x += grid / 2) {
        const wave = Math.sin(x * 0.018 + time + y * 0.012) * 18;
        const px = x;
        const py = y + wave;

        if (x === -grid) {
          context.moveTo(px, py);
        } else {
          context.lineTo(px, py);
        }
      }
      context.stroke();
    }

    for (let x = 0; x < width; x += grid) {
      for (let y = 0; y < height; y += grid) {
        const offset = Math.sin(time + x * 0.02 + y * 0.015) * 8;
        const alpha = 0.18 + ((x + y) % (grid * 3) === 0 ? 0.18 : 0);
        context.fillStyle = `rgba(245,245,240,${alpha})`;
        context.fillRect(x + offset, y - offset, 2, 2);
      }
    }

    context.strokeStyle = "rgba(245,245,240,0.2)";
    context.strokeRect(width * 0.18, height * 0.18, width * 0.64, height * 0.64);
    context.strokeStyle = "rgba(245,245,240,0.1)";
    context.strokeRect(width * 0.26, height * 0.26, width * 0.48, height * 0.48);

    if (!reducedMotion) {
      frame += 1;
      requestAnimationFrame(draw);
    }
  };

  resizeCanvas();
  draw();
  window.addEventListener("resize", resizeCanvas, { passive: true });
}

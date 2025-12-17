
import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
}

const CoupleAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width;
    let height = canvas.height;

    // === OPTIMIZED CONFIGURATION ===
    const PARTICLE_COUNT = 2500; // 4x density for clear imagery
    const CONNECTION_DISTANCE = 50; // Reduced for performance
    const FLOAT_SPEED = 1.2;
    const CONVERGE_SPEED = 0.18; // Much faster convergence
    const GRID_CELL_SIZE = CONNECTION_DISTANCE;

    // Timing (60fps) - SIGNIFICANTLY REDUCED
    const TIME_FLOAT = 2 * 60; // 2 seconds floating
    const TIME_CONVERGE = 1.5 * 60; // 1.5 seconds converging

    let state = 0;
    let stateTimer = 0;
    const particles: Particle[] = [];

    // Spatial hash grid for O(n) line drawing
    let grid: Map<string, number[]> = new Map();

    const getGridKey = (x: number, y: number): string => {
      const gx = Math.floor(x / GRID_CELL_SIZE);
      const gy = Math.floor(y / GRID_CELL_SIZE);
      return `${gx},${gy}`;
    };

    const buildGrid = () => {
      grid.clear();
      for (let i = 0; i < particles.length; i++) {
        const key = getGridKey(particles[i].x, particles[i].y);
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key)!.push(i);
      }
    };

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * FLOAT_SPEED,
          vy: (Math.random() - 0.5) * FLOAT_SPEED,
          targetX: width / 2,
          targetY: height / 2,
        });
      }
      calculateTargets();
    };

    const calculateTargets = () => {
      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) / 450;

      let pIndex = 0;
      const setTarget = (x: number, y: number) => {
        if (pIndex < particles.length) {
          particles[pIndex].targetX = x;
          particles[pIndex].targetY = y;
          pIndex++;
        }
      };

      const groomOffset = 70 * scale;
      const brideOffset = 70 * scale;

      // === GROOM (Left) ===
      const gx = cx - groomOffset;
      const gy = cy - 90 * scale;
      const headRadius = 28 * scale;

      // Groom Head - Dense fill
      for (let i = 0; i < 150; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * headRadius;
        setTarget(gx + Math.cos(angle) * r, gy + Math.sin(angle) * r);
      }

      // Groom Body
      const gBodyTop = gy + headRadius;
      const gBodyHeight = 160 * scale;
      const shoulderWidth = 80 * scale;

      for (let i = 0; i < 600; i++) {
        const yRatio = Math.random();
        // Taper legs
        const currentWidth = shoulderWidth * (1 - yRatio * 0.3);
        const px = gx + (Math.random() - 0.5) * currentWidth;
        const py = gBodyTop + yRatio * gBodyHeight;
        setTarget(px, py);
      }

      // === BRIDE (Right) ===
      const bx = cx + brideOffset;
      const by = cy - 90 * scale;

      // Bride Head
      for (let i = 0; i < 150; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * headRadius;
        setTarget(bx + Math.cos(angle) * r, by + Math.sin(angle) * r);
      }

      // Bride Dress - A-Line
      const dressTop = by + headRadius;
      const dressHeight = 160 * scale;
      const waistWidth = 35 * scale;
      const dressBottomWidth = 140 * scale;

      for (let i = 0; i < 800; i++) {
        const h = Math.random();
        const currentWidth = waistWidth + (dressBottomWidth - waistWidth) * h;
        const px = bx + (Math.random() - 0.5) * currentWidth;
        const py = dressTop + h * dressHeight;
        setTarget(px, py);
      }

      // === HEART between them ===
      const heartCx = cx;
      const heartCy = cy - 30 * scale;
      const heartSize = 25 * scale;

      for (let i = 0; i < 200; i++) {
        const t = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * heartSize;
        // Heart parametric
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        setTarget(heartCx + (hx / 16) * r, heartCy + (hy / 16) * r);
      }

      // Fill remaining
      while (pIndex < particles.length) {
        const choice = Math.random();
        if (choice < 0.4) {
          // Reinforce dress
          const h = Math.random();
          const w = waistWidth + (dressBottomWidth - waistWidth) * h;
          setTarget(bx + (Math.random() - 0.5) * w, dressTop + h * dressHeight);
        } else if (choice < 0.8) {
          // Reinforce groom
          const yRatio = Math.random();
          const cw = shoulderWidth * (1 - yRatio * 0.3);
          setTarget(gx + (Math.random() - 0.5) * cw, gBodyTop + yRatio * gBodyHeight);
        } else {
          // More heart
          const t = Math.random() * Math.PI * 2;
          const r = Math.sqrt(Math.random()) * heartSize;
          const hx = 16 * Math.pow(Math.sin(t), 3);
          const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
          setTarget(heartCx + (hx / 16) * r, heartCy + (hy / 16) * r);
        }
        pIndex++;
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        width = canvas.width;
        height = canvas.height;
        initParticles();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Easing function for smooth convergence
    const easeOutQuad = (t: number): number => t * (2 - t);

    const draw = () => {
      if (!ctx || !canvas) return;

      // Clear with background color (faster than clearRect for opaque bg)
      ctx.fillStyle = '#fff1f2'; // rose-50
      ctx.fillRect(0, 0, width, height);

      stateTimer++;

      if (state === 0 && stateTimer > TIME_FLOAT) {
        state = 1;
        stateTimer = 0;
      } else if (state === 1 && stateTimer > TIME_CONVERGE) {
        state = 2;
        stateTimer = 0;
      }

      // Calculate convergence progress with easing
      const convergeProgress = state === 1 ? easeOutQuad(Math.min(stateTimer / TIME_CONVERGE, 1)) : 0;
      const effectiveConvergeSpeed = CONVERGE_SPEED * (1 + convergeProgress * 2);

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (state === 0) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        } else if (state === 1) {
          p.x += (p.targetX - p.x) * effectiveConvergeSpeed;
          p.y += (p.targetY - p.y) * effectiveConvergeSpeed;
        } else {
          p.x = p.targetX;
          p.y = p.targetY;
        }
      }

      // Build spatial grid for connections (only during float)
      if (state === 0) {
        buildGrid();
      }

      // Draw connections using spatial hash (ONLY in float state for performance)
      if (state === 0) {
        ctx.strokeStyle = 'rgba(251, 113, 133, 0.15)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();

        const checked = new Set<string>();
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const gxi = Math.floor(p.x / GRID_CELL_SIZE);
          const gyi = Math.floor(p.y / GRID_CELL_SIZE);

          // Check neighboring cells
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              const neighborKey = `${gxi + dx},${gyi + dy}`;
              const neighbors = grid.get(neighborKey);
              if (!neighbors) continue;

              for (const j of neighbors) {
                if (j <= i) continue;
                const pairKey = `${i}-${j}`;
                if (checked.has(pairKey)) continue;
                checked.add(pairKey);

                const pj = particles[j];
                const ddx = p.x - pj.x;
                const ddy = p.y - pj.y;
                const distSq = ddx * ddx + ddy * ddy;

                if (distSq < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
                  ctx.moveTo(p.x, p.y);
                  ctx.lineTo(pj.x, pj.y);
                }
              }
            }
          }
        }
        ctx.stroke();
      }

      // Draw particles - batch by color
      const particleColor = state === 2 ? '#e11d48' : '#fb7185';
      const particleRadius = state === 2 ? 2.2 : 1.5;

      ctx.fillStyle = particleColor;
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.moveTo(p.x + particleRadius, p.y);
        ctx.arc(p.x, p.y, particleRadius, 0, Math.PI * 2);
      }
      ctx.fill();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full h-full bg-rose-50 relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-10" />
      <div className="absolute bottom-10 left-0 w-full text-center z-20 opacity-80">
        <p className="text-rose-900 font-serif italic text-lg">Finding your perfect match...</p>
      </div>
    </div>
  );
};

export default CoupleAnimation;



import React, { useEffect, useRef } from 'react';

const CoupleAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width;
    let height = canvas.height;
    
    // Configuration
    const particleCount = 600; // High density for clear silhouette without lines
    const connectionDistanceFloat = 100;
    const floatSpeed = 0.6;
    const convergeSpeed = 0.06;
    
    // Animation Cycle State
    // 0: Floating (Chaos)
    // 1: Converging (Forming)
    // 2: Formed (Holding - Bride & Groom) - FINAL STATE
    let state = 0; 
    let stateTimer = 0;

    interface Point {
      x: number;
      y: number;
      vx: number;
      vy: number;
      targetX: number;
      targetY: number;
      color?: string; // Optional: differentiate particles
    }

    const particles: Point[] = [];

    // Initialize Particles
    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * floatSpeed,
          vy: (Math.random() - 0.5) * floatSpeed,
          targetX: width / 2, 
          targetY: height / 2
        });
      }
      calculateTargets();
    };

    // Calculate "Bride and Groom" target shapes
    const calculateTargets = () => {
        const cx = width / 2;
        const cy = height / 2;
        // Adjusted scale for better visibility on standard screens
        const outputScale = Math.min(width, height) / 500; 

        let pIndex = 0;
        const setTarget = (x: number, y: number) => {
            if (pIndex < particles.length) {
                particles[pIndex].targetX = x;
                particles[pIndex].targetY = y;
                pIndex++;
            }
        };

        const groomOffset = 60 * outputScale; 
        const brideOffset = 60 * outputScale;
        const centerYOffset = 0; // Centered vertically

        // === GROOM (Left) ===
        const gx = cx - groomOffset;
        const gy = cy - 80 * outputScale + centerYOffset; // Head center
        const headRadius = 22 * outputScale;
        
        // 1. Groom Head (Outline + Fill) - Circle
        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random()) * headRadius; // Uniform distribution within circle
            setTarget(gx + Math.cos(angle) * r, gy + Math.sin(angle) * r);
        }

        // 2. Groom Body (Rectangular Suit)
        const bodyTop = gy + headRadius;
        const bodyHeight = 140 * outputScale;
        const shoulderWidth = 70 * outputScale;
        
        // Shoulders/Torso Area fill
        for (let i = 0; i < 180; i++) {
             // Random point in rectangle roughly representing torso/legs
             const px = gx + (Math.random() - 0.5) * shoulderWidth;
             const py = bodyTop + Math.random() * bodyHeight;
             
             // Shaping: taper slightly for legs? 
             // Simple Box is fine for abstract style
             setTarget(px, py);
        }

        // === BRIDE (Right) ===
        const bx = cx + brideOffset;
        const by = cy - 80 * outputScale + centerYOffset;
        
        // 1. Bride Head
        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random()) * headRadius;
            setTarget(bx + Math.cos(angle) * r, by + Math.sin(angle) * r);
        }

        // 2. Bride Dress (Triangle/A-Line)
        const dressTop = by + headRadius;
        const dressHeight = 140 * outputScale;
        const dressBottomWidth = 120 * outputScale;
        const waistWidth = 30 * outputScale;

        // Dress Fill
        for (let i = 0; i < 240; i++) {
            // Triangle logic
            // random height factor 0..1
            const h = Math.random();
            const currentWidth = waistWidth + (dressBottomWidth - waistWidth) * h;
            
            const px = bx + (Math.random() - 0.5) * currentWidth;
            const py = dressTop + h * dressHeight;
            setTarget(px, py);
        }

        // Use any remaining particles to reinforce the outlines or center
        while(pIndex < particles.length) {
            // Add to heart/center area between them?
            // Or just reinforce the bodies
            if (Math.random() > 0.5) {
                // Reinforce Bride Dress Bottom
                setTarget(bx + (Math.random()-0.5)*dressBottomWidth, dressTop + dressHeight - Math.random()*10);
            } else {
                // Reinforce Groom Shoulders
                setTarget(gx + (Math.random()-0.5)*shoulderWidth, bodyTop + Math.random()*20);
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

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      // State Machine
      stateTimer++;

      // Timing Constants (60fps)
      // Float: 25 Seconds
      // Converge: 3 Seconds
      const TIME_FLOAT = 25 * 60; 
      const TIME_CONVERGE = 3 * 60; 

      if (state === 0 && stateTimer > TIME_FLOAT) {
          state = 1;
          stateTimer = 0;
      } else if (state === 1 && stateTimer > TIME_CONVERGE) {
          state = 2; // Fully formed
          stateTimer = 0;
      }

      ctx.fillStyle = state === 2 ? '#e11d48' : '#fb7185'; // Rose-600 vs Rose-400
      ctx.strokeStyle = `rgba(225, 29, 72, 0.3)`;

      // Update & Draw
      particles.forEach(p => {
          // MOVEMENT LOGIC
          if (state === 0) {
              // Floating
              p.x += p.vx;
              p.y += p.vy;
              // Bounce
              if (p.x < 0 || p.x > width) p.vx *= -1;
              if (p.y < 0 || p.y > height) p.vy *= -1;
          } 
          else if (state === 1) {
              // Converging
              p.x += (p.targetX - p.x) * convergeSpeed;
              p.y += (p.targetY - p.y) * convergeSpeed;
          } 
          else if (state === 2) {
              // Formed - Lock exact position
              p.x = p.targetX;
              p.y = p.targetY;
          }

          // Draw Point
          ctx.beginPath();
          // Adjust size: Smaller when floating for elegance, slightly larger when formed for solidity
          const r = state === 2 ? 2.5 : 1.8; 
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
      });

      // Draw Connections (ONLY in float/converge)
      if (state !== 2) {
          for (let i = 0; i < particles.length; i++) {
              for (let j = i + 1; j < particles.length; j++) {
                  const dx = particles[i].x - particles[j].x;
                  const dy = particles[i].y - particles[j].y;
                  
                  // Optimization
                  if (Math.abs(dx) > connectionDistanceFloat || Math.abs(dy) > connectionDistanceFloat) continue; 

                  const dist = Math.sqrt(dx * dx + dy * dy);
                  if (dist < connectionDistanceFloat) {
                      ctx.beginPath();
                      ctx.moveTo(particles[i].x, particles[i].y);
                      ctx.lineTo(particles[j].x, particles[j].y);
                      ctx.stroke();
                  }
              }
          }
      }

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
        {/* Removed blurred blobs to ensure clean appearance */}
        
        <canvas ref={canvasRef} className="absolute inset-0 z-10" />
        
        <div className="absolute bottom-10 left-0 w-full text-center z-20 opacity-80">
            <p className="text-rose-900 font-serif italic text-lg">Finding your perfect match...</p>
        </div>
    </div>
  );
};

export default CoupleAnimation;

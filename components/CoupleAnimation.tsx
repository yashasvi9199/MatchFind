
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
    const particleCount = 180; // Slight increase for better shape definition
    const connectionDistanceFloat = 100;
    const connectionDistanceFormed = 25; // Drastically reduced to prevent "blur"
    const floatSpeed = 0.5;
    const disperseSpeed = 2.0;
    const convergeSpeed = 0.05;
    
    // Animation Cycle State
    // 0: Floating (Chaos)
    // 1: Converging (Forming)
    // 2: Formed (Holding - Bride & Groom)
    // 3: Dispersing (Exploding)
    let state = 0; 
    let stateTimer = 0;

    interface Point {
      x: number;
      y: number;
      vx: number;
      vy: number;
      targetX: number;
      targetY: number;
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
          targetX: 0,
          targetY: 0
        });
      }
      calculateTargets();
    };

    // Calculate "Bride and Groom" target shapes
    const calculateTargets = () => {
        const cx = width / 2;
        const cy = height / 2;
        const scale = Math.min(width, height) * 0.0035; 

        // Helper to add target points
        let pIndex = 0;
        const setTarget = (x: number, y: number) => {
            if (pIndex < particles.length) {
                particles[pIndex].targetX = x;
                particles[pIndex].targetY = y;
                pIndex++;
            }
        };

        const groomOffset = 60 * scale * 40;
        const brideOffset = 60 * scale * 40;

        // --- Groom (Left) ---
        const gx = cx - groomOffset;
        const gy = cy - 60 * scale * 40;
        const headRadius = 25 * scale * 40;
        
        // Head (Circle)
        for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI * 2;
            setTarget(gx + Math.cos(angle) * headRadius, gy + Math.sin(angle) * headRadius);
        }

        // Body (Simple Suit Shape)
        const bodyTop = gy + headRadius;
        const bodyHeight = 110 * scale * 40;
        const shoulderWidth = 70 * scale * 40;
        
        // Shoulders & Body Outline
        for (let i = 0; i < 12; i++) setTarget(gx - shoulderWidth/2 + (i/12)*shoulderWidth, bodyTop + 5);
        for (let i = 0; i < 18; i++) setTarget(gx - shoulderWidth/2, bodyTop + (i/18)*bodyHeight);
        for (let i = 0; i < 18; i++) setTarget(gx + shoulderWidth/2, bodyTop + (i/18)*bodyHeight);
        // Legs / Bottom
        for (let i = 0; i < 12; i++) setTarget(gx - shoulderWidth/2 + (i/12)*shoulderWidth, bodyTop + bodyHeight);
        
        // Inner detail (Tie/Buttons - vertical line)
        for (let i = 0; i < 8; i++) setTarget(gx, bodyTop + 10 + (i/8)*(bodyHeight/2));


        // --- Bride (Right) ---
        const bx = cx + brideOffset;
        const by = cy - 50 * scale * 40;
        
        // Head
        for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI * 2;
            setTarget(bx + Math.cos(angle) * headRadius, by + Math.sin(angle) * headRadius);
        }

        // Dress (Gown Shape)
        const dressTop = by + headRadius;
        const dressHeight = 120 * scale * 40;
        const dressBottomWidth = 110 * scale * 40;
        const waistWidth = 40 * scale * 40;

        // Waist
        for (let i = 0; i < 8; i++) setTarget(bx - waistWidth/2 + (i/8)*waistWidth, dressTop + 10);

        // Sides of dress (A-Frame)
        for (let i = 0; i < 20; i++) {
             // Left slope
             setTarget(bx - waistWidth/2 - (i/20) * (dressBottomWidth/2 - waistWidth/2), dressTop + 10 + (i/20) * dressHeight);
             // Right slope
             setTarget(bx + waistWidth/2 + (i/20) * (dressBottomWidth/2 - waistWidth/2), dressTop + 10 + (i/20) * dressHeight);
        }
        // Bottom of dress
        for (let i = 0; i < 15; i++) {
           setTarget(bx - dressBottomWidth/2 + (i/15)*dressBottomWidth, dressTop + 10 + dressHeight);
        }
        
        // Scramble remaining unused particles to center or let them float near
        while(pIndex < particles.length) {
            // Just attach them to the bottom of the dress or random outline points to thicken
            particles[pIndex].targetX = bx + (Math.random()-0.5)*dressBottomWidth;
            particles[pIndex].targetY = dressTop + dressHeight + (Math.random())*20;
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

      // TIMINGS (Simulating 60fps)
      // 0: Float (0-4s) -> 240 frames
      // 1: Converge (4-8s) -> 240 frames
      // 2: Formed (8-13s) -> 300 frames
      // 3: Disperse (13s-14s) -> 60 frames
      
      const TIME_FLOAT = 240;
      const TIME_CONVERGE = 140; // Quick snap
      const TIME_FORMED = 300;   // Hold for 5 sec
      const TIME_DISPERSE = 60;  // Quick explode

      if (state === 0 && stateTimer > TIME_FLOAT) {
          state = 1;
          stateTimer = 0;
      } else if (state === 1 && stateTimer > TIME_CONVERGE) {
          state = 2; // Fully formed
          stateTimer = 0;
      } else if (state === 2 && stateTimer > TIME_FORMED) {
          state = 3;
          stateTimer = 0;
          // Assign explosive velocities for dispersal
          particles.forEach(p => {
              const angle = Math.random() * Math.PI * 2;
              const force = Math.random() * disperseSpeed + 1;
              p.vx = Math.cos(angle) * force;
              p.vy = Math.sin(angle) * force;
          });
      } else if (state === 3 && stateTimer > TIME_DISPERSE) {
          state = 0;
          stateTimer = 0;
          // Calm down velocities
          particles.forEach(p => {
            p.vx = (Math.random() - 0.5) * floatSpeed;
            p.vy = (Math.random() - 0.5) * floatSpeed;
          });
      }

      // Drawing Config based on State
      let currentConnDist = connectionDistanceFloat;
      let lineAlpha = 0.2; // Default faint line

      if (state === 2) {
          currentConnDist = connectionDistanceFormed; // Reduce to fix blur
          lineAlpha = 0.15; // Even fainter lines in formed state
      }

      ctx.fillStyle = state === 2 ? '#be123c' : '#e11d48'; // Darker rose when formed
      ctx.strokeStyle = `rgba(225, 29, 72, ${lineAlpha})`;

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
              // Converging (Ease out)
              p.x += (p.targetX - p.x) * convergeSpeed;
              p.y += (p.targetY - p.y) * convergeSpeed;
          } 
          else if (state === 2) {
              // Formed (Micro jitter to keep it alive)
              const jitter = 0.3;
              p.x = p.targetX + (Math.random() - 0.5) * jitter;
              p.y = p.targetY + (Math.random() - 0.5) * jitter;
          } 
          else if (state === 3) {
              // Dispersing
              p.x += p.vx;
              p.y += p.vy;
          }

          // Draw Point
          ctx.beginPath();
          // Make dots slightly smaller in formed state to be sharper
          const r = state === 2 ? 1.5 : 2; 
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
      });

      // Draw Connections (Optimized)
      // Only draw lines if we are NOT dispersing (too chaotic) or if we are floating/formed
      if (state !== 3) {
          for (let i = 0; i < particles.length; i++) {
              // Optimization: Don't check every pair against every pair if possible, 
              // but for N=180 it's fine (~16k checks).
              for (let j = i + 1; j < particles.length; j++) {
                  const dx = particles[i].x - particles[j].x;
                  const dy = particles[i].y - particles[j].y;
                  if (Math.abs(dx) > currentConnDist || Math.abs(dy) > currentConnDist) continue; // Pre-check box

                  const dist = Math.sqrt(dx * dx + dy * dy);
                  if (dist < currentConnDist) {
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
        {/* Decorative background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <canvas ref={canvasRef} className="absolute inset-0 z-10" />
        
        <div className="absolute bottom-10 left-0 w-full text-center z-20 opacity-80">
            <p className="text-rose-900 font-serif italic text-lg">Finding your perfect match...</p>
        </div>
    </div>
  );
};

export default CoupleAnimation;

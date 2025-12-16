
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
    const particleCount = 150;
    const connectionDistance = 100;
    const floatSpeed = 0.5;
    const convergeSpeed = 0.05;
    
    // State
    // 0: Floating, 1: Converging, 2: Stopped/Formed
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
        const scale = Math.min(width, height) * 0.003; // Dynamic scaling

        // Helper to add target points
        let pIndex = 0;
        const setTarget = (x: number, y: number) => {
            if (pIndex < particles.length) {
                particles[pIndex].targetX = x;
                particles[pIndex].targetY = y;
                pIndex++;
            }
        };

        // Groom (Left side)
        // Head (Circle)
        const gx = cx - 50 * scale * 40;
        const gy = cy - 60 * scale * 40;
        const headRadius = 25 * scale * 40;
        
        for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI * 2;
            setTarget(gx + Math.cos(angle) * headRadius, gy + Math.sin(angle) * headRadius);
        }

        // Body (Line/Rectangle)
        const bodyTop = gy + headRadius;
        const bodyHeight = 110 * scale * 40;
        const shoulderWidth = 60 * scale * 40;
        
        // Shoulders
        for (let i = 0; i < 10; i++) setTarget(gx - shoulderWidth/2 + (i/10)*shoulderWidth, bodyTop + 10);
        // Sides
        for (let i = 0; i < 15; i++) setTarget(gx - shoulderWidth/2, bodyTop + (i/15)*bodyHeight);
        for (let i = 0; i < 15; i++) setTarget(gx + shoulderWidth/2, bodyTop + (i/15)*bodyHeight);
        // Legs
        for (let i = 0; i < 10; i++) setTarget(gx - 10, bodyTop + bodyHeight + (i/10)*40);
        for (let i = 0; i < 10; i++) setTarget(gx + 10, bodyTop + bodyHeight + (i/10)*40);


        // Bride (Right side)
        const bx = cx + 50 * scale * 40;
        const by = cy - 50 * scale * 40; // Slightly shorter head center
        
        // Head
        for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI * 2;
            setTarget(bx + Math.cos(angle) * headRadius, by + Math.sin(angle) * headRadius);
        }

        // Dress (Triangle)
        const dressTop = by + headRadius;
        const dressHeight = 120 * scale * 40;
        const dressBottomWidth = 100 * scale * 40;

        // Sides of dress
        for (let i = 0; i < 15; i++) {
             // Left slope
             setTarget(bx + (i/15) * (-dressBottomWidth/2), dressTop + (i/15) * dressHeight);
        }
        for (let i = 0; i < 15; i++) {
            // Right slope
            setTarget(bx + (i/15) * (dressBottomWidth/2), dressTop + (i/15) * dressHeight);
       }
       // Bottom of dress
       for (let i = 0; i < 10; i++) {
           setTarget(bx - dressBottomWidth/2 + (i/10)*dressBottomWidth, dressTop + dressHeight);
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
      
      // Update State
      stateTimer++;
      if (state === 0 && stateTimer > 200) { // After 200 frames (~3s), start forming
          state = 1;
      }
      if (state === 1 && stateTimer > 500) { // After formation, stop? Or just keep holding
          state = 2;
      }

      ctx.fillStyle = '#e11d48'; // Rose-600 color
      ctx.strokeStyle = 'rgba(225, 29, 72, 0.2)';

      // Update & Draw Particles
      particles.forEach(p => {
          if (state === 0) {
              // Floating
              p.x += p.vx;
              p.y += p.vy;

              // Bounce
              if (p.x < 0 || p.x > width) p.vx *= -1;
              if (p.y < 0 || p.y > height) p.vy *= -1;
          } else {
              // Converging
              p.x += (p.targetX - p.x) * convergeSpeed;
              p.y += (p.targetY - p.y) * convergeSpeed;
          }

          // Draw Point
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
      });

      // Draw Connections (Web effect)
      if (state === 0) {
          for (let i = 0; i < particles.length; i++) {
              for (let j = i + 1; j < particles.length; j++) {
                  const dx = particles[i].x - particles[j].x;
                  const dy = particles[i].y - particles[j].y;
                  const dist = Math.sqrt(dx * dx + dy * dy);

                  if (dist < connectionDistance) {
                      ctx.beginPath();
                      ctx.moveTo(particles[i].x, particles[i].y);
                      ctx.lineTo(particles[j].x, particles[j].y);
                      ctx.stroke();
                  }
              }
          }
      } else {
           // In formation mode, connect neighbors to form lines roughly
           // This is simpler; just drawing dots might be enough or we can connect indices
           // For outline effect, we rely on the density of dots.
           // Maybe draw lines between close dots to solidify the shape
           for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Reduce distance for tighter shape
                if (dist < 20) { 
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

// src/components/ui/InteractiveBackground.tsx
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- 1. GPU Accelerated Spotlight Tracking ---
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const springConfig = { damping: 30, stiffness: 300, mass: 0.1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // --- 2. The Engine Room (Depth-Enabled Involute Gears) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); 
    if (!ctx) return;

    let animationFrameId: number;
    let frameCount = 0;
    
    // Theme colors
    let themeBg = '#0F172A';
    let themePrimary = '#F97316';
    let themeBorder = '#334155';

    // Physics config
    const mouse = { x: -1000, y: -1000, radius: 300 }; // Increased radius for a wider lens effect
    const spacing = 110;   
    let gears: Gear[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 400);
      mouseY.set(e.clientY - 400);
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Dynamic Theme Fetcher
    const updateThemeColors = () => {
      const style = getComputedStyle(document.body);
      themeBg = style.getPropertyValue('--color-background').trim() || themeBg;
      themePrimary = style.getPropertyValue('--color-primary').trim() || themePrimary;
      themeBorder = style.getPropertyValue('--color-borderline').trim() || themeBorder;
    };

    class Gear {
      x: number;
      y: number;
      teeth: number;
      rotation: number;
      baseSpeed: number;
      currentSpeed: number;
      direction: number;
      intensity: number;
      
      // Z-Axis Depth Physics
      baseRadius: number;
      currentRadius: number;

      constructor(x: number, y: number, col: number, row: number) {
        this.x = x;
        this.y = y;
        this.teeth = 8; 
        
        this.baseRadius = 24; // Much smaller idle state for deeper contrast
        this.currentRadius = this.baseRadius;

        this.direction = (col + row) % 2 === 0 ? 1 : -1;
        const offset = this.direction === 1 ? 0 : (Math.PI / this.teeth);
        this.rotation = offset;
        
        this.baseSpeed = 0.001; // Slower idle spin for contrast
        this.currentSpeed = this.baseSpeed;
        this.intensity = 0;
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let targetIntensity = 0;
        let targetSpeed = this.baseSpeed;
        let targetRadius = this.baseRadius;

        // If in magnetic range, calculate lens distortion
        if (distance < mouse.radius) {
          targetIntensity = 1 - Math.pow(distance / mouse.radius, 1.5);
          targetSpeed = this.baseSpeed + (targetIntensity * 0.035);
          
          // Lens swell: Add up to 22px of size to the gear when directly under mouse
          targetRadius = this.baseRadius + (targetIntensity * 22); 
        }

        // Smooth Linear Interpolation (Lerp) for all 3 physics vectors
        this.intensity += (targetIntensity - this.intensity) * 0.1;
        this.currentSpeed += (targetSpeed - this.currentSpeed) * 0.05;
        this.currentRadius += (targetRadius - this.currentRadius) * 0.12; // Snappy but smooth size scaling
        
        this.rotation += this.currentSpeed * this.direction;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // --- MECHANICALLY ACCURATE GEAR PATH (Dynamic Radius) ---
        ctx.beginPath();
        const step = (Math.PI * 2) / this.teeth;
        const halfStep = step / 2;
        const slope = halfStep * 0.25; 
        
        // Dynamically base proportions on the current floating radius
        const rInner = this.currentRadius * 0.75;
        const rOuter = this.currentRadius;
        const rHole = this.currentRadius * 0.35;

        for (let i = 0; i < this.teeth; i++) {
          const a = i * step;
          // Valley (Inner arc)
          ctx.arc(0, 0, rInner, a, a + halfStep - slope);
          // Tooth Tip (Outer arc)
          ctx.arc(0, 0, rOuter, a + halfStep + slope, a + step - slope);
        }
        ctx.closePath();
        
        // Cut out the inner axle hole
        ctx.arc(0, 0, rHole, 0, Math.PI * 2, true);

        // --- THEME STYLING ---
        if (this.intensity > 0.02) {
          ctx.fillStyle = themePrimary;
          ctx.globalAlpha = 0.1 + (this.intensity * 0.6);
          ctx.fill();

          ctx.strokeStyle = themePrimary;
          ctx.globalAlpha = 0.3 + (this.intensity * 0.7);
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          ctx.fillStyle = themeBorder;
          ctx.globalAlpha = 0.03;
          ctx.fill();

          ctx.strokeStyle = themeBorder;
          ctx.globalAlpha = 0.15;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    const initGears = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gears = [];
      updateThemeColors();

      const cols = Math.ceil(canvas.width / spacing) + 1;
      const rowHeight = spacing * 0.866; 
      const rows = Math.ceil(canvas.height / rowHeight) + 1;

      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const xOffset = row % 2 === 0 ? 0 : spacing / 2;
          gears.push(new Gear(col * spacing + xOffset, row * rowHeight, col, row));
        }
      }
    };

    const animate = () => {
      if (frameCount % 60 === 0) updateThemeColors();
      frameCount++;

      ctx.globalAlpha = 1;
      ctx.fillStyle = themeBg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      gears.forEach(gear => {
        gear.update();
        gear.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    initGears();
    animate();

    const handleResize = () => initGears();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-500">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-10" 
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}
      />
      <motion.div
        style={{ 
          x: smoothX, 
          y: smoothY,
          background: 'radial-gradient(circle, color-mix(in srgb, var(--color-primary) 10%, transparent) 0%, transparent 60%)'
        }}
        className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full will-change-transform z-10"
      />
      <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_150px_rgba(0,0,0,0.5)]" />
    </div>
  );
}
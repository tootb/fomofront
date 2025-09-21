import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import './DotGrid.css';

const throttle = (func, limit) => {
  let lastCall = 0;
  return function (...args) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

function hexToRgb(hex) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 82, g: 39, b: 255 }; // Fallback color
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16)
  };
}

const DotGrid = ({
  dotSize = 8,
  gap = 25,
  baseColor = '#5227FF',
  activeColor = '#00FFFF',
  proximity = 150,
  speedTrigger = 100,
  shockRadius = 250,
  shockStrength = 5,
  maxSpeed = 5000,
  resistance = 750,
  returnDuration = 1.5,
  className = '',
  style
}) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const animationRef = useRef(null);
  const pointerRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0
  });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      console.log('Canvas initialized:', width, 'x', height);
    }

    const cols = Math.floor((width + gap) / (dotSize + gap));
    const rows = Math.floor((height + gap) / (dotSize + gap));
    const cell = dotSize + gap;

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;

    const extraX = width - gridW;
    const extraY = height - gridH;

    const startX = extraX / 2 + dotSize / 2;
    const startY = extraY / 2 + dotSize / 2;

    const dots = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        dots.push({ 
          cx, 
          cy, 
          xOffset: 0, 
          yOffset: 0, 
          _inertiaApplied: false,
          originalX: cx,
          originalY: cy
        });
      }
    }
    dotsRef.current = dots;
    console.log('Grid built with', dots.length, 'dots');
  }, [dotSize, gap]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const { x: px, y: py } = pointerRef.current;
    const proxSq = proximity * proximity;

    for (const dot of dotsRef.current) {
      const ox = dot.cx + dot.xOffset;
      const oy = dot.cy + dot.yOffset;
      const dx = dot.cx - px;
      const dy = dot.cy - py;
      const dsq = dx * dx + dy * dy;

      let fillStyle = baseColor;
      if (dsq <= proxSq) {
        const dist = Math.sqrt(dsq);
        const t = 1 - dist / proximity;
        const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
        const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
        const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
        fillStyle = `rgb(${r},${g},${b})`;
      }

      ctx.fillStyle = fillStyle;
      ctx.beginPath();
      ctx.arc(ox, oy, dotSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(draw);
  }, [proximity, baseColor, activeRgb, baseRgb, dotSize]);

  useEffect(() => {
    buildGrid();
    
    // Force initial draw
    setTimeout(() => {
      draw();
    }, 100);

    let ro = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(() => {
        buildGrid();
        setTimeout(draw, 50);
      });
      wrapperRef.current && ro.observe(wrapperRef.current);
    } else {
      const handleResize = () => {
        buildGrid();
        setTimeout(draw, 50);
      };
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
    
    return () => {
      if (ro) ro.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [buildGrid, draw]);

  useEffect(() => {
    const onMove = e => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const now = performance.now();
      const pr = pointerRef.current;
      
      const dx = e.clientX - pr.lastX;
      const dy = e.clientY - pr.lastY;
      const dt = pr.lastTime ? now - pr.lastTime : 16;
      
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);
      
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }
      
      pr.lastTime = now;
      pr.lastX = e.clientX;
      pr.lastY = e.clientY;
      pr.vx = vx;
      pr.vy = vy;
      pr.speed = speed;
      pr.x = e.clientX - rect.left;
      pr.y = e.clientY - rect.top;

      // Apply physics to nearby dots
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
        if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          
          const pushX = (dot.cx - pr.x) * 0.1 + vx * 0.005;
          const pushY = (dot.cy - pr.y) * 0.1 + vy * 0.005;
          
          // Simple animation
          let startTime = null;
          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / 1000, 1);
            
            const easeOut = 1 - Math.pow(1 - progress, 3);
            dot.xOffset = pushX * (1 - easeOut);
            dot.yOffset = pushY * (1 - easeOut);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              // Return to original position
              let returnStart = null;
              const returnAnim = (currentTime) => {
                if (!returnStart) returnStart = currentTime;
                const returnElapsed = currentTime - returnStart;
                const returnProgress = Math.min(returnElapsed / (returnDuration * 1000), 1);
                
                dot.xOffset = pushX * (1 - returnProgress);
                dot.yOffset = pushY * (1 - returnProgress);
                
                if (returnProgress < 1) {
                  requestAnimationFrame(returnAnim);
                } else {
                  dot.xOffset = 0;
                  dot.yOffset = 0;
                  dot._inertiaApplied = false;
                }
              };
              requestAnimationFrame(returnAnim);
            }
          };
          requestAnimationFrame(animate);
        }
      }
    };

    const onClick = e => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
        if (dist < shockRadius && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          const falloff = Math.max(0, 1 - dist / shockRadius);
          const pushX = (dot.cx - cx) * shockStrength * falloff;
          const pushY = (dot.cy - cy) * shockStrength * falloff;
          
          // Shock animation
          let startTime = null;
          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / 500, 1);
            
            dot.xOffset = pushX * (1 - progress);
            dot.yOffset = pushY * (1 - progress);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              dot.xOffset = 0;
              dot.yOffset = 0;
              dot._inertiaApplied = false;
            }
          };
          requestAnimationFrame(animate);
        }
      }
    };

    const throttledMove = throttle(onMove, 16);
    document.addEventListener('mousemove', throttledMove, { passive: true });
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('mousemove', throttledMove);
      document.removeEventListener('click', onClick);
    };
  }, [maxSpeed, speedTrigger, proximity, returnDuration, shockRadius, shockStrength]);

  return (
    <section className={`dot-grid ${className}`} style={style}>
      <div ref={wrapperRef} className="dot-grid__wrap">
        <canvas ref={canvasRef} className="dot-grid__canvas" />
      </div>
    </section>
  );
};

export default DotGrid;
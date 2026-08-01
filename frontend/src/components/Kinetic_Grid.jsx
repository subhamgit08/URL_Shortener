import React, { useRef, useEffect } from "react";

export default function KineticGrid({ children, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // --- Configuration ---
    const spacing = 45; // Spacing adjusted to match the image's mesh size
    const dotRadius = 1.5; 
    const mouseRadius = 250; // Radius of the blue glow and warp effect
    // ---------------------
    
    let dots = [];
    let cols = 0;
    let rows = 0;
    const ripples = [];
    const mouse = { x: width / 2, y: height / 2 };

    class Ripple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.speed = 12; 
        this.life = 1; 
      }
      update() {
        this.radius += this.speed;
        this.life -= 0.015;
      }
    }

    class Dot {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
      }

      update() {
        let dx = mouse.x - this.baseX;
        let dy = mouse.y - this.baseY;
        let distance = Math.sqrt(dx * dx + dy * dy);

        let targetX = this.baseX;
        let targetY = this.baseY;

        // Warp towards cursor
        if (distance < mouseRadius) {
          const force = Math.pow((mouseRadius - distance) / mouseRadius, 2);
          targetX += dx * force * 0.5; // Controls how intensely the grid pulls in
          targetY += dy * force * 0.5;
        }

        // Ripple displacement
        for (let i = 0; i < ripples.length; i++) {
          const ripple = ripples[i];
          const rdx = this.baseX - ripple.x;
          const rdy = this.baseY - ripple.y;
          const rDistance = Math.sqrt(rdx * rdx + rdy * rdy);
          
          const distToWave = Math.abs(rDistance - ripple.radius);
          const waveWidth = 60; 

          if (distToWave < waveWidth) {
            const waveForce = Math.sin((1 - distToWave / waveWidth) * Math.PI) * ripple.life;
            const angle = Math.atan2(rdy, rdx);
            targetX += Math.cos(angle) * waveForce * 25;
            targetY += Math.sin(angle) * waveForce * 25;
          }
        }

        // Spring physics for smooth easing
        this.x += (targetX - this.x) * 0.15;
        this.y += (targetY - this.y) * 0.15;
      }
    }

    const initGrid = () => {
      dots = [];
      cols = Math.ceil(width / spacing) + 2;
      rows = Math.ceil(height / spacing) + 2;

      for (let i = 0; i < cols; i++) {
        let col = [];
        for (let j = 0; j < rows; j++) {
          // Offset by spacing so grid completely covers the edges when pulled
          let x = (i - 1) * spacing;
          let y = (j - 1) * spacing;
          col.push(new Dot(x, y));
        }
        dots.push(col);
      }
    };

    // Helper to draw smooth curves across the 2D array
    const drawGridLines = (strokeStyle) => {
      ctx.beginPath();
      
      // Horizontal curves
      for (let j = 0; j < rows; j++) {
        ctx.moveTo(dots[0][j].x, dots[0][j].y);
        for (let i = 1; i < cols - 1; i++) {
          const xc = (dots[i][j].x + dots[i + 1][j].x) / 2;
          const yc = (dots[i][j].y + dots[i + 1][j].y) / 2;
          ctx.quadraticCurveTo(dots[i][j].x, dots[i][j].y, xc, yc);
        }
        ctx.lineTo(dots[cols - 1][j].x, dots[cols - 1][j].y);
      }

      // Vertical curves
      for (let i = 0; i < cols; i++) {
        ctx.moveTo(dots[i][0].x, dots[i][0].y);
        for (let j = 1; j < rows - 1; j++) {
          const xc = (dots[i][j].x + dots[i][j + 1].x) / 2;
          const yc = (dots[i][j].y + dots[i][j + 1].y) / 2;
          ctx.quadraticCurveTo(dots[i][j].x, dots[i][j].y, xc, yc);
        }
        ctx.lineTo(dots[i][rows - 1].x, dots[i][rows - 1].y);
      }

      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    // Helper to draw the intersection dots
    const drawGridDots = (fillStyle) => {
      ctx.beginPath();
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          ctx.moveTo(dots[i][j].x + dotRadius, dots[i][j].y);
          ctx.arc(dots[i][j].x, dots[i][j].y, dotRadius, 0, Math.PI * 2);
        }
      }
      ctx.fillStyle = fillStyle;
      ctx.fill();
    };

    initGrid();

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleClick = (e) => {
      ripples.push(new Ripple(e.clientX, e.clientY));
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initGrid();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);

    let animationFrameId;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Remove dead ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].update();
        if (ripples[i].life <= 0) ripples.splice(i, 1);
      }

      // Update dot physics
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          dots[i][j].update();
        }
      }

      // 1. Draw base grid (Faint gray/white)
      const baseColor = "rgba(255, 255, 255, 0.1)";
      drawGridLines(baseColor);
      drawGridDots(baseColor);

      // 2. Draw glow overlay (Neon blue bounded by radius)
      const gradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0, 
        mouse.x, mouse.y, mouseRadius
      );
      // Bright neon blue center fading to transparent
      gradient.addColorStop(0, "rgba(96, 165, 250, 0.9)"); 
      gradient.addColorStop(1, "rgba(96, 165, 250, 0)");   

      drawGridLines(gradient);
      drawGridDots(gradient);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      className={className}
      style={{ 
        position: "relative", 
        minHeight: "100vh", 
        width: "100%", 
        backgroundColor: "#0F0F11", // Darker background to make blue pop
        overflow: "hidden" 
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          zIndex: 0, 
          pointerEvents: "none" 
        }}
      />
      <div 
        style={{ 
          position: "relative", 
          zIndex: 10, 
          width: "100%", 
          height: "100%", 
          pointerEvents: "auto" 
        }}
      >
        {children}
      </div>
    </div>
  );
}
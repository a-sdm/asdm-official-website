import React, { useEffect, useRef } from 'react';

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

interface CodeDrop {
  x: number;
  y: number;
  speed: number;
  text: string;
  opacity: number;
  fontSize: number;
  color: string;
}
export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const codeDropsRef = useRef<CodeDrop[]>([]);
  const animationRef = useRef<number>();

  // Programming code snippets and keywords
  const codeSnippets = [
    'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'class', 'import',
    'export', 'return', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this',
    'AI.predict()', 'model.train()', 'data.process()', 'neural.network()',
    'algorithm.optimize()', 'system.deploy()', 'code.review()', 'test.run()',
    '{ x: 0, y: 1 }', '[1, 2, 3]', '=> {}', '&&', '||', '===', '!==',
    'React.useState', 'useEffect', 'useState', 'props', 'state', 'render',
    'API.call()', 'fetch()', 'POST', 'GET', 'JSON', 'HTTP', 'REST',
    'docker run', 'git commit', 'npm install', 'yarn add', 'build', 'deploy',
    'machine.learning', 'deep.learning', 'neural.net', 'tensorflow', 'pytorch',
    '0x1A2B', '0101', '1010', '1100', '0011', 'NULL', 'undefined', 'true', 'false'
  ];
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize dots
    const initDots = () => {
      dotsRef.current = [];
      for (let i = 0; i < 150; i++) {
        dotsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          color: Math.random() > 0.6 ? '#fbbf24' : Math.random() > 0.3 ? '#f59e0b' : '#94a3b8'
        });
      }
    };

    // Initialize code drops
    const initCodeDrops = () => {
      codeDropsRef.current = [];
      for (let i = 0; i < 30; i++) {
        codeDropsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          speed: Math.random() * 0.5 + 0.2,
          text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
          opacity: Math.random() * 0.7 + 0.3,
          fontSize: Math.random() * 4 + 8,
          color: Math.random() > 0.7 ? '#fbbf24' : Math.random() > 0.5 ? '#f59e0b' : '#94a3b8'
        });
      }
    };
    initDots();
    initCodeDrops();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw dots
      dotsRef.current.forEach(dot => {
        // Update position
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Bounce off edges
        if (dot.x <= 0 || dot.x >= canvas.width) dot.vx *= -1;
        if (dot.y <= 0 || dot.y >= canvas.height) dot.vy *= -1;

        // Keep dots in bounds
        dot.x = Math.max(0, Math.min(canvas.width, dot.x));
        dot.y = Math.max(0, Math.min(canvas.height, dot.y));

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = dot.color + Math.floor(dot.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      // Draw connections between nearby dots
      dotsRef.current.forEach((dot1, i) => {
        dotsRef.current.slice(i + 1).forEach(dot2 => {
          const distance = Math.sqrt((dot1.x - dot2.x) ** 2 + (dot1.y - dot2.y) ** 2);
          if (distance < 100) {
            const opacity = (100 - distance) / 100 * 0.3;
            ctx.beginPath();
            ctx.moveTo(dot1.x, dot1.y);
            ctx.lineTo(dot2.x, dot2.y);
            ctx.strokeStyle = `rgba(251, 191, 36, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // Draw neural network connections between code drops
      codeDropsRef.current.forEach((code1, i) => {
        // Only connect code drops that are visible on screen
        if (code1.y >= -50 && code1.y <= canvas.height + 50) {
          codeDropsRef.current.slice(i + 1).forEach(code2 => {
            // Only connect to other visible code drops
            if (code2.y >= -50 && code2.y <= canvas.height + 50) {
              const distance = Math.sqrt((code1.x - code2.x) ** 2 + (code1.y - code2.y) ** 2);
              if (distance < 200) { // Increased connection range for better network effect
                const opacity = (200 - distance) / 200 * 0.25;
                ctx.beginPath();
                ctx.moveTo(code1.x, code1.y);
                ctx.lineTo(code2.x, code2.y);
                
                // Use cyan/blue connections for code drops
                const connectionColor = `rgba(245, 158, 11, ${opacity})`; // Amber color
                
                ctx.strokeStyle = connectionColor;
                ctx.lineWidth = 0.8;
                ctx.stroke();
              }
            }
          });
        }
      });

      // Draw connections between dots and code drops (cross-layer connections)
      dotsRef.current.forEach(dot => {
        codeDropsRef.current.forEach(code => {
          // Only connect to visible code drops
          if (code.y >= -50 && code.y <= canvas.height + 50) {
            const distance = Math.sqrt((dot.x - code.x) ** 2 + (dot.y - code.y) ** 2);
            if (distance < 100) { // Slightly increased range for better connectivity
              const opacity = (100 - distance) / 100 * 0.18;
              ctx.beginPath();
              ctx.moveTo(dot.x, dot.y);
              ctx.lineTo(code.x, code.y);
              ctx.strokeStyle = `rgba(252, 211, 77, ${opacity})`; // Light yellow connections
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });
      });
      // Update and draw falling code
      codeDropsRef.current.forEach(codeDrop => {
        // Update position
        codeDrop.y += codeDrop.speed;

        // Reset when off screen
        if (codeDrop.y > canvas.height + 50) {
          codeDrop.y = -50;
          codeDrop.x = Math.random() * canvas.width;
          codeDrop.text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
          codeDrop.speed = Math.random() * 0.5 + 0.2;
          codeDrop.opacity = Math.random() * 0.7 + 0.3;
          codeDrop.fontSize = Math.random() * 4 + 8;
          codeDrop.color = Math.random() > 0.7 ? '#fbbf24' : Math.random() > 0.5 ? '#f59e0b' : '#94a3b8';
        }

        // Draw code text
        ctx.font = `${codeDrop.fontSize}px 'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace`;
        ctx.fillStyle = codeDrop.color + Math.floor(codeDrop.opacity * 255).toString(16).padStart(2, '0');
        ctx.textAlign = 'center';
        
        // Add subtle glow effect
        ctx.shadowColor = codeDrop.color;
        ctx.shadowBlur = 5;
        ctx.fillText(codeDrop.text, codeDrop.x, codeDrop.y);
        ctx.shadowBlur = 0;
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
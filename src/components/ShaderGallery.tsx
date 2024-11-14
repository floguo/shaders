'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { plasmaWave } from '@/lib/shaders/plasma-wave'
import { rippleEffect } from '@/lib/shaders/ripple-effect'
import { fractalNoise } from '@/lib/shaders/fractal-noise'

type Shader = {
  id: number;
  name: string;
  shader: (ctx: CanvasRenderingContext2D, time: number) => void;
};

const shaders: Shader[] = [
  { id: 1, name: 'Ripple Effect', shader: rippleEffect },
  { id: 2, name: 'Plasma Wave', shader: plasmaWave },
  { id: 3, name: 'Fractal Noise', shader: fractalNoise },
];

function useTypingEffect(text: string, speed: number = 10) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isTyping) {
      timeoutId = setTimeout(() => {
        setDisplayedText((current) => {
          const next = text.slice(0, current.length + 1);
          if (next === text) setIsTyping(false);
          return next;
        });
      }, speed);
    }
    return () => clearTimeout(timeoutId);
  }, [displayedText, isTyping, speed, text]);

  return displayedText;
}

function ShaderPreview({ 
  shader, 
  onClick, 
  isPlaying, 
  togglePlay, 
  onHover,
  onUnhover,
  shaderTime,
  updateShaderTime 
}: {
  shader: Shader;
  onClick: () => void;
  isPlaying: boolean;
  togglePlay?: () => void;
  onHover: (id: number) => void;
  onUnhover: () => void;
  shaderTime: number;
  updateShaderTime: (id: number, time: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let animationFrameId: number;
    let lastFrameTime = performance.now();

    const renderFrame = (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (isPlaying) {
        const deltaTime = (timestamp - lastFrameTime) / 1000;
        updateShaderTime(shader.id, shaderTime + deltaTime);
      }
      lastFrameTime = timestamp;

      shader.shader(ctx, shaderTime);
      
      if (isPlaying) {
        animationFrameId = requestAnimationFrame(renderFrame);
      }
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(renderFrame);
    } else {
      renderFrame(lastFrameTime);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isClient, isPlaying, shader, shaderTime, updateShaderTime]);

  const handleMouseEnter = () => {
    onHover(shader.id);
  };

  const handleMouseLeave = () => {
    onUnhover();
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="text-left w-full group"
    >
      <div className="relative overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={300} 
          className="w-full aspect-video transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
        {!isClient && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
            Loading shader...
          </div>
        )}
      </div>
      <div className="font-mono text-xs tracking-wider mt-2 flex justify-between items-center">
        <span>{shader.name}</span>
        {togglePlay && isClient && (
          <button 
            onClick={(e) => { e.stopPropagation(); togglePlay(); }} 
            className="text-xs border border-white px-2 py-1 rounded"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        )}
      </div>
    </button>
  );
}

export default function ShaderGallery() {
  const [playingShader, setPlayingShader] = useState(1);
  const [shaderTimes, setShaderTimes] = useState<{ [key: number]: number }>({});
  const [isClient, setIsClient] = useState(false);
  const typedAbout = useTypingEffect('A collection of shader experiments', 10);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleShaderHover = (shaderId: number) => {
    setPlayingShader(shaderId);
  };

  const handleShaderUnhover = () => {
    // Optionally, you can set a delay here to make the transition smoother
    // setTimeout(() => setPlayingShader(1), 300);
  };

  const updateShaderTime = (id: number, time: number) => {
    setShaderTimes(prev => ({ ...prev, [id]: time }));
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex justify-center">
      <div className="w-full max-w-2xl">
        <header className="mb-16 grid grid-cols-2 font-mono text-xs tracking-wider">
          <div>FLOGUO LABS</div>
          <div className="text-right">
            <Link href="https://x.com/floguo" target="_blank" rel="noopener noreferrer" className="hover:underline">
              X: @floguo
            </Link>
          </div>
        </header>

        <div className="mb-16 font-mono text-xs">
          <div className="text-neutral-500 mb-2">ABOUT</div>
          <div aria-live="polite">
            {isClient ? typedAbout : 'A collection of shader experiments'}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {shaders.map((shader) => (
            <ShaderPreview
              key={shader.id}
              shader={shader}
              onClick={() => setPlayingShader(shader.id)} 
              isPlaying={isClient && playingShader === shader.id}
              onHover={handleShaderHover}
              onUnhover={handleShaderUnhover}
              shaderTime={shaderTimes[shader.id] || 0}
              updateShaderTime={updateShaderTime}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
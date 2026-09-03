import React, { useEffect, useRef } from 'react';
import { VoiceStateType } from '../types';

interface DynamicVoiceWaveProps {
  voiceState: VoiceStateType;
  onClick?: () => void;
}

export default function DynamicVoiceWave({ voiceState, onClick }: DynamicVoiceWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // 根据状态控制波幅与波速（品牌橙色 #FF6500，统一纯净）
      let targetAmplitude = 12;
      let speed = 0.04;
      let waveCount = 3;

      if (voiceState === 'listening') {
        targetAmplitude = 36 + Math.sin(phase * 4) * 8;
        speed = 0.09;
        waveCount = 4;
      } else if (voiceState === 'thinking') {
        targetAmplitude = 20 + Math.sin(phase * 6) * 6;
        speed = 0.12;
        waveCount = 3;
      } else if (voiceState === 'waking') {
        targetAmplitude = 28;
        speed = 0.07;
      } else if (voiceState === 'success') {
        targetAmplitude = 22 + Math.sin(phase * 3) * 5;
        speed = 0.05;
      } else if (voiceState === 'idle') {
        targetAmplitude = 9 + Math.sin(phase * 1.5) * 3;
        speed = 0.03;
      }

      phase += speed;
      const cy = height / 2;

      // 绘制多层平滑正弦波
      const waves = [
        { amp: targetAmplitude * 1.0, freq: 0.016, alpha: 0.9, lineWidth: 2.5, phaseShift: 0 },
        { amp: targetAmplitude * 0.65, freq: 0.022, alpha: 0.5, lineWidth: 1.8, phaseShift: 1.4 },
        { amp: targetAmplitude * 0.4, freq: 0.028, alpha: 0.3, lineWidth: 1.2, phaseShift: 2.8 },
        { amp: targetAmplitude * 0.2, freq: 0.01, alpha: 0.2, lineWidth: 1.0, phaseShift: 4.2 }
      ];

      waves.slice(0, waveCount).forEach((w) => {
        ctx.beginPath();
        ctx.strokeStyle = '#FF6500';
        ctx.lineWidth = w.lineWidth;
        ctx.globalAlpha = w.alpha;
        ctx.shadowColor = '#FF6500';
        ctx.shadowBlur = 10;

        for (let x = 0; x <= width; x += 3) {
          // 两端淡出衰减系数，让声波自然收于两端
          const normX = (x / width) * 2 - 1; // -1 to 1
          const envelope = Math.max(0, 1 - Math.pow(normX, 2));

          const y =
            cy +
            Math.sin(x * w.freq + phase + w.phaseShift) *
              w.amp *
              envelope;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // 中心光晕微点
      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [voiceState]);

  return (
    <div
      onClick={onClick}
      className="w-full max-w-[680px] h-[64px] flex items-center justify-center cursor-pointer select-none relative group"
      title="点击唤醒语音交互"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

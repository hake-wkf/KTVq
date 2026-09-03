import React, { useEffect, useRef } from 'react';
import { VoiceStateType } from '../types';

interface LuminousVoiceOrbProps {
  voiceState: VoiceStateType;
  onClick?: () => void;
  liveSttText?: string;
}

/**
 * LuminousVoiceOrb
 * 灵感源自 Siri / 小爱同学的纯净光体语音主体：
 * - 一团柔和纯粹的光（青蓝冷光流体 + 超软环境辉光）
 * - 待机时：轻轻呼吸 (gentle breathing rhythm)
 * - 说话时：随声音有机膨胀起伏 (fluid bloom responsive to sound)
 * - 思考时：流光缓缓旋动 (calm cosmic fluid swirl)
 * - 成功时：瞬间明亮闪耀后归于平静 (bright luminous burst & settle)
 * - 纯粹、高级，无堆叠音柱、无粒子、无实体球、无 App Logo
 */
export default function LuminousVoiceOrb({
  voiceState,
  onClick,
  liveSttText = ''
}: LuminousVoiceOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;
    let successBloomProgress = 0; // 0 to 1 for flash burst

    const width = 360;
    const height = 240;
    canvas.width = width;
    canvas.height = height;

    const centerX = width / 2;
    const centerY = height / 2;

    const render = () => {
      time += 0.024;
      ctx.clearRect(0, 0, width, height);

      const isListening = voiceState === 'listening' || voiceState === 'waking';
      const isThinking = voiceState === 'thinking';
      const isSuccess = voiceState === 'success';

      if (isSuccess && successBloomProgress < 1) {
        successBloomProgress = Math.min(1, successBloomProgress + 0.04);
      } else if (!isSuccess) {
        successBloomProgress = 0;
      }

      // 基础参数计算
      let baseRadius = 46;
      let scale = 1;
      let rotationSpeed = 0.4;
      let brightness = 1;

      if (isListening) {
        // 用户说话时，随声音起伏扩张，有机呼吸波动
        const speechAmp = Math.sin(time * 6) * 0.18 + Math.cos(time * 3.7) * 0.12;
        scale = 1.15 + speechAmp;
        brightness = 1.25;
        rotationSpeed = 0.9;
      } else if (isThinking) {
        // AI 思考时：缓慢悠扬流转
        scale = 1.02 + Math.sin(time * 2) * 0.06;
        rotationSpeed = 1.6;
        brightness = 1.1;
      } else if (isSuccess) {
        // 成功时：亮一下闪光脉冲
        const flash = Math.sin(successBloomProgress * Math.PI);
        scale = 1 + flash * 0.28;
        brightness = 1 + flash * 0.6;
      } else {
        // 待机时：极其柔和的自然深呼吸
        scale = 1 + Math.sin(time * 1.6) * 0.07;
        brightness = 0.95;
        rotationSpeed = 0.35;
      }

      const rot = time * rotationSpeed;

      // 启用高画质混合模式
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // 1. 最外层：超宽柔和青蓝环境辉光 (Environmental Aura)
      const outerGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        baseRadius * 2.8 * scale
      );
      outerGrad.addColorStop(0, `rgba(6, 182, 212, ${0.35 * brightness})`);
      outerGrad.addColorStop(0.45, `rgba(14, 165, 233, ${0.18 * brightness})`);
      outerGrad.addColorStop(0.8, `rgba(37, 99, 235, ${0.06 * brightness})`);
      outerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = outerGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 2.8 * scale, 0, Math.PI * 2);
      ctx.fill();

      // 2. 内部多瓣柔性流动光斑（流体旋动，青水流光）
      const lobeCount = 4;
      for (let i = 0; i < lobeCount; i++) {
        const angle = rot + (i * Math.PI * 2) / lobeCount;
        const dist = (baseRadius * 0.38 + Math.sin(time * 2.5 + i) * 6) * scale;
        const lx = centerX + Math.cos(angle) * dist;
        const ly = centerY + Math.sin(angle) * dist;

        const lobeGrad = ctx.createRadialGradient(
          lx,
          ly,
          0,
          lx,
          ly,
          baseRadius * 1.5 * scale
        );

        if (i % 2 === 0) {
          // 青碧电光
          lobeGrad.addColorStop(0, `rgba(34, 211, 238, ${0.8 * brightness})`);
          lobeGrad.addColorStop(0.5, `rgba(6, 182, 212, ${0.35 * brightness})`);
          lobeGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
        } else {
          // 湛蓝宝光 (伴随极细微柔和暖调融合，极度高级)
          lobeGrad.addColorStop(0, `rgba(56, 189, 248, ${0.75 * brightness})`);
          lobeGrad.addColorStop(0.6, `rgba(79, 70, 229, ${0.25 * brightness})`);
          lobeGrad.addColorStop(1, 'rgba(79, 70, 229, 0)');
        }

        ctx.fillStyle = lobeGrad;
        ctx.beginPath();
        ctx.arc(lx, ly, baseRadius * 1.5 * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. 核心温润亮白高光核 (Ethereal Core)
      const coreGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        baseRadius * 0.7 * scale
      );
      coreGrad.addColorStop(0, `rgba(255, 255, 255, ${0.95 * brightness})`);
      coreGrad.addColorStop(0.35, `rgba(207, 250, 254, ${0.75 * brightness})`);
      coreGrad.addColorStop(0.7, `rgba(34, 211, 238, ${0.35 * brightness})`);
      coreGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 0.7 * scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [voiceState]);

  // 状态文案提示（紧贴在光体下方）
  const getStatusText = () => {
    switch (voiceState) {
      case 'waking':
      case 'listening':
        return '正在聆听...';
      case 'thinking':
        return '正在思考...';
      case 'success':
        return '已执行';
      case 'unclear':
        return '没听清，请再说一次';
      case 'idle':
      default:
        return '正在待命 · 随时对我说';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center select-none shrink-0 relative pt-2">
      {/* 1. 光体主体容器（轻触可直接唤醒语音交互） */}
      <div
        onClick={onClick}
        className="relative cursor-pointer group flex items-center justify-center active:scale-98 transition-transform"
        title="点击与小谷对话"
      >
        {/* 背景深度柔焦环境晕染 */}
        <div
          className={`absolute w-44 h-44 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            voiceState === 'listening'
              ? 'bg-cyan-400/25 scale-125'
              : voiceState === 'thinking'
              ? 'bg-sky-500/20 scale-110'
              : voiceState === 'success'
              ? 'bg-cyan-300/35 scale-130'
              : 'bg-cyan-500/15 scale-95 group-hover:scale-105 group-hover:bg-cyan-400/20'
          }`}
        />

        {/* 核心柔性流体光斑 Canvas */}
        <canvas
          ref={canvasRef}
          className="w-[280px] h-[170px] pointer-events-none relative z-10"
        />
      </div>

      {/* 2. 状态文字紧贴在光体下方（清晰克制、不占空间） */}
      <div className="flex flex-col items-center -mt-3 z-20">
        <div className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              voiceState === 'listening' || voiceState === 'thinking'
                ? 'bg-cyan-400 animate-ping shadow-[0_0_8px_#22D3EE]'
                : voiceState === 'success'
                ? 'bg-cyan-300 shadow-[0_0_8px_#67E8F9]'
                : 'bg-cyan-400/70'
            }`}
          />
          <span className="text-xs sm:text-sm font-medium tracking-widest text-cyan-300/90 font-sans">
            {getStatusText()}
          </span>
        </div>

        {/* 用户说话时的实时识别字句浮现 */}
        {liveSttText && (
          <div className="mt-1.5 px-4 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-medium text-cyan-200 animate-fade-in backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            “{liveSttText}”
          </div>
        )}
      </div>
    </div>
  );
}

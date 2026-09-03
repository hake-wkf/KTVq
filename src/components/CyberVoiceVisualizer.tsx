import React, { useEffect, useRef } from 'react';
import { VoiceStateType } from '../types';

interface CyberVoiceVisualizerProps {
  voiceState: VoiceStateType;
  onActivate: () => void;
  onQuickPrompt: (prompt: string) => void;
  liveSttText?: string;
}

export default function CyberVoiceVisualizer({
  voiceState,
  onActivate,
  onQuickPrompt,
  liveSttText = ''
}: CyberVoiceVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 状态显示
  const getStatusInfo = () => {
    switch (voiceState) {
      case 'waking':
        return {
          dotColor: 'bg-[#FF6500]',
          statusText: '唤醒中',
          subText: '小谷在线，请说出您的需求',
          isActive: true
        };
      case 'listening':
        return {
          dotColor: 'bg-[#FF6500]',
          statusText: '聆听中',
          subText: '正在倾听您的语音指令...',
          isActive: true
        };
      case 'thinking':
        return {
          dotColor: 'bg-[#FF6500]',
          statusText: '思考中',
          subText: 'AI 正在处理您的请求',
          isActive: true
        };
      case 'success':
        return {
          dotColor: 'bg-emerald-400',
          statusText: '已执行',
          subText: '相关设备联动已调度生效',
          isActive: false
        };
      case 'unclear':
        return {
          dotColor: 'bg-[#FF6500]',
          statusText: '未听清',
          subText: '请点击重试或再次说出指令',
          isActive: false
        };
      case 'idle':
      default:
        return {
          dotColor: 'bg-emerald-400',
          statusText: '待命',
          subText: '直接说出指令或轻触声波对话',
          isActive: false
        };
    }
  };

  const status = getStatusInfo();

  // 核心高科技动态声波渲染（Canvas 硬件加速）
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      phase += 0.05;
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // 计算基础参数
      const isListening = voiceState === 'listening';
      const isThinking = voiceState === 'thinking';
      const isIdle = voiceState === 'idle' || voiceState === 'success';

      const barCount = 68; // 密集科技声波频谱柱
      const barWidth = 3;
      const gap = (width - barCount * barWidth) / (barCount - 1);

      // 绘制中心基准发光导轨微线
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 101, 0, 0.15)';
      ctx.lineWidth = 1;
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // 绘制左右两侧和中间的声波频谱柱
      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + gap);
        const distFromCenter = Math.abs(i - barCount / 2) / (barCount / 2);
        // 高斯钟形衰减曲线
        const gaussian = Math.exp(-distFromCenter * distFromCenter * 3.2);

        let amplitude = 4;
        if (isListening) {
          // 语音高频跳跃
          const noise = Math.sin(i * 0.7 + phase * 4) * Math.cos(i * 0.3 + phase * 2);
          amplitude = (Math.abs(noise) * 24 + 6) * gaussian;
        } else if (isThinking) {
          // 思考流转波浪
          const wave = Math.sin(phase * 3 + i * 0.28) * 16 + 8;
          amplitude = Math.max(3, wave * gaussian);
        } else if (isIdle) {
          // 待命呼吸律动
          const breath = Math.sin(phase * 1.5 + i * 0.15) * 6 + 4;
          amplitude = Math.max(2, breath * gaussian);
        }

        const barHeight = Math.max(3, amplitude);

        // 颜色渐变：根据状态和振幅在品牌橙与流光金之间渐变
        const alpha = isListening ? 0.95 : isThinking ? 0.85 : 0.45;
        const color =
          i % 4 === 0
            ? `rgba(255, 140, 50, ${alpha})`
            : `rgba(255, 101, 0, ${alpha})`;

        ctx.fillStyle = color;
        ctx.shadowColor = '#FF6500';
        ctx.shadowBlur = isListening ? 12 : isThinking ? 8 : 4;

        // 细长圆角矩形胶囊柱
        const rx = 1.5;
        const topY = centerY - barHeight;
        const bottomY = centerY + barHeight;
        const h = barHeight * 2;

        ctx.beginPath();
        ctx.roundRect(x, topY, barWidth, h, rx);
        ctx.fill();

        // 在部分特定节点绘制高科技微点装饰（参考截图中的 `-=-||--=--||---=||` 科技符号感）
        if (i % 6 === 0 && barHeight > 8) {
          ctx.beginPath();
          ctx.arc(x + barWidth / 2, topY - 4, 1.2, 0, Math.PI * 2);
          ctx.arc(x + barWidth / 2, bottomY + 4, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = '#FF9E4A';
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [voiceState]);

  // 6 组完全对齐用户参考截图的指令药丸
  const quickChips = [
    '点歌: 青花瓷',
    '打开设备列表',
    '空调控制',
    '场景列表',
    '回家模式',
    '打开客厅灯'
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center py-2 select-none shrink-0 z-10">
      {/* 1. 状态指示行：例如 “● 思考中  AI 正在处理您的请求” */}
      <div className="flex items-center gap-2.5 mb-2 font-sans">
        <span
          className={`w-2 h-2 rounded-full ${status.dotColor} ${
            status.isActive
              ? 'animate-ping shadow-[0_0_12px_#FF6500]'
              : 'shadow-[0_0_6px_rgba(52,211,153,0.8)]'
          }`}
        />
        <span className="text-sm font-bold text-white tracking-wider">
          {status.statusText}
        </span>
        <span className="text-xs text-zinc-400 font-medium ml-1">
          {status.subText}
        </span>
      </div>

      {/* 实时语音打字机文字显示 */}
      {liveSttText && (
        <div className="mb-2 py-1 px-4 rounded-full bg-[#FF6500]/15 border border-[#FF6500]/50 text-xs font-bold text-[#FF6500] animate-fade-in shadow-[0_0_15px_rgba(255,101,0,0.3)] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6500] animate-ping" />
          <span>识别中: “{liveSttText}”</span>
        </div>
      )}

      {/* 2. 核心科技声波区域：
          不再生硬粘贴方形Logo，而是打造极具未来感的发光声纹律动带 + 居中悬浮的科技声学触控核心（橙色流光光晕） */}
      <div
        onClick={onActivate}
        className="relative group cursor-pointer my-1 flex items-center justify-center w-full max-w-[720px] h-[72px]"
        title="点击轻触开始语音指令"
      >
        {/* 背景声学发光微带 */}
        <div className="absolute inset-x-12 h-8 bg-gradient-to-r from-transparent via-[#FF6500]/15 to-transparent blur-xl pointer-events-none group-hover:via-[#FF6500]/30 transition-all duration-500" />

        {/* 核心动态频谱 Canvas (左右宽幅波纹) */}
        <canvas
          ref={canvasRef}
          width={640}
          height={68}
          className="w-full max-w-[640px] h-[68px] z-10 pointer-events-none"
        />

        {/* 中央悬浮科技声学能量核心（科技风环形光圈，非贴图） */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center pointer-events-none">
          {/* 外围微旋转科技虚线环 */}
          <div
            className={`w-14 h-14 rounded-full border border-[#FF6500]/30 border-dashed transition-all duration-700 ${
              voiceState === 'listening'
                ? 'scale-125 border-[#FF6500] animate-spin'
                : voiceState === 'thinking'
                ? 'scale-110 animate-spin-slow border-[#FF6500]/60'
                : 'scale-90 group-hover:scale-105 group-hover:border-[#FF6500]/60'
            }`}
          />

          {/* 内部高科技能量光核 */}
          <div
            className={`absolute w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF6500] to-amber-400 p-[1px] shadow-[0_0_20px_rgba(255,101,0,0.5)] transition-transform duration-300 ${
              voiceState === 'listening'
                ? 'scale-110 animate-pulse'
                : 'group-hover:scale-110'
            }`}
          >
            <div className="w-full h-full rounded-full bg-[#090A0E] flex items-center justify-center">
              {/* 内层微光能量核心点 */}
              <div
                className={`w-2.5 h-2.5 rounded-full bg-[#FF6500] transition-all ${
                  voiceState === 'listening'
                    ? 'scale-125 shadow-[0_0_12px_#FF6500]'
                    : 'shadow-[0_0_6px_#FF6500]'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. 快捷指令药丸栏（高科技暗黑磨砂玻璃质感，橙色边缘光泽） */}
      <div className="flex items-center justify-center gap-2.5 flex-wrap mt-2 max-w-[900px]">
        {quickChips.map((chip) => (
          <button
            key={chip}
            onClick={() => onQuickPrompt(chip)}
            className="px-4 py-1.5 rounded-xl bg-[#0F1117]/80 hover:bg-[#161922] border border-white/[0.08] hover:border-[#FF6500]/60 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-95 shadow-[0_2px_10px_rgba(0,0,0,0.4)] hover:shadow-[0_0_15px_rgba(255,101,0,0.25)] flex items-center gap-1.5"
          >
            <span>{chip}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

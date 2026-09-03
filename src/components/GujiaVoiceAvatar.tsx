import React, { useState, useEffect } from 'react';
import { VoiceStateType } from '../types';
import GujiaLogo from './GujiaLogo';

interface GujiaVoiceAvatarProps {
  voiceState: VoiceStateType;
  onClick?: () => void;
  className?: string;
}

export default function GujiaVoiceAvatar({
  voiceState,
  onClick,
  className = ''
}: GujiaVoiceAvatarProps) {
  const [waveOffsets, setWaveOffsets] = useState({ roof: 0, body: 0 });
  const [pulseRipples, setPulseRipples] = useState<number[]>([1, 2, 3]);

  // 动态律动计算：聆听时内部笔画与外部声波同频波动
  useEffect(() => {
    let animFrame: number;
    let t = 0;

    const loop = () => {
      t += 0.08;
      if (voiceState === 'listening') {
        setWaveOffsets({
          roof: Math.sin(t * 3.5) * 4.5,
          body: Math.sin(t * 3.5 + 0.8) * 3.5
        });
      } else if (voiceState === 'thinking') {
        setWaveOffsets({
          roof: Math.sin(t * 6) * 2,
          body: Math.cos(t * 6) * 2
        });
      } else if (voiceState === 'waking') {
        setWaveOffsets({
          roof: Math.sin(t * 4) * 3,
          body: 0
        });
      } else {
        setWaveOffsets({ roof: 0, body: 0 });
      }
      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, [voiceState]);

  // 状态光晕与缩放计算
  const isListening = voiceState === 'listening';
  const isThinking = voiceState === 'thinking';
  const isWaking = voiceState === 'waking';

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center cursor-pointer select-none group py-4 ${className}`}
      title="点击唤醒或发起语音对话"
    >
      {/* 外部动态扩散声波环（采用与图标同构的橙色圆角方环，专为聆听动感打造） */}
      {(isListening || isWaking) && (
        <>
          <div className="absolute w-[124px] h-[124px] rounded-[38px] border-2 border-[#FF6500]/60 bg-[#FF6500]/10 animate-ping pointer-events-none" />
          <div
            className="absolute w-[148px] h-[148px] rounded-[44px] border border-[#FF6500]/40 bg-[#FF6500]/5 pointer-events-none animate-pulse"
            style={{ animationDuration: '1.2s' }}
          />
          <div
            className="absolute w-[172px] h-[172px] rounded-[52px] border border-[#FF6500]/20 pointer-events-none"
            style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}
          />
        </>
      )}

      {/* 思考状态下的聚拢收束微光 */}
      {isThinking && (
        <div className="absolute w-[130px] h-[130px] rounded-[40px] border-2 border-[#FF6500]/60 bg-[#FF6500]/15 animate-spin-slow pointer-events-none shadow-[0_0_30px_rgba(255,101,0,0.3)]" />
      )}

      {/* 待机状态下的轻微温暖橙色底晕 */}
      <div
        className={`absolute w-[100px] h-[100px] rounded-[32px] bg-[#FF6500]/20 blur-xl transition-all duration-700 pointer-events-none ${
          isListening
            ? 'scale-150 opacity-100 bg-[#FF6500]/40 blur-2xl'
            : isThinking
            ? 'scale-125 opacity-80 bg-[#FF6500]/30'
            : 'scale-100 opacity-40 group-hover:scale-110 group-hover:opacity-70'
        }`}
      />

      {/* 核心谷家品牌橙色图标（带呼吸动量与点击微弹跳） */}
      <div
        className={`relative z-10 transition-all duration-300 transform active:scale-95 ${
          isListening
            ? 'scale-105 shadow-[0_0_40px_rgba(255,101,0,0.5)]'
            : isThinking
            ? 'scale-100 shadow-[0_0_25px_rgba(255,101,0,0.35)]'
            : isWaking
            ? 'scale-110 shadow-[0_0_35px_rgba(255,101,0,0.6)]'
            : 'scale-100 hover:scale-105 shadow-[0_0_20px_rgba(255,101,0,0.25)]'
        }`}
      >
        <GujiaLogo
          size={100}
          roofOffset={waveOffsets.roof}
          bodyOffset={waveOffsets.body}
          className="transition-transform"
        />
      </div>

      {/* 两侧伴随对称的 4 柱语音跳动脉冲（纯正品牌橙色，增强声波对话感） */}
      {isListening && (
        <>
          {/* 左侧声纹音频柱 */}
          <div className="absolute -left-16 flex items-center gap-1.5 h-12">
            <span className="w-1.5 h-4 bg-[#FF6500] rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
            <span className="w-1.5 h-8 bg-[#FF6500] rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
            <span className="w-1.5 h-10 bg-[#FF6500] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <span className="w-1.5 h-6 bg-[#FF6500] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>

          {/* 右侧声纹音频柱 */}
          <div className="absolute -right-16 flex items-center gap-1.5 h-12">
            <span className="w-1.5 h-6 bg-[#FF6500] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            <span className="w-1.5 h-10 bg-[#FF6500] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <span className="w-1.5 h-8 bg-[#FF6500] rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
            <span className="w-1.5 h-4 bg-[#FF6500] rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
          </div>
        </>
      )}
    </div>
  );
}

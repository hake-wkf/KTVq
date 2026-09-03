import React, { useState, useEffect } from 'react';
import { VoiceStateType } from '../types';
import GujiaVoiceAvatar from './GujiaVoiceAvatar';

interface VoiceStatusWaveProps {
  voiceState: VoiceStateType;
  onAvatarClick: () => void;
  onQuickPrompt: (prompt: string) => void;
  liveSttText?: string;
}

export default function VoiceStatusWave({
  voiceState,
  onAvatarClick,
  onQuickPrompt,
  liveSttText = ''
}: VoiceStatusWaveProps) {
  // 模拟音频条随机振幅，随状态动态波动
  const [leftBars, setLeftBars] = useState<number[]>([4, 8, 14, 6, 18, 10, 24, 12, 6, 16, 20, 8, 4]);
  const [rightBars, setRightBars] = useState<number[]>([4, 8, 20, 16, 6, 12, 24, 10, 18, 6, 14, 8, 4]);

  useEffect(() => {
    let timer: any;
    if (voiceState === 'listening') {
      timer = setInterval(() => {
        setLeftBars(Array.from({ length: 14 }, () => Math.floor(Math.random() * 24 + 4)));
        setRightBars(Array.from({ length: 14 }, () => Math.floor(Math.random() * 24 + 4)));
      }, 120);
    } else if (voiceState === 'thinking') {
      timer = setInterval(() => {
        setLeftBars(Array.from({ length: 14 }, (_, i) => Math.floor(Math.sin(Date.now() / 200 + i) * 8 + 12)));
        setRightBars(Array.from({ length: 14 }, (_, i) => Math.floor(Math.cos(Date.now() / 200 + i) * 8 + 12)));
      }, 150);
    } else {
      // 待命状态：平稳微波
      setLeftBars([4, 6, 8, 6, 10, 8, 12, 8, 6, 10, 8, 6, 4]);
      setRightBars([4, 6, 8, 10, 6, 8, 12, 8, 10, 6, 8, 6, 4]);
    }
    return () => clearInterval(timer);
  }, [voiceState]);

  // 状态显示元数据
  const getMeta = () => {
    switch (voiceState) {
      case 'waking':
        return { dotColor: 'bg-[#FF6500]', label: '唤醒中', sub: '小谷在呢，请对我说话...', isLive: true };
      case 'listening':
        return { dotColor: 'bg-[#FF6500]', label: '聆听中', sub: '正在倾听您的语音指令...', isLive: true };
      case 'thinking':
        return { dotColor: 'bg-[#FF6500]', label: '思考中', sub: 'AI 正在处理您的请求', isLive: true };
      case 'success':
        return { dotColor: 'bg-emerald-400', label: '已完成', sub: '指令已为您执行完毕', isLive: false };
      case 'unclear':
        return { dotColor: 'bg-[#FF6500]', label: '未识别', sub: '没听清，请再说一次', isLive: false };
      case 'idle':
      default:
        return { dotColor: 'bg-emerald-400', label: '待命', sub: '等待唤醒或点击下方指令', isLive: false };
    }
  };

  const meta = getMeta();

  // 截图中的 6 个典型快捷指令
  const quickChips = [
    '点歌: 青花瓷',
    '打开设备列表',
    '空调控制',
    '场景列表',
    '回家模式',
    '打开客厅灯'
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center py-2 select-none shrink-0">
      {/* 1. 状态文本行：例如 “● 思考中  AI 正在处理您的请求” */}
      <div className="flex items-center gap-2 mb-2 font-sans">
        <span
          className={`w-2 h-2 rounded-full ${meta.dotColor} ${
            meta.isLive ? 'animate-ping shadow-[0_0_10px_#FF6500]' : 'shadow-[0_0_6px_rgba(52,211,153,0.8)]'
          }`}
        />
        <span className="text-sm font-bold text-white tracking-wide">
          {meta.label}
        </span>
        <span className="text-xs text-zinc-400 font-medium ml-1">
          {meta.sub}
        </span>
      </div>

      {/* 实时语音打字机识别文字 */}
      {liveSttText && (
        <div className="mb-2 py-1 px-4 rounded-full bg-[#FF6500]/15 border border-[#FF6500]/50 text-xs font-bold text-[#FF6500] animate-fade-in shadow-[0_0_15px_rgba(255,101,0,0.3)]">
          识别中: “{liveSttText}”
        </div>
      )}

      {/* 2. 核心动态声波音频条 + 谷家橙色Logo主体 */}
      <div className="flex items-center justify-center gap-4 my-1">
        {/* 左侧均衡器音频条 */}
        <div className="flex items-center gap-1 h-10">
          {leftBars.map((height, i) => (
            <span
              key={'l-' + i}
              className="w-1 bg-[#FF6500] rounded-full transition-all duration-150 opacity-80"
              style={{
                height: `${height}px`,
                boxShadow: '0 0 6px rgba(255, 101, 0, 0.4)'
              }}
            />
          ))}
        </div>

        {/* 中央谷家品牌Logo动效交互主体 */}
        <div
          onClick={onAvatarClick}
          className="cursor-pointer active:scale-95 transition-transform"
          title="点击轻触说话"
        >
          <GujiaVoiceAvatar voiceState={voiceState} />
        </div>

        {/* 右侧均衡器音频条 */}
        <div className="flex items-center gap-1 h-10">
          {rightBars.map((height, i) => (
            <span
              key={'r-' + i}
              className="w-1 bg-[#FF6500] rounded-full transition-all duration-150 opacity-80"
              style={{
                height: `${height}px`,
                boxShadow: '0 0 6px rgba(255, 101, 0, 0.4)'
              }}
            />
          ))}
        </div>
      </div>

      {/* 3. 快捷建议指令药丸行：点歌: 青花瓷 | 打开设备列表 | 空调控制 | 场景列表 | 回家模式 | 打开客厅灯 */}
      <div className="flex items-center justify-center gap-2.5 flex-wrap mt-2.5 max-w-[900px]">
        {quickChips.map((chip) => (
          <button
            key={chip}
            onClick={() => onQuickPrompt(chip)}
            className="px-4 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#FF6500]/50 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}

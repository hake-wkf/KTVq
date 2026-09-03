import React from 'react';
import { Wifi, Settings } from 'lucide-react';
import { VoiceStateType } from '../types';

interface HeaderBarProps {
  timeString: string;
  dateString: string;
  onOpenSettings: () => void;
  voiceState?: VoiceStateType;
}

export default function HeaderBar({
  timeString,
  dateString,
  onOpenSettings,
  voiceState = 'idle'
}: HeaderBarProps) {
  const getStatusDisplay = () => {
    switch (voiceState) {
      case 'waking':
      case 'listening':
        return { text: '聆听中', color: 'bg-cyan-400', ping: true, shadow: '' };
      case 'thinking':
        return { text: '思考中', color: 'bg-sky-400', ping: true, shadow: '' };
      case 'success':
        return { text: '已执行', color: 'bg-cyan-400', ping: false, shadow: '' };
      case 'idle':
      default:
        return { text: '待命', color: 'bg-zinc-400', ping: false, shadow: '' };
    }
  };

  const status = getStatusDisplay();

  return (
    <header className="h-[54px] px-8 bg-transparent flex items-center justify-between shrink-0 z-30 select-none border-b border-white/[0.04]">
      {/* 左侧：时间与日期 (格式例如: 17:20   9月3日周四) */}
      <div className="flex items-center gap-3 font-mono">
        <span className="text-xl lg:text-2xl font-black text-white tracking-tight">
          {timeString}
        </span>
        <span className="text-xs text-zinc-400 font-medium">
          {dateString}
        </span>
      </div>

      {/* 中间：系统标题 */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold tracking-widest text-zinc-300 font-sans">
          AI · 智能家居系统
        </span>
      </div>

      {/* 右侧：WiFi + 电量/信号 87% + 状态指示 (● 待命) + 设置 */}
      <div className="flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-2.5 text-zinc-300">
          <Wifi size={16} className="text-zinc-300" />
          <span className="font-semibold text-zinc-300">87%</span>
        </div>

        {/* 状态点与文本：● 待命 / 思考中 / 聆听中 */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-white/10 text-zinc-300">
          <span
            className={`w-2 h-2 rounded-full ${status.color} ${status.shadow} ${
              status.ping ? 'animate-ping' : ''
            }`}
          />
          <span className="font-sans font-semibold text-xs tracking-wide">
            {status.text}
          </span>
        </div>

        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer border border-white/10 ml-1"
          title="系统设置"
        >
          <Settings size={14} />
        </button>
      </div>
    </header>
  );
}

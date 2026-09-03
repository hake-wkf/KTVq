import React from 'react';
import { MessageSquareText, Disc, LayoutGrid, Star } from 'lucide-react';
import { ActivePage } from '../types';

interface BottomDockProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  isPlayingMusic?: boolean;
}

export default function BottomDock({
  activePage,
  onNavigate,
  isPlayingMusic = false
}: BottomDockProps) {
  const tabs = [
    {
      id: 'voice' as ActivePage,
      label: 'AI 对话',
      icon: MessageSquareText
    },
    {
      id: 'music' as ActivePage,
      label: '音乐',
      icon: Disc
    },
    {
      id: 'device-list' as ActivePage,
      label: '设备',
      icon: LayoutGrid
    },
    {
      id: 'scene-list' as ActivePage,
      label: '场景',
      icon: Star
    }
  ];

  return (
    <div className="flex justify-center items-center py-2 shrink-0 z-40 select-none">
      <div className="bg-[#12141B]/95 border border-white/[0.08] backdrop-blur-2xl px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.85)] relative">
        {tabs.map((tab) => {
          const isActive =
            tab.id === 'voice'
              ? activePage === 'voice'
              : tab.id === 'device-list'
              ? activePage === 'device-list' || activePage === 'device-control'
              : activePage === tab.id;

          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`px-5 py-2 rounded-xl transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-w-[80px] relative active:scale-95 ${
                isActive
                  ? 'bg-white/[0.08] border border-white/[0.12] text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] border border-transparent font-medium'
              }`}
            >
              <Icon
                size={18}
                className={`transition-colors ${
                  isActive
                    ? 'text-cyan-400'
                    : tab.id === 'music' && isPlayingMusic
                    ? 'text-zinc-300'
                    : 'text-zinc-400'
                }`}
              />
              <span className="text-xs mt-1 tracking-wider whitespace-nowrap font-sans">
                {tab.label}
              </span>

              {/* 音乐在后台播放时的小状态点 */}
              {tab.id === 'music' && isPlayingMusic && !isActive && (
                <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-cyan-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

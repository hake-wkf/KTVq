import React, { useState, useEffect, useRef } from 'react';
import { Mic, Music2, Lightbulb, Sparkles } from 'lucide-react';
import { VoiceMessage, ActivePage, VoiceStateType, Device, Scene, Song } from '../types';
import LuminousVoiceOrb from './LuminousVoiceOrb';

interface VoiceDialoguePageProps {
  messages: VoiceMessage[];
  onSendMessage: (text: string) => void;
  voiceState: VoiceStateType;
  setVoiceState: (state: VoiceStateType) => void;
  onNavigate: (page: ActivePage) => void;
  currentSongTitle?: string;
  devices?: Device[];
  scenes?: Scene[];
  currentSong?: Song;
  isPlayingMusic?: boolean;
  onToggleMusic?: () => void;
  onNextSong?: () => void;
  onPrevSong?: () => void;
  onToggleDevice?: (id: string) => void;
  onTriggerScene?: (id: string) => void;
}

export default function VoiceDialoguePage({
  messages,
  onSendMessage,
  voiceState,
  setVoiceState,
  onNavigate
}: VoiceDialoguePageProps) {
  const [liveSttText, setLiveSttText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // 按照需求 1：AI 对话高亮记录显示两条（一问一答）
  // 找出最新的一条用户提问和最新的一条小谷回复
  const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user') || {
    id: 'user-default',
    sender: 'user',
    text: '打开卧室空调，设置28度',
    timestamp: '17:20'
  };

  const lastAiMsg = [...messages].reverse().find((m) => m.sender === 'ai') || {
    id: 'ai-default',
    sender: 'ai',
    text: '好的，已为您开启卧室空调，温度已设定为 28°C。',
    timestamp: '17:20',
    intentType: 'toggle_device',
    actionPayload: { deviceName: '卧室空调990F02', deviceState: true }
  };

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, voiceState, liveSttText]);

  // 模拟自然语音输入交互
  const handleSimulateVoice = (sampleText: string) => {
    if (sampleText.includes('设备列表')) {
      onNavigate('device-list');
      return;
    }
    if (sampleText.includes('场景列表')) {
      onNavigate('scene-list');
      return;
    }

    setVoiceState('waking');
    setLiveSttText('');

    setTimeout(() => {
      setVoiceState('listening');

      let idx = 0;
      const interval = setInterval(() => {
        if (idx < sampleText.length) {
          setLiveSttText(sampleText.substring(0, idx + 1));
          idx++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setLiveSttText('');
            onSendMessage(sampleText);
          }, 240);
        }
      }, 45);
    }, 250);
  };

  // 点击中央光体或右下角麦克风按钮唤醒
  const handleToggleMic = () => {
    if (voiceState === 'listening' || voiceState === 'waking') {
      handleSimulateVoice('回家模式');
    } else {
      const candidates = [
        '打开客厅灯',
        '回家模式',
        '点歌: 晴天',
        '今天天气怎么样',
        '打开设备列表'
      ];
      const picked = candidates[Math.floor(Math.random() * candidates.length)];
      handleSimulateVoice(picked);
    }
  };

  // 5 个最高频高雅弱化建议说法（统一样式）
  const quickSuggestions = [
    '点歌: 晴天',
    '打开客厅灯',
    '回家模式',
    '设备列表',
    '场景列表'
  ];

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden text-white relative select-none font-sans px-10 py-3 w-full">
      {/* 1280 横屏青蓝流光科技底色 */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[360px] bg-cyan-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      {/* =========================================================
          1. 顶部偏中：中央语音体（青蓝流光）
          ========================================================= */}
      <div className="shrink-0 z-20 pt-1">
        <LuminousVoiceOrb
          voiceState={voiceState}
          onClick={handleToggleMic}
          liveSttText={liveSttText}
        />
      </div>

      {/* =========================================================
          2. 核心舞台：聚焦两条高亮记录（一问一答）
          ========================================================= */}
      <div className="flex-1 flex flex-col justify-center max-w-[960px] w-full mx-auto z-10 py-4">
        <div className="flex flex-col space-y-6 w-full">
          {/* 1. 用户提问 (一问) */}
          <div className="flex items-start gap-4 w-full">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg font-mono font-semibold shrink-0 select-none bg-white/[0.08] border border-white/[0.15] text-zinc-200 text-xs mt-1">
              我说
            </span>
            <div className="flex-1">
              {liveSttText ? (
                <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-white tracking-wide leading-snug">
                  “{liveSttText}”
                  <span className="inline-block w-2 h-5 bg-cyan-400 ml-1.5 animate-pulse align-middle" />
                </p>
              ) : (
                <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-zinc-200 tracking-wide leading-snug">
                  {lastUserMsg.text}
                </p>
              )}
            </div>
          </div>

          {/* 2. 小谷回答 (一答) */}
          <div className="flex flex-col items-start w-full">
            <div className="flex items-start gap-4 w-full">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono font-semibold shrink-0 select-none bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]" />
                小谷
              </span>

              <div className="flex-1">
                {liveSttText ? (
                  <p className="text-lg sm:text-xl text-zinc-400 font-normal leading-snug italic">
                    倾听指令中...
                  </p>
                ) : voiceState === 'thinking' ? (
                  <div className="flex items-center gap-2 text-cyan-300">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-xl font-medium text-cyan-200 ml-1">正在为您处理...</span>
                  </div>
                ) : (
                  <p className="text-2xl sm:text-3xl lg:text-[32px] font-semibold text-white tracking-wide leading-snug drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]">
                    {lastAiMsg.text}
                  </p>
                )}
              </div>
            </div>

            {/* 如果小谷回复包含设备/场景/音乐执行操作，在答复下方展示微状态反馈卡 */}
            {!liveSttText && voiceState !== 'thinking' && lastAiMsg.actionPayload && (
              <div className="ml-16 mt-3 flex items-center gap-3 animate-fade-in">
                {lastAiMsg.intentType === 'toggle_device' && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141720] border border-white/[0.1] text-xs font-medium text-zinc-200 shadow-lg">
                    <Lightbulb size={15} className="text-cyan-400" />
                    <span className="font-semibold">{lastAiMsg.actionPayload.deviceName}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-cyan-300 font-semibold">
                      {lastAiMsg.actionPayload.deviceState ? '已开启' : '已关闭'}
                    </span>
                  </div>
                )}

                {lastAiMsg.intentType === 'trigger_scene' && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141720] border border-white/[0.1] text-xs font-medium text-zinc-200 shadow-lg">
                    <Sparkles size={15} className="text-cyan-400" />
                    <span className="font-semibold">{lastAiMsg.actionPayload.sceneName}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-cyan-300 font-semibold">
                      联动已生效
                    </span>
                  </div>
                )}

                {lastAiMsg.intentType === 'play_music' && lastAiMsg.actionPayload.songTitle && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141720] border border-white/[0.1] text-xs font-medium text-zinc-200 shadow-lg">
                    <Music2 size={15} className="text-cyan-400" />
                    <span className="font-semibold">{lastAiMsg.actionPayload.songTitle}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-300">{lastAiMsg.actionPayload.artist}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div ref={chatBottomRef} />
      </div>

      {/* =========================================================
          3. 底部区域：建议说法 + 右侧麦克风按钮
          深色低亮、克制优雅
          ========================================================= */}
      <div className="shrink-0 pt-2 pb-1 relative flex items-center justify-between max-w-[980px] w-full mx-auto z-20">
        {/* 左侧：弱化建议说法 */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-zinc-400 text-xs font-mono mr-1">建议说法:</span>
          {quickSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSimulateVoice(suggestion)}
              className="px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] text-zinc-300 hover:text-white text-xs font-normal transition-all cursor-pointer active:scale-95"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* 右侧：麦克风说话按钮 */}
        <div className="relative pl-3">
          <button
            onClick={handleToggleMic}
            className={`relative p-3 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center active:scale-95 border ${
              voiceState === 'listening' || voiceState === 'waking'
                ? 'bg-white text-black border-white shadow-lg scale-105'
                : voiceState === 'thinking'
                ? 'bg-white/[0.1] border-white/[0.2] text-white'
                : 'bg-[#151821] hover:bg-[#1C202B] border-white/[0.08] hover:border-white/[0.15] text-zinc-300 hover:text-white'
            }`}
            title={voiceState === 'listening' ? '正在倾听...' : '轻触对小谷说话'}
          >
            {voiceState === 'listening' ? (
              <div className="flex items-center gap-0.5 h-5 px-1">
                <span className="w-1 bg-black rounded-full h-3 animate-pulse" />
                <span className="w-1 bg-black rounded-full h-5 animate-pulse" style={{ animationDelay: '100ms' }} />
                <span className="w-1 bg-black rounded-full h-4 animate-pulse" style={{ animationDelay: '200ms' }} />
                <span className="w-1 bg-black rounded-full h-2 animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <Mic size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Play, Check, Mic, Sparkles, Home, LogOut, Moon, Film, BookOpen, Sun } from 'lucide-react';
import { Scene, ActivePage } from '../types';

interface SceneListPageProps {
  scenes: Scene[];
  onTriggerScene: (id: string) => void;
  onNavigate: (page: ActivePage) => void;
  onOpenVoice?: () => void;
}

interface SceneVisualData {
  id: string;
  name: string;
  area: string;
  subText: string;
  bgImg: string;
  gradientOverlay: string;
  ambientColor: string;
  iconName: string;
}

const DEFAULT_SCENES_VISUAL: SceneVisualData[] = [
  {
    id: 'scene-home',
    name: '回家模式',
    area: '全屋',
    subText: '开启玄关与客厅吊顶灯带，空调调至25℃，自动播放轻音乐',
    bgImg: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000&auto=format&fit=crop&q=85',
    gradientOverlay: 'from-cyan-950/70 via-[#0A111A]/85 to-[#06080C]',
    ambientColor: 'rgba(34, 211, 238, 0.35)',
    iconName: 'Home'
  },
  {
    id: 'scene-leave',
    name: '离家模式',
    area: '全屋',
    subText: '全屋灯光布帘一键关闭，空调进入低功耗待机，开启AI全屋安防',
    bgImg: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop&q=85',
    gradientOverlay: 'from-slate-950/80 via-[#0A0E16]/90 to-[#06080C]',
    ambientColor: 'rgba(148, 163, 184, 0.25)',
    iconName: 'LogOut'
  },
  {
    id: 'scene-sleep',
    name: '温馨睡眠',
    area: '主卧',
    subText: '关闭卧室主灯与射灯，保留脚底微光地灯，关闭遮光帘，空调开启睡眠静音',
    bgImg: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?w=1000&auto=format&fit=crop&q=85',
    gradientOverlay: 'from-indigo-950/75 via-[#080C18]/85 to-[#06080C]',
    ambientColor: 'rgba(99, 102, 241, 0.35)',
    iconName: 'Moon'
  },
  {
    id: 'scene-cinema',
    name: '客厅影院',
    area: '客厅',
    subText: '关闭客厅顶灯，调暗氛围灯带至15%，静音空调，自动开启功放与投影',
    bgImg: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=1000&auto=format&fit=crop&q=85',
    gradientOverlay: 'from-cyan-950/70 via-[#101328]/85 to-[#06080C]',
    ambientColor: 'rgba(56, 189, 248, 0.4)',
    iconName: 'Film'
  },
  {
    id: 'scene-focus',
    name: '专注阅读',
    area: '书房',
    subText: '书房调光灯切换至4000K自然中性光，照度自动提升至85%，伴随舒缓白噪音',
    bgImg: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=1000&auto=format&fit=crop&q=85',
    gradientOverlay: 'from-emerald-950/70 via-[#08151A]/85 to-[#06080C]',
    ambientColor: 'rgba(45, 212, 191, 0.35)',
    iconName: 'BookOpen'
  },
  {
    id: 'scene-wake',
    name: '清晨唤醒',
    area: '主卧',
    subText: '晨光智能窗帘缓慢开启50%，床头灯以晨曦暖光渐亮，播报今日天气与日程',
    bgImg: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1000&auto=format&fit=crop&q=85',
    gradientOverlay: 'from-amber-950/70 via-[#14120E]/85 to-[#06080C]',
    ambientColor: 'rgba(251, 191, 36, 0.35)',
    iconName: 'Sun'
  }
];

export default function SceneListPage({
  scenes = [],
  onTriggerScene,
  onNavigate,
  onOpenVoice
}: SceneListPageProps) {
  const [runningSceneId, setRunningSceneId] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('全屋');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const areas = ['全屋', '客厅', '主卧', '书房'];

  // 合并后台配置与富视觉背景数据
  const displayScenes: SceneVisualData[] = DEFAULT_SCENES_VISUAL.map((vis) => {
    const matched = scenes.find((s) => s.id === vis.id);
    if (matched) {
      return {
        ...vis,
        name: matched.name || vis.name,
        subText: matched.subText || matched.description || vis.subText,
        area: matched.area || vis.area
      };
    }
    return vis;
  });

  const filteredScenes =
    selectedArea === '全屋'
      ? displayScenes
      : displayScenes.filter((s) => s.area === selectedArea);

  const handleExecute = (id: string, name: string) => {
    setRunningSceneId(id);
    onTriggerScene(id);
    setToastMessage(`已为您执行场景：“${name}”`);
    setTimeout(() => {
      setRunningSceneId(null);
    }, 1300);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Home':
        return <Home size={16} />;
      case 'LogOut':
        return <LogOut size={16} />;
      case 'Moon':
        return <Moon size={16} />;
      case 'Film':
        return <Film size={16} />;
      case 'BookOpen':
        return <BookOpen size={16} />;
      case 'Sun':
        return <Sun size={16} />;
      default:
        return <Sparkles size={16} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#0A0B0E] text-white select-none relative">
      {/* 执行成功 Toast 浮层 */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-[#161922] border border-white/[0.12] text-white px-5 py-2 rounded-full shadow-2xl flex items-center gap-2 backdrop-blur-md animate-fade-in text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 核心展示区 */}
      <div className="flex-1 flex flex-col px-8 py-4 overflow-hidden z-10">
        {/* 区域选择标签栏与统计 */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.05] shrink-0">
          <div className="flex items-center gap-1.5 bg-[#12141A] p-1 rounded-xl border border-white/[0.06]">
            {areas.map((area) => {
              const isActive = selectedArea === area;
              return (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <span>{area}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-zinc-400 font-mono shrink-0">
            共 <span className="text-zinc-200 font-bold">{filteredScenes.length}</span> 个智能场景
          </div>
        </div>

        {/* 场景卡片网格列表 */}
        <div className="flex-1 my-3 overflow-y-auto no-scrollbar pr-1">
          <div className="grid grid-cols-3 gap-4">
            {filteredScenes.map((scene) => {
              const isRunning = runningSceneId === scene.id;

              return (
                <div
                  key={scene.id}
                  onClick={() => handleExecute(scene.id, scene.name)}
                  className={`group relative h-[175px] rounded-2xl overflow-hidden cursor-pointer border transition-all duration-200 active:scale-[0.98] flex flex-col justify-between p-5 bg-[#13161C] ${
                    isRunning
                      ? 'border-white/[0.2] shadow-lg'
                      : 'border-white/[0.06] hover:border-white/[0.12] hover:bg-[#181B22]'
                  }`}
                >
                  {/* 1. 高清室内实景大背景图 (带深色渐变覆盖，保证安静质感与文字清晰) */}
                  <img
                    src={scene.bgImg}
                    alt={scene.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-45 transition-opacity duration-300"
                  />

                  {/* 2. 场景深色遮罩 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-[#0B0D12]/80 to-[#0B0D12]/60" />

                  {/* 3. 正在执行时的微弱高亮 */}
                  {isRunning && (
                    <div className="absolute inset-0 bg-white/[0.05] pointer-events-none" />
                  )}

                  {/* 卡片头部：区域胶囊标签与右侧触发按键 */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.08] text-zinc-300 flex items-center justify-center">
                        {renderIcon(scene.iconName)}
                      </div>
                      <span className="text-[11px] font-mono font-medium text-zinc-400 bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.06]">
                        {scene.area}
                      </span>
                    </div>

                    {/* 右上角快捷执行指示器 */}
                    {isRunning ? (
                      <div className="w-7 h-7 rounded-full bg-white/[0.1] text-cyan-300 border border-white/[0.15] flex items-center justify-center">
                        <Check size={14} strokeWidth={2.5} />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.06] text-zinc-400 hover:text-white flex items-center justify-center transition-all">
                        <Play size={10} fill="currentColor" className="ml-0.5" />
                      </div>
                    )}
                  </div>

                  {/* 卡片底部：场景名称与执行设备联动说明 */}
                  <div className="relative z-10">
                    <h3 className="text-base font-bold text-zinc-100 group-hover:text-white transition-colors flex items-center gap-2">
                      <span>{scene.name}</span>
                      {isRunning && (
                        <span className="text-[11px] font-normal text-cyan-300">
                          执行中...
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {scene.subText}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 底部极简语音提示 */}
      <footer className="h-[46px] px-8 bg-[#0C0D11] border-t border-white/[0.05] flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>支持语音：“小谷同学，执行回家模式”、“开启温馨睡眠”</span>
        </div>
        <button
          onClick={onOpenVoice || (() => onNavigate('voice'))}
          className="text-xs text-zinc-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1 font-medium transition-colors"
        >
          <Mic size={13} />
          <span>语音对话 &gt;</span>
        </button>
      </footer>
    </div>
  );
}

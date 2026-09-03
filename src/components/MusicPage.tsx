import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Disc3,
  ListMusic,
  X,
  Mic,
  Check
} from 'lucide-react';
import { Song, ActivePage } from '../types';

interface MusicPageProps {
  songs?: Song[];
  currentSong?: Song;
  isPlaying?: boolean;
  onSelectSong?: (song: Song) => void;
  onTogglePlay?: () => void;
  onNextSong?: () => void;
  onPrevSong?: () => void;
  playbackProgress?: number;
  onNavigate: (page: ActivePage) => void;
  onOpenVoice?: () => void;
}

export default function MusicPage({
  songs = [],
  currentSong = {
    id: 'm1',
    title: '晴天',
    artist: '周杰伦',
    duration: '04:29',
    coverColor: 'from-cyan-500 to-sky-700'
  },
  isPlaying = true,
  onSelectSong,
  onTogglePlay,
  onNextSong,
  onPrevSong,
  onNavigate,
  onOpenVoice
}: MusicPageProps) {
  const [isPlaylistDrawerOpen, setIsPlaylistDrawerOpen] = useState(false);
  const [volume, setVolume] = useState<number>(65);
  const [isMuted, setIsMuted] = useState(false);
  const [playMode, setPlayMode] = useState<'loop' | 'shuffle'>('loop');

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#0A0B0E] text-white relative select-none">
      {/* 核心播放主体区 (大幅优化黑胶唱片与加大右侧操作栏，空间比例平衡美观) */}
      <div className="flex-1 px-14 py-6 flex items-center justify-center gap-16 overflow-hidden z-10">
        {/* 左侧：精美黑胶唱片 CD 展现 (逼真同心凹槽纹理、中心专辑封面、旋转动效、高保真唱臂) */}
        <div className="relative shrink-0 flex items-center justify-center">
          {/* 唱片外层唱机托盘底座微阴影 */}
          <div className="w-[360px] h-[360px] rounded-full bg-[#12141A] border border-white/[0.06] p-2 flex items-center justify-center shadow-[0_24px_60px_rgba(0,0,0,0.85)] relative">
            {/* 黑胶盘体 (旋转) */}
            <div
              className={`w-full h-full rounded-full bg-[#0D0E12] border-2 border-zinc-800 relative flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-700 ${
                isPlaying ? 'animate-[spin_20s_linear_infinite]' : ''
              }`}
            >
              {/* 黑胶微同心光泽纹理 (层层密致微同心圆) */}
              <div className="absolute inset-4 rounded-full border border-white/[0.04]" />
              <div className="absolute inset-8 rounded-full border border-white/[0.03]" />
              <div className="absolute inset-12 rounded-full border border-white/[0.04]" />
              <div className="absolute inset-16 rounded-full border border-white/[0.03]" />
              <div className="absolute inset-20 rounded-full border border-white/[0.04]" />
              <div className="absolute inset-24 rounded-full border border-white/[0.03]" />

              {/* 黑胶模拟反光条 (Conic 扇形高光扫光感) */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none opacity-40"
                style={{
                  background:
                    'conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.08) 50deg, transparent 90deg, rgba(255,255,255,0.06) 230deg, transparent 270deg)'
                }}
              />

              {/* 中心专辑圆标 (中心封面画芯) */}
              <div className="w-[140px] h-[140px] rounded-full overflow-hidden border-4 border-[#1E222B] shadow-inner relative flex items-center justify-center bg-zinc-900">
                <img
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80"
                  alt={currentSong.title}
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.5px]" />

                {/* 唱芯文字标 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                  <span className="text-white font-bold text-xs tracking-wider line-clamp-1 drop-shadow-md">
                    {currentSong.title}
                  </span>
                  <span className="text-[10px] text-zinc-300 font-medium line-clamp-1">
                    {currentSong.artist}
                  </span>
                </div>

                {/* 中心金属轴孔 */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 via-zinc-100 to-zinc-800 border-2 border-zinc-950 shadow-md flex items-center justify-center z-10">
                  <div className="w-3 h-3 rounded-full bg-[#0D0E12]" />
                </div>
              </div>
            </div>

            {/* 唱片机复古唱臂 (根据播放/暂停自动切换角度) */}
            <div
              className={`absolute -top-3 -right-2 w-28 h-36 pointer-events-none transition-transform duration-700 origin-top-right ${
                isPlaying ? 'rotate-[-8deg]' : 'rotate-[-32deg]'
              }`}
            >
              {/* 唱臂轴基座 */}
              <div className="absolute top-1 right-2 w-9 h-9 rounded-full bg-gradient-to-b from-zinc-600 to-zinc-900 border border-zinc-500/40 shadow-lg flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-zinc-400" />
              </div>
              {/* 唱臂金属杆 */}
              <div className="absolute top-7 right-6 w-1.5 h-24 bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-500 rounded-full shadow-md transform rotate-12" />
              {/* 唱针磁头 */}
              <div className="absolute bottom-2 left-6 w-4 h-7 bg-zinc-800 border border-zinc-500/50 rounded-sm shadow-md transform rotate-15" />
            </div>
          </div>
        </div>

        {/* 右侧：整体比例适中、布局严谨合理的操作控制台 */}
        <div className="flex-1 max-w-[480px] flex flex-col justify-center gap-6">
          {/* 歌曲主信息 */}
          <div className="space-y-1.5">
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
              {currentSong.title}
            </h2>
            <p className="text-base text-zinc-400 font-medium">
              {currentSong.artist}
            </p>
          </div>

          {/* 核心播放控制按钮群 (尺寸更大、触控更自如，车规级大屏布局) */}
          <div className="flex items-center gap-5 pt-2">
            {/* 播放模式切换 */}
            <button
              onClick={() => setPlayMode(playMode === 'loop' ? 'shuffle' : 'loop')}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors cursor-pointer border active:scale-95 ${
                playMode === 'shuffle'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-white/[0.04] text-zinc-400 hover:text-zinc-200 border-white/[0.08]'
              }`}
              title={playMode === 'loop' ? '列表循环' : '随机播放'}
            >
              {playMode === 'loop' ? <Repeat size={20} /> : <Shuffle size={20} />}
            </button>

            {/* 上一首 */}
            <button
              onClick={onPrevSong}
              className="w-14 h-14 rounded-2xl bg-[#171B24] hover:bg-[#202532] border border-white/[0.1] text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
              title="上一首"
            >
              <SkipBack size={24} />
            </button>

            {/* 播放 / 暂停 (加大为 76x76，居中聚焦) */}
            <button
              onClick={onTogglePlay}
              className="w-20 h-20 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black flex items-center justify-center transition-all cursor-pointer shadow-[0_0_25px_rgba(6,182,212,0.35)] active:scale-95"
              title={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? (
                <Pause size={32} strokeWidth={2.5} />
              ) : (
                <Play size={32} strokeWidth={2.5} className="ml-1" />
              )}
            </button>

            {/* 下一首 */}
            <button
              onClick={onNextSong}
              className="w-14 h-14 rounded-2xl bg-[#171B24] hover:bg-[#202532] border border-white/[0.1] text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
              title="下一首"
            >
              <SkipForward size={24} />
            </button>

            {/* 查看歌单按钮 */}
            <button
              onClick={() => setIsPlaylistDrawerOpen(true)}
              className="w-12 h-12 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
              title="查看歌单列表"
            >
              <ListMusic size={20} />
            </button>
          </div>

          {/* 音量控制栏 */}
          <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title={isMuted ? '恢复声音' : '静音'}
            >
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <div className="flex-1 flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/[0.1] rounded-lg"
              />
            </div>
            <span className="text-xs font-mono text-zinc-400 w-8 text-right shrink-0">
              {isMuted ? 0 : volume}%
            </span>
          </div>
        </div>
      </div>

      {/* 底部极简语音提示 */}
      <footer className="h-[46px] px-8 bg-[#0C0D11] border-t border-white/[0.05] flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>支持语音点歌：“小谷同学，放首七里香”、“播放周杰伦”、“暂停播放”</span>
        </div>
        <button
          onClick={onOpenVoice || (() => onNavigate('voice'))}
          className="text-xs text-zinc-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1 font-medium transition-colors"
        >
          <Mic size={13} />
          <span>语音对话 &gt;</span>
        </button>
      </footer>

      {/* 歌单侧边栏抽屉：只展示歌曲名称与作者 */}
      {isPlaylistDrawerOpen && (
        <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-fade-in">
          <div className="w-[360px] h-full bg-[#12141A] border-l border-white/[0.08] p-5 flex flex-col justify-between shadow-2xl">
            {/* 抽屉头部 */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <ListMusic size={18} className="text-zinc-400" />
                <h3 className="text-sm font-bold text-white">播放列表</h3>
                <span className="text-xs text-zinc-500 font-mono">({songs.length})</span>
              </div>
              <button
                onClick={() => setIsPlaylistDrawerOpen(false)}
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* 歌曲列表 (仅展示歌曲名称和作者) */}
            <div className="flex-1 my-3 overflow-y-auto space-y-1.5 no-scrollbar pr-1">
              {songs.map((song) => {
                const isSelected = song.id === currentSong.id;
                return (
                  <div
                    key={song.id}
                    onClick={() => {
                      if (onSelectSong) onSelectSong(song);
                      setIsPlaylistDrawerOpen(false);
                    }}
                    className={`px-3.5 py-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-white/[0.06] border-white/[0.12] text-white'
                        : 'bg-white/[0.02] hover:bg-white/[0.05] border-transparent text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isSelected ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-zinc-600" />
                      )}
                      <div>
                        <h4 className={`text-sm font-medium ${isSelected ? 'text-white font-semibold' : 'text-zinc-200'}`}>
                          {song.title}
                        </h4>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {song.artist}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[11px] text-cyan-300 font-mono">播放中</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 抽屉底部 */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500">
              <span>已载入全部歌曲</span>
              <span>共 5 首</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import HeaderBar from './components/HeaderBar';
import BottomDock from './components/BottomDock';
import VoiceDialoguePage from './components/VoiceDialoguePage';
import DeviceListPage from './components/DeviceListPage';
import DeviceControlPage from './components/DeviceControlPage';
import SceneListPage from './components/SceneListPage';
import MusicPage from './components/MusicPage';
import SettingsModal from './components/SettingsModal';
import { initialDevices, initialScenes, initialSongs } from './data';
import { ActivePage, Device, Scene, Song, VoiceMessage, VoiceStateType } from './types';
import { parseVoiceIntent } from './utils/voiceIntent';
import { Maximize2, Minimize2 } from 'lucide-react';

export default function App() {
  // 核心主屏默认为 AI 语音对话页，减少操作层级
  const [activePage, setActivePage] = useState<ActivePage>('voice');
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [scenes, setScenes] = useState<Scene[]>(initialScenes);
  const [songs] = useState<Song[]>(initialSongs);
  const [currentSong, setCurrentSong] = useState<Song>(initialSongs[0]);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(true);
  const [songIndex, setSongIndex] = useState<number>(0);
  const [selectedRoom, setSelectedRoom] = useState<string>('全部');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(initialDevices[0]?.id || 'd-ac1');

  // 时钟与日期 (与设计图 17:20 9月3日周四 对应)
  const [timeStr, setTimeStr] = useState<string>('17:20');
  const [dateStr, setDateStr] = useState<string>('9月3日周四');

  // 系统设置弹窗
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 全屏沉浸模式
  const [isFullScreen, setIsFullScreen] = useState(false);

  // AI 语音对话记录流
  const [voiceMessages, setVoiceMessages] = useState<VoiceMessage[]>([
    {
      id: 'vm-init',
      sender: 'ai',
      text: "你好，我是小谷，说'小谷同学'就能唤醒我。"
    }
  ]);
  const [voiceState, setVoiceState] = useState<VoiceStateType>('idle');

  // 实时时钟更新
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);

      const month = now.getMonth() + 1;
      const date = now.getDate();
      const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      setDateStr(`${month}月${date}日 ${days[now.getDay()]}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // 设备完整属性更新
  const handleUpdateDevice = (updatedDev: Device) => {
    setDevices((prev) =>
      prev.map((dev) => (dev.id === updatedDev.id ? updatedDev : dev))
    );
  };

  // 设备开关切换
  const handleToggleDevice = (id: string) => {
    setDevices((prev) =>
      prev.map((dev) => {
        if (dev.id === id) {
          const nextState = !dev.isOn;
          return {
            ...dev,
            isOn: nextState,
            statusText: nextState ? (dev.type === 'switch' ? '运行中' : '已开启') : '已关闭'
          };
        }
        return dev;
      })
    );
  };

  // 场景联动触发
  const handleTriggerScene = (sceneId: string) => {
    setScenes((prev) =>
      prev.map((sc) => ({
        ...sc,
        isActive: sc.id === sceneId
      }))
    );
  };

  // 音乐上一首 / 下一首
  const handleNextSong = () => {
    const nextIdx = (songIndex + 1) % songs.length;
    setSongIndex(nextIdx);
    setCurrentSong(songs[nextIdx]);
    setIsPlayingMusic(true);
  };

  const handlePrevSong = () => {
    const prevIdx = (songIndex - 1 + songs.length) % songs.length;
    setSongIndex(prevIdx);
    setCurrentSong(songs[prevIdx]);
    setIsPlayingMusic(true);
  };

  // 核心语音交互处理引擎
  const handleSendVoiceMessage = (rawText: string) => {
    // 1. 唤醒词专项响应
    if (rawText === '小谷同学') {
      const userMsg: VoiceMessage = {
        id: 'v-' + Date.now(),
        sender: 'user',
        text: '小谷同学'
      };
      setVoiceMessages((prev) => [...prev, userMsg]);
      setVoiceState('waking');
      setTimeout(() => {
        setVoiceState('listening');
        const aiMsg: VoiceMessage = {
          id: 'v-ai-' + Date.now(),
          sender: 'ai',
          text: '在呢，请问有什么可以帮您？'
        };
        setVoiceMessages((prev) => [...prev, aiMsg]);
      }, 550);
      return;
    }

    // 2. 模拟“没听清”专项响应
    if (rawText === '__UNCLEAR__' || rawText.includes('没听清')) {
      const userMsg: VoiceMessage = {
        id: 'v-' + Date.now(),
        sender: 'user',
        text: '...'
      };
      setVoiceMessages((prev) => [...prev, userMsg]);
      setVoiceState('unclear');
      setTimeout(() => {
        const aiMsg: VoiceMessage = {
          id: 'v-ai-' + Date.now(),
          sender: 'ai',
          text: '我没听清，请再说一次。'
        };
        setVoiceMessages((prev) => [...prev, aiMsg]);
      }, 400);
      setTimeout(() => {
        setVoiceState('idle');
      }, 2200);
      return;
    }

    // 3. 常规业务指令（点歌、开关设备、执行场景、跳转页面）
    const userMsg: VoiceMessage = {
      id: 'v-' + Date.now(),
      sender: 'user',
      text: rawText
    };
    setVoiceMessages((prev) => [...prev, userMsg]);
    setVoiceState('thinking');

    setTimeout(() => {
      const intent = parseVoiceIntent(rawText, devices, scenes, songs);

      // 1. 如果意图是点歌：切换歌曲并预备跳转
      if (intent.intentType === 'play_music' && intent.targetSong) {
        setCurrentSong(intent.targetSong);
        setIsPlayingMusic(true);
      }

      // 2. 如果意图是打开/关闭设备：直接操作对应设备
      if (intent.intentType === 'toggle_device' && intent.updatedDeviceId) {
        setDevices((prev) =>
          prev.map((d) => {
            if (d.id === intent.updatedDeviceId) {
              return {
                ...d,
                isOn: !!intent.updatedDeviceState,
                statusText: intent.updatedDeviceState ? '已开启' : '已关闭'
              };
            }
            return d;
          })
        );
      }

      // 3. 如果意图是执行场景：直接触发场景
      if (intent.intentType === 'trigger_scene' && intent.triggeredSceneId) {
        handleTriggerScene(intent.triggeredSceneId);
      }

      // 4. 添加 AI 消息记录流
      const aiMsg: VoiceMessage = {
        id: 'v-ai-' + Date.now(),
        sender: 'ai',
        text: intent.aiText,
        intentType: intent.intentType,
        actionPayload: intent.actionPayload
      };
      setVoiceMessages((prev) => [...prev, aiMsg]);

      // 触发主体执行成功脉冲与动效反馈
      setVoiceState('success');

      // 5. 如果包含自动页面跳转，给用户预留 900ms 观察对话流状态卡与成功脉冲
      if (intent.targetPage) {
        if (intent.actionPayload?.room) {
          setSelectedRoom(intent.actionPayload.room);
        }
        setTimeout(() => {
          setActivePage(intent.targetPage!);
          setVoiceState('idle');
        }, 950);
      } else {
        setTimeout(() => {
          setVoiceState('idle');
        }, 1600);
      }
    }, 650);
  };

  return (
    <div className="w-screen h-screen bg-[#050507] text-white font-sans flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden select-none relative">
      {/* 极简全屏/窗口视图模式按钮 */}
      <button
        onClick={() => setIsFullScreen(!isFullScreen)}
        className="absolute top-3 right-4 z-40 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-white/5"
        title="切换屏幕全屏沉浸显示"
      >
        {isFullScreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
        <span>{isFullScreen ? '窗口模式' : '1280×800 居中'}</span>
      </button>

      {/* =========================================================
          10寸中控屏工业级硬件外框 (标准 1280×800, 16:10 物理比例)
          ========================================================= */}
      <div
        className={`relative transition-all duration-300 flex flex-col items-center justify-center ${
          isFullScreen
            ? 'w-full h-full'
            : 'w-full max-w-[1280px] h-full max-h-[800px] aspect-[16/10]'
        }`}
      >
        {/* 硬件面板边框（包含双麦克风拾音开孔、高对比度与科技网格背景） */}
        <div className="w-full h-full bg-[#07080B] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px] rounded-[24px] border-[5px] border-zinc-800/90 shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden relative">
          {/* 硬件顶部机身刻痕微孔装饰 */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 pointer-events-none opacity-40">
            <span className="w-1 h-1 rounded-full bg-zinc-500" />
            <span className="w-1 h-1 rounded-full bg-zinc-500" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            <span className="w-1 h-1 rounded-full bg-zinc-500" />
            <span className="w-1 h-1 rounded-full bg-zinc-500" />
          </div>

          {/* =========================================================
              统一全局顶部 HeaderBar（按照截图：时间、系统标题、WiFi/状态/设置）
              ========================================================= */}
          <HeaderBar
            timeString={timeStr}
            dateString={dateStr}
            onOpenSettings={() => setIsSettingsOpen(true)}
            voiceState={voiceState}
          />

          {/* =========================================================
              核心页面容器
              ========================================================= */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* 1. AI 语音对话页 (截图核心主页：对话气泡、状态声波、快捷药丸) */}
            {activePage === 'voice' && (
              <VoiceDialoguePage
                messages={voiceMessages}
                onSendMessage={handleSendVoiceMessage}
                voiceState={voiceState}
                setVoiceState={setVoiceState}
                onNavigate={(page) => setActivePage(page)}
                currentSongTitle={currentSong.title}
                devices={devices}
                scenes={scenes}
                currentSong={currentSong}
                isPlayingMusic={isPlayingMusic}
                onToggleMusic={() => setIsPlayingMusic(!isPlayingMusic)}
                onNextSong={handleNextSong}
                onPrevSong={handlePrevSong}
                onToggleDevice={handleToggleDevice}
                onTriggerScene={handleTriggerScene}
              />
            )}

            {/* 2. 设备列表页 (极简车机质感，点击设备直接跳转详情页，无弹窗) */}
            {activePage === 'device-list' && (
              <DeviceListPage
                devices={devices}
                onToggleDevice={handleToggleDevice}
                onUpdateDevice={handleUpdateDevice}
                onNavigate={(page) => setActivePage(page)}
                defaultRoom={selectedRoom}
                onOpenVoice={() => setActivePage('voice')}
                onSelectDevice={(id) => {
                  setSelectedDeviceId(id);
                  setActivePage('device-control');
                }}
              />
            )}

            {/* 3. 具体设备专属详情控制页 (全屏页面展示，无弹窗) */}
            {activePage === 'device-control' && (
              <DeviceControlPage
                devices={devices}
                selectedDeviceId={selectedDeviceId}
                onSelectDevice={setSelectedDeviceId}
                onToggleDevice={handleToggleDevice}
                onUpdateDevice={handleUpdateDevice}
                onNavigate={(page) => setActivePage(page)}
                onOpenVoice={() => setActivePage('voice')}
              />
            )}

            {/* 4. 场景列表页 (按房间/区域分类展示) */}
            {activePage === 'scene-list' && (
              <SceneListPage
                scenes={scenes}
                onTriggerScene={handleTriggerScene}
                onNavigate={(page) => setActivePage(page)}
                onOpenVoice={() => setActivePage('voice')}
              />
            )}

            {/* 5. 歌曲播放页 (音乐播放、进度、歌单等) */}
            {activePage === 'music' && (
              <MusicPage
                songs={songs}
                currentSong={currentSong}
                isPlaying={isPlayingMusic}
                onSelectSong={(song) => {
                  setCurrentSong(song);
                  setIsPlayingMusic(true);
                }}
                onTogglePlay={() => setIsPlayingMusic(!isPlayingMusic)}
                onNextSong={handleNextSong}
                onPrevSong={handlePrevSong}
                playbackProgress={42}
                onNavigate={(page) => setActivePage(page)}
                onOpenVoice={() => setActivePage('voice')}
              />
            )}
          </div>

          {/* =========================================================
              全局底部悬浮 Dock（截图结构：[💬 AI对话] [💿 音乐] [⊞ 设备] [⭐ 场景]）
              ========================================================= */}
          <BottomDock
            activePage={activePage}
            onNavigate={(page) => setActivePage(page)}
            isPlayingMusic={isPlayingMusic}
          />
        </div>
      </div>

      {/* =========================================================
          全局设置弹窗（小程序绑定/解绑、网络设置）
          ========================================================= */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

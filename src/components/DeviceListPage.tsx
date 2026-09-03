import React, { useState } from 'react';
import {
  Power,
  ChevronRight,
  Lightbulb,
  Sun,
  Sparkles,
  ChevronLeft,
  Pause,
  SlidersHorizontal,
  Mic,
  Disc3
} from 'lucide-react';
import { Device, ActivePage } from '../types';

interface DeviceListPageProps {
  devices: Device[];
  onToggleDevice: (id: string) => void;
  onUpdateDevice?: (device: Device) => void;
  onNavigate: (page: ActivePage) => void;
  defaultRoom?: string;
  onOpenVoice?: () => void;
  onSelectDevice?: (deviceId: string) => void;
}

export default function DeviceListPage({
  devices,
  onToggleDevice,
  onUpdateDevice,
  onNavigate,
  defaultRoom = '全部',
  onOpenVoice,
  onSelectDevice
}: DeviceListPageProps) {
  const rooms = ['全部', '主卧', '客厅'];
  const [selectedRoom, setSelectedRoom] = useState<string>(
    rooms.includes(defaultRoom) ? defaultRoom : '全部'
  );

  // 过滤设备 (按房间筛选)
  const filteredDevices = devices.filter((d) => {
    return selectedRoom === '全部' ? true : d.room === selectedRoom || d.room.includes(selectedRoom);
  });

  const onCount = filteredDevices.filter((d) => d.isOn).length;

  // 点击卡片跳转进入对应详情页
  const handleGoDetail = (deviceId: string) => {
    if (onSelectDevice) {
      onSelectDevice(deviceId);
    }
    onNavigate('device-control');
  };

  // 空调温度调整
  const handleAdjustAcTemp = (dev: Device, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateDevice) return;
    const current = dev.targetTemp ?? dev.value ?? 28;
    const newTemp = Math.min(30, Math.max(16, current + delta));
    onUpdateDevice({
      ...dev,
      targetTemp: newTemp,
      value: newTemp,
      statusText: `制冷 ${newTemp}°C`
    });
  };

  // 窗帘控制 (全开、暂停、全关)
  const handleCurtainAction = (dev: Device, action: 'open' | 'pause' | 'close', e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateDevice) return;
    if (action === 'open') {
      onUpdateDevice({
        ...dev,
        curtainState: 'open',
        curtainPercent: 100,
        isOn: true,
        value: 100,
        statusText: '开启100%'
      });
    } else if (action === 'close') {
      onUpdateDevice({
        ...dev,
        curtainState: 'close',
        curtainPercent: 0,
        isOn: false,
        value: 0,
        statusText: '已关闭'
      });
    } else {
      onUpdateDevice({
        ...dev,
        curtainState: 'pause',
        statusText: `开合度 ${dev.curtainPercent ?? 50}%`
      });
    }
  };

  // 灯带参数调整
  const handleLightBrightnessChange = (dev: Device, val: number) => {
    if (!onUpdateDevice) return;
    onUpdateDevice({
      ...dev,
      brightness: val,
      value: val,
      isOn: val > 0,
      statusText: `亮度 ${val}% · 色温 ${dev.colorTemp ?? 45}%`
    });
  };

  const handleLightColorTempChange = (dev: Device, val: number) => {
    if (!onUpdateDevice) return;
    onUpdateDevice({
      ...dev,
      colorTemp: val,
      statusText: `亮度 ${dev.brightness ?? 80}% · 色温 ${val}%`
    });
  };

  // KTV功放音量调整 (0-20)
  const handleAdjustKtvVol = (dev: Device, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateDevice) return;
    const current = dev.accompanimentVol ?? dev.value ?? 14;
    const newVol = Math.min(20, Math.max(0, current + delta));
    onUpdateDevice({
      ...dev,
      accompanimentVol: newVol,
      value: newVol
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#0A0B0E] text-white select-none relative">
      {/* 顶部房间过滤 (克制车机质感，已移除图二快捷筛选栏) */}
      <div className="px-8 py-3 border-b border-white/[0.05] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 bg-[#12141A] p-1 rounded-xl border border-white/[0.06]">
          {rooms.map((room) => {
            const isActive = selectedRoom === room;
            return (
              <button
                key={room}
                onClick={() => setSelectedRoom(room)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                {room}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span>共 {filteredDevices.length} 台设备</span>
          <span className="text-zinc-600">·</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-zinc-200 font-mono font-medium">{onCount}</span>
            <span>台开启</span>
          </div>
        </div>
      </div>

      {/* 设备网格列表：骨架统一、内脏不同、开关/功放为经典触控大圆钮、卡片增高、彻底移除左下角文字 */}
      <div className="flex-1 px-8 py-3.5 overflow-y-auto no-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map((dev) => {
            const isOn = dev.isOn;

            return (
              <div
                key={dev.id}
                onClick={() => handleGoDetail(dev.id)}
                className={`h-[228px] rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-md relative group ${
                  isOn
                    ? 'bg-[#131622] hover:bg-[#161B2A] border border-white/[0.08] hover:border-cyan-500/30'
                    : 'bg-[#0E1017] hover:bg-[#12151F] border border-white/[0.04] opacity-75 hover:opacity-90'
                }`}
              >
                {/* 1. 统一头部：左侧图标+名称+房间，右侧统一电源切换键 */}
                <div className="flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isOn
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                          : 'bg-white/[0.03] text-zinc-500 border border-white/[0.06]'
                      }`}
                    >
                      {dev.type === 'curtain' && <SlidersHorizontal size={17} />}
                      {dev.type === 'switch' && <Lightbulb size={17} />}
                      {(dev.type === 'dimmer_light' || dev.type === 'light') && <Sun size={17} />}
                      {dev.type === 'ac' && <span className="text-xs font-semibold">{isOn ? '❄️' : '⚪'}</span>}
                      {dev.type === 'ktv_amp' && <Disc3 size={17} />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h3
                        className={`text-sm font-semibold tracking-wide truncate max-w-[130px] ${
                          isOn ? 'text-white' : 'text-zinc-400'
                        }`}
                      >
                        {dev.name}
                      </h3>
                      <span className="text-[11px] text-zinc-500 truncate">
                        {dev.room}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleDevice(dev.id);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      isOn
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.18)]'
                        : 'bg-white/[0.03] text-zinc-500 border border-white/[0.06] hover:text-zinc-300'
                    }`}
                  >
                    <Power size={12} className={isOn ? 'text-cyan-300' : 'text-zinc-500'} strokeWidth={2.2} />
                    <span>{isOn ? '开启' : '关闭'}</span>
                  </button>
                </div>

                {/* 2. 居中操控区 */}
                <div className="flex-1 flex flex-col justify-center my-2">
                  {/* --- 窗帘：标准三段控制组 --- */}
                  {dev.type === 'curtain' && (() => {
                    const percent = dev.curtainPercent ?? (isOn ? 75 : 0);
                    const isOpen = percent === 100 || dev.curtainState === 'open';
                    const isClose = percent === 0 || dev.curtainState === 'close' || !isOn;
                    const isPause = dev.curtainState === 'pause' && isOn;

                    return (
                      <div className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400">开合度</span>
                          <span className={`font-mono font-semibold ${isOn ? 'text-cyan-300' : 'text-zinc-500'}`}>
                            {percent}%
                          </span>
                        </div>
                        <div
                          className="w-full grid grid-cols-3 gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => handleCurtainAction(dev, 'open', e)}
                            className={`py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border active:scale-95 ${
                              isOpen && isOn
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                                : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.06] text-zinc-400'
                            }`}
                          >
                            打开
                          </button>
                          <button
                            onClick={(e) => handleCurtainAction(dev, 'pause', e)}
                            className={`py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border active:scale-95 ${
                              isPause && isOn
                                ? 'bg-white/[0.12] text-white border-white/20 font-semibold'
                                : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.06] text-zinc-400'
                            }`}
                          >
                            暂停
                          </button>
                          <button
                            onClick={(e) => handleCurtainAction(dev, 'close', e)}
                            className={`py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border active:scale-95 ${
                              isClose || !isOn
                                ? 'bg-zinc-800 text-zinc-400 border-zinc-700 font-semibold'
                                : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.06] text-zinc-400'
                            }`}
                          >
                            关闭
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* --- 开关：保持原状经典大圆纽 --- */}
                  {dev.type === 'switch' && (
                    <div className="flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleDevice(dev.id);
                        }}
                        className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
                          isOn
                            ? 'bg-cyan-500/15 border-2 border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08]'
                        }`}
                      >
                        <Lightbulb
                          size={28}
                          className={
                            isOn
                              ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                              : 'text-zinc-500'
                          }
                        />
                        <span
                          className={`text-xs font-semibold mt-1 ${
                            isOn ? 'text-white' : 'text-zinc-500'
                          }`}
                        >
                          {isOn ? '开' : '关'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* --- 功放外部：也是开关样式（经典大圆钮） --- */}
                  {dev.type === 'ktv_amp' && (
                    <div className="flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleDevice(dev.id);
                        }}
                        className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
                          isOn
                            ? 'bg-cyan-500/15 border-2 border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08]'
                        }`}
                      >
                        <Disc3
                          size={28}
                          className={
                            isOn
                              ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                              : 'text-zinc-500'
                          }
                        />
                        <span
                          className={`text-xs font-semibold mt-1 ${
                            isOn ? 'text-white' : 'text-zinc-500'
                          }`}
                        >
                          {isOn ? '开' : '关'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* --- 调光灯带：标准胶囊滑块 --- */}
                  {(dev.type === 'dimmer_light' || dev.type === 'light') && (() => {
                    const brightness = dev.brightness ?? dev.value ?? 80;

                    return (
                      <div
                        className="flex flex-col gap-2.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400">亮度</span>
                          <span className={`font-mono font-semibold ${isOn ? 'text-cyan-300' : 'text-zinc-500'}`}>
                            {isOn ? `${brightness}%` : '0%'}
                          </span>
                        </div>

                        <div className="h-8 w-full bg-black/40 border border-white/[0.08] rounded-full overflow-hidden relative flex items-center p-0.5">
                          <div
                            className={`h-full rounded-full transition-all duration-100 flex items-center justify-end pr-1 shadow-sm ${
                              isOn ? 'bg-cyan-400/80' : 'bg-zinc-800'
                            }`}
                            style={{ width: `${isOn ? Math.max(8, brightness) : 0}%` }}
                          >
                            <div className="w-1.5 h-5 rounded-full bg-zinc-900" />
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="100"
                            value={brightness}
                            disabled={!isOn}
                            onChange={(e) => handleLightBrightnessChange(dev, Number(e.target.value))}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    );
                  })()}

                  {/* --- 空调：标准双向步进器 --- */}
                  {dev.type === 'ac' && (() => {
                    const temp = dev.targetTemp ?? dev.value ?? 28;

                    return (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-xs text-zinc-400">
                          <span>制冷模式</span>
                          <span>自动风速</span>
                        </div>
                        <div
                          className="flex items-center justify-between px-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => handleAdjustAcTemp(dev, -1, e)}
                            disabled={!isOn}
                            className={`w-10 h-10 rounded-full border flex items-center justify-center text-xl font-light transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed ${
                              isOn
                                ? 'bg-white/[0.05] hover:bg-white/[0.1] border-white/[0.08] text-white'
                                : 'bg-white/[0.02] border-white/[0.04] text-zinc-600'
                            }`}
                          >
                            -
                          </button>

                          <div className="flex items-baseline font-mono">
                            <span
                              className={`text-3xl font-extrabold tracking-tight ${
                                isOn ? 'text-white' : 'text-zinc-600'
                              }`}
                            >
                              {temp}
                            </span>
                            <span className={`text-sm ml-0.5 font-medium ${isOn ? 'text-cyan-400' : 'text-zinc-600'}`}>
                              °C
                            </span>
                          </div>

                          <button
                            onClick={(e) => handleAdjustAcTemp(dev, 1, e)}
                            disabled={!isOn}
                            className={`w-10 h-10 rounded-full border flex items-center justify-center text-xl font-light transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed ${
                              isOn
                                ? 'bg-white/[0.05] hover:bg-white/[0.1] border-white/[0.08] text-white'
                                : 'bg-white/[0.02] border-white/[0.04] text-zinc-600'
                            }`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* 3. 统一底部：左下角文字彻底移除，只保留右侧轻量详情入口 */}
                <div className="flex items-center justify-end text-xs pt-2 border-t border-white/[0.04] shrink-0">
                  <div className="flex items-center gap-0.5 text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    <span>详情</span>
                    <ChevronRight size={13} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 底部系统状态栏 (已彻底删除“点击设备对应任意处...”等说明书文字) */}
      <footer className="h-[46px] px-8 bg-[#0C0D11] border-t border-white/[0.05] flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>智能中控实时在线 · 已连接 {filteredDevices.length} 台设备</span>
        </div>
        <button
          onClick={onOpenVoice || (() => onNavigate('voice'))}
          className="text-xs text-zinc-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1 font-medium transition-colors"
        >
          <Mic size={13} />
          <span>语音助手 &gt;</span>
        </button>
      </footer>
    </div>
  );
}

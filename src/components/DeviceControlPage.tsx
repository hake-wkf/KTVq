import React, { useState } from 'react';
import {
  ChevronLeft,
  Power,
  ChevronRight,
  Lightbulb,
  Sun,
  Sparkles,
  Pause,
  Mic,
  Volume2
} from 'lucide-react';
import { Device, ActivePage } from '../types';

interface DeviceControlPageProps {
  devices?: Device[];
  selectedDeviceId?: string;
  onSelectDevice?: (id: string) => void;
  onToggleDevice?: (id: string) => void;
  onUpdateDevice?: (device: Device) => void;
  onNavigate: (page: ActivePage) => void;
  onOpenVoice?: () => void;
}

const INPUT_SOURCES = [
  '蓝牙',
  'HDMI ARC',
  '同轴/光纤',
  'USB',
  'AUX 1',
  'AUX 2'
] as const;

// 模式严格保持用户指定的 5 种，不要改名字
const KTV_MODES = [
  '原声',
  '酒吧',
  '流行',
  '劲k',
  'party'
] as const;

export default function DeviceControlPage({
  devices = [],
  selectedDeviceId,
  onSelectDevice,
  onToggleDevice,
  onUpdateDevice,
  onNavigate,
  onOpenVoice
}: DeviceControlPageProps) {
  // 当前选中的设备
  const currentDevice =
    devices.find((d) => d.id === selectedDeviceId) || devices[0];

  const [activeTabDeviceId, setActiveTabDeviceId] = useState<string>(
    currentDevice ? currentDevice.id : devices[0]?.id || ''
  );

  const activeDevice =
    devices.find((d) => d.id === activeTabDeviceId) || currentDevice || devices[0];

  if (!activeDevice) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0A0B0E] text-white">
        <p className="text-zinc-400 text-sm">未找到对应设备</p>
        <button
          onClick={() => onNavigate('device-list')}
          className="mt-4 px-4 py-2 rounded-xl bg-white/[0.06] text-xs text-white cursor-pointer"
        >
          返回设备列表
        </button>
      </div>
    );
  }

  // 统一更新设备属性方法
  const updateDeviceAttr = (partial: Partial<Device>) => {
    if (!onUpdateDevice) return;
    onUpdateDevice({
      ...activeDevice,
      ...partial
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#0A0B0E] text-white select-none relative">
      {/* 顶部导航栏：返回列表 + 当前设备名称 + 主开关 (已移除图三横向列表) */}
      <div className="h-[60px] px-8 bg-[#0C0E13] border-b border-white/[0.06] flex items-center justify-between shrink-0 z-20">
        {/* 左侧：返回按钮与当前设备信息 */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('device-list')}
            className="h-9 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
            <span>返回列表</span>
          </button>

          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-white tracking-wide">
              {activeDevice.name}
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-zinc-400 text-[11px]">
              {activeDevice.room}
            </span>
          </div>
        </div>

        {/* 右侧：主电源开关 (统一规范：开启=青蓝点亮，关闭=灰色) */}
        <button
          onClick={() => onToggleDevice && onToggleDevice(activeDevice.id)}
          className={`h-9 px-3.5 rounded-xl flex items-center gap-2 border transition-all cursor-pointer ${
            activeDevice.isOn
              ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.18)]'
              : 'bg-white/[0.03] border-white/[0.06] text-zinc-500'
          }`}
        >
          <Power size={13} className={activeDevice.isOn ? 'text-cyan-300' : 'text-zinc-500'} />
          <span className="text-xs font-medium">
            {activeDevice.isOn ? '开启' : '关闭'}
          </span>
          <span
            className={`w-1.5 h-1.5 rounded-full ml-0.5 ${
              activeDevice.isOn ? 'bg-cyan-400' : 'bg-zinc-600'
            }`}
          />
        </button>
      </div>

      {/* 核心控制区域：统一单强调色（青蓝）规范 */}
      <div className="flex-1 px-8 py-5 overflow-y-auto no-scrollbar">
        {/* =========================================================
            1. 客厅 KTV 功放控制台 (先输入源, 再模式; 模式仅限 原声/酒吧/流行/劲k/party; 音量0-20)
            ========================================================= */}
        {activeDevice.type === 'ktv_amp' && (
          <div className="max-w-4xl mx-auto flex flex-col gap-5">
            {/* 第一层：输入源 */}
            <div className="rounded-2xl bg-[#13161F] border border-white/[0.08] p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-sm font-semibold text-zinc-200">
                  输入源
                </span>
                <span className="text-xs text-zinc-400">
                  当前: <span className="text-cyan-300 font-medium">{activeDevice.ktvSource || '蓝牙'}</span>
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {INPUT_SOURCES.map((src) => {
                  const isActive = (activeDevice.ktvSource || '蓝牙') === src;
                  return (
                    <button
                      key={src}
                      onClick={() => updateDeviceAttr({ ktvSource: src })}
                      className={`py-3 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center truncate border active:scale-95 ${
                        isActive
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.06] text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {src}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 第二层：模式 (模式严格为 原声;酒吧;流行;劲k;party 不要改名字，统一青蓝强调色) */}
            <div className="rounded-2xl bg-[#13161F] border border-white/[0.08] p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-sm font-semibold text-zinc-200">
                  模式
                </span>
                <span className="text-xs text-zinc-400">
                  当前模式: <span className="text-cyan-300 font-bold">{activeDevice.ktvMode || '原声'}</span>
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2.5">
                {KTV_MODES.map((mode) => {
                  const isActive = (activeDevice.ktvMode || '原声') === mode;
                  return (
                    <button
                      key={mode}
                      onClick={() => updateDeviceAttr({ ktvMode: mode })}
                      className={`py-4 px-2 rounded-xl text-sm font-bold transition-all cursor-pointer text-center border active:scale-95 ${
                        isActive
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-md'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.06] text-zinc-300 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 第三层：音量调节 (伴奏音乐音量、麦克风人声音量、混响空间音效全部为 0-20，统一青蓝滑轨) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 伴奏音乐音量 */}
              <div className="rounded-2xl bg-[#13161F] border border-white/[0.08] p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-semibold text-zinc-200">伴奏音乐音量</span>
                  <span className="font-mono text-zinc-400">0 ~ 20</span>
                </div>
                <div className="flex items-center justify-between my-2 px-2">
                  <button
                    onClick={() => {
                      const cur = activeDevice.accompanimentVol ?? 14;
                      updateDeviceAttr({ accompanimentVol: Math.max(0, cur - 1) });
                    }}
                    className="w-12 h-12 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-white text-2xl font-light flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  >
                    -
                  </button>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white font-mono">
                      {activeDevice.accompanimentVol ?? 14}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const cur = activeDevice.accompanimentVol ?? 14;
                      updateDeviceAttr({ accompanimentVol: Math.min(20, cur + 1) });
                    }}
                    className="w-12 h-12 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-white text-2xl font-light flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  >
                    +
                  </button>
                </div>
                <div className="pt-2">
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={activeDevice.accompanimentVol ?? 14}
                    onChange={(e) => updateDeviceAttr({ accompanimentVol: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/[0.1] rounded-lg"
                  />
                </div>
              </div>

              {/* 麦克风人声音量 (范围 0-20，统一青蓝) */}
              <div className="rounded-2xl bg-[#13161F] border border-white/[0.08] p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-semibold text-zinc-200">麦克风人声音量</span>
                  <span className="font-mono text-zinc-400">0 ~ 20</span>
                </div>
                <div className="flex items-center justify-between my-2 px-2">
                  <button
                    onClick={() => {
                      const cur = activeDevice.micVol ?? 16;
                      updateDeviceAttr({ micVol: Math.max(0, cur - 1) });
                    }}
                    className="w-12 h-12 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-white text-2xl font-light flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  >
                    -
                  </button>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white font-mono">
                      {activeDevice.micVol ?? 16}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const cur = activeDevice.micVol ?? 16;
                      updateDeviceAttr({ micVol: Math.min(20, cur + 1) });
                    }}
                    className="w-12 h-12 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-white text-2xl font-light flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  >
                    +
                  </button>
                </div>
                <div className="pt-2">
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={activeDevice.micVol ?? 16}
                    onChange={(e) => updateDeviceAttr({ micVol: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/[0.1] rounded-lg"
                  />
                </div>
              </div>

              {/* 混响音效 (范围 0-20，统一青蓝) */}
              <div className="rounded-2xl bg-[#13161F] border border-white/[0.08] p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-semibold text-zinc-200">混响音效</span>
                  <span className="font-mono text-zinc-400">0 ~ 20</span>
                </div>
                <div className="flex items-center justify-between my-2 px-2">
                  <button
                    onClick={() => {
                      const cur = activeDevice.micEffect ?? 12;
                      updateDeviceAttr({ micEffect: Math.max(0, cur - 1) });
                    }}
                    className="w-12 h-12 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-white text-2xl font-light flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  >
                    -
                  </button>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white font-mono">
                      {activeDevice.micEffect ?? 12}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const cur = activeDevice.micEffect ?? 12;
                      updateDeviceAttr({ micEffect: Math.min(20, cur + 1) });
                    }}
                    className="w-12 h-12 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-white text-2xl font-light flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  >
                    +
                  </button>
                </div>
                <div className="pt-2">
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={activeDevice.micEffect ?? 12}
                    onChange={(e) => updateDeviceAttr({ micEffect: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/[0.1] rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            2. 窗帘专属深度控制板 (已移除图一开合模拟视效，纯粹清晰控制)
            ========================================================= */}
        {activeDevice.type === 'curtain' && (
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <div className="rounded-3xl bg-[#141824] border border-white/[0.08] p-7 flex flex-col gap-6 shadow-xl">
              {/* 顶部状态与开合度显示 (青蓝统一强调色) */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 font-medium block mb-1">当前开合度</span>
                  <div className="flex items-baseline font-mono">
                    <span className="text-5xl font-extrabold text-white">
                      {activeDevice.curtainPercent ?? activeDevice.value ?? 75}
                    </span>
                    <span className="text-2xl text-cyan-400 ml-1">%</span>
                  </div>
                </div>

                <div
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
                    activeDevice.isOn
                      ? 'bg-cyan-400/10 border-cyan-400/30 text-cyan-300'
                      : 'bg-white/[0.03] border-white/10 text-zinc-500'
                  }`}
                >
                  {activeDevice.isOn ? '开启' : '关闭'}
                </div>
              </div>

              {/* 三大实体触控操作按键 (打开 / 暂停 / 关闭，开启态使用青蓝) */}
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    updateDeviceAttr({
                      curtainPercent: 100,
                      value: 100,
                      curtainState: 'open',
                      statusText: '开合度 100%',
                      isOn: true
                    });
                  }}
                  className={`h-24 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer border ${
                    activeDevice.curtainPercent === 100 && activeDevice.isOn
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-md'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.06] text-zinc-300'
                  }`}
                >
                  <div className="flex items-center text-cyan-300 font-bold tracking-tighter text-2xl">
                    <span>&lt;</span>
                    <span>&gt;</span>
                  </div>
                  <span className="text-sm font-semibold">打开</span>
                </button>

                <button
                  onClick={() => {
                    updateDeviceAttr({
                      curtainState: 'pause',
                      statusText: `开合度 ${activeDevice.curtainPercent ?? 50}%`
                    });
                  }}
                  className={`h-24 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer border ${
                    activeDevice.curtainState === 'pause' && activeDevice.isOn
                      ? 'bg-white/[0.12] border-white/20 text-white shadow-lg'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.06] text-zinc-300'
                  }`}
                >
                  <Pause size={22} className="text-zinc-200" />
                  <span className="text-sm font-semibold">暂停</span>
                </button>

                <button
                  onClick={() => {
                    updateDeviceAttr({
                      curtainPercent: 0,
                      value: 0,
                      curtainState: 'close',
                      statusText: '已关闭',
                      isOn: false
                    });
                  }}
                  className={`h-24 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer border ${
                    activeDevice.curtainPercent === 0 || !activeDevice.isOn
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-300 shadow-md'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.06] text-zinc-300'
                  }`}
                >
                  <div className="flex items-center text-zinc-300 font-bold tracking-tighter text-2xl">
                    <span>&gt;</span>
                    <span>&lt;</span>
                  </div>
                  <span className="text-sm font-semibold">关闭</span>
                </button>
              </div>

              {/* 细粒度百分比滑轨调节 (统一青蓝滑块) */}
              <div className="space-y-2 pt-2">
                <span className="text-xs text-zinc-400 font-medium block">开合度微调</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={activeDevice.curtainPercent ?? activeDevice.value ?? 75}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    updateDeviceAttr({
                      curtainPercent: val,
                      value: val,
                      statusText: `开合度 ${val}%`,
                      isOn: val > 0
                    });
                  }}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-white/[0.08] rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                  <span>0% (关闭)</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100% (打开)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            3. 开关射灯专属深度控制板 (青蓝温润点亮，关则灰色)
            ========================================================= */}
        {activeDevice.type === 'switch' && (
          <div className="max-w-3xl mx-auto flex flex-col items-center justify-center gap-6 py-6">
            <div className="w-full rounded-3xl bg-[#141824] border border-white/[0.08] p-8 flex flex-col items-center justify-center gap-6 shadow-xl">
              {/* 超大圆形触控开关 (开=青蓝柔光，关=暗灰) */}
              <button
                onClick={() => onToggleDevice && onToggleDevice(activeDevice.id)}
                className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
                  activeDevice.isOn
                    ? 'bg-cyan-500/15 border-2 border-cyan-400/40 shadow-[0_0_35px_rgba(6,182,212,0.25)]'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08]'
                }`}
              >
                <Lightbulb
                  size={52}
                  className={
                    activeDevice.isOn
                      ? 'text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                      : 'text-zinc-500'
                  }
                />
                <span
                  className={`text-lg font-bold mt-2 ${
                    activeDevice.isOn ? 'text-white' : 'text-zinc-500'
                  }`}
                >
                  {activeDevice.isOn ? '开' : '关'}
                </span>
              </button>

              <div className="text-center">
                <span className="text-sm font-semibold text-zinc-200 block">
                  {activeDevice.name}
                </span>
                <span className="text-xs text-zinc-400 mt-1 block">
                  {activeDevice.isOn ? '电源通电开启中 · 实时功率 12W' : '已切断电源'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            4. 调光灯带专属深度控制板 (亮度用统一青蓝，色温保留真实冷暖渐变)
            ========================================================= */}
        {(activeDevice.type === 'dimmer_light' || activeDevice.type === 'light') && (
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <div className="rounded-3xl bg-[#141824] border border-white/[0.08] p-7 flex flex-col gap-6 shadow-xl">
              {/* 顶部名称与当前模式 */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    {activeDevice.name}
                  </h3>
                  <span className="text-xs text-zinc-400 mt-1 block">
                    无极调光 · 2700K~6500K 线性冷暖色温
                  </span>
                </div>

                <span
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold border ${
                    activeDevice.isOn
                      ? 'bg-cyan-400/10 border-cyan-400/30 text-cyan-300'
                      : 'bg-white/[0.03] border-white/10 text-zinc-500'
                  }`}
                >
                  {activeDevice.isOn ? '开启' : '关闭'}
                </span>
              </div>

              {/* 1. 亮度控制胶囊滑轨 (统一青蓝强调色) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="flex items-center gap-2 text-zinc-200">
                    <Sun size={16} className="text-cyan-400" />
                    <span>亮度调节</span>
                  </span>
                  <span className="text-cyan-300 font-mono text-base">
                    {activeDevice.brightness ?? activeDevice.value ?? 80}%
                  </span>
                </div>

                <div className="h-9 w-full bg-black/50 border border-white/[0.08] rounded-full overflow-hidden relative flex items-center p-1">
                  <div
                    className="h-full bg-cyan-400/80 rounded-full transition-all duration-100 flex items-center justify-end pr-1.5 shadow-sm"
                    style={{
                      width: `${Math.max(6, activeDevice.brightness ?? activeDevice.value ?? 80)}%`
                    }}
                  >
                    <div className="w-2 h-6 rounded-full bg-zinc-900" />
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={activeDevice.brightness ?? activeDevice.value ?? 80}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updateDeviceAttr({
                        brightness: val,
                        value: val,
                        isOn: val > 0,
                        statusText: `亮度 ${val}% · 色温 ${activeDevice.colorTemp ?? 45}%`
                      });
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
              </div>

              {/* 2. 色温控制胶囊滑轨 (唯一例外：保留真实暖黄到冷白渐变功能需要) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="flex items-center gap-2 text-zinc-200">
                    <Sparkles size={16} className="text-cyan-300" />
                    <span>色温冷暖调节</span>
                  </span>
                  <span className="text-zinc-200 font-mono text-base">
                    {activeDevice.colorTemp ?? 45}%
                  </span>
                </div>

                <div className="h-9 w-full bg-black/50 border border-white/[0.08] rounded-full overflow-hidden relative flex items-center p-1">
                  <div
                    className="h-full bg-gradient-to-r from-[#FDBA74] via-[#FDE68A] to-[#BAE6FD] rounded-full transition-all duration-100 flex items-center justify-end pr-1.5 shadow-sm"
                    style={{
                      width: `${Math.max(6, activeDevice.colorTemp ?? 45)}%`
                    }}
                  >
                    <div className="w-2 h-6 rounded-full bg-zinc-900" />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeDevice.colorTemp ?? 45}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updateDeviceAttr({
                        colorTemp: val,
                        statusText: `亮度 ${activeDevice.brightness ?? 80}% · 色温 ${val}%`
                      });
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                  <span>暖黄 2700K</span>
                  <span>温馨 3500K</span>
                  <span>自然 4000K</span>
                  <span>冷白 6500K</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            5. 空调专属深度控制板 (开启=青蓝点亮，关闭=灰色，温润不刺眼)
            ========================================================= */}
        {activeDevice.type === 'ac' && (
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <div className="rounded-3xl bg-[#141824] border border-white/[0.08] p-7 flex flex-col gap-6 shadow-xl">
              {/* 顶部标题与青蓝温润开关 */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    {activeDevice.name}
                  </h3>
                  <span className="text-xs text-zinc-400 mt-1 block">
                    变频节能 · 双向矢量送风
                  </span>
                </div>

                <button
                  onClick={() => onToggleDevice && onToggleDevice(activeDevice.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    activeDevice.isOn
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.18)]'
                      : 'bg-white/[0.04] text-zinc-400 border border-white/[0.08]'
                  }`}
                >
                  <Power size={14} className={activeDevice.isOn ? 'text-cyan-300' : 'text-zinc-500'} strokeWidth={2.2} />
                  <span>{activeDevice.isOn ? '开启' : '关闭'}</span>
                </button>
              </div>

              {/* 中间核心温控区：圆形减号 + 大号温度28℃ + 圆形加号 */}
              <div className="flex items-center justify-between px-6 py-4 bg-black/30 rounded-2xl border border-white/[0.05]">
                <button
                  onClick={() => {
                    const cur = activeDevice.targetTemp ?? activeDevice.value ?? 28;
                    if (cur > 16) {
                      updateDeviceAttr({
                        targetTemp: cur - 1,
                        value: cur - 1,
                        statusText: `制冷 ${cur - 1}°C`
                      });
                    }
                  }}
                  className="w-16 h-16 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-white text-3xl font-light flex items-center justify-center transition-all cursor-pointer active:scale-95"
                >
                  -
                </button>

                <div className="flex items-baseline justify-center">
                  <span className="text-6xl font-black text-white tracking-tight">
                    {activeDevice.targetTemp ?? activeDevice.value ?? 28}
                  </span>
                  <span className="text-2xl font-medium text-cyan-400 ml-1.5">
                    °C
                  </span>
                </div>

                <button
                  onClick={() => {
                    const cur = activeDevice.targetTemp ?? activeDevice.value ?? 28;
                    if (cur < 30) {
                      updateDeviceAttr({
                        targetTemp: cur + 1,
                        value: cur + 1,
                        statusText: `制冷 ${cur + 1}°C`
                      });
                    }
                  }}
                  className="w-16 h-16 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-white text-3xl font-light flex items-center justify-center transition-all cursor-pointer active:scale-95"
                >
                  +
                </button>
              </div>

              {/* 模式选择 (制冷、制热、送风、除湿，统一青蓝强调色) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4">
                  <span className="text-xs text-zinc-400 font-semibold block mb-3">运行模式</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'cool', label: '❄️ 制冷' },
                      { id: 'heat', label: '☀️ 制热' },
                      { id: 'fan', label: '🍃 送风' },
                      { id: 'dry', label: '💧 除湿' }
                    ].map((m) => {
                      const isActive = (activeDevice.acMode || 'cool') === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => updateDeviceAttr({ acMode: m.id as any })}
                          className={`py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            isActive
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-sm'
                              : 'bg-white/[0.03] text-zinc-400 hover:text-zinc-200 border border-white/[0.05]'
                          }`}
                        >
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 风速档位 (统一青蓝强调色) */}
                <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4">
                  <span className="text-xs text-zinc-400 font-semibold block mb-3">风速档位</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'low', label: '低速' },
                      { id: 'mid', label: '中速' },
                      { id: 'high', label: '强劲' }
                    ].map((f) => {
                      const isActive = (activeDevice.fanSpeed || 'mid') === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => updateDeviceAttr({ fanSpeed: f.id as any })}
                          className={`py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            isActive
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-sm'
                              : 'bg-white/[0.03] text-zinc-400 hover:text-zinc-200 border border-white/[0.05]'
                          }`}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部极简语音提示 */}
      <footer className="h-[46px] px-8 bg-[#0C0D11] border-t border-white/[0.05] flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>支持语音调节：“小谷同学，把{activeDevice.name}温度调到26度”、“关闭{activeDevice.name}”</span>
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

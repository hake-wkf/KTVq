export type DeviceType =
  | 'switch'
  | 'curtain'
  | 'ac'
  | 'dimmer_light'
  | 'ktv_amp'
  | 'light'
  | 'lock'
  | 'sensor';

export interface Device {
  id: string;
  name: string;
  room: string;
  type: DeviceType;
  isOn: boolean;
  value: number; // For light: brightness (0-100), curtain: open% (0-100), AC: temp (16-31)
  statusText: string;
  unit?: string;

  // 窗帘专用属性
  curtainState?: 'open' | 'pause' | 'close';
  curtainPercent?: number; // 0 - 100%

  // 空调专用属性
  acMode?: 'cool' | 'heat' | 'fan' | 'dry'; // 制冷; 制热; 送风; 除湿
  fanSpeed?: 'auto' | 'low' | 'mid' | 'high'; // 自动; 低; 中; 高
  currentTemp?: number;
  targetTemp?: number;

  // 调光灯专用属性
  brightness?: number; // 0 - 100
  colorTemp?: number; // 0 - 100 (暖到冷)

  // KTV功放专用属性
  ktvSource?: '蓝牙' | 'HDMI ARC' | '同轴/光纤' | 'USB' | 'AUX 1' | 'AUX 2' | string;
  ktvMode?: '原声' | '酒吧' | '流行' | '劲k' | 'party' | string;
  accompanimentVol?: number; // 0 - 30
  micVol?: number; // 0 - 30
  micEffect?: number; // 0 - 20
}

export interface Scene {
  id: string;
  name: string;
  description?: string;
  gradient?: string;
  actionsText?: string;
  isActive?: boolean;
  area?: string;
  subText?: string;
  bgImg?: string;
  icon?: string;
}

export interface ActivityLog {
  id: string;
  time: string;
  icon: string;
  description: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverColor: string; // Gradient or solid color representing album
}

export type ActivePage = 'voice' | 'device-list' | 'device-control' | 'scene-list' | 'music';

export type VoiceStateType = 'idle' | 'waking' | 'listening' | 'thinking' | 'success' | 'unclear';

export interface VoiceMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  intentType?: 'play_music' | 'toggle_device' | 'open_device_list' | 'open_device_control' | 'trigger_scene' | 'open_scene_list' | 'general';
  actionPayload?: {
    page?: ActivePage;
    songTitle?: string;
    artist?: string;
    deviceName?: string;
    deviceState?: boolean;
    sceneName?: string;
    room?: string;
  };
}

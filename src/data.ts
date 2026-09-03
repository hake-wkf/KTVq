import { Device, Scene, Song, ActivityLog } from './types';

export const initialDevices: Device[] = [
  // 卧室核心设备 (精准对应用户参考图 1~4)
  {
    id: 'd-cur1',
    name: '卧室窗帘990F02',
    room: '主卧',
    type: 'curtain',
    isOn: true,
    value: 100,
    statusText: '开启100%',
    curtainState: 'open',
    curtainPercent: 100
  },
  {
    id: 'd-sw1',
    name: '卧室射灯990F02',
    room: '主卧',
    type: 'switch',
    isOn: true,
    value: 100,
    statusText: '开'
  },
  {
    id: 'd-sw2',
    name: '卧室镜灯990F02',
    room: '主卧',
    type: 'switch',
    isOn: false,
    value: 0,
    statusText: '关'
  },
  {
    id: 'd-dim1',
    name: '卧室灯带990F02',
    room: '主卧',
    type: 'dimmer_light',
    isOn: true,
    value: 80,
    statusText: '亮度 80% · 色温 45%',
    brightness: 80,
    colorTemp: 45
  },
  {
    id: 'd-ac1',
    name: '卧室空调990F02',
    room: '主卧',
    type: 'ac',
    isOn: true,
    value: 28,
    statusText: '制冷 28°C',
    unit: '°C',
    acMode: 'cool',
    fanSpeed: 'auto',
    currentTemp: 29,
    targetTemp: 28
  },
  // 客厅专业KTV功放 (满足需求3 专业KTV功放风格)
  {
    id: 'd-ktv1',
    name: '客厅KTV功放990F02',
    room: '客厅',
    type: 'ktv_amp',
    isOn: true,
    value: 14,
    statusText: '原声 · 蓝牙',
    ktvSource: '蓝牙',
    ktvMode: '原声',
    accompanimentVol: 14,
    micVol: 16,
    micEffect: 12
  }
];

export const initialScenes: Scene[] = [
  {
    id: 'scene-home',
    name: '回家模式',
    area: '全屋',
    icon: 'Home',
    subText: '开启玄关与客厅吊顶灯带，空调调至25℃舒适室温，自动播放轻音乐',
    bgImg: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000&auto=format&fit=crop&q=85',
    gradient: 'from-cyan-900/60 via-[#0B1522]/90 to-[#070B10]'
  },
  {
    id: 'scene-leave',
    name: '离家模式',
    area: '全屋',
    icon: 'LogOut',
    subText: '全屋灯光布帘一键关闭，空调进入低功耗待机，开启AI全屋安防巡航',
    bgImg: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop&q=85',
    gradient: 'from-slate-900/70 via-[#0A1017]/90 to-[#070B10]'
  },
  {
    id: 'scene-sleep',
    name: '温馨睡眠',
    area: '主卧',
    icon: 'Moon',
    subText: '关闭卧室主灯与射灯，保留脚底微光地灯，关闭遮光窗帘，空调开启睡眠静音',
    bgImg: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?w=1000&auto=format&fit=crop&q=85',
    gradient: 'from-indigo-950/70 via-[#090D18]/90 to-[#070B10]'
  },
  {
    id: 'scene-cinema',
    name: '客厅影院',
    area: '客厅',
    icon: 'Film',
    subText: '关闭客厅顶灯，调暗氛围灯带至15%，静音空调，自动开启KTV功放与投影仪',
    bgImg: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=1000&auto=format&fit=crop&q=85',
    gradient: 'from-cyan-950/80 via-[#101426]/90 to-[#070B10]'
  },
  {
    id: 'scene-focus',
    name: '专注阅读',
    area: '书房',
    icon: 'BookOpen',
    subText: '书房调光灯切换至4000K自然中性光，照度自动提升至85%，伴随舒缓白噪音',
    bgImg: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=1000&auto=format&fit=crop&q=85',
    gradient: 'from-emerald-950/60 via-[#09151A]/90 to-[#070B10]'
  },
  {
    id: 'scene-wake',
    name: '清晨唤醒',
    area: '主卧',
    icon: 'Sun',
    subText: '晨光智能窗帘缓慢开启50%，床头灯以晨曦暖光渐亮，播报今日天气与日程',
    bgImg: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1000&auto=format&fit=crop&q=85',
    gradient: 'from-amber-950/60 via-[#141210]/90 to-[#070B10]'
  }
];

export const initialSongs: Song[] = [
  { id: 'm1', title: '晴天', artist: '周杰伦', duration: '04:29', coverColor: 'from-cyan-500 to-sky-700' },
  { id: 'm2', title: '青花瓷', artist: '周杰伦', duration: '03:59', coverColor: 'from-sky-600 to-cyan-500' },
  { id: 'm3', title: '七里香', artist: '周杰伦', duration: '04:59', coverColor: 'from-cyan-600 to-sky-800' },
  { id: 'm4', title: '稻香', artist: '周杰伦', duration: '03:43', coverColor: 'from-sky-500 to-cyan-700' },
  { id: 'm5', title: '夜曲', artist: '周杰伦', duration: '03:46', coverColor: 'from-cyan-950 to-slate-900' },
  { id: 'm6', title: '兰亭序', artist: '周杰伦', duration: '04:13', coverColor: 'from-cyan-800 to-sky-900' },
  { id: 'm7', title: '告白气球', artist: '周杰伦', duration: '03:35', coverColor: 'from-sky-500 to-cyan-600' },
  { id: 'm8', title: '说好不哭', artist: '周杰伦', duration: '03:42', coverColor: 'from-cyan-700 to-slate-900' }
];

export const initialLogs: ActivityLog[] = [
  { id: 'log1', time: '17:20', icon: 'light', description: '客厅吊顶灯带已开启' },
  { id: 'log2', time: '16:45', icon: 'scene', description: '回家模式已执行' },
  { id: 'log3', time: '16:30', icon: 'music', description: '晴天 正在播放' },
  { id: 'log4', time: '15:10', icon: 'sensor', description: '客厅温湿度 26°C / 45% 正常' }
];

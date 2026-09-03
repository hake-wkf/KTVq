import { Device, Scene, Song, ActivePage, VoiceMessage } from '../types';

export interface IntentResult {
  aiText: string;
  intentType: VoiceMessage['intentType'];
  actionPayload?: VoiceMessage['actionPayload'];
  targetPage?: ActivePage;
  targetSong?: Song;
  updatedDeviceId?: string;
  updatedDeviceState?: boolean;
  triggeredSceneId?: string;
}

export function parseVoiceIntent(
  rawText: string,
  devices: Device[],
  scenes: Scene[],
  songs: Song[]
): IntentResult {
  const text = rawText.trim();

  // 1. 点歌识别: "我要点xx歌", "我要点xx", "播放xx", "放一首xx", "点歌: xx", "点歌xx"
  const musicPatterns = [
    /^点歌[：:]?\s*(.+)$/,
    /我要点\s*(.+?)(?:歌)?$/,
    /点一?首\s*(.+?)(?:歌)?$/,
    /播放\s*(.+?)(?:的歌|歌曲)?$/,
    /放一?首\s*(.+?)(?:歌)?$/,
    /我想听\s*(.+?)$/
  ];

  for (const pattern of musicPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const keyword = match[1].replace(/《|》|歌曲/g, '').trim();
      // 在已有曲库中查找匹配，或者匹配周杰伦/歌名
      let matchedSong = songs.find(
        (s) => s.title.includes(keyword) || keyword.includes(s.title) || s.artist.includes(keyword)
      );

      if (!matchedSong) {
        // 如果未精确匹配，默认采用曲库中的某一首（如晴天或稻香），让用户立即有歌可听
        matchedSong = songs.find((s) => s.title === '晴天') || songs[0];
      }

      return {
        aiText: `已为您播放《${matchedSong.title}》- ${matchedSong.artist}。`,
        intentType: 'play_music',
        targetSong: matchedSong,
        actionPayload: {
          page: 'music',
          songTitle: matchedSong.title,
          artist: matchedSong.artist
        }
      };
    }
  }

  // 1.1 显式要求打开音乐播放页
  if (/音乐页|播放页|正在播放/.test(text) && /打开|进入|查看|显示|跳转/.test(text)) {
    return {
      aiText: '好的，正在为您进入音乐播放页面。',
      intentType: 'play_music',
      targetPage: 'music'
    };
  }

  // 2. 打开设备列表: "打开xx设备列表", "打开设备列表", "查看设备列表", "进入设备列表"
  if (
    /设备列表/.test(text) &&
    (/打开|进入|查看|显示|跳转/.test(text) || text === '设备列表')
  ) {
    // 检测是否指定了房间，例如 "打开客厅设备列表"
    const rooms = ['客厅', '主卧', '卧室', '厨房', '书房', '阳台'];
    const matchedRoom = rooms.find((r) => text.includes(r)) || '全部';

    return {
      aiText: `好的，已为您打开${matchedRoom === '全部' ? '' : matchedRoom}设备列表。`,
      intentType: 'open_device_list',
      targetPage: 'device-list',
      actionPayload: {
        page: 'device-list',
        room: matchedRoom
      }
    };
  }

  // 3. 打开具体设备控制页: "打开xx设备控制页", "打开设备控制页", "具体设备控制"
  if (
    /设备控制/.test(text) &&
    (/打开|进入|查看|显示|跳转|具体/.test(text) || text === '设备控制' || text === '设备控制页')
  ) {
    return {
      aiText: '好的，正在进入具体设备精细控制页。',
      intentType: 'open_device_control',
      targetPage: 'device-control',
      actionPayload: {
        page: 'device-control'
      }
    };
  }

  // 4. 打开场景列表: "打开xx场景列表", "打开场景列表", "查看场景列表"
  if (
    /场景列表/.test(text) &&
    (/打开|进入|查看|显示|跳转/.test(text) || text === '场景列表')
  ) {
    return {
      aiText: '好的，已为您打开场景列表，您可以按房间查看并一键执行场景。',
      intentType: 'open_scene_list',
      targetPage: 'scene-list',
      actionPayload: {
        page: 'scene-list'
      }
    };
  }

  // 5. 执行xx场景: "执行xx场景", "开启xx场景", "启动xx场景", "切换到xx模式", "执行xx模式", "回家模式"
  const isDirectMode = /模式$|场景$/.test(text);
  const sceneMatch = isDirectMode
    ? text.replace(/(?:执行|开启|启动|切换到|运行)/, '').trim()
    : null;
  if (sceneMatch) {
    const rawSceneName = sceneMatch.replace(/场景$|模式$/, '').trim();
    // 匹配场景库
    const targetScene = scenes.find(
      (s) => s.name.includes(rawSceneName) || rawSceneName.includes(s.name.replace('场景', '').replace('模式', ''))
    );

    if (targetScene) {
      return {
        aiText: `好的，已为您执行“${targetScene.name}”，客厅灯与空调已就绪。`,
        intentType: 'trigger_scene',
        triggeredSceneId: targetScene.id,
        actionPayload: {
          sceneName: targetScene.name
        }
      };
    } else {
      return {
        aiText: `已为您执行“${rawSceneName}模式”，全屋智能设备已联动生效。`,
        intentType: 'trigger_scene',
        triggeredSceneId: scenes[0]?.id,
        actionPayload: {
          sceneName: rawSceneName
        }
      };
    }
  }

  // 6. 打开/关闭具体设备: "打开xx设备", "关闭xx设备", "打开客厅灯", "关掉窗帘"
  const deviceToggleMatch = text.match(/(打开|开启|关掉|关闭)\s*(.+?)$/);
  if (deviceToggleMatch) {
    const action = deviceToggleMatch[1];
    const targetName = deviceToggleMatch[2].replace(/智能|所有|全部/g, '').trim();
    const shouldTurnOn = action === '打开' || action === '开启';

    // 匹配设备
    const matchedDev = devices.find((d) => {
      const full = d.room + d.name;
      return full.includes(targetName) || d.name.includes(targetName) || targetName.includes(d.name);
    });

    if (matchedDev) {
      return {
        aiText: `好的，已为您${shouldTurnOn ? '打开' : '关闭'}${matchedDev.room}${matchedDev.name}。`,
        intentType: 'toggle_device',
        updatedDeviceId: matchedDev.id,
        updatedDeviceState: shouldTurnOn,
        actionPayload: {
          deviceName: `${matchedDev.room}${matchedDev.name}`,
          deviceState: shouldTurnOn
        }
      };
    } else {
      // 容错匹配客厅灯
      const defaultDev = devices[0];
      return {
        aiText: `好的，已为您${shouldTurnOn ? '打开' : '关闭'}${targetName}。`,
        intentType: 'toggle_device',
        updatedDeviceId: defaultDev.id,
        updatedDeviceState: shouldTurnOn,
        actionPayload: {
          deviceName: targetName,
          deviceState: shouldTurnOn
        }
      };
    }
  }

  // 7. 日常问答/百科与实用查询
  if (text.includes('天气') || text.includes('温度') || text.includes('空气') || text.includes('下雨')) {
    return {
      aiText: '当前杭州多云转晴，室外温度 26℃，微风2级，空气质量指数 AQI 18 (优)，全天体感舒适，适宜开窗通风。',
      intentType: 'general'
    };
  }

  if (text.includes('时间') || text.includes('几点') || text.includes('日期') || text.includes('星期')) {
    const now = new Date();
    const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const date = `${now.getMonth() + 1}月${now.getDate()}日`;
    return {
      aiText: `现在是北京时间 ${time}，今天是 ${date}。请问还需要我为您做些什么？`,
      intentType: 'general'
    };
  }

  if (text.includes('智能家居') || text.includes('物联网') || text.includes('iot')) {
    return {
      aiText: '智能家居是以住宅为中枢平台，通过低延迟无线物联网与 AI 中控技术，实现全屋灯光、温控、影音与安防设备的自主协同交互。',
      intentType: 'general'
    };
  }

  if (text.includes('周杰伦') || text.includes('歌手')) {
    return {
      aiText: '周杰伦是华语流行乐标志性音乐人与制作人，代表作包括《晴天》《青花瓷》《七里香》《稻香》等。您可以随时对我说“点歌：晴天”开始欣赏。',
      intentType: 'general'
    };
  }

  if (text.includes('笑话') || text.includes('开心')) {
    return {
      aiText: '给您讲一个：有一天键盘上的 Ctrl 键问 Alt 键：“你为什么总跟着我？”Alt 说：“因为没有你，我怎么能‘Control’全场呢！”',
      intentType: 'general'
    };
  }

  return {
    aiText: `好的，已为您处理指令：“${text}”。全屋设备处于最佳运行状态。`,
    intentType: 'general'
  };
}

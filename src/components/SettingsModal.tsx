import React, { useState } from 'react';
import { X, Wifi, User, QrCode, LogOut, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'wifi'>('account');
  const [boundAccount, setBoundAccount] = useState<string | null>('谷家智能小程序用户_8829');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md animate-fade-in select-none">
      <div className="w-[480px] h-[320px] bg-[#0E131A] border border-cyan-500/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* 标题栏 */}
        <div className="h-14 px-6 border-b border-white/[0.06] flex items-center justify-between shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]" />
            <h3 className="text-base font-bold text-white tracking-wide">系统设置</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* 主体左右或Tab布局 */}
        <div className="flex-1 flex flex-col p-6 justify-between">
          <div className="flex gap-2 border-b border-white/[0.06] pb-3">
            <button
              onClick={() => setActiveTab('account')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'account'
                  ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                  : 'text-zinc-400 hover:text-white bg-white/[0.04]'
              }`}
            >
              <User size={13} />
              <span>小程序绑定</span>
            </button>
            <button
              onClick={() => setActiveTab('wifi')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'wifi'
                  ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                  : 'text-zinc-400 hover:text-white bg-white/[0.04]'
              }`}
            >
              <Wifi size={13} />
              <span>网络配置</span>
            </button>
          </div>

          <div className="flex-1 py-3 flex items-center">
            {activeTab === 'account' ? (
              <div className="w-full flex items-center justify-between">
                {boundAccount ? (
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                      <User size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{boundAccount}</span>
                        <span className="text-[10px] bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check size={10} strokeWidth={3} /> 已绑定
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">已同步全屋设备权限与个性化歌单</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-zinc-400 border border-white/10">
                      <QrCode size={28} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">未绑定账号</div>
                      <p className="text-xs text-zinc-400 mt-1">请使用“谷家智能小程序”扫码绑定</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                    <Wifi size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">GuJia_Smart_5G</div>
                    <p className="text-xs text-cyan-300 mt-0.5">信号极佳 · 延迟 8ms</p>
                  </div>
                </div>
                <span className="text-xs text-cyan-200/80 bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-500/20">
                  已连接 5GHz
                </span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] text-zinc-500">固件版本: v3.4.2-pro (Build 20260901)</span>
            {boundAccount ? (
              <button
                onClick={() => setBoundAccount(null)}
                className="px-3 py-1 text-xs text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <LogOut size={12} />
                <span>解除绑定</span>
              </button>
            ) : (
              <button
                onClick={() => setBoundAccount('谷家智能小程序用户_8829')}
                className="px-3 py-1 text-xs text-cyan-300 hover:bg-cyan-950/40 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>模拟扫码绑定</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

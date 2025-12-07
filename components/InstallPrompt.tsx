import React, { useState, useEffect } from 'react';
import { Download, X, Share2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// 检测设备类型
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isAndroid = /Android/.test(navigator.userAgent);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone === true;

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(isStandalone);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // 检查是否已经安装
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 监听 beforeinstallprompt 事件（Android Chrome/Edge）
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 监听应用安装完成事件
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    // 对于 iOS，延迟显示提示（因为不支持 beforeinstallprompt）
    if (isIOS && !isInstalled) {
      const timer = setTimeout(() => {
        // 检查是否在 24 小时内已关闭过提示
        const dismissedTime = localStorage.getItem('pwa-install-dismissed');
        if (!dismissedTime) {
          // 如果没有关闭记录，直接显示
          setShowPrompt(true);
        } else {
          const hoursSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60);
          if (hoursSinceDismissed >= 24) {
            setShowPrompt(true);
          }
        }
      }, 3000); // 3秒后显示
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    // iOS 设备
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    // Android 设备
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSInstructions(false);
    // 保存到 localStorage，避免频繁提示
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // 如果已安装，则不显示
  if (isInstalled) {
    return null;
  }

  // 对于 Android，如果没有 deferredPrompt 且不在显示状态，则不显示
  // 但如果是 iOS，即使没有 deferredPrompt 也可以显示（因为 iOS 不支持 beforeinstallprompt）
  if (!isIOS && !deferredPrompt && !showPrompt) {
    return null;
  }

  // 如果既没有显示状态，也没有 deferredPrompt（iOS 除外），则不显示
  if (!showPrompt && !deferredPrompt && !isIOS) {
    return null;
  }

  // 检查是否在 24 小时内已关闭过提示（iOS 安装说明弹窗除外）
  const dismissedTime = localStorage.getItem('pwa-install-dismissed');
  if (dismissedTime && !showIOSInstructions) {
    const hoursSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60);
    if (hoursSinceDismissed < 24) {
      return null;
    }
  }

  // iOS 安装说明
  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">安装到主屏幕</h3>
            <button
              onClick={handleDismiss}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold text-xs">1</span>
              <p>点击底部工具栏的 <Share2 size={16} className="inline" /> 分享按钮</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold text-xs">2</span>
              <p>选择"添加到主屏幕"</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold text-xs">3</span>
              <p>点击"添加"完成安装</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="mt-6 w-full px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition-colors active:scale-95"
          >
            知道了
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 left-0 right-0 z-50 px-4 sm:px-0 sm:left-auto sm:right-auto sm:w-full sm:max-w-md sm:mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-teal-200 p-4 flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
          <Download size={24} className="text-teal-600" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-800">安装 Potato Habits</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {isIOS ? '添加到主屏幕，获得更好的体验' : '添加到主屏幕，获得更好的体验'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition-colors active:scale-95"
          >
            {isIOS ? '安装' : '安装'}
          </button>
          <button
            onClick={handleDismiss}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;


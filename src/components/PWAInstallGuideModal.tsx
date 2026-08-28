import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Check, X, Share2, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallGuideModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android');

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('브라우저 메뉴(⋮)에서 [홈 화면에 추가] 또는 [앱 설치]를 눌러주세요!');
      return;
    }
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (!isOpen) return null;

  return (
    <div
      id="pwa-install-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-bold text-lg">
              ☀️
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100">
                날씨LEE2510.app 설치
              </h2>
              <p className="text-xs text-sky-400 font-medium">
                스마트폰 홈화면에 1초 만에 앱으로 설치
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('android')}
            className={`py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'android'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📱 안드로이드 (삼성/LG/구글)
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'ios'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🍏 아이폰 (iPhone)
          </button>
        </div>

        {/* Content body */}
        <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          {activeTab === 'android' ? (
            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-semibold text-slate-200">Chrome(크롬) 또는 삼성 인터넷 열기</p>
                  <p className="text-slate-400 text-[11px]">현재 페이지를 스마트폰 브라우저로 엽니다.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-semibold text-slate-200">우측 상단 메뉴(⋮) 클릭</p>
                  <p className="text-slate-400 text-[11px]">브라우저 우측 상단 점 3개 메뉴를 터치합니다.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-semibold text-emerald-400">[홈 화면에 추가] 또는 [앱 설치] 선택</p>
                  <p className="text-slate-400 text-[11px]">홈 화면에 아이콘이 생성되어 독립 앱으로 실행됩니다.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-semibold text-slate-200">Safari(사파리) 브라우저로 접속</p>
                  <p className="text-slate-400 text-[11px]">아이폰 기본 Safari 브라우저에서 엽니다.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
                  2
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-200 flex items-center gap-1">
                    하단 중앙 <Share2 className="w-3.5 h-3.5 text-sky-400" /> [공유] 버튼 터치
                  </p>
                  <p className="text-slate-400 text-[11px]">네모와 위쪽 화살표 모양의 공유 아이콘</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
                  3
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-emerald-400 flex items-center gap-1">
                    <PlusSquare className="w-3.5 h-3.5 text-emerald-400" /> [홈 화면에 추가] 선택
                  </p>
                  <p className="text-slate-400 text-[11px]">우측 상단 [추가]를 누르면 아이폰 홈 화면에 바로 설치됩니다.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-1">
          {deferredPrompt ? (
            <button
              onClick={handleInstallClick}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/30 active:scale-98 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>지금 원클릭 앱 설치하기</span>
            </button>
          ) : isInstalled ? (
            <div className="w-full py-2.5 px-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold text-xs text-center flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>이미 앱으로 설치되어 실행 중입니다</span>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
            >
              확인 (안내에 따라 홈 화면에 추가하기)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

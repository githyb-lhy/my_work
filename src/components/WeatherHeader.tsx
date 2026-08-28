import React, { useState, useEffect } from 'react';
import { MapPin, RotateCw, Search, Compass, Smartphone } from 'lucide-react';
import { CurrentWeather } from '../types';

interface WeatherHeaderProps {
  weather: CurrentWeather | null;
  loading: boolean;
  onRefresh: () => void;
  onGetCurrentLocation: () => void;
  onOpenSearch: () => void;
  onOpenInstallGuide?: () => void;
}

export const WeatherHeader: React.FC<WeatherHeaderProps> = ({
  weather,
  loading,
  onRefresh,
  onGetCurrentLocation,
  onOpenSearch,
  onOpenInstallGuide,
}) => {

  return (
    <header id="weather-header" className="w-full bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-30 px-3.5 py-3 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-2.5 sm:gap-3">
        {/* Top Row: Location Title, Status Badge, and Refresh */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-sky-400 shrink-0 shadow-sm">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-lg font-bold text-slate-100 tracking-tight truncate">
                  {weather ? weather.location.address : '위치 확인 중...'}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold border shrink-0 bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  기상청 실시간
                </span>
              </div>

              {weather && (
                <p className="text-[11px] sm:text-xs text-slate-400 flex flex-wrap items-center gap-1.5 mt-0.5 font-mono">
                  <span>위도 {weather.location.lat.toFixed(4)}°, 경도 {weather.location.lng.toFixed(4)}°</span>
                  <span className="text-slate-600 font-sans">•</span>
                  <span>관측 {weather.baseTime.slice(0, 2)}:{weather.baseTime.slice(2, 4)} 기준</span>
                </p>
              )}
            </div>
          </div>

          <button
            id="btn-refresh-weather"
            onClick={onRefresh}
            disabled={loading}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all shadow-sm active:scale-95 disabled:opacity-50 shrink-0"
            title="날씨 새로고침"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>

        {/* Action Controls Button Bar: Touch friendly on mobile */}
        <div className="grid grid-cols-3 sm:flex sm:items-center sm:justify-end gap-2 pt-1 border-t border-slate-800/50 sm:border-t-0 sm:pt-0">
          <button
            id="btn-install-pwa"
            onClick={onOpenInstallGuide}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 sm:px-3 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500/20 to-blue-600/20 hover:from-sky-500/30 hover:to-blue-600/30 text-sky-300 border border-sky-500/40 transition-all shadow-sm active:scale-95"
            title="스마트폰에 앱(PWA)으로 설치하기"
          >
            <Smartphone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="truncate">폰에 앱 설치</span>
          </button>

          <button
            id="btn-my-location"
            onClick={onGetCurrentLocation}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 sm:px-3 text-xs sm:text-sm font-semibold rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-300 border border-slate-800 hover:border-slate-700 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            title="현재 스마트폰 GPS 위치로 날씨 조회"
          >
            <Compass className={`w-3.5 h-3.5 text-sky-400 shrink-0 ${loading ? 'animate-spin' : ''}`} />
            <span className="truncate">GPS 현재위치</span>
          </button>

          <button
            id="btn-search-region"
            onClick={onOpenSearch}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 sm:px-3 text-xs sm:text-sm font-medium rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all shadow-sm active:scale-95"
            title="다른 지역 날씨 검색"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">지역 검색</span>
          </button>
        </div>
      </div>
    </header>
  );
};

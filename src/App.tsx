/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { WeatherHeader } from './components/WeatherHeader';
import { CurrentWeatherHero } from './components/CurrentWeatherHero';
import { LifeAndOutfitGuide } from './components/LifeAndOutfitGuide';
import { HourlyForecastView } from './components/HourlyForecastView';
import { DailyForecastView } from './components/DailyForecastView';
import { AirQualityCard } from './components/AirQualityCard';
import { KmaObservationDetail } from './components/KmaObservationDetail';
import { LocationSearchModal } from './components/LocationSearchModal';
import { PWAInstallGuideModal } from './components/PWAInstallGuideModal';
import { CurrentWeather, RegionInfo } from './types';
import { AlertCircle, RotateCcw, Compass, Radio, CloudSun, Download } from 'lucide-react';

export default function App() {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isInstallOpen, setIsInstallOpen] = useState<boolean>(false);
  const [lastCoords, setLastCoords] = useState<{ lat: number; lng: number } | null>(null);


  // Fetch weather from server API
  const fetchWeather = useCallback(
    async (lat: number, lng: number, address?: string, nx?: number, ny?: number) => {
      setLoading(true);
      setError(null);

      try {
        let url = `/api/weather/current?lat=${lat}&lng=${lng}`;
        if (address) url += `&address=${encodeURIComponent(address)}`;
        if (nx && ny) url += `&nx=${nx}&ny=${ny}`;

        const res = await fetch(url);
        const json = await res.json();

        if (json.success && json.data) {
          setWeather(json.data);
          setLastCoords({ lat, lng });
        } else {
          throw new Error(json.error || '날씨 데이터를 불러오지 못했습니다.');
        }
      } catch (err: any) {
        console.error('Fetch weather error:', err);
        setError(err.message || '날씨 정보를 불러오는 중 통신 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get User's Current GPS Location
  const handleGetCurrentLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      // Geolocation not supported, fallback to default (Seoul)
      fetchWeather(37.5665, 126.978, '서울특별시 중구');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeather(latitude, longitude);
      },
      (err) => {
        console.warn('Geolocation error or denied:', err.message);
        // Fallback to Seoul City Hall
        fetchWeather(37.5665, 126.978, '서울특별시 중구');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [fetchWeather]);

  // Initial load: automatically request user location
  useEffect(() => {
    handleGetCurrentLocation();
  }, [handleGetCurrentLocation]);

  // Refresh current data
  const handleRefresh = () => {
    if (lastCoords) {
      fetchWeather(lastCoords.lat, lastCoords.lng, weather?.location.address);
    } else {
      handleGetCurrentLocation();
    }
  };

  // Region selection from Search Modal
  const handleSelectRegion = (region: RegionInfo) => {
    fetchWeather(region.lat, region.lng, region.fullName, region.nx, region.ny);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white antialiased">
      {/* Background Subtle Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <WeatherHeader
        weather={weather}
        loading={loading}
        onRefresh={handleRefresh}
        onGetCurrentLocation={handleGetCurrentLocation}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenInstallGuide={() => setIsInstallOpen(true)}
      />


      {/* Main Bento Dashboard Area */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col gap-3.5 sm:gap-6">
        {/* Loading State */}
        {loading && !weather && (
          <div className="py-20 sm:py-24 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-5 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl p-6 sm:p-8">
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-slate-800 border-t-sky-500 animate-spin" />
              <CloudSun className="w-6 h-6 sm:w-7 sm:h-7 text-sky-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h2 className="text-base sm:text-lg font-bold text-slate-100">기상청 실시간 관측 데이터 동기화 중</h2>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                현재 위치의 초단기실황 및 단기예보 격자 좌표를 변환하여 기상청 표준 데이터를 수신하고 있습니다.
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-5 sm:p-8 rounded-3xl bg-rose-950/25 border border-rose-800/50 backdrop-blur-xl text-center space-y-3.5 my-4 sm:my-6">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/30">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-rose-200">날씨 정보를 가져올 수 없습니다</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">{error}</p>
            </div>
            <div className="flex items-center justify-center gap-2.5 pt-1">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs sm:text-sm font-medium border border-slate-700 text-slate-200 transition-all shadow-sm active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>다시 시도</span>
              </button>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs sm:text-sm font-medium text-white transition-all shadow-md shadow-sky-900/30 active:scale-95"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>지역 검색으로 이동</span>
              </button>
            </div>
          </div>
        )}

        {/* Loaded Weather Data Bento Dashboard */}
        {weather && (
          <div className="flex flex-col gap-3.5 sm:gap-6">
            {/* Bento Block 1: Current Weather Hero Card */}
            <CurrentWeatherHero weather={weather} />

            {/* Bento Block 2: 24-Hour Hourly Timeline */}
            <HourlyForecastView hourly={weather.hourly} />

            {/* Bento Block 3: Life & Outfit Guide and Air Quality (2-Column Bento on lg) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6 items-stretch">
              <div className="lg:col-span-7 flex flex-col">
                <LifeAndOutfitGuide lifeIndices={weather.lifeIndices} weather={weather} />
              </div>
              <div className="lg:col-span-5 flex flex-col">
                <AirQualityCard airQuality={weather.airQuality} weather={weather} />
              </div>
            </div>

            {/* Bento Block 4: 7-Day Weekly Forecast */}
            <DailyForecastView daily={weather.daily} />

            {/* Bento Block 5: KMA Standard Observation Specs */}
            <KmaObservationDetail weather={weather} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-6 px-4 text-center text-xs text-slate-400 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-300">대한민국 기상청(KMA) & 에어코리아 실시간 연동 서비스</span>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 font-mono text-slate-400">
            <a
              href="/날씨LEE2510.html"
              download="날씨LEE2510.html"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 hover:text-sky-200 text-xs font-sans font-semibold transition-all shadow-sm active:scale-95"
              title="핸드폰 및 PC에서 인터넷 브라우저로 바로 실행 가능한 단일 HTML 파일 다운로드"
            >
              <Download className="w-3.5 h-3.5" />
              <span>단일 실행파일(.html) 다운로드</span>
            </a>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-sky-300 font-semibold text-xs">
              개발자 : LEE2510
            </span>
          </div>
        </div>
      </footer>

      {/* Location Search Modal */}
      <LocationSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectRegion={handleSelectRegion}
        onUseCurrentLocation={handleGetCurrentLocation}
        loadingLocation={loading}
      />

      {/* PWA Phone Install Guide Modal */}
      <PWAInstallGuideModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />
    </div>
  );
}


import React from 'react';
import { Activity } from 'lucide-react';
import { AirQuality, CurrentWeather } from '../types';

interface AirQualityCardProps {
  airQuality: AirQuality;
  weather: CurrentWeather;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ airQuality, weather }) => {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case '좋음':
        return 'text-sky-400 bg-sky-500/15 border-sky-500/30';
      case '보통':
        return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
      case '나쁨':
        return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
      case '매우나쁨':
        return 'text-rose-400 bg-rose-500/15 border-rose-500/30';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const getProgressWidth = (val: number, max: number) => {
    return Math.min(100, Math.max(8, (val / max) * 100));
  };

  return (
    <section id="section-air-quality" className="p-4 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-lg hover:border-slate-700/80 transition-all flex flex-col justify-between h-full gap-3 sm:gap-4">
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/25 flex items-center justify-center text-teal-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-100">
                대기질 & 환경 지표
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">에어코리아 및 대기 관측</p>
            </div>
          </div>

          <span className={`px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold border font-mono ${getGradeColor(airQuality.pm10Grade)}`}>
            {airQuality.gradeText}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
          {/* 미세먼지 PM10 Bento Tile */}
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] sm:text-xs text-slate-300 font-medium">미세먼지 (PM10)</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold border ${getGradeColor(airQuality.pm10Grade)}`}>
                {airQuality.pm10Grade}
              </span>
            </div>

            <div className="flex items-baseline gap-1 my-1">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100">{airQuality.pm10}</span>
              <span className="text-[11px] sm:text-xs text-slate-400">㎍/㎥</span>
            </div>

            {/* Gauge bar */}
            <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  airQuality.pm10Grade === '좋음'
                    ? 'bg-sky-400'
                    : airQuality.pm10Grade === '보통'
                    ? 'bg-emerald-400'
                    : airQuality.pm10Grade === '나쁨'
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${getProgressWidth(airQuality.pm10, 150)}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] sm:text-[10px] text-slate-400 mt-1 font-mono">
              <span>좋음 (0~30)</span>
              <span>보통 (~80)</span>
              <span>나쁨 (~150)</span>
            </div>
          </div>

          {/* 초미세먼지 PM2.5 Bento Tile */}
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] sm:text-xs text-slate-300 font-medium">초미세먼지 (PM2.5)</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold border ${getGradeColor(airQuality.pm25Grade)}`}>
                {airQuality.pm25Grade}
              </span>
            </div>

            <div className="flex items-baseline gap-1 my-1">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100">{airQuality.pm25}</span>
              <span className="text-[11px] sm:text-xs text-slate-400">㎍/㎥</span>
            </div>

            {/* Gauge bar */}
            <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  airQuality.pm25Grade === '좋음'
                    ? 'bg-sky-400'
                    : airQuality.pm25Grade === '보통'
                    ? 'bg-emerald-400'
                    : airQuality.pm25Grade === '나쁨'
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${getProgressWidth(airQuality.pm25, 75)}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] sm:text-[10px] text-slate-400 mt-1 font-mono">
              <span>좋음 (0~15)</span>
              <span>보통 (~35)</span>
              <span>나쁨 (~75)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric secondary stats Bento Row */}
      <div className="grid grid-cols-3 gap-2 pt-2.5 sm:pt-3 border-t border-slate-800/80">
        <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center">
          <span className="text-[10px] sm:text-[11px] text-slate-400 block font-medium">기압 (hPa)</span>
          <span className="text-xs sm:text-sm font-bold font-mono text-slate-200 mt-0.5 block">{weather.pressure}</span>
        </div>
        <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center">
          <span className="text-[10px] sm:text-[11px] text-slate-400 block font-medium">오존 (O₃)</span>
          <span className="text-xs sm:text-sm font-bold font-mono text-slate-200 mt-0.5 block">{airQuality.o3 ?? 0.03}</span>
        </div>
        <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center">
          <span className="text-[10px] sm:text-[11px] text-slate-400 block font-medium">일출 / 일몰</span>
          <span className="text-[10px] sm:text-xs font-bold font-mono text-slate-200 mt-0.5 block truncate">
            {weather.sunriseTime} / {weather.sunsetTime}
          </span>
        </div>
      </div>
    </section>
  );
};

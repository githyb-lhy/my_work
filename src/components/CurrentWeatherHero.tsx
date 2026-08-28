import React from 'react';
import { Droplets, Wind, CloudRain, Sun, AlertTriangle, ArrowDown, ArrowUp, Thermometer, ShieldCheck } from 'lucide-react';
import { CurrentWeather, WeatherCondition } from '../types';
import { WeatherIcon } from './WeatherIcons';

interface CurrentWeatherHeroProps {
  weather: CurrentWeather;
}

function getWeatherBgGradient(condition: WeatherCondition, isNight: boolean): string {
  if (isNight) {
    if (condition.includes('rain') || condition.includes('shower')) {
      return 'from-slate-900 via-indigo-950 to-blue-950 border-indigo-800/40 text-white';
    }
    return 'from-slate-950 via-slate-900 to-indigo-950 border-slate-800/60 text-white';
  }

  switch (condition) {
    case 'clear':
      return 'from-sky-500 via-sky-600 to-blue-700 border-sky-400/30 text-white shadow-sky-950/30';
    case 'mostly_clear':
    case 'partly_cloudy':
      return 'from-sky-600 via-blue-600 to-slate-700 border-sky-400/30 text-white';
    case 'cloudy':
    case 'overcast':
      return 'from-slate-700 via-slate-800 to-slate-900 border-slate-600/40 text-slate-100';
    case 'light_rain':
    case 'rain':
    case 'heavy_rain':
    case 'shower':
      return 'from-blue-800 via-slate-800 to-slate-950 border-blue-600/40 text-white';
    case 'sleet':
    case 'snow':
    case 'heavy_snow':
      return 'from-indigo-800 via-slate-800 to-sky-950 border-indigo-400/30 text-white';
    case 'thunderstorm':
      return 'from-purple-900 via-slate-900 to-slate-950 border-purple-600/40 text-white';
    case 'fog':
      return 'from-slate-600 via-slate-700 to-slate-800 border-slate-500/30 text-white';
    default:
      return 'from-sky-600 via-blue-700 to-indigo-800 border-sky-500/30 text-white';
  }
}

export const CurrentWeatherHero: React.FC<CurrentWeatherHeroProps> = ({ weather }) => {
  const bgClass = getWeatherBgGradient(weather.condition, weather.isNight);

  return (
    <section id="hero-weather-card" className="w-full">
      {/* Weather Advisory Banner if present */}
      {weather.advisory?.hasAdvisory && (
        <div id="weather-advisory-banner" className="mb-3.5 p-3.5 sm:p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-start gap-3 text-amber-200 backdrop-blur-md shadow-sm">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5 border border-amber-500/30">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center gap-1.5 font-bold text-amber-300">
              <span>[기상특보] {weather.advisory.title}</span>
              <span className="text-[10px] font-mono font-normal text-amber-400/80 px-1.5 py-0.5 rounded bg-amber-950/50 border border-amber-500/20">
                {weather.advisory.publishedAt}
              </span>
            </div>
            <p className="mt-1 text-slate-200 text-[11px] sm:text-xs leading-relaxed">{weather.advisory.content}</p>
          </div>
        </div>
      )}

      {/* Main Hero Bento Card */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${bgClass} border p-4 sm:p-7 shadow-2xl transition-all duration-300`}>
        {/* Background visual light circle effect */}
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-72 h-72 bg-black/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4 sm:gap-6">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
              <span>{weather.location.dongName} 실시간</span>
            </div>
            <div className="text-[11px] sm:text-xs text-white/80 font-mono tracking-wide px-2 py-0.5 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10">
              기상청 초단기실황
            </div>
          </div>

          {/* Center Weather Main Numbers */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3.5 sm:gap-6">
              <div className="p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 shadow-lg flex items-center justify-center shrink-0">
                <WeatherIcon condition={weather.condition} isNight={weather.isNight} className="w-14 h-14 sm:w-20 sm:h-20 drop-shadow-md" />
              </div>

              <div>
                <div className="flex items-baseline gap-2 sm:gap-3">
                  <span className="text-5xl sm:text-7xl font-extrabold tracking-tight font-mono">
                    {weather.temperature > 0 ? `+${weather.temperature}` : weather.temperature}°
                  </span>
                  <span className="text-xl sm:text-3xl font-bold text-white/95">
                    {weather.conditionKorean}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 mt-1.5 text-xs sm:text-sm text-white/90">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 border border-white/20">
                    <Thermometer className="w-3 h-3 text-white/80" />
                    체감 {weather.feelsLike}°
                  </span>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-sky-500/30 border border-sky-300/40 text-sky-100">
                    <ArrowDown className="w-2.5 h-2.5 text-sky-200" />
                    최저 {weather.minTempToday}°
                  </span>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-rose-500/30 border border-rose-300/40 text-rose-100">
                    <ArrowUp className="w-2.5 h-2.5 text-rose-200" />
                    최고 {weather.maxTempToday}°
                  </span>
                </div>
              </div>
            </div>

            {/* Air Quality Mini Bento Badge on Mobile */}
            <div className="grid grid-cols-2 sm:flex sm:flex-col items-stretch sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-white/15 gap-2">
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-black/20 backdrop-blur-md border border-white/15 text-left sm:text-right">
                <div className="text-[10px] sm:text-[11px] text-white/70">미세먼지 상태</div>
                <div className="text-xs sm:text-sm font-bold flex items-center sm:justify-end gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${weather.airQuality.pm10Grade === '좋음' ? 'bg-sky-400' : weather.airQuality.pm10Grade === '보통' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span>{weather.airQuality.pm10Grade} ({weather.airQuality.pm10}㎍)</span>
                </div>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-black/20 backdrop-blur-md border border-white/15 text-left sm:text-right">
                <div className="text-[10px] sm:text-[11px] text-white/70">초미세먼지 상태</div>
                <div className="text-xs sm:text-sm font-bold mt-0.5 font-mono">
                  {weather.airQuality.pm25Grade} ({weather.airQuality.pm25}㎍/㎥)
                </div>
              </div>
            </div>
          </div>

          {/* 4 Core Observation Bento Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 pt-3 sm:pt-4 border-t border-white/20">
            {/* 습도 REH */}
            <div id="stat-humidity" className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3 hover:bg-white/15 transition-all">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-500/25 border border-sky-300/40 flex items-center justify-center text-sky-200 shrink-0">
                <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs text-white/75 font-medium truncate">습도 (REH)</div>
                <div className="text-base sm:text-lg font-extrabold font-mono text-white">{weather.humidity}%</div>
              </div>
            </div>

            {/* 바람 WSD / VEC */}
            <div id="stat-wind" className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3 hover:bg-white/15 transition-all">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-500/25 border border-teal-300/40 flex items-center justify-center text-teal-200 shrink-0">
                <Wind className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs text-white/75 font-medium truncate">바람 (WSD)</div>
                <div className="text-sm sm:text-lg font-extrabold font-mono text-white truncate">
                  {weather.windDirection} {weather.windSpeed}m/s
                </div>
              </div>
            </div>

            {/* 1시간 강수량 RN1 */}
            <div id="stat-precip" className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3 hover:bg-white/15 transition-all">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/25 border border-blue-300/40 flex items-center justify-center text-blue-200 shrink-0">
                <CloudRain className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs text-white/75 font-medium truncate">1시간강수량 (RN1)</div>
                <div className="text-base sm:text-lg font-extrabold font-mono text-white">
                  {weather.precipitation1h > 0 ? `${weather.precipitation1h}mm` : '0 mm'}
                </div>
              </div>
            </div>

            {/* 자외선 지수 UV */}
            <div id="stat-uv" className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3 hover:bg-white/15 transition-all">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/25 border border-amber-300/40 flex items-center justify-center text-amber-200 shrink-0">
                <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs text-white/75 font-medium truncate">자외선 지수</div>
                <div className="text-sm sm:text-lg font-extrabold font-mono text-white truncate">
                  {weather.uvIndex} ({weather.uvGrade})
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Calendar, Droplets } from 'lucide-react';
import { DailyForecastItem } from '../types';
import { WeatherIcon } from './WeatherIcons';

interface DailyForecastViewProps {
  daily: DailyForecastItem[];
}

function formatDailyDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length >= 3) {
    return `${parseInt(parts[1], 10)}/${parseInt(parts[2], 10)}`;
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }
  return dateStr;
}

export const DailyForecastView: React.FC<DailyForecastViewProps> = ({ daily }) => {
  if (!daily || daily.length === 0) return null;

  // Calculate min & max among all 7 days for relative bar alignment
  const allMins = daily.map((d) => d.minTemp);
  const allMaxs = daily.map((d) => d.maxTemp);
  const lowest = Math.min(...allMins);
  const highest = Math.max(...allMaxs);
  const range = Math.max(1, highest - lowest);

  return (
    <section id="section-daily-forecast" className="p-4 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-lg hover:border-slate-700/80 transition-all">
      <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
          <Calendar className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100">
            기상청 7일 주간 예보
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400">향후 일주일간의 날씨 및 기온 변화</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {daily.map((item, idx) => {
          const isToday = idx === 0;
          const leftPercent = ((item.minTemp - lowest) / range) * 100;
          const widthPercent = Math.max(8, ((item.maxTemp - item.minTemp) / range) * 100);

          return (
            <div
              key={item.date}
              className={`p-2.5 sm:px-4 sm:py-3 rounded-2xl flex items-center justify-between gap-2 text-xs sm:text-sm border transition-all ${
                isToday
                  ? 'bg-sky-950/30 border-sky-500/40 shadow-sm shadow-sky-950/30 ring-1 ring-sky-500/20'
                  : 'bg-slate-950/40 border-slate-800/70 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              {/* Day Name & Date */}
              <div className="w-20 sm:w-26 font-semibold flex items-center gap-1.5 shrink-0">
                <span className={`text-xs sm:text-sm ${isToday ? 'text-sky-400 font-bold' : 'text-slate-200'}`}>
                  {item.dayName}
                </span>
                <span
                  className={`text-[10px] sm:text-[11px] font-mono px-1.5 py-0.5 rounded-md ${
                    isToday
                      ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                      : 'text-slate-400 bg-slate-900/80 border border-slate-800/80'
                  }`}
                >
                  {formatDailyDate(item.date)}
                </span>
              </div>

              {/* Rain Chance */}
              <div className="w-11 sm:w-14 text-center font-mono shrink-0">
                {Math.max(item.popAm, item.popPm) > 0 ? (
                  <span className="inline-flex items-center gap-0.5 text-blue-400 font-medium text-[11px] sm:text-xs">
                    <Droplets className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    {Math.max(item.popAm, item.popPm)}%
                  </span>
                ) : (
                  <span className="text-slate-600 text-[11px] sm:text-xs">-</span>
                )}
              </div>

              {/* Weather Icon & Condition Text */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:w-32 min-w-0">
                <div className="p-1 rounded-lg bg-slate-900/80 shrink-0">
                  <WeatherIcon condition={item.conditionAm} className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-slate-300 text-[11px] sm:text-xs truncate">
                  {item.conditionTextAm}
                </span>
              </div>

              {/* Temp Min */}
              <div className="w-8 sm:w-10 text-right font-mono text-sky-300 font-bold text-xs sm:text-sm shrink-0">
                {item.minTemp}°
              </div>

              {/* Visual Temperature Range Bar (on larger mobile and up) */}
              <div className="flex-1 h-2 bg-slate-800/80 rounded-full relative overflow-hidden max-w-[120px] hidden md:block">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400"
                  style={{
                    marginLeft: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                />
              </div>

              {/* Temp Max */}
              <div className="w-8 sm:w-10 text-right sm:text-left font-mono text-rose-300 font-bold text-xs sm:text-sm shrink-0">
                {item.maxTemp}°
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

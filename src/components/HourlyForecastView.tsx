import React, { useState } from 'react';
import { Clock, Droplets, TrendingUp } from 'lucide-react';
import { HourlyForecastItem } from '../types';
import { WeatherIcon } from './WeatherIcons';

interface HourlyForecastViewProps {
  hourly: HourlyForecastItem[];
}

export const HourlyForecastView: React.FC<HourlyForecastViewProps> = ({ hourly }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!hourly || hourly.length === 0) return null;

  const items = hourly.slice(0, 24);

  // Min and max temperatures
  const temps = items.map((h) => h.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = Math.max(1, maxTemp - minTemp);

  // Time segment summaries (새벽, 오전, 오후, 밤)
  const segments = [
    {
      name: '새벽',
      timeRange: '00시 ~ 06시',
      iconEmoji: '🌙',
      items: items.filter((_, idx) => {
        const hour = parseInt(items[idx].time.split(':')[0], 10);
        return hour >= 0 && hour < 6;
      }),
    },
    {
      name: '오전',
      timeRange: '06시 ~ 12시',
      iconEmoji: '🌅',
      items: items.filter((_, idx) => {
        const hour = parseInt(items[idx].time.split(':')[0], 10);
        return hour >= 6 && hour < 12;
      }),
    },
    {
      name: '오후',
      timeRange: '12시 ~ 18시',
      iconEmoji: '☀️',
      items: items.filter((_, idx) => {
        const hour = parseInt(items[idx].time.split(':')[0], 10);
        return hour >= 12 && hour < 18;
      }),
    },
    {
      name: '저녁·밤',
      timeRange: '18시 ~ 24시',
      iconEmoji: '✨',
      items: items.filter((_, idx) => {
        const hour = parseInt(items[idx].time.split(':')[0], 10);
        return hour >= 18 || hour === 0;
      }),
    },
  ];

  // SVG Chart calculation for 24 hours (scales fully to width without overflowing)
  const svgWidth = 800;
  const svgHeight = 115;
  const paddingX = 24;
  const paddingY = 24;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const points = items.map((item, idx) => {
    const x = paddingX + (idx / (items.length - 1 || 1)) * chartWidth;
    const y = paddingY + chartHeight - ((item.temp - minTemp) / tempRange) * chartHeight;
    return { x, y, ...item, idx };
  });

  const pathD = points.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[idx - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${svgHeight} L ${points[0].x},${svgHeight} Z`;

  return (
    <section id="section-hourly-forecast" className="w-full max-w-full overflow-hidden p-4 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-lg hover:border-slate-700/80 transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-sky-400 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-100">
                오늘 24시간 시간별 예보
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono">
                최저 {minTemp}° / 최고 {maxTemp}°
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400">24시간 동안의 기온 추이 및 강수확률(POP) 변화</p>
          </div>
        </div>
      </div>

      {/* 4 Time-Segment Overview Cards (새벽 / 오전 / 오후 / 저녁·밤) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 w-full">
        {segments.map((seg) => {
          const segTemps = seg.items.map((i) => i.temp);
          const segMin = segTemps.length > 0 ? Math.min(...segTemps) : minTemp;
          const segMax = segTemps.length > 0 ? Math.max(...segTemps) : maxTemp;
          const maxPop = seg.items.length > 0 ? Math.max(...seg.items.map((i) => i.pop)) : 0;
          const representativeItem = seg.items[Math.floor(seg.items.length / 2)] || items[0];

          return (
            <div
              key={seg.name}
              className="p-3 sm:p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between gap-2 hover:border-slate-700/80 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{seg.iconEmoji}</span>
                  <span className="text-xs font-bold text-slate-200">{seg.name}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-medium">{seg.timeRange}</span>
              </div>

              <div className="flex items-center justify-between gap-2 my-0.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                    <WeatherIcon
                      condition={representativeItem.condition}
                      isNight={representativeItem.isNight}
                      className="w-4 h-4 text-sky-300"
                    />
                  </div>
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-sm sm:text-base font-bold text-slate-100">
                      {segMin === segMax ? `${segMin}°` : `${segMin}°~${segMax}°`}
                    </span>
                  </div>
                </div>

                {maxPop > 0 ? (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[10px] font-mono font-bold">
                    <Droplets className="w-2.5 h-2.5" />
                    {maxPop}%
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-medium">강수없음</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 24-Hour Continuous Temperature Curve Visual Graph (Screen Contained) */}
      <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 w-full overflow-hidden">
        <div className="flex items-center justify-between mb-2 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
            <span>24시간 기온 및 강수 연속 흐름</span>
          </div>
          <span className="text-[11px] font-mono text-slate-300 truncate max-w-[55%] text-right">
            {hoveredIndex !== null ? (
              <span className="text-sky-300 font-bold">
                {items[hoveredIndex].time} • {items[hoveredIndex].temp}°C ({items[hoveredIndex].pop}%)
              </span>
            ) : (
              '24시간 연속 추이'
            )}
          </span>
        </div>

        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-24 sm:h-28 select-none block"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="hourlyTempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area */}
            <path d={areaD} fill="url(#hourlyTempGrad)" />

            {/* Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Points, Temperature labels, and Icons */}
            {points.map((pt, idx) => {
              const isHovered = hoveredIndex === idx;
              const isExtreme = pt.temp === minTemp || pt.temp === maxTemp;
              const isStep = idx % 2 === 0;

              return (
                <g
                  key={`pt-${idx}`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                >
                  {/* Hover column guideline */}
                  {isHovered && (
                    <line
                      x1={pt.x}
                      y1={0}
                      x2={pt.x}
                      y2={svgHeight}
                      stroke="#38bdf8"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      opacity="0.8"
                    />
                  )}

                  {/* Rain Probability Bar at Bottom */}
                  {pt.pop > 0 && (
                    <rect
                      x={pt.x - 3}
                      y={svgHeight - (pt.pop / 100) * 16}
                      width="6"
                      height={(pt.pop / 100) * 16}
                      rx="1.5"
                      fill="#60a5fa"
                      opacity="0.75"
                    />
                  )}

                  {/* Point Circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 4.5 : isExtreme ? 3 : 1.8}
                    fill={isExtreme ? (pt.temp === maxTemp ? '#fb7185' : '#38bdf8') : '#0f172a'}
                    stroke={isExtreme ? '#ffffff' : '#38bdf8'}
                    strokeWidth={isHovered ? 2 : 1.2}
                  />

                  {/* Temp Text */}
                  {(isStep || isHovered || isExtreme) && (
                    <text
                      x={pt.x}
                      y={pt.y - 6}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="JetBrains Mono, monospace"
                      fill={pt.temp === maxTemp ? '#fca5a5' : pt.temp === minTemp ? '#93c5fd' : '#e2e8f0'}
                    >
                      {pt.temp}°
                    </text>
                  )}

                  {/* Time Text at baseline */}
                  {isStep && (
                    <text
                      x={pt.x}
                      y={svgHeight - 2}
                      textAnchor="middle"
                      fontSize="8.5"
                      fontFamily="JetBrains Mono, monospace"
                      fill="#94a3b8"
                    >
                      {pt.time.slice(0, 2)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
};

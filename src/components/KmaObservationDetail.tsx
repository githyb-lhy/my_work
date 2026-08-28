import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { CurrentWeather } from '../types';

interface KmaObservationDetailProps {
  weather: CurrentWeather;
}

export const KmaObservationDetail: React.FC<KmaObservationDetailProps> = ({ weather }) => {
  const [isOpen, setIsOpen] = useState(false);

  const kmaCodes = [
    { code: 'T1H', name: '기온', val: `${weather.temperature} ℃`, desc: '지상 1.5m 높이의 대기 온도' },
    { code: 'RN1', name: '1시간 강수량', val: `${weather.precipitation1h} mm`, desc: '관측 시각 기준 1시간 누적 강수량' },
    { code: 'REH', name: '상대습도', val: `${weather.humidity} %`, desc: '공기 중 수증기 포화도' },
    { code: 'PTY', name: '강수형태', val: `코드 ${weather.ptyCode} (${weather.ptyCode === 0 ? '없음' : weather.ptyCode === 1 ? '비' : weather.ptyCode === 2 ? '비/눈' : weather.ptyCode === 3 ? '눈' : '빗방울'})`, desc: '기상청 강수형태 코드' },
    { code: 'WSD', name: '풍속', val: `${weather.windSpeed} m/s`, desc: '지상 10m 평균 풍속' },
    { code: 'VEC', name: '풍향', val: `${weather.windDirection} (${weather.windDirectionDeg}°)`, desc: '16방위 기상청 표준 풍향' },
    { code: 'SKY', name: '하늘상태', val: `코드 ${weather.skyCode} (${weather.skyCode === 1 ? '맑음' : weather.skyCode === 3 ? '구름많음' : '흐림'})`, desc: '기상청 운량 기준 하늘상태' },
  ];

  return (
    <section id="section-kma-observation-raw" className="rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-lg overflow-hidden hover:border-slate-700/80 transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-6 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs sm:text-base font-bold text-slate-100 flex flex-wrap items-center gap-1.5">
              <span>기상청(KMA) 표준 관측 데이터</span>
              <span className="text-[10px] sm:text-[11px] font-mono font-normal px-2 py-0.2 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                초단기실황
              </span>
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate">
              기상청 Open API 표준 코드 및 LCC 좌표 변환 정보
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400 shrink-0 ml-2">
          <span className="text-[11px] hidden sm:inline font-mono">{isOpen ? '접기' : '자세히 보기'}</span>
          <div className="p-1 rounded-lg bg-slate-800/60 border border-slate-800">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="p-4 sm:p-6 pt-0 border-t border-slate-800/80 mt-1">
          {/* Bento Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 my-3 sm:my-4">
            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 block text-[10px] sm:text-[11px] font-medium">기상청 격자 좌표</span>
              <span className="font-mono font-bold text-slate-100 text-xs sm:text-sm mt-0.5 block">X: {weather.location.nx}, Y: {weather.location.ny}</span>
            </div>
            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 block text-[10px] sm:text-[11px] font-medium">WGS84 위경도</span>
              <span className="font-mono font-bold text-slate-100 text-xs sm:text-sm mt-0.5 block">{weather.location.lat.toFixed(4)}, {weather.location.lng.toFixed(4)}</span>
            </div>
            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 block text-[10px] sm:text-[11px] font-medium">발표 기준 일자/시각</span>
              <span className="font-mono font-bold text-slate-100 text-xs sm:text-sm mt-0.5 block">{weather.baseDate} {weather.baseTime}</span>
            </div>
            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 block text-[10px] sm:text-[11px] font-medium">데이터 연동 상태</span>
              <span className="text-xs sm:text-sm font-bold mt-0.5 block flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                기상청 실시간 동기화
              </span>
            </div>
          </div>

          {/* KMA Standard Code Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/40 p-1">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800/80 text-slate-400 bg-slate-900/50 text-[11px]">
                  <th className="py-2.5 px-3 font-semibold">항목코드</th>
                  <th className="py-2.5 px-3 font-semibold">항목명</th>
                  <th className="py-2.5 px-3 font-semibold">관측값</th>
                  <th className="py-2.5 px-3 font-semibold hidden sm:table-cell">설명</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {kmaCodes.map((item) => (
                  <tr key={item.code} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-sky-400 text-xs">{item.code}</td>
                    <td className="py-2.5 px-3 text-slate-200 font-medium text-xs">{item.name}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-100 text-xs">{item.val}</td>
                    <td className="py-2.5 px-3 text-slate-400 hidden sm:table-cell text-xs">{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* LCC Formula Notice */}
          <div className="mt-3 p-3 sm:p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 text-[11px] sm:text-xs text-slate-400 leading-relaxed">
            💡 <strong className="text-slate-200">기상청 격자 변환:</strong> 본 애플리케이션은 기상청(KMA) 표준 Lambert Conformal Conic (람베르트 등각원추투영법) 정밀 알고리즘을 적용하여 스마트폰 GPS 위경도 좌표를 기상청 격자 좌표(X, Y)로 실시간 변환하여 데이터를 조회합니다.
          </div>
        </div>
      )}
    </section>
  );
};

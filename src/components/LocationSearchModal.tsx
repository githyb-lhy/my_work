import React, { useState, useMemo } from 'react';
import { Search, X, MapPin, Compass, Navigation } from 'lucide-react';
import { KOREA_MAJOR_REGIONS } from '../data/koreaRegions';
import { RegionInfo } from '../types';

interface LocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRegion: (region: RegionInfo) => void;
  onUseCurrentLocation: () => void;
  loadingLocation: boolean;
}

export const LocationSearchModal: React.FC<LocationSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectRegion,
  onUseCurrentLocation,
  loadingLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRegions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return KOREA_MAJOR_REGIONS;
    return KOREA_MAJOR_REGIONS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.fullName.toLowerCase().includes(q) ||
        r.province.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        (r.district && r.district.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="location-search-modal"
        className="w-full max-w-lg bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] backdrop-blur-xl"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-sky-400">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">대한민국 지역 날씨 검색</h3>
              <p className="text-xs text-slate-400">기상청 표준 격자가 등록된 전국 주요 지역</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/40">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="시·군·구, 동 이름으로 검색 (예: 강남, 분당, 해운대, 송도)"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-inner"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Current GPS button */}
          <button
            onClick={() => {
              onUseCurrentLocation();
              onClose();
            }}
            disabled={loadingLocation}
            className="w-full mt-3 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 text-sky-300 text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <Compass className={`w-4 h-4 text-sky-400 ${loadingLocation ? 'animate-spin' : ''}`} />
            <span>현재 GPS 위치로 즉시 설정하기</span>
          </button>
        </div>

        {/* Region List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-800/60 bento-scrollbar">
          {filteredRegions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              검색 결과가 없습니다. 다른 검색어를 입력해 보세요.
            </div>
          ) : (
            filteredRegions.map((region) => (
              <button
                key={region.id}
                onClick={() => {
                  onSelectRegion(region);
                  onClose();
                }}
                className="w-full py-3 px-3 flex items-center justify-between text-left hover:bg-slate-800/60 rounded-xl transition-all group my-0.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 group-hover:text-sky-400 group-hover:bg-sky-500/15 group-hover:border-sky-500/30 transition-all">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200 group-hover:text-sky-300 transition-colors">
                      {region.name}
                    </div>
                    <div className="text-xs text-slate-400">{region.fullName}</div>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400 font-mono bg-slate-950/60 px-2 py-1 rounded-md border border-slate-800">
                  격자 {region.nx}, {region.ny}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

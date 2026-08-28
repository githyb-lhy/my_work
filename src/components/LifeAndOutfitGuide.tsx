import React from 'react';
import { Shirt, Umbrella, Sparkles, AlertTriangle, Layers, Compass, Wind } from 'lucide-react';
import { LifeIndices, CurrentWeather } from '../types';

interface LifeAndOutfitGuideProps {
  lifeIndices: LifeIndices;
  weather: CurrentWeather;
}

// Temperature range based outfit advice generator
const getDetailedOutfitInfo = (temp: number, feelsLike: number, minTemp: number, maxTemp: number, condition: string) => {
  const tempDiff = maxTemp - minTemp;
  const isRain = condition.includes('rain') || condition.includes('shower') || condition.includes('thunder');
  const isSnow = condition.includes('snow');

  if (temp >= 28) {
    return {
      category: '한여름 무더위',
      categoryColor: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
      summary: '통풍이 잘되는 린넨, 쿨맥스 소재의 시원하고 가벼운 옷차림이 필수입니다.',
      top: '민소매, 얇은 반팔 티셔츠, 린넨 셔츠, 쿨링 티셔츠',
      bottom: '반바지, 린넨 팬츠, 얇은 치마, 냉감 슬랙스',
      outer: '실내 냉방 대비 얇은 여름 셔츠 또는 볼레로',
      accessories: isRain ? ['우산', '방수 샌들'] : ['자외선 차단제', '양산/모자', '선글라스'],
      tags: ['#민소매', '#린넨셔츠', '#쿨링웨어', '#반바지', '#통풍우수'],
    };
  }
  if (temp >= 23) {
    return {
      category: '초여름 · 따뜻함',
      categoryColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
      summary: '반팔과 얇은 긴팔이 어울리는 쾌적하고 활동하기 좋은 날씨입니다.',
      top: '반팔 티셔츠, 얇은 셔츠, 피케 셔츠, 반팔 블라우스',
      bottom: '면바지, 슬랙스, 얇은 청바지, 반바지',
      outer: tempDiff >= 8 ? '아침·저녁용 얇은 가디건 또는 셔츠' : '불필요',
      accessories: isRain ? ['휴대용 우산', '레인부츠'] : ['자외선 차단제', '선글라스'],
      tags: ['#반팔티', '#얇은셔츠', '#슬랙스', '#면바지', '#가벼운외출'],
    };
  }
  if (temp >= 20) {
    return {
      category: '완연한 봄 · 가을',
      categoryColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
      summary: '가장 쾌적한 기온으로, 긴팔 티셔츠나 셔츠, 얇은 가디건 조합을 추천합니다.',
      top: '긴팔 티셔츠, 블라우스, 셔츠, 7부 티셔츠',
      bottom: '청바지, 슬랙스, 면바지, 롱스커트',
      outer: '얇은 가디건, 니트 조끼, 셔츠 레이어드',
      accessories: isRain ? ['우산'] : ['가벼운 스카프'],
      tags: ['#긴팔티', '#셔츠', '#얇은가디건', '#청바지', '#슬랙스'],
    };
  }
  if (temp >= 17) {
    return {
      category: '선선한 환절기',
      categoryColor: 'text-sky-400 bg-sky-500/15 border-sky-500/30',
      summary: '살짝 선선하여 맨투맨, 후드티 또는 얇은 니트가 제격인 날씨입니다.',
      top: '맨투맨, 후드티, 얇은 니트, 긴팔 셔츠',
      bottom: '청바지, 슬랙스, 트레이닝 팬츠',
      outer: '가디건, 바람막이 자켓, 니트 가디건',
      accessories: isRain ? ['튼튼한 우산'] : ['양말(스니커즈)'],
      tags: ['#맨투맨', '#후드티', '#가디건', '#바람막이', '#청바지'],
    };
  }
  if (temp >= 12) {
    return {
      category: '쌀쌀한 봄 · 가을',
      categoryColor: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
      summary: '아침저녁으로 쌀쌀하므로 자켓, 야상, 도톰한 가디건 등 겉옷이 필수입니다.',
      top: '도톰한 니트, 기모 없는 맨투맨, 셔츠 레이어드',
      bottom: '청바지, 면바지, 슬랙스, 스타킹',
      outer: '자켓, 야상 점퍼, 가죽 자켓, 청자켓, 트렌치코트',
      accessories: isRain ? ['방풍 우산'] : ['머플러(선택)'],
      tags: ['#자켓', '#야상점퍼', '#트렌치코트', '#도톰한니트', '#가죽자켓'],
    };
  }
  if (temp >= 9) {
    return {
      category: '늦가을 · 초겨울',
      categoryColor: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
      summary: '체감온도가 낮아지니 트렌치코트, 점퍼, 두꺼운 니트로 보온에 신경 쓰세요.',
      top: '도톰한 울 니트, 기모 맨투맨, 목폴라 티셔츠',
      bottom: '기모 청바지, 두꺼운 슬랙스, 골덴 바지',
      outer: '트렌치코트, 숏패딩, 항공점퍼, 코트, 두꺼운 야상',
      accessories: isRain ? ['방수 우산'] : ['가벼운 머플러', '두꺼운 양말'],
      tags: ['#코트', '#숏패딩', '#기모의류', '#울니트', '#목폴라'],
    };
  }
  if (temp >= 5) {
    return {
      category: '겨울 추위',
      categoryColor: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
      summary: '울코트나 가죽자켓, 발열내의(히트텍)를 챙겨 입어 체온을 유지해야 합니다.',
      top: '발열내의(히트텍), 두꺼운 스웨터, 기모 후드',
      bottom: '기모 바지, 방풍 팬츠, 기모 타이즈',
      outer: '울코트, 헤비 숏패딩, 가죽자켓, 플리스 자켓',
      accessories: isSnow ? ['방설 우산', '방한화', '장갑'] : ['목도리', '장갑', '방한 양말'],
      tags: ['#울코트', '#발열내의', '#플리스', '#기모바지', '#목도리'],
    };
  }
  return {
    category: '한파 · 극심한 추위',
    categoryColor: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
    summary: '롱패딩 등 방한 아우터와 목도리, 장갑 등 완전 방한 장비를 필수로 갖추세요.',
    top: '두꺼운 발열내의, 헤비 기모 니트/후드, 터틀넥',
    bottom: '패딩 팬츠, 두꺼운 기모 안감 바지',
    outer: '롱패딩, 헤비 다운자켓, 무스탕',
    accessories: ['목도리/머플러', '보온 장갑', '방한모자', '핫팩', isSnow ? '방수 방한화' : '두꺼운 양말'],
    tags: ['#롱패딩', '#헤비다운', '#히트텍필수', '#목도리장갑', '#방한무장'],
  };
};

export const LifeAndOutfitGuide: React.FC<LifeAndOutfitGuideProps> = ({
  lifeIndices,
  weather,
}) => {
  const outfit = getDetailedOutfitInfo(
    weather.temperature,
    weather.feelsLike,
    weather.minTempToday,
    weather.maxTempToday,
    weather.condition
  );

  const tempDiff = weather.maxTempToday - weather.minTempToday;
  const isLargeTempDiff = tempDiff >= 9;

  return (
    <div id="life-outfit-guide-container" className="flex flex-col gap-3.5 sm:gap-5 h-full">
      {/* 1. 오늘의 상세 맞춤 옷차림 추천 Bento Card */}
      <div id="card-outfit-guide" className="p-4 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-lg hover:border-slate-700/80 transition-all flex flex-col justify-between gap-3 sm:gap-4">
        <div>
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-400">
                <Shirt className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                  오늘의 맞춤 옷차림 가이드
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400">기온 및 체감 온도 기반 실시간 추천 코디</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] sm:text-xs px-2.5 py-1 rounded-xl border font-bold ${outfit.categoryColor}`}>
                {outfit.category} ({weather.temperature}°C)
              </span>
            </div>
          </div>

          {/* Core Tip Message */}
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 shadow-inner mb-3">
            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-lg bg-violet-500/20 text-violet-300 mt-0.5 shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-relaxed">
                  {outfit.summary}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 leading-normal">
                  {lifeIndices.outfitTip}
                </p>
              </div>
            </div>
          </div>

          {/* Specific Clothing Breakdown (상의 / 하의 / 겉옷 / 소품) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 mb-3">
            {/* 상의 */}
            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-start gap-2">
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 shrink-0">
                상의
              </span>
              <span className="text-xs text-slate-200 leading-tight pt-0.5">
                {outfit.top}
              </span>
            </div>

            {/* 하의 */}
            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-start gap-2">
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                하의
              </span>
              <span className="text-xs text-slate-200 leading-tight pt-0.5">
                {outfit.bottom}
              </span>
            </div>

            {/* 아우터 */}
            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-start gap-2">
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                아우터
              </span>
              <span className="text-xs text-slate-200 leading-tight pt-0.5">
                {outfit.outer}
              </span>
            </div>

            {/* 소품 및 준비물 */}
            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-start gap-2">
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                추천 소품
              </span>
              <span className="text-xs text-slate-200 leading-tight pt-0.5">
                {outfit.accessories.join(', ')}
              </span>
            </div>
          </div>

          {/* Large Temperature Difference Notice Banner */}
          {isLargeTempDiff && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>일교차 주의 ({tempDiff}°C):</strong> 낮과 아침·저녁 기온차가 크므로 입고 벗기 편한 겉옷을 꼭 챙기세요.
              </span>
            </div>
          )}

          {/* Outfit Hashtag Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {outfit.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-300 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Umbrella recommendation banner */}
        <div className={`p-3 sm:p-3.5 rounded-2xl flex items-center gap-3 border transition-all ${
          lifeIndices.umbrellaNeeded
            ? 'bg-blue-500/15 border-blue-500/35 text-blue-100 shadow-sm shadow-blue-500/10'
            : 'bg-slate-950/40 border-slate-800/80 text-slate-300'
        }`}>
          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${
            lifeIndices.umbrellaNeeded
              ? 'bg-blue-500/25 text-blue-300 border border-blue-400/40'
              : 'bg-slate-800 text-slate-400 border border-slate-700/60'
          }`}>
            <Umbrella className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <span className={`font-bold block ${lifeIndices.umbrellaNeeded ? 'text-blue-300' : 'text-slate-200'}`}>
              {lifeIndices.umbrellaNeeded ? '우산 챙기기 권장' : '우산 불필요'}
            </span>
            <p className="text-slate-300 mt-0.5 text-[11px] sm:text-xs leading-tight">{lifeIndices.umbrellaTip}</p>
          </div>
        </div>
      </div>

      {/* 2. 생활 기상 지수 Bento Card */}
      <div id="card-life-indices" className="p-4 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-lg hover:border-slate-700/80 transition-all flex flex-col justify-between">
        <div className="flex items-center gap-2 sm:gap-2.5 mb-2.5 sm:mb-3.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100">
              기상청 생활 기상 지수
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {/* 빨래 지수 */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-medium text-slate-300 text-[11px] sm:text-xs">🧺 빨래</span>
              <span className="font-bold text-slate-100 font-mono text-xs">{lifeIndices.laundryScore}점</span>
            </div>
            <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-1">
              <div
                className={`h-full rounded-full ${lifeIndices.laundryScore >= 70 ? 'bg-emerald-400' : lifeIndices.laundryScore >= 40 ? 'bg-amber-400' : 'bg-rose-400'}`}
                style={{ width: `${lifeIndices.laundryScore}%` }}
              />
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight truncate">{lifeIndices.laundryText}</p>
          </div>

          {/* 세차 지수 */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-medium text-slate-300 text-[11px] sm:text-xs">🚗 세차</span>
              <span className="font-bold text-slate-100 font-mono text-xs">{lifeIndices.carWashScore}점</span>
            </div>
            <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-1">
              <div
                className={`h-full rounded-full ${lifeIndices.carWashScore >= 70 ? 'bg-sky-400' : lifeIndices.carWashScore >= 40 ? 'bg-amber-400' : 'bg-rose-400'}`}
                style={{ width: `${lifeIndices.carWashScore}%` }}
              />
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight truncate">{lifeIndices.carWashText}</p>
          </div>

          {/* 산책 / 야외활동 지수 */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-medium text-slate-300 text-[11px] sm:text-xs">👟 산책</span>
              <span className="font-bold text-slate-100 font-mono text-xs">{lifeIndices.walkScore}점</span>
            </div>
            <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-1">
              <div
                className={`h-full rounded-full ${lifeIndices.walkScore >= 70 ? 'bg-teal-400' : lifeIndices.walkScore >= 40 ? 'bg-amber-400' : 'bg-rose-400'}`}
                style={{ width: `${lifeIndices.walkScore}%` }}
              />
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight truncate">{lifeIndices.walkText}</p>
          </div>

          {/* 실내 환기 가이드 */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-medium text-slate-300 text-[11px] sm:text-xs">🪟 실내 환기</span>
              <span className="font-bold text-slate-100 font-mono text-xs">{lifeIndices.ventilationScore}점</span>
            </div>
            <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-1">
              <div
                className={`h-full rounded-full ${lifeIndices.ventilationScore >= 70 ? 'bg-indigo-400' : lifeIndices.ventilationScore >= 40 ? 'bg-amber-400' : 'bg-rose-400'}`}
                style={{ width: `${lifeIndices.ventilationScore}%` }}
              />
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight truncate">{lifeIndices.ventilationText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

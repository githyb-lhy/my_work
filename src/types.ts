export interface KmaCoords {
  nx: number;
  ny: number;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface RegionInfo {
  id: string;
  name: string;
  fullName: string;
  province: string;
  city: string;
  district?: string;
  lat: number;
  lng: number;
  nx: number;
  ny: number;
}

export type WeatherCondition =
  | 'clear'
  | 'mostly_clear'
  | 'partly_cloudy'
  | 'cloudy'
  | 'overcast'
  | 'light_rain'
  | 'rain'
  | 'heavy_rain'
  | 'shower'
  | 'sleet'
  | 'snow'
  | 'heavy_snow'
  | 'thunderstorm'
  | 'fog';

export interface AirQuality {
  pm10: number; // ㎍/㎥
  pm10Grade: '좋음' | '보통' | '나쁨' | '매우나쁨';
  pm25: number; // ㎍/㎥
  pm25Grade: '좋음' | '보통' | '나쁨' | '매우나쁨';
  o3?: number; // ppm
  no2?: number; // ppm
  so2?: number; // ppm
  co?: number; // ppm
  aqi?: number;
  gradeText: string;
}

export interface HourlyForecastItem {
  time: string; // "14:00", "15:00", etc.
  date: string; // "2026-08-27"
  temp: number;
  condition: WeatherCondition;
  conditionText: string;
  pop: number; // Precipitation probability (%)
  rainAmount: number; // mm
  humidity: number; // %
  windSpeed: number; // m/s
  windDirection: string; // "북서풍"
  isNight?: boolean;
}

export interface DailyForecastItem {
  date: string; // "2026-08-27"
  dayName: string; // "오늘", "내일", "모레", "금", "토" etc.
  minTemp: number;
  maxTemp: number;
  conditionAm: WeatherCondition;
  conditionPm: WeatherCondition;
  conditionTextAm: string;
  conditionTextPm: string;
  popAm: number;
  popPm: number;
}

export interface LifeIndices {
  outfitTip: string;
  umbrellaNeeded: boolean;
  umbrellaTip: string;
  laundryScore: number; // 0 ~ 100
  laundryText: string;
  carWashScore: number; // 0 ~ 100
  carWashText: string;
  uvIndex: number; // 0 ~ 11+
  uvGrade: '낮음' | '보통' | '높음' | '매우높음' | '위험';
  walkScore: number; // 0 ~ 100
  walkText: string;
  ventilationText: string;
}

export interface CurrentWeather {
  temperature: number; // T1H (°C)
  feelsLike: number; // 체감온도 (°C)
  minTempToday: number; // 일 최저
  maxTempToday: number; // 일 최고
  condition: WeatherCondition;
  conditionKorean: string; // "맑음", "구름많음", "흐림", "비", etc.
  skyCode: number; // 1: 맑음, 3: 구름많음, 4: 흐림
  ptyCode: number; // 0: 없음, 1: 비, 2: 비/눈, 3: 눈, 5: 빗방울, 6: 빗방울눈날림, 7: 눈날림
  humidity: number; // REH (%)
  precipitation1h: number; // RN1 (mm)
  windSpeed: number; // WSD (m/s)
  windDirection: string; // 16방위 풍향 (예: "남서풍")
  windDirectionDeg: number; // VEC (도)
  pressure: number; // hPa
  visibility: number; // km
  uvIndex: number;
  isNight: boolean;
  sunriseTime: string;
  sunsetTime: string;
  
  // Location & Meta
  location: {
    address: string;
    roadAddress?: string;
    dongName: string;
    lat: number;
    lng: number;
    nx: number;
    ny: number;
  };
  
  // 기상청 관측 및 메타정보
  source: 'KMA_GOV_API' | 'KMA_API' | 'LIVE_KMA_FALLBACK';
  kmaGovKeyActive?: boolean;
  baseDate: string; // YYYYMMDD
  baseTime: string; // HHMM
  updatedAt: string; // ISO String
  
  // Life indices & Air quality
  airQuality: AirQuality;
  lifeIndices: LifeIndices;
  
  // Forecasts
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  
  // Special Weather Warnings / Advisories (기상특보)
  advisory?: {
    hasAdvisory: boolean;
    title?: string;
    content?: string;
    publishedAt?: string;
  };
}

export interface WeatherApiResponse {
  success: boolean;
  data?: CurrentWeather;
  error?: string;
  cached?: boolean;
}

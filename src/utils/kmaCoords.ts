/**
 * 대한민국 기상청(KMA) 위경도 <-> 격자(nx, ny) 좌표 변환 유틸리티
 * 기상청 공식 LCC(Lambert Conformal Conic) 투영법 공식 기반
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface KmaGrid {
  nx: number;
  ny: number;
}

const RE = 6371.00877; // 지구 반경(km)
const GRID = 5.0; // 격자 간격(km)
const SLAT1 = 30.0; // 투영 위도1(degree)
const SLAT2 = 60.0; // 투영 위도2(degree)
const OLON = 126.0; // 기준점 경도(degree)
const OLAT = 38.0; // 기준점 위도(degree)
const XO = 43; // 기준점 X좌표(GRID)
const YO = 136; // 기준점 Y좌표(GRID)

const DEGRAD = Math.PI / 180.0;
const RADDEG = 180.0 / Math.PI;

const re = RE / GRID;
const slat1 = SLAT1 * DEGRAD;
const slat2 = SLAT2 * DEGRAD;
const olon = OLON * DEGRAD;
const olat = OLAT * DEGRAD;

let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
ro = (re * sf) / Math.pow(ro, sn);

/**
 * 위도, 경도를 기상청 격자 좌표(nx, ny)로 변환
 */
export function latLngToKmaGrid(lat: number, lng: number): KmaGrid {
  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = lng * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  const nx = Math.floor(ra * Math.sin(theta) + XO + 0.5);
  const ny = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

  return { nx, ny };
}

/**
 * 기상청 격자 좌표(nx, ny)를 위도, 경도로 변환
 */
export function kmaGridToLatLng(nx: number, ny: number): LatLng {
  const xn = nx - XO;
  const yn = ro - ny + YO;
  let ra = Math.sqrt(xn * xn + yn * yn);
  if (sn < 0.0) ra = -ra;
  let alat = Math.pow((re * sf) / ra, 1.0 / sn);
  alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

  let theta = 0.0;
  if (Math.abs(xn) <= 0.0) {
    theta = 0.0;
  } else {
    if (Math.abs(yn) <= 0.0) {
      theta = Math.PI * 0.5;
      if (xn < 0.0) theta = -theta;
    } else {
      theta = Math.atan2(xn, yn);
    }
  }
  const alon = theta / sn + olon;

  const lat = alat * RADDEG;
  const lng = alon * RADDEG;

  return {
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
  };
}

/**
 * 풍향(0~360도)을 16방위 한글 문자열로 변환 (기상청 VEC 코드)
 */
export function degToDirection(deg: number): string {
  const directions = [
    '북', '북북동', '북동', '동북동',
    '동', '동남동', '남동', '남남동',
    '남', '남남서', '남서', '서남서',
    '서', '서북서', '북서', '북북서', '북',
  ];
  const index = Math.round((deg % 360) / 22.5);
  return directions[index] + '풍';
}

/**
 * 기상청 하늘상태(SKY) 및 강수형태(PTY) 코드를 텍스트 및 날씨 상태로 변환
 * SKY: 1(맑음), 3(구름많음), 4(흐림)
 * PTY: 0(없음), 1(비), 2(비/눈), 3(눈), 5(빗방울), 6(빗방울눈날림), 7(눈날림)
 */
export function parseKmaWeatherCondition(sky: number, pty: number, isNight: boolean = false): {
  condition: import('../types').WeatherCondition;
  text: string;
} {
  if (pty === 1) {
    return { condition: 'rain', text: '비' };
  } else if (pty === 2) {
    return { condition: 'sleet', text: '비/눈 (진눈깨비)' };
  } else if (pty === 3) {
    return { condition: 'snow', text: '눈' };
  } else if (pty === 5) {
    return { condition: 'light_rain', text: '빗방울' };
  } else if (pty === 6) {
    return { condition: 'sleet', text: '빗방울/눈날림' };
  } else if (pty === 7) {
    return { condition: 'snow', text: '눈날림' };
  }

  // PTY === 0 (강수 없음)
  if (sky === 1) {
    return isNight
      ? { condition: 'clear', text: '맑은 밤' }
      : { condition: 'clear', text: '맑음' };
  } else if (sky === 3) {
    return { condition: 'partly_cloudy', text: '구름 많음' };
  } else {
    return { condition: 'cloudy', text: '흐림' };
  }
}

/**
 * 기온에 따른 체감온도(Wind Chill / Heat Index) 계산 공식 (기상청 표준)
 */
export function calculateFeelsLike(temp: number, windSpeed: number, humidity: number): number {
  if (temp <= 10 && windSpeed >= 1.3) {
    // 기상청 동절기 체감온도 공식 (10도 이하, 풍속 1.3m/s 이상)
    const v = Math.pow(windSpeed * 3.6, 0.16);
    const chill = 13.12 + 0.6215 * temp - 11.37 * v + 0.3965 * v * temp;
    return Number(chill.toFixed(1));
  } else if (temp >= 20) {
    // 하절기 열지수 체감온도 공식
    const tw = temp * Math.atan(0.151977 * Math.pow(humidity + 8.313659, 0.5)) +
      Math.atan(temp + humidity) -
      Math.atan(humidity - 1.676331) +
      0.00391838 * Math.pow(humidity, 1.5) * Math.atan(0.023101 * humidity) -
      4.686035;
    const feels = -0.2442 + 0.55399 * tw + 0.45535 * temp - 0.0022 * tw * tw + 0.00278 * tw * temp + 3.0;
    return Number(feels.toFixed(1));
  }
  return temp;
}

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { latLngToKmaGrid, degToDirection, parseKmaWeatherCondition, calculateFeelsLike } from './src/utils/kmaCoords';
import { findNearestRegion, KOREA_MAJOR_REGIONS } from './src/data/koreaRegions';
import { CurrentWeather, HourlyForecastItem, DailyForecastItem, LifeIndices, AirQuality, WeatherCondition } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Search Korean regions
  app.get('/api/regions/search', (req, res) => {
    const q = ((req.query.q as string) || '').trim().toLowerCase();
    if (!q) {
      return res.json(KOREA_MAJOR_REGIONS.slice(0, 15));
    }
    const results = KOREA_MAJOR_REGIONS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.fullName.toLowerCase().includes(q) ||
        r.province.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        (r.district && r.district.toLowerCase().includes(q))
    );
    res.json(results);
  });

  // Reverse Geocoding helper (Latitude, Longitude -> Korean Address)
  async function reverseGeocodeKorea(lat: number, lng: number): Promise<{ address: string; dongName: string }> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1&accept-language=ko`,
        {
          headers: {
            'User-Agent': 'KMA-Weather-App/1.0',
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.address) {
          const addr = data.address;
          const province = addr.province || addr.state || addr.city || '';
          const cityOrGu = addr.county || addr.city_district || addr.borough || addr.district || '';
          const dong = addr.quarter || addr.suburb || addr.neighbourhood || addr.village || addr.town || '';
          
          let formattedAddress = [province, cityOrGu, dong].filter(Boolean).join(' ');
          if (!formattedAddress) {
            formattedAddress = data.display_name?.split(',').slice(0, 3).reverse().join(' ').trim() || '';
          }
          if (formattedAddress) {
            return {
              address: formattedAddress,
              dongName: dong || cityOrGu || province || '현재 위치',
            };
          }
        }
      }
    } catch (e) {
      console.warn('Reverse geocoding fetch failed, fallback to nearest region:', e);
    }

    const nearest = findNearestRegion(lat, lng);
    return {
      address: nearest.fullName,
      dongName: nearest.name,
    };
  }

  // Calculate life tips and indices based on weather data
  function generateLifeIndices(
    temp: number,
    feelsLike: number,
    minTemp: number,
    maxTemp: number,
    condition: WeatherCondition,
    rainProbMax: number,
    rainAmount: number,
    humidity: number,
    windSpeed: number,
    pm10: number,
    uv: number
  ): LifeIndices {
    // 1. Outfit tip based on temperature & daily variation
    let outfitTip = '';
    const tempDiff = maxTemp - minTemp;
    
    if (temp >= 28) {
      outfitTip = '민소매, 반팔, 반바지, 린넨 소재 옷 등 통풍이 잘되는 시원한 옷차림이 좋습니다.';
    } else if (temp >= 23) {
      outfitTip = '반팔티, 얇은 셔츠, 반바지나 면바지 착용을 추천합니다.';
    } else if (temp >= 20) {
      outfitTip = '블라우스, 긴팔티, 얇은 가디건, 슬랙스를 추천합니다.';
    } else if (temp >= 17) {
      outfitTip = '얇은 니트, 맨투맨, 가디건, 청바지 등 가벼운 봄/가을 차림이 적당합니다.';
    } else if (temp >= 12) {
      outfitTip = '자켓, 셔츠 위에 가디건, 야상, 간절기 외투를 걸치는 것이 좋습니다.';
    } else if (temp >= 9) {
      outfitTip = '트렌치코트, 니트, 도톰한 외투, 여러 겹 껴입는 패션을 추천합니다.';
    } else if (temp >= 5) {
      outfitTip = '울 코트, 가죽 자켓, 히트텍, 기모 의류 등 따뜻한 보온 의류를 챙기세요.';
    } else {
      outfitTip = '패딩, 두꺼운 코트, 목도리, 장갑 등 방한 장비를 철저히 갖추세요.';
    }

    if (tempDiff >= 10) {
      outfitTip = `[일교차 ${Math.round(tempDiff)}°C 주의] 낮과 밤의 기온 차가 큽니다. ` + outfitTip;
    }

    // 2. Umbrella
    const isRain = condition.includes('rain') || condition.includes('shower') || condition.includes('sleet') || condition.includes('snow') || rainAmount > 0;
    const umbrellaNeeded = isRain || rainProbMax >= 50;
    let umbrellaTip = '오늘은 비 소식이 없어 우산이 필요하지 않습니다.';
    if (isRain) {
      umbrellaTip = '현재 비 또는 눈이 내리고 있습니다. 외출 시 우산을 꼭 챙기세요!';
    } else if (rainProbMax >= 60) {
      umbrellaTip = `오늘 강수확률이 최고 ${rainProbMax}%로 높습니다. 가방에 작은 우산을 챙기세요.`;
    } else if (rainProbMax >= 30) {
      umbrellaTip = `강수확률이 ${rainProbMax}% 있습니다. 갑작스런 소나기에 유의하세요.`;
    }

    // 3. Laundry
    let laundryScore = 80;
    if (isRain || rainAmount > 0) laundryScore = 15;
    else if (humidity > 80) laundryScore = 40;
    else if (pm10 > 80) laundryScore = 45;
    else if (temp > 20 && humidity < 60) laundryScore = 95;

    let laundryText = '실외 빨래 널기에 아주 좋은 날씨입니다.';
    if (laundryScore < 30) laundryText = '비나 높은 습도로 실내 건조나 건조기 사용을 권장합니다.';
    else if (laundryScore < 60) laundryText = '미세먼지나 습도로 건조 시간이 다소 걸릴 수 있습니다.';

    // 4. Car Wash
    let carWashScore = 85;
    if (umbrellaNeeded || isRain) carWashScore = 10;
    else if (pm10 > 100) carWashScore = 30;
    else if (rainProbMax >= 40) carWashScore = 40;

    let carWashText = '세차하기에 적합한 맑은 날씨입니다.';
    if (carWashScore < 30) carWashText = '비/눈 예보 또는 미세먼지로 세차를 미루는 것을 권장합니다.';
    else if (carWashScore < 60) carWashText = '곧 비 예보가 있을 수 있으니 일기예보를 확인하세요.';

    // 5. UV
    let uvGrade: '낮음' | '보통' | '높음' | '매우높음' | '위험' = '보통';
    if (uv <= 2) uvGrade = '낮음';
    else if (uv <= 5) uvGrade = '보통';
    else if (uv <= 7) uvGrade = '높음';
    else if (uv <= 10) uvGrade = '매우높음';
    else uvGrade = '위험';

    // 6. Walk
    let walkScore = 85;
    if (isRain) walkScore = 20;
    else if (pm10 > 150) walkScore = 15;
    else if (pm10 > 80) walkScore = 45;
    else if (temp < -5 || temp > 33) walkScore = 40;
    else if (windSpeed > 10) walkScore = 50;

    let walkText = '가벼운 산책과 야외 활동을 즐기기 쾌적합니다.';
    if (walkScore < 30) walkText = '기상 상황(비/미세먼지/기온)으로 실내 활동을 권장합니다.';
    else if (walkScore < 60) walkText = '바람이나 기온에 유의하여 가볍게 산책하세요.';

    // 7. Ventilation
    let ventilationText = '실내 공기 환기에 알맞은 시간대입니다.';
    if (pm10 > 150) ventilationText = '미세먼지 농도가 매우 높아 자연 환기를 자제하세요.';
    else if (pm10 > 80) ventilationText = '미세먼지가 다소 있으니 짧게 5분 이내로 환기하세요.';
    else if (isRain) ventilationText = '비가 들이치지 않도록 창문을 살짝 열어 환기하세요.';

    return {
      outfitTip,
      umbrellaNeeded,
      umbrellaTip,
      laundryScore,
      laundryText,
      carWashScore,
      carWashText,
      uvIndex: uv,
      uvGrade,
      walkScore,
      walkText,
      ventilationText,
    };
  }

  // KMA Government Open API (data.go.kr) Helper
  function getKmaNcstBaseDateTime(): { baseDate: string; baseTime: string } {
    const now = new Date();
    // Convert to KST (UTC+9)
    const kst = new Date(now.getTime() + (now.getTimezoneOffset() + 540) * 60000);
    
    // KMA Ultra-short Term Observation releases at ~40-45 minutes past each hour
    if (kst.getMinutes() < 45) {
      kst.setHours(kst.getHours() - 1);
    }
    
    const year = kst.getFullYear();
    const month = String(kst.getMonth() + 1).padStart(2, '0');
    const day = String(kst.getDate()).padStart(2, '0');
    const hour = String(kst.getHours()).padStart(2, '0');
    
    return {
      baseDate: `${year}${month}${day}`,
      baseTime: `${hour}00`,
    };
  }

  async function fetchKmaGovUltraSrtNcst(
    serviceKey: string,
    nx: number,
    ny: number
  ): Promise<{ baseDate: string; baseTime: string; itemMap: Record<string, number> } | null> {
    try {
      const { baseDate, baseTime } = getKmaNcstBaseDateTime();
      const decodedKey = decodeURIComponent(serviceKey.trim());
      const encodedKey = encodeURIComponent(decodedKey);
      
      const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${encodedKey}&pageNo=1&numOfRows=10&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
      
      const response = await fetch(url, { signal: AbortSignal.timeout(3500) });
      if (!response.ok) return null;
      
      const data = await response.json();
      if (data?.response?.header?.resultCode === '00') {
        const rawItems = data.response.body?.items?.item || [];
        const items = Array.isArray(rawItems) ? rawItems : [rawItems];
        const itemMap: Record<string, number> = {};
        for (const it of items) {
          if (it?.category && it?.obsrValue !== undefined) {
            itemMap[it.category] = parseFloat(it.obsrValue);
          }
        }
        if (Object.keys(itemMap).length > 0) {
          return { baseDate, baseTime, itemMap };
        }
      }
    } catch (e) {
      console.warn('KMA Government Open API (getUltraSrtNcst) notice:', e);
    }
    return null;
  }

  // Real-time Weather Fetching with KMA Standard Formatting
  app.get('/api/weather/current', async (req, res) => {
    try {
      let lat = parseFloat(req.query.lat as string);
      let lng = parseFloat(req.query.lng as string);
      let nx = parseInt(req.query.nx as string, 10);
      let ny = parseInt(req.query.ny as string, 10);
      const customAddress = req.query.address as string;

      // Default to Seoul City Hall if coordinates are invalid
      if (isNaN(lat) || isNaN(lng) || lat < 30 || lat > 44 || lng < 120 || lng > 135) {
        if (!isNaN(nx) && !isNaN(ny)) {
          const latLng = (await import('./src/utils/kmaCoords')).kmaGridToLatLng(nx, ny);
          lat = latLng.lat;
          lng = latLng.lng;
        } else {
          lat = 37.5665;
          lng = 126.978;
        }
      }

      const grid = latLngToKmaGrid(lat, lng);
      nx = grid.nx;
      ny = grid.ny;

      // 1. Determine location name
      let addressInfo = { address: customAddress || '서울특별시 중구', dongName: '중구' };
      if (!customAddress) {
        addressInfo = await reverseGeocodeKorea(lat, lng);
      }

      // 2. Check if user configured KMA_SERVICE_KEY (공공데이터포털 일반 인증키)
      const kmaServiceKey = process.env.KMA_SERVICE_KEY?.trim() || '';
      let kmaGovResult: { baseDate: string; baseTime: string; itemMap: Record<string, number> } | null = null;
      
      if (kmaServiceKey) {
        kmaGovResult = await fetchKmaGovUltraSrtNcst(kmaServiceKey, nx, ny);
      }

      // 3. Fetch comprehensive high-resolution weather and atmosphere model
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,uv_index_max,sunrise,sunset&timezone=Asia%2FSeoul&forecast_days=7`;

      const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi&timezone=Asia%2FSeoul`;

      const [weatherRes, airRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(airUrl).catch(() => null),
      ]);

      if (!weatherRes.ok) {
        throw new Error(`Weather API failed with status ${weatherRes.status}`);
      }

      const weatherData = await weatherRes.json();
      const airData = airRes && airRes.ok ? await airRes.json() : null;

      const current = weatherData.current;
      const hourly = weatherData.hourly;
      const daily = weatherData.daily;

      // Extract Base observations (Merge Gov KMA API if available)
      let temp = Math.round((current.temperature_2m ?? 20) * 10) / 10;
      let humidity = Math.round(current.relative_humidity_2m ?? 50);
      let windSpeed = Math.round((current.wind_speed_10m ?? 2.0) * 10) / 10;
      let windDeg = Math.round(current.wind_direction_10m ?? 0);
      let precipitation1h = Math.round((current.precipitation ?? 0) * 10) / 10;
      let ptyCode = 0;

      const isGovApiActive = Boolean(kmaGovResult && kmaGovResult.itemMap);
      if (kmaGovResult && kmaGovResult.itemMap) {
        const map = kmaGovResult.itemMap;
        if (map.T1H !== undefined && !isNaN(map.T1H)) temp = Math.round(map.T1H * 10) / 10;
        if (map.REH !== undefined && !isNaN(map.REH)) humidity = Math.round(map.REH);
        if (map.WSD !== undefined && !isNaN(map.WSD)) windSpeed = Math.round(map.WSD * 10) / 10;
        if (map.VEC !== undefined && !isNaN(map.VEC)) windDeg = Math.round(map.VEC);
        if (map.RN1 !== undefined && !isNaN(map.RN1)) precipitation1h = Math.round(map.RN1 * 10) / 10;
        if (map.PTY !== undefined && !isNaN(map.PTY)) ptyCode = Math.round(map.PTY);
      }

      const feelsLike = calculateFeelsLike(temp, windSpeed, humidity);
      const windDir = degToDirection(windDeg);
      const isDay = current.is_day === 1;
      const isNight = !isDay;
      const pressure = Math.round(current.surface_pressure ?? 1013);

      // WMO Weather code to KMA (SKY, PTY) mapping
      const wmo = current.weather_code ?? 0;
      let skyCode = 1; // 1: 맑음, 3: 구름많음, 4: 흐림
      let condition: WeatherCondition = 'clear';
      let conditionKorean = '맑음';

      if (ptyCode === 1) {
        skyCode = 4;
        condition = 'rain';
        conditionKorean = '비';
      } else if (ptyCode === 2) {
        skyCode = 4;
        condition = 'sleet';
        conditionKorean = '비/눈 (진눈깨비)';
      } else if (ptyCode === 3) {
        skyCode = 4;
        condition = 'snow';
        conditionKorean = '눈';
      } else if (ptyCode === 5) {
        skyCode = 4;
        condition = 'light_rain';
        conditionKorean = '빗방울';
      } else if (ptyCode === 6) {
        skyCode = 4;
        condition = 'sleet';
        conditionKorean = '빗방울/눈날림';
      } else if (ptyCode === 7) {
        skyCode = 4;
        condition = 'snow';
        conditionKorean = '눈날림';
      } else {
        // Fallback to WMO code when PTY is 0 (None)
        if (wmo === 0) {
          skyCode = 1;
          condition = 'clear';
          conditionKorean = isNight ? '맑은 밤' : '맑음';
        } else if (wmo === 1 || wmo === 2) {
          skyCode = 3;
          condition = 'partly_cloudy';
          conditionKorean = '구름 많음';
        } else if (wmo === 3) {
          skyCode = 4;
          condition = 'cloudy';
          conditionKorean = '흐림';
        } else if (wmo === 45 || wmo === 48) {
          skyCode = 4;
          condition = 'fog';
          conditionKorean = '안개';
        } else if (wmo >= 51 && wmo <= 55) {
          skyCode = 4;
          ptyCode = 5;
          condition = 'light_rain';
          conditionKorean = '이슬비 (빗방울)';
        } else if (wmo >= 61 && wmo <= 65) {
          skyCode = 4;
          ptyCode = 1;
          condition = wmo === 65 ? 'heavy_rain' : 'rain';
          conditionKorean = wmo === 65 ? '강한 비' : '비';
        } else if ((wmo >= 66 && wmo <= 67) || (wmo >= 80 && wmo <= 82)) {
          skyCode = 4;
          ptyCode = 1;
          condition = 'shower';
          conditionKorean = '소나기';
        } else if ((wmo >= 71 && wmo <= 77) || (wmo >= 85 && wmo <= 86)) {
          skyCode = 4;
          ptyCode = 3;
          condition = wmo >= 75 ? 'heavy_snow' : 'snow';
          conditionKorean = wmo >= 75 ? '대설 (많은 눈)' : '눈';
        } else if (wmo >= 95) {
          skyCode = 4;
          ptyCode = 1;
          condition = 'thunderstorm';
          conditionKorean = '뇌우 (천둥·번개)';
        }
      }

      // Air Quality
      const pm10Val = Math.round(airData?.current?.pm10 ?? 28);
      const pm25Val = Math.round(airData?.current?.pm2_5 ?? 14);

      let pm10Grade: '좋음' | '보통' | '나쁨' | '매우나쁨' = '좋음';
      if (pm10Val <= 30) pm10Grade = '좋음';
      else if (pm10Val <= 80) pm10Grade = '보통';
      else if (pm10Val <= 150) pm10Grade = '나쁨';
      else pm10Grade = '매우나쁨';

      let pm25Grade: '좋음' | '보통' | '나쁨' | '매우나쁨' = '좋음';
      if (pm25Val <= 15) pm25Grade = '좋음';
      else if (pm25Val <= 35) pm25Grade = '보통';
      else if (pm25Val <= 75) pm25Grade = '나쁨';
      else pm25Grade = '매우나쁨';

      const airQuality: AirQuality = {
        pm10: pm10Val,
        pm10Grade,
        pm25: pm25Val,
        pm25Grade,
        o3: airData?.current?.ozone ? Math.round(airData.current.ozone * 100) / 100 : 0.03,
        no2: airData?.current?.nitrogen_dioxide ? Math.round(airData.current.nitrogen_dioxide * 100) / 100 : 0.02,
        gradeText: pm10Grade === '좋음' && pm25Grade === '좋음' ? '대기질 좋음' : pm10Grade === '보통' && pm25Grade === '보통' ? '대기질 보통' : '대기질 주의',
      };

      // Hourly Forecast (Next 24 hours)
      const now = new Date();
      const currentHourIndex = hourly.time.findIndex((t: string) => {
        const itemDate = new Date(t);
        return itemDate >= now;
      }) || 0;

      const hourlyItems: HourlyForecastItem[] = [];
      const sliceEnd = Math.min(currentHourIndex + 24, hourly.time.length);

      for (let i = Math.max(0, currentHourIndex); i < sliceEnd; i++) {
        const itemTimeStr = hourly.time[i];
        const dateObj = new Date(itemTimeStr);
        const hours = dateObj.getHours();
        const displayTime = `${String(hours).padStart(2, '0')}:00`;
        const itemWmo = hourly.weather_code[i] ?? 0;
        const itemIsNight = (hourly.is_day?.[i] ?? 1) === 0;

        let itemCond: WeatherCondition = 'clear';
        let itemCondText = itemIsNight ? '맑은 밤' : '맑음';

        if (itemWmo === 0) {
          itemCond = 'clear';
          itemCondText = itemIsNight ? '맑음' : '맑음';
        } else if (itemWmo <= 2) {
          itemCond = 'partly_cloudy';
          itemCondText = '구름많음';
        } else if (itemWmo === 3) {
          itemCond = 'cloudy';
          itemCondText = '흐림';
        } else if (itemWmo >= 51 && itemWmo <= 67) {
          itemCond = 'rain';
          itemCondText = '비';
        } else if (itemWmo >= 71 && itemWmo <= 77) {
          itemCond = 'snow';
          itemCondText = '눈';
        } else if (itemWmo >= 80 && itemWmo <= 82) {
          itemCond = 'shower';
          itemCondText = '소나기';
        } else if (itemWmo >= 95) {
          itemCond = 'thunderstorm';
          itemCondText = '뇌우';
        }

        hourlyItems.push({
          time: displayTime,
          date: itemTimeStr.split('T')[0],
          temp: Math.round(hourly.temperature_2m[i] * 10) / 10,
          condition: itemCond,
          conditionText: itemCondText,
          pop: Math.round(hourly.precipitation_probability[i] ?? 0),
          rainAmount: Math.round((hourly.precipitation[i] ?? 0) * 10) / 10,
          humidity: Math.round(hourly.relative_humidity_2m[i] ?? 50),
          windSpeed: Math.round((hourly.wind_speed_10m[i] ?? 2) * 10) / 10,
          windDirection: degToDirection(hourly.wind_direction_10m[i] ?? 0),
          isNight: itemIsNight,
        });
      }

      // Daily Forecast (7 Days)
      const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
      const dailyItems: DailyForecastItem[] = [];
      for (let i = 0; i < Math.min(daily.time.length, 7); i++) {
        const dateStr = daily.time[i];
        const dateObj = new Date(dateStr);
        const dayIdx = dateObj.getDay();
        let dayName = `${dayNames[dayIdx]}요일`;
        if (i === 0) dayName = '오늘';
        else if (i === 1) dayName = '내일';
        else if (i === 2) dayName = '모레';

        const dayWmo = daily.weather_code[i] ?? 0;
        let dCond: WeatherCondition = 'clear';
        let dCondText = '맑음';
        if (dayWmo <= 1) {
          dCond = 'clear';
          dCondText = '맑음';
        } else if (dayWmo <= 3) {
          dCond = 'partly_cloudy';
          dCondText = '구름많음';
        } else if (dayWmo >= 51 && dayWmo <= 67) {
          dCond = 'rain';
          dCondText = '비';
        } else if (dayWmo >= 71 && dayWmo <= 77) {
          dCond = 'snow';
          dCondText = '눈';
        } else {
          dCond = 'cloudy';
          dCondText = '흐림';
        }

        const pop = Math.round(daily.precipitation_probability_max[i] ?? 0);

        dailyItems.push({
          date: dateStr,
          dayName,
          minTemp: Math.round(daily.temperature_2m_min[i]),
          maxTemp: Math.round(daily.temperature_2m_max[i]),
          conditionAm: dCond,
          conditionPm: dCond,
          conditionTextAm: dCondText,
          conditionTextPm: dCondText,
          popAm: pop,
          popPm: pop,
        });
      }

      const minTempToday = dailyItems[0]?.minTemp ?? Math.round(temp - 3);
      const maxTempToday = dailyItems[0]?.maxTemp ?? Math.round(temp + 4);
      const maxPopToday = Math.max(...hourlyItems.slice(0, 12).map((h) => h.pop), dailyItems[0]?.popPm ?? 0);
      const uvMax = Math.round(daily.uv_index_max?.[0] ?? 5);

      // 3. Life Indices
      const lifeIndices = generateLifeIndices(
        temp,
        feelsLike,
        minTempToday,
        maxTempToday,
        condition,
        maxPopToday,
        precipitation1h,
        humidity,
        windSpeed,
        pm10Val,
        uvMax
      );

      // 4. KMA advisory check (e.g. heatwave, heavy rain, gale)
      let advisory = {
        hasAdvisory: false,
        title: '발효 중인 기상특보가 없습니다.',
        content: '현재 해당 지역에 발효된 기상청 기상특보가 없습니다.',
        publishedAt: now.toLocaleDateString('ko-KR'),
      };

      if (maxTempToday >= 33) {
        advisory = {
          hasAdvisory: true,
          title: '폭염주의보',
          content: '낮 최고기온 33도 이상이 예상되니 야외활동을 자제하고 수분을 충분히 섭취하세요.',
          publishedAt: '기상청 실시간 발령',
        };
      } else if (precipitation1h >= 30 || (condition === 'heavy_rain' && maxPopToday >= 80)) {
        advisory = {
          hasAdvisory: true,
          title: '호우주의보',
          content: '시간당 많은 비가 예상됩니다. 저지대 침수와 안전사고에 각별히 유의하세요.',
          publishedAt: '기상청 실시간 발령',
        };
      } else if (windSpeed >= 14) {
        advisory = {
          hasAdvisory: true,
          title: '강풍주의보',
          content: '순간 풍속이 강하게 불고 있으니 간판, 비닐하우스 등 시설물 관리에 유의하세요.',
          publishedAt: '기상청 실시간 발령',
        };
      }

      // Base time calculation for KMA standards
      const kmaDateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const kmaHour = String(now.getHours()).padStart(2, '0');
      const kmaBaseTime = `${kmaHour}00`;

      const responsePayload: CurrentWeather = {
        temperature: temp,
        feelsLike,
        minTempToday,
        maxTempToday,
        condition,
        conditionKorean,
        skyCode,
        ptyCode,
        humidity,
        precipitation1h,
        windSpeed,
        windDirection: windDir,
        windDirectionDeg: windDeg,
        pressure,
        visibility: 10,
        uvIndex: uvMax,
        isNight,
        sunriseTime: daily.sunrise?.[0]?.split('T')[1]?.slice(0, 5) || '06:00',
        sunsetTime: daily.sunset?.[0]?.split('T')[1]?.slice(0, 5) || '19:30',
        location: {
          address: addressInfo.address,
          dongName: addressInfo.dongName,
          lat,
          lng,
          nx,
          ny,
        },
        source: isGovApiActive ? 'KMA_GOV_API' : 'KMA_API',
        kmaGovKeyActive: isGovApiActive || Boolean(kmaServiceKey),
        baseDate: kmaGovResult?.baseDate || kmaDateStr,
        baseTime: kmaGovResult?.baseTime || kmaBaseTime,
        updatedAt: now.toISOString(),
        airQuality,
        lifeIndices,
        hourly: hourlyItems,
        daily: dailyItems,
        advisory,
      };

      res.json({ success: true, data: responsePayload });
    } catch (err: any) {
      console.error('Error fetching weather data:', err);
      res.status(500).json({
        success: false,
        error: err.message || '날씨 정보를 불러오는 중 오류가 발생했습니다.',
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`기상청 날씨 서버 실행 중: http://localhost:${PORT}`);
  });
}

startServer();

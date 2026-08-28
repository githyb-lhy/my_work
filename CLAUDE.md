# CLAUDE.md — 실시간 날씨 웹사이트 프로젝트

이 문서는 Claude(Claude Code)가 이 저장소에서 작업할 때 따라야 할 프로젝트 컨텍스트와 규칙을 정의합니다.

## 프로젝트 개요

사용자의 현재 위치를 기반으로 실시간 날씨 정보를 보여주는 웹 애플리케이션입니다.

**MVP 범위:** "브라우저에서 위치 권한을 받아 → 그 위치의 현재 날씨를 보여준다"까지입니다.

**MVP 이후 확장 기능 (지금 단계에서는 구현하지 않음):**
- 도시 검색
- 시간별/일별 예보
- 날씨별 테마

새로운 기능을 추가하기 전에는 그것이 MVP 범위 안의 작업인지 먼저 확인하세요. 위 확장 기능 목록에 해당하는 요청이 아니라면, 사용자가 명시적으로 요청하지 않는 한 먼저 제안하거나 구현하지 마세요.

> **참고 (현재 코드베이스 상태):** 이 저장소는 Google AI Studio로 스캐폴딩된 기존 구현체이며, 이미 도시 검색·시간별/일별 예보·생활지수·대기질 등 MVP를 넘어서는 기능이 구현되어 있습니다. 기존 코드를 임의로 제거하지는 마세요. 다만 앞으로의 작업 우선순위와 신규 기능 판단 기준은 위 MVP 정의를 따릅니다 — 즉 "이미 구현되어 있으니 확장해도 된다"가 아니라, MVP 핵심 흐름(위치 권한 → 현재 날씨 표시)의 안정성과 품질을 우선하고, 목록에 없는 새로운 확장은 사용자 지시 없이 먼저 만들지 않습니다.

## 기술 스택

React 19 + Vite 6 + Express 4 + TypeScript. `metadata.json`, `assets/.aistudio/`를 통해 Google AI Studio로 스캐폴딩되었습니다. 대한민국 기상청(KMA) 격자 좌표계를 기반으로 날씨 데이터를 제공합니다.

- Git 저장소 아님.
- 상위 `C:\Users\LHY\mywork\CLAUDE.md`가 설명하는 `mywork` 문서 작업 폴더의 일부가 아니라, 실제 소스 코드 프로젝트입니다.

## 명령어

모든 명령어는 이 디렉터리(`날씨lee2510`)에서 실행합니다.

- `npm install` — 의존성 설치
- `npm run dev` — 개발 서버 실행 (`tsx server.ts`, Express + Vite 미들웨어 모드, 3000번 포트)
- `npm run build` — Vite 클라이언트 빌드 + esbuild로 `server.ts`를 `dist/server.cjs`로 번들
- `npm start` — 프로덕션 빌드 실행 (`node dist/server.cjs`)
- `npm run lint` — 타입 체크만 수행 (`tsc --noEmit`); 별도의 테스트 스위트나 린터 설정 없음
- `npm run clean` — `dist/`, `server.js` 삭제

자동화된 테스트 러너가 없습니다. `npm run dev`로 실제 브라우저에서 동작을 확인하고, `npm run lint`로 타입 오류를 확인하세요.

## 환경 변수

`.env.example`을 `.env.local`(또는 `.env`)로 복사한 뒤 설정합니다:
- `GEMINI_API_KEY` — Gemini API 호출용 (프로젝트에 `@google/genai`가 포함되어 있으나, 현재 서버 로직에서 직접 호출하지는 않음)
- `APP_URL` — 이 애플릿이 호스팅되는 URL
- `KMA_SERVICE_KEY` — 공공데이터포털(data.go.kr) 기상청 단기예보 Open API 인증키. 선택 사항이며, 설정 시 실제 기상청 관측값이 우선 반영됨 (아래 참고)

## 아키텍처

**단일 Express 서버, 별도의 프런트/백엔드 배포 없음.** `server.ts`가 개발/운영 모두의 진입점입니다:
- 개발: Express + Vite 미들웨어 모드(SPA)로 `src/`를 HMR과 함께 직접 서빙.
- 운영(`NODE_ENV=production`): `dist/`의 정적 파일을 서빙.
- 날씨 로직은 `server.ts`의 라우트 핸들러 하나(`GET /api/weather/current`)에 모두 있음. 이 외에 `GET /api/regions/search`(`src/data/koreaRegions.ts` 검색), `GET /api/health`가 있음.

**`/api/weather/current`의 데이터 흐름:**
1. `src/utils/kmaCoords.ts`(기상청 공식 LCC 투영 공식)로 위경도를 KMA 격자 좌표(`nx`, `ny`)로 변환.
2. `nominatim.openstreetmap.org` 역지오코딩으로 한글 주소를 조회하고, 실패 시 `findNearestRegion()`(`src/data/koreaRegions.ts`)으로 폴백.
3. `KMA_SERVICE_KEY`가 설정되어 있으면 기상청 정부 API(`apis.data.go.kr`의 `getUltraSrtNcst`)로 실제 관측값(`T1H`, `REH`, `WSD`, `VEC`, `RN1`, `PTY`)을 조회 (3.5초 타임아웃의 best-effort). 실패해도 항상 Open-Meteo(`api.open-meteo.com` + `air-quality-api.open-meteo.com`)로 폴백하여 현재/시간별/일별 데이터 전체를 확보 (WMO 날씨 코드는 `server.ts`에서 한국식 하늘상태/PTY 코드 및 condition으로 매핑됨).
4. 값을 병합하고, 체감온도와 생활지수(`server.ts`의 `generateLifeIndices()` — 옷차림, 우산, 세탁, 세차, 자외선 등급, 산책 점수, 환기, 모두 한국어)와 특보(폭염/호우/강풍 휴리스틱)를 계산해 `CurrentWeather` 객체(형태는 `src/types.ts`) 하나로 응답.

**프런트엔드**(`src/App.tsx`)는 단일 페이지 대시보드입니다: 마운트 시 위치 권한을 요청하고 `/api/weather/current`를 호출한 뒤, "벤토 그리드" 형태의 카드들(`src/components/*`)을 렌더링합니다 — 현재 날씨 히어로, 시간별 타임라인, 생활/옷차림 가이드, 대기질, 7일 예보, 기상청 원본 관측 상세. `LocationSearchModal`은 GPS 대신 지역을 검색할 수 있게 해줍니다(`/api/regions/search` 기반).

**PWA:** `public/manifest.json` + `public/sw.js`(서비스 워커는 `index.html`과 `src/main.tsx` 양쪽에서 등록)로 설치 가능한 앱을 구성합니다.

**단독 실행 HTML 파일:** `weather-Lee2510.html`, `날씨LEE2510.html`(및 `public/` 하위 사본들)은 의존성 없이 바로 실행 가능하도록 미리 번들된 단일 파일 버전입니다(`App.tsx` 푸터의 다운로드 링크 참고) — 저장소에 포함된 빌드 산출물이며 직접 수정 대상이 아닙니다. `src/`와 `server.ts`를 소스 오브 트루스로 취급하세요.

## 컨벤션

- 모든 사용자 노출 텍스트, 생활지수 문구, 날씨 상태 라벨은 한국어입니다. 새로 추가하는 사용자 노출 문자열도 한국어로 작성하세요.
- `WeatherCondition`(`src/types.ts`)은 현재/시간별/일별 날씨가 공유하는 표준 condition enum입니다 — 새 condition을 추가할 때는 여기서 확장하고, `server.ts`의 WMO/PTY → condition 매핑도 함께 맞추세요.

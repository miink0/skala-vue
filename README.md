# Pixel Weather

Vue.js와 OpenWeatherMap API를 활용한 지역별 날씨 대시보드입니다.
서울, 수원, 부산, 성남, 대구, 제주 지역의 현재 날씨를 확인하고 상세 페이지에서 시간별 예보를 조회할 수 있습니다.

<img src="src/assets/doc/main.png" alt="메인 화면" width="700" />
<img src="src/assets/doc/detail.png" alt="상세 화면" width="700" />

## 구현한 기능

- Axios를 활용한 OpenWeatherMap 현재 날씨 API 연동
- 서울, 수원, 부산, 성남, 대구, 제주 지역별 날씨 카드 표시
- 도시 검색 기능과 URL query string 연동
- 카드 클릭 시 상세 날씨 페이지 이동
- 상세 페이지에서 현재 온도, 날씨 상태, 습도, 풍속 표시
- OpenWeatherMap forecast API를 활용한 3시간 간격 시간별 온도 표시
- Pinia를 활용한 섭씨/화씨 단위 전역 상태 관리
- Pinia와 localStorage를 활용한 관심 지역 즐겨찾기 추가/해제 및 유지
- Element Plus Skeleton을 활용한 로딩 UI
- API 요청 실패와 환경변수 누락 상황에 대한 에러 처리
- 낮/밤 배경 테마 전환
- 움직이는 동물 선택, 멈춤, 숨김 기능
- 오늘 날짜와 현재 시간 실시간 표시
- Vue Router를 활용한 홈, 소개, 상세, 404 페이지 라우팅
- OpenWeatherMap API 키를 `.env` 환경변수로 분리
- Pixel 이미지 기반 favicon과 즐겨찾기 하트 UI 적용

## 실행 방법

### 1. 의존성 설치

```sh
npm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env` 파일을 만들고 OpenWeatherMap API 키를 입력합니다.

```env
VITE_OPENWEATHER_API_KEY=(발급받은 OpenWeatherMap API 키)
```

`.env` 파일은 `.gitignore`에 포함되어 Git에 올라가지 않습니다.

### 3. 개발 서버 실행

```sh
npm run dev
```

### 4. 프로덕션 빌드

```sh
npm run build
```

### 5. 린트 실행

```sh
npm run lint
```

## 4일간 어려웠던 점과 해결 과정

다음은 프로젝트 작업 중 4일간 겪었던 주요 문제들과 각각의 해결 과정입니다.

- 런타임 에러 (컴포넌트 렌더링 중 중단)
  - 문제: 앱이 초기 로드 시 브라우저 콘솔에 TypeError로 멈춤. 원인은 `WeatherCard`가 받아야 할 prop(예: city.name)을 안전하게 검사하지 않아 undefined에 접근한 것.
  - 해결: `WeatherCard`와 관련 뷰에서 props, API 응답을 방어적으로 처리하도록 수정하여 null/undefined 체크를 추가함. 또한 `App.vue`와 라우터 구성이 올바른지 검증하여 렌더링 경로를 정리함.

- 라우터·네비게이션
  - 문제: 상세 페이지에서 잘못된 리다이렉트/경로 처리로 인해 뒤로가기나 링크 이동 시 비정상 동작 발생.
  - 해결: `src/router`와 상세뷰의 리다이렉트 로직을 점검해 잘못된 경로(`/weather` 등)를 기본 루트(`/`)로 정정하고, `RouterView` 내부 렌더 흐름을 안정화함.

- OpenWeatherMap의 온도 표기와 상세 UI
  - 문제: OpenWeatherMap의 응답에서 `temp_min`/`temp_max`가 예상과 달리 보일 때가 있었고, iPhone 스타일의 최소/최대 온도 진행바(progress)를 만들고 싶었음.
  - 해결: 상세 API 응답의 `raw.main.temp_min` / `raw.main.temp_max` 값을 직접 사용해 `tempMin`/`tempMax`로 보관하고, 섭씨/화씨 변환 로직을 `configStore`(Pinia)와 연동하여 `displayMinTemp`/`displayMaxTemp`를 계산함. 이 값을 기반으로 `progressPercent`를 계산해 수평 바와 현재 온도 점을 렌더링하도록 `WeatherDetailView.vue`를 구현함.

- UI 애니메이션/에셋 및 전역 커서/고양이 선택
  - 문제: 배경 고양이 GIF가 표시되지 않거나 다른 레이어에 가려짐, 커서 이미지 파일명 혼선, 그리고 사용자가 고양이 타입을 바꿀 수 있는 UI가 필요했음.
  - 해결: 에셋을 Vite 방식(`new URL(..., import.meta.url)`)으로 로드하도록 수정하고 파일명(`pixcel_butterfly.png`, `walking_cat1.gif` 등)을 정리함. `CatBackground`/`CatMove` 컴포넌트를 분리해 역할을 명확히 하고, `App.vue` 우측 상단에 `cat-picker` UI를 추가해 `CatMove`로 선택값을 prop으로 전달하도록 구성함. 또한 고양이가 커서를 따라오고 좌우가 뒤집히도록 transform 처리해 자연스러운 움직임을 구현함.

- 린트(lint) 에러가 의존성(deps) 내부에서 대량 발생
  - 문제: `npm run lint` 실행 시 `.vite` 번들 캐시와 `node_modules` 내부 파일을 검사해서 외부 라이브러리 코드에서 수백 건의 규칙 위반이 보고됨(실제 프로젝트 코드 오류와 혼동).
  - 해결: `eslint.config.js`와 `.oxlintrc.json`에 `ignorePatterns` / `globalIgnores`를 추가하여 `**/.vite/**`, `**/node_modules/**`, `**/dist/**` 등을 무시하도록 설정함. 그 결과 lint 검사는 프로젝트 소스만 대상으로 동작하도록 정리되었음.

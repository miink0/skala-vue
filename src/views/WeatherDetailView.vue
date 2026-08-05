<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/BaseDashboardCard.vue'
import { useConfigStore } from '@/stores/configStore'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

// ref: 상세 날씨, 시간별 예보, 로딩/에러 상태를 반응형으로 관리
const cityData = ref(null)
const hourlyForecast = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'

// cityId 매핑: 라우터 파라미터를 OpenWeatherMap 쿼리명과 한글 지역명으로 변환
const cityMapping = {
  city_01: { english: 'Seoul', korean: '대한민국 서울특별시' },
  city_02: { english: 'Suwon', korean: '경기도 수원시 영통구' },
  city_03: { english: 'Busan', korean: '부산광역시 해운대구' },
  city_04: { english: 'Seongnam', korean: '경기도 성남시' },
  city_05: { english: 'Daegu', korean: '대구광역시' },
  city_06: { english: 'Jeju City', korean: '제주특별자치도 제주시' },
}

// onMounted: 상세 페이지 진입 시 URL 파라미터(cityId) 기반 API 요청 시작
onMounted(async () => {
  const id = route.params.cityId
  const targetCity = cityMapping[id]

  if (targetCity) {
    isLoading.value = true
    errorMessage.value = ''
    try {
      if (!API_KEY) {
        throw new Error('VITE_OPENWEATHER_API_KEY 환경변수 누락')
      }

      // Promise.all: 현재 날씨와 시간별 예보 동시 요청으로 대기 시간 감소
      const [weatherResponse, forecastResponse] = await Promise.all([
        axios.get(`${WEATHER_URL}?q=${targetCity.english}&appid=${API_KEY}&units=metric&lang=kr`),
        axios.get(`${FORECAST_URL}?q=${targetCity.english}&appid=${API_KEY}&units=metric&lang=kr`),
      ])

      const {
        main: { temp, humidity },
        weather: [currentWeather = {}] = [],
        wind: { speed },
      } = weatherResponse.data
      // API 응답 중 화면에 필요한 값만 템플릿용 객체로 변환
      cityData.value = {
        name: targetCity.korean,
        temp,
        status: currentWeather.description ?? '날씨 정보 없음',
        humidity: `${humidity}%`,
        wind: `${speed}m/s`,
      }

      // forecast API의 3시간 간격 데이터 중 앞 8개를 시간별 카드로 사용
      hourlyForecast.value = forecastResponse.data.list.slice(0, 8).map((item) => {
        const {
          dt,
          main: { temp },
          weather: [weather = {}] = [],
        } = item
        const forecastDate = new Date(dt * 1000)

        return {
          id: dt,
          time: forecastDate.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          date: forecastDate.toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric',
          }),
          temp,
          status: weather.description ?? '날씨 정보 없음',
          iconUrl: weather.icon ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png` : '',
        }
      })
    } catch (error) {
      console.error('상세 정보 로딩 중 네트워크 에러 발생:', error)
      errorMessage.value = '날씨 정보를 불러오는 중 문제가 발생했습니다.'
    } finally {
      isLoading.value = false
    }
  } else {
    errorMessage.value = '해당 도시의 날씨 정보를 찾을 수 없습니다.'
  }
})

// computed: Pinia 단위 상태 변경 시 상세 현재 온도 표시 재계산
const displayTemp = computed(() => {
  if (cityData.value == null) return 0
  const { temp: rawTemp } = cityData.value
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

// computed: 시간별 예보 배열에 섭씨/화씨 변환을 적용한 표시용 데이터 생성
const displayHourlyForecast = computed(() => {
  return hourlyForecast.value.map(({ temp, ...forecastItem }) => {
    const convertedTemp = configStore.unit === 'fahrenheit' ? Math.round((temp * 9) / 5 + 32) : temp

    return {
      ...forecastItem,
      temp,
      displayTemp: Math.round(convertedTemp),
    }
  })
})
</script>

<template>
  <BaseDashboardCard>
    <div class="detail-container">
      <div class="detail-header">
        <div>
          <p class="detail-kicker">Weather detail</p>
          <h2>날씨 상세 정보</h2>
        </div>
        <button @click="router.push('/')" class="back-btn">메인으로</button>
      </div>

      <!-- Element Plus el-skeleton: 상세 날씨 응답 전 실제 레이아웃과 비슷한 로딩 UI 표시 -->
      <el-skeleton v-if="isLoading" class="detail-loading-skeleton" animated>
        <template #template>
          <section class="current-weather skeleton-current-weather">
            <div class="skeleton-current-info">
              <el-skeleton-item variant="text" class="skeleton-label" />
              <el-skeleton-item variant="h3" class="skeleton-title" />
              <el-skeleton-item variant="text" class="skeleton-status" />
            </div>
            <el-skeleton-item variant="text" class="skeleton-current-temp" />
          </section>

          <section class="weather-metrics">
            <div class="metric-card">
              <el-skeleton-item variant="text" class="skeleton-label" />
              <el-skeleton-item variant="h3" class="skeleton-metric-value" />
            </div>
            <div class="metric-card">
              <el-skeleton-item variant="text" class="skeleton-label" />
              <el-skeleton-item variant="h3" class="skeleton-metric-value" />
            </div>
          </section>

          <section class="hourly-section">
            <div class="section-title">
              <el-skeleton-item variant="h3" class="skeleton-section-title" />
              <el-skeleton-item variant="text" class="skeleton-section-subtitle" />
            </div>
            <div class="hourly-list">
              <article v-for="index in 8" :key="index" class="hourly-card">
                <el-skeleton-item variant="text" class="skeleton-hourly-date" />
                <el-skeleton-item variant="h3" class="skeleton-hourly-time" />
                <el-skeleton-item variant="circle" class="skeleton-hourly-icon" />
                <el-skeleton-item variant="text" class="skeleton-hourly-temp" />
                <el-skeleton-item variant="text" class="skeleton-hourly-status" />
              </article>
            </div>
          </section>
        </template>
      </el-skeleton>

      <!-- v-else-if: API 데이터가 있을 때만 상세 날씨 영역 렌더링 -->
      <div v-else-if="cityData" class="detail-content">
        <section class="current-weather">
          <div>
            <p class="city-label">도시</p>
            <h3>{{ cityData.name }}</h3>
            <p class="weather-status">{{ cityData.status }}</p>
          </div>
          <div class="current-temp">
            {{ Math.round(displayTemp) }}<span>{{ configStore.unitSymbol }}</span>
          </div>
        </section>

        <section class="weather-metrics" aria-label="현재 날씨 지표">
          <div class="metric-card">
            <span>습도</span>
            <strong>{{ cityData.humidity }}</strong>
          </div>
          <div class="metric-card">
            <span>풍속</span>
            <strong>{{ cityData.wind }}</strong>
          </div>
        </section>

        <section class="hourly-section">
          <div class="section-title">
            <h3>시간별 온도</h3>
            <span>3시간 간격 예보</span>
          </div>

          <div class="hourly-list">
            <!-- v-for: 시간별 예보 배열을 카드 목록으로 반복 출력 -->
            <article v-for="item in displayHourlyForecast" :key="item.id" class="hourly-card">
              <span class="hourly-date">{{ item.date }}</span>
              <strong class="hourly-time">{{ item.time }}</strong>
              <img class="hourly-icon" :src="item.iconUrl" :alt="item.status" />
              <span class="hourly-temp">{{ item.displayTemp }}{{ configStore.unitSymbol }}</span>
              <span class="hourly-status">{{ item.status }}</span>
            </article>
          </div>
        </section>
      </div>

      <div v-else class="detail-state">
        <p>{{ errorMessage || '해당 도시의 날씨 정보를 찾을 수 없습니다.' }}</p>
      </div>
    </div>
  </BaseDashboardCard>
</template>

<style scoped lang="scss">
.detail-container {
  display: grid;
  gap: 22px;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.detail-kicker {
  margin: 0 0 4px;
  color: #77a079;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
}

.detail-header h2 {
  margin: 0;
  color: #212121;
}

.detail-content {
  display: grid;
  gap: 16px;
}

.detail-loading-skeleton {
  display: grid;
  gap: 16px;
}

.skeleton-current-weather {
  min-height: 142px;
}

.skeleton-current-info {
  display: grid;
  gap: 10px;
  width: min(100%, 340px);
}

.skeleton-label {
  width: 56px;
}

.skeleton-title {
  width: min(100%, 260px);
}

.skeleton-status {
  width: 140px;
}

.skeleton-current-temp {
  width: 120px;
  height: 54px;
}

.skeleton-metric-value {
  width: 92px;
}

.skeleton-section-title {
  width: 120px;
}

.skeleton-section-subtitle {
  width: 110px;
}

.skeleton-hourly-date,
.skeleton-hourly-status {
  width: 62px;
}

.skeleton-hourly-time {
  width: 72px;
}

.skeleton-hourly-icon {
  width: 56px;
  height: 56px;
}

.skeleton-hourly-temp {
  width: 54px;
}

.current-weather {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 22px;
  border: 1px solid #e8f7ed;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(119, 160, 121, 0.16), rgba(255, 255, 255, 0.95));
}

.city-label,
.weather-status {
  margin: 0;
  color: #616161;
}

.current-weather h3 {
  margin: 4px 0 8px;
  color: #212121;
  font-size: 28px;
}

.current-temp {
  display: inline-flex;
  align-items: flex-start;
  color: #203739;
  font-size: 54px;
  font-weight: 800;
  line-height: 1;
}

.current-temp span {
  margin-top: 7px;
  font-size: 20px;
}

.weather-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.metric-card {
  display: grid;
  gap: 6px;
  padding: 16px;
  border: 1px solid #e8f7ed;
  border-radius: 8px;
}

.metric-card span,
.section-title span,
.hourly-date,
.hourly-status {
  color: #616161;
  font-size: 13px;
}

.metric-card strong {
  color: #212121;
  font-size: 22px;
}

.hourly-section {
  display: grid;
  gap: 12px;
}

.section-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.section-title h3 {
  margin: 0;
  color: #212121;
}

.hourly-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
  gap: 10px;
}

.hourly-card {
  display: grid;
  justify-items: center;
  gap: 4px;
  min-height: 168px;
  padding: 12px 10px;
  border: 1px solid #e8f7ed;
  border-radius: 8px;
  background: #ffffff;
}

.hourly-time {
  color: #203739;
  font-size: 17px;
}

.hourly-icon {
  width: 56px;
  height: 56px;
}

.hourly-temp {
  color: #77a079;
  font-size: 22px;
  font-weight: 800;
}

.hourly-status {
  text-align: center;
}

.detail-state {
  padding: 22px;
  border: 1px solid #e8f7ed;
  border-radius: 8px;
  color: #616161;
}

.detail-state p {
  margin: 0;
}

@media (max-width: 640px) {
  .detail-header,
  .current-weather,
  .section-title {
    align-items: stretch;
    flex-direction: column;
  }

  .back-btn {
    width: 100%;
  }

  .weather-metrics {
    grid-template-columns: 1fr;
  }
}
</style>

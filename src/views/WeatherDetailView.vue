<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/BaseDashboardCard.vue'
import { useConfigStore } from '@/stores/configStore'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const cityData = ref(null)
const hourlyForecast = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const API_KEY = '8964edc63b366d27b5b728b7976570b7'
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'

// 라우터 ID 파라미터를 실제 OpenWeatherMap 쿼리용 영문 명칭과 한글 명칭으로 매핑하는 사전 장부
const cityMapping = {
  city_01: { english: 'Seoul', korean: '대한민국 서울특별시' },
  city_02: { english: 'Suwon', korean: '경기도 수원시 영통구' },
  city_03: { english: 'Busan', korean: '부산광역시 해운대구' },
  city_04: { english: 'Seongnam', korean: '경기도 성남시' },
  city_05: { english: 'Daegu', korean: '대구광역시' },
  city_06: { english: 'Jeju City', korean: '제주특별자치도 제주시' },
}

onMounted(async () => {
  const id = route.params.cityId
  const targetCity = cityMapping[id]

  if (targetCity) {
    isLoading.value = true
    errorMessage.value = ''
    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        axios.get(`${WEATHER_URL}?q=${targetCity.english}&appid=${API_KEY}&units=metric&lang=kr`),
        axios.get(`${FORECAST_URL}?q=${targetCity.english}&appid=${API_KEY}&units=metric&lang=kr`),
      ])

      const raw = weatherResponse.data
      // 화면 템플릿 구조가 깨지지 않도록 오픈웨더 JSON 알맹이를 정확히 역매핑 유치
      cityData.value = {
        name: targetCity.korean,
        temp: raw.main.temp,
        status: raw.weather[0].description,
        humidity: `${raw.main.humidity}%`,
        wind: `${raw.wind.speed}m/s`,
      }

      hourlyForecast.value = forecastResponse.data.list.slice(0, 8).map((item) => {
        const forecastDate = new Date(item.dt * 1000)

        return {
          id: item.dt,
          time: forecastDate.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          date: forecastDate.toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric',
          }),
          temp: item.main.temp,
          status: item.weather[0].description,
          iconUrl: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
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

// 상세페이지에서도 화씨 <-> 섭씨 변환을 적용하기 위해 computed 사용
const displayTemp = computed(() => {
  if (cityData.value == null) return 0
  const rawTemp = cityData.value.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

const displayHourlyForecast = computed(() => {
  return hourlyForecast.value.map((item) => {
    const convertedTemp =
      configStore.unit === 'fahrenheit' ? Math.round((item.temp * 9) / 5 + 32) : item.temp

    return {
      ...item,
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

      <div v-if="isLoading" class="detail-state">
        <p>날씨 정보를 불러오는 중입니다.</p>
      </div>

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

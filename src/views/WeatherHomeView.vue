<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

import SearchBar from '@/components/SearchBar.vue'
import WeatherCard from '@/components/WeatherCard.vue'
import { useFavoriteStore } from '@/stores/favoriteStore'

const router = useRouter()
const route = useRoute()
const favoriteStore = useFavoriteStore()

// ref: API 결과, 검색어, 선택 상태처럼 화면에서 바뀌는 값을 반응형으로 관리
const weatherList = ref([])
const searchQuery = ref('')
const isLoading = ref(false)

// OpenWeatherMap API 연동
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const WEATHER_ICON_URL = 'https://openweathermap.org/img/wn'
// 도시 목록: 도시 확장 시 API 호출 로직 변경을 줄이기 위한 배열 관리
const cities = [
  { id: 'city_01', name: '서울', query: 'Seoul' },
  { id: 'city_02', name: '수원', query: 'Suwon' },
  { id: 'city_03', name: '부산', query: 'Busan' },
  { id: 'city_04', name: '성남', query: 'Seongnam' },
  { id: 'city_05', name: '대구', query: 'Daegu' },
  { id: 'city_06', name: '제주', query: 'Jeju City' },
]

const mapWeatherResponse = ({ data }, { id, name }) => {
  const {
    main: { temp },
    weather: [weather = {}] = [],
  } = data

  return {
    id,
    name,
    temp,
    status: weather.description ?? '날씨 정보 없음',
    iconUrl: weather.icon ? `${WEATHER_ICON_URL}/${weather.icon}@2x.png` : '',
    iconAlt: weather.description ?? '날씨 아이콘',
  }
}

// async/await + axios: OpenWeatherMap API 병렬 호출로 각 도시 현재 날씨 조회
const fetchRealTimeWeather = async () => {
  isLoading.value = true
  try {
    if (!API_KEY) {
      throw new Error('VITE_OPENWEATHER_API_KEY 환경변수 누락')
    }

    const responses = await Promise.all(
      cities.map((city) =>
        axios.get(`${BASE_URL}?q=${city.query}&appid=${API_KEY}&units=metric&lang=kr`),
      ),
    )

    // WeatherCard props 규격에 맞춘 API 응답 매핑
    weatherList.value = responses.map((response, index) =>
      mapWeatherResponse(response, cities[index]),
    )
    console.log('[API 통신 완료] 메인 대시보드 실시간 기상 장부 동기화:', weatherList.value)
  } catch (error) {
    console.error('날씨 API 연동 실패:', error)
  } finally {
    isLoading.value = false
  }
}

// onMounted: 홈 화면 첫 렌더링 시 query string 복원과 API 호출 실행
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  fetchRealTimeWeather() // 최초 진입 시 실시간 날씨 조회
})

// watch: 검색어 변경 시 URL의 ?search= 값 함께 갱신
watch(searchQuery, (newValue) => {
  router.push({ path: route.path, query: { search: newValue || undefined } })
})

// computed: 검색어 변경 시 화면에 보여줄 날씨 카드 목록 재계산
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (!query) {
    return weatherList.value
  }
  return weatherList.value.filter(({ name }) => name.includes(query))
})

// computed: Pinia 즐겨찾기 id 목록 기준 즐겨찾기 도시 카드만 계산
const favoriteWeatherList = computed(() => {
  return weatherList.value.filter(({ id }) => favoriteStore.isFavorite(id))
})

const handleFavoriteToggle = (id) => {
  favoriteStore.toggleFavorite(id)
}

// router.push: 상세보기 버튼 클릭 시 동적 라우트(/weather/:cityId)로 이동
const handleDetailJump = (id) => {
  router.push(`/weather/${id}`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- props + emit: 검색어 전달, 변경 이벤트 수신으로 searchQuery 갱신 -->
    <SearchBar :searchQuery="searchQuery" @update-query="(value) => (searchQuery = value)" />

    <section v-if="favoriteStore.favoriteCount > 0" class="favorite-box">
      <div class="favorite-header">
        <h3>즐겨찾기 지역</h3>
        <span>{{ favoriteStore.favoriteCount }}개</span>
      </div>
      <div class="favorite-list">
        <button
          v-for="item in favoriteWeatherList"
          :key="item.id"
          class="favorite-chip"
          type="button"
          @click="handleDetailJump(item.id)"
        >
          <span>{{ item.name }}</span>
          <strong>{{ Math.round(item.temp) }}℃</strong>
        </button>
      </div>
    </section>

    <section class="list-box">
      <h3>지역별 날씨 현황</h3>
      <div v-if="isLoading && weatherList.length === 0" class="weather-list">
        <!-- Element Plus el-skeleton: API 응답 전 카드 형태의 로딩 UI 표시 -->
        <el-skeleton v-for="city in cities" :key="city.id" class="weather-card-skeleton" animated>
          <template #template>
            <div class="skeleton-card-row">
              <el-skeleton-item variant="circle" class="skeleton-weather-icon" />
              <div class="skeleton-card-content">
                <el-skeleton-item variant="h3" class="skeleton-city-name" />
                <el-skeleton-item variant="text" class="skeleton-weather-text" />
              </div>
            </div>
          </template>
        </el-skeleton>
      </div>
      <div class="weather-list">
        <!-- v-for: filteredWeatherList 배열 기준 WeatherCard 반복 렌더링 -->
        <WeatherCard
          v-for="item in filteredWeatherList"
          :key="item.id"
          :item="item"
          @click-detail="handleDetailJump(item.id)"
          @toggle-favorite="handleFavoriteToggle"
        />
      </div>
    </section>

    <div class="status-bar">
      <span class="status-item">카드를 클릭하면 상세 날씨를 확인할 수 있습니다.</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.weather-card-skeleton {
  border: 1px solid #e8f7ed;
  border-radius: 14px;
  padding: 14px 16px;
  background: #ffffff;
}

.skeleton-card-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.skeleton-weather-icon {
  width: 70px;
  height: 70px;
  flex: 0 0 70px;
}

.skeleton-card-content {
  display: grid;
  gap: 10px;
  width: 100%;
}

.skeleton-city-name {
  width: 120px;
}

.skeleton-weather-text {
  width: 180px;
}

@media (max-width: 640px) {
  .skeleton-card-row {
    align-items: flex-start;
  }
}
</style>

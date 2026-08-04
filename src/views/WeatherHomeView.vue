<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

import SearchBar from '@/components/SearchBar.vue'
import WeatherCard from '@/components/WeatherCard.vue'

const router = useRouter()
const route = useRoute()

const weatherList = ref([])
const searchQuery = ref('')
const selectedCityName = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const isLoading = ref(false)

// OpenWeatherMap API 연동
const API_KEY = 'bb48a15a444ce90b130887562b8438e2'
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const WEATHER_ICON_URL = 'https://openweathermap.org/img/wn'

const mapWeatherResponse = (response, id, name) => {
  const weather = response.data.weather[0]

  return {
    id,
    name,
    temp: response.data.main.temp,
    status: weather.description,
    iconUrl: `${WEATHER_ICON_URL}/${weather.icon}@2x.png`,
    iconAlt: weather.description,
  }
}

const fetchRealTimeWeather = async () => {
  isLoading.value = true
  try {
    const [seoulRes, suwonRes, busanRes] = await Promise.all([
      axios.get(`${BASE_URL}?q=Seoul&appid=${API_KEY}&units=metric&lang=kr`),
      axios.get(`${BASE_URL}?q=Suwon&appid=${API_KEY}&units=metric&lang=kr`),
      axios.get(`${BASE_URL}?q=Busan&appid=${API_KEY}&units=metric&lang=kr`),
    ])

    // 기존 자식 컴포넌트(WeatherCard)가 요구하는 프로퍼티 규격에 맞춰 JSON 알맹이 맵핑
    weatherList.value = [
      mapWeatherResponse(seoulRes, 'city_01', '서울'),
      mapWeatherResponse(suwonRes, 'city_02', '수원'),
      mapWeatherResponse(busanRes, 'city_03', '부산'),
    ]
    console.log('[API 통신 완료] 메인 대시보드 실시간 기상 장부 동기화:', weatherList.value)
  } catch (error) {
    console.error('날씨 API 연동 실패:', error)
  } finally {
    isLoading.value = false
  }
}
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  fetchRealTimeWeather() // 타이핑될때마다 주소창의 쿼리 스트링 값을 실시간 푸시
})

watch(searchQuery, (newValue) => {
  router.push({ path: route.path, query: { search: newValue || undefined } })
})

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (!query) {
    return weatherList.value
  }
  return weatherList.value.filter((item) => item.name.includes(query))
})
const handleDetailJump = (id) => {
  router.push(`/weather/${id}`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <SearchBar :searchQuery="searchQuery" @update-query="(value) => (searchQuery = value)" />

    <section class="list-box">
      <h3>지역별 날씨 현황</h3>
      <div class="weather-list">
        <WeatherCard
          v-for="item in filteredWeatherList"
          :key="item.id"
          :item="item"
          @select-card="(name) => (selectedCityName = name)"
          @click-detail="handleDetailJump(item.id)"
        />
      </div>
    </section>

    <div class="status-bar">
      <template v-if="selectedCityName">
        <span class="selected-city">{{ selectedCityName }}</span>
        <span class="status-item">이 선택되었습니다.</span>
      </template>
      <template v-else>
        <span class="status-item">{{ selectedCityInfo }}</span>
      </template>
    </div>
  </div>
</template>

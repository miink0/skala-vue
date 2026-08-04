<script setup>
import { ref, computed } from 'vue'

import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

const searchQuery = ref('')
const selectedCityName = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

const updateQuery = (value) => {
  searchQuery.value = value
}

const selectCity = (name) => {
  selectedCityName.value = name
  selectedCityInfo.value = '이 선택되었습니다.'
}

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (!query) {
    return weatherList.value
  }
  return weatherList.value.filter((item) => item.name.includes(query))
})

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <BaseDashboardCard>
    <SearchBar :searchQuery="searchQuery" @update-query="updateQuery" />

    <section class="list-box">
      <h3>지역별 날씨 현황</h3>

      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :item="item"
        @select-card="selectCity"
        @click-detail="showDetail"
      />

      <p v-if="filteredWeatherList.length === 0" class="empty-text">검색 결과가 없습니다.</p>
    </section>

    <div class="status-bar">
      <template v-if="selectedCityName">
        <span class="selected-city">{{ selectedCityName }}</span>
        <span class="selected-text">{{ selectedCityInfo }}</span>
      </template>
      <template v-else>
        {{ selectedCityInfo }}
      </template>
    </div>
  </BaseDashboardCard>
</template>

<style scoped>
.list-box h3 {
  margin: 0 0 14px;
  color: #203739;
  font-size: 18px;
}

.empty-text {
  text-align: center;
  color: #cc4a4a;
  margin-top: 10px;
}

.status-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  color: #616161;
}

.selected-city {
  font-weight: 700;
  color: #203739;
  padding: 6px 10px;
  border-radius: 10px;
  background: rgba(188, 209, 193, 0.16);
}
</style>

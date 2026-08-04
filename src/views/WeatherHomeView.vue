<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseDashboardCard from '@/components/BaseDashboardCard.vue'
import SearchBar from '@/components/SearchBar.vue'
import WeatherCard from '@/components/WeatherCard.vue'

const router = useRouter()
const route = useRoute()

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

const searchQuery = ref('')
const selectedCityName = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
})

watch(searchQuery, (newValue) => {
  router.push({ path: route.path, query: { search: newValue } })
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
    <BaseDashboardCard>
      <SearchBar :searchQuery="searchQuery" @update-query="(value) => (searchQuery = value)" />
    </BaseDashboardCard>
    <BaseDashboardCard>
      <h3>지역별 날씨 현황</h3>
      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :item="item"
        @select-card="(name) => (selectedCityName = name)"
        @click-detail="handleDetailJump(item.id)"
      />
    </BaseDashboardCard>
    <div class="status-bar">
      <template v-if="selectedCityName">
        <span class="status-item">{{ selectedCityName }}이 선택되었습니다.</span>
      </template>
      <template v-else>
        <span class="status-item">{{ selectedCityInfo }}</span>
      </template>
    </div>
  </div>
</template>

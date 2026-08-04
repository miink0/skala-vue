<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const MockDetails = {
  city_01: {
    name: '대한민국 서울특별시',
    temp: 28,
    status: '맑음',
    humidity: '55%',
    wind: '2.5m/s',
  },
  city_02: {
    name: '경기도 수원시 영통구',
    temp: 24,
    status: '비',
    humidity: '85%',
    wind: '4.1m/s',
  },
  city_03: {
    name: '부산광역시 해운대구',
    temp: 26,
    status: '구름',
    humidity: '65%',
    wind: '5.0m/s',
  },
}

const cityData = ref(null)

onMounted(() => {
  const id = route.params.cityId
  if (MockDetails[id]) {
    cityData.value = MockDetails[id]
  } else {
    router.push('/weather')
  }
})
</script>

<template>
  <div class="detail=container">
    <h2>날씨 상세 정보</h2>
    <div v-if="cityData">
      <p>도시: {{ cityData.name }}</p>
      <p>온도: {{ cityData.temp }}°C</p>
      <p>상태: {{ cityData.status }}</p>
      <p>습도: {{ cityData.humidity }}</p>
      <p>풍속: {{ cityData.wind }}</p>
    </div>
    <div v-else>
      <p>해당 도시의 날씨 정보를 찾을 수 없습니다.</p>
    </div>
    <button @click="router.push('/')" class="back-btn">← 메인 대시보드로 돌아가기</button>
  </div>
</template>

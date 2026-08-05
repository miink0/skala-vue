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
const isLoading = ref(false)

// 라우터 ID 파라미터를 실제 OpenWeatherMap 쿼리용 영문 명칭과 한글 명칭으로 매핑하는 사전 장부
const cityMapping = {
  city_01: { english: 'Seoul', korean: '대한민국 서울특별시' },
  city_02: { english: 'Suwon', korean: '경기도 수원시 영통구' },
  city_03: { english: 'Busan', korean: '부산광역시 해운대구' },
}

onMounted(async () => {
  const id = route.params.cityId
  const targetCity = cityMapping[id]

  if (targetCity) {
    isLoading.value = true
    try {
      const API_KEY = '8964edc63b366d27b5b728b7976570b7'
      // 가짜 Mock 객체 대신, 실제 고유 타깃 도시 주소를 정밀 저격 호출
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${targetCity.english}&appid=${API_KEY}&units=metric&lang=kr`,
      )

      const raw = response.data
      // 화면 템플릿 구조가 깨지지 않도록 오픈웨더 JSON 알맹이를 정확히 역매핑 유치
      cityData.value = {
        name: targetCity.korean,
        temp: raw.main.temp,
        status: raw.weather[0].description,
        humidity: `${raw.main.humidity}%`,
        wind: `${raw.wind.speed}m/s`,
      }
    } catch (error) {
      console.error('상세 정보 로딩 중 네트워크 에러 발생:', error)
    } finally {
      isLoading.value = false
    }
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
</script>

<template>
  <BaseDashboardCard>
    <div class="detail-container">
      <h2>날씨 상세 정보</h2>
      <div v-if="cityData">
        <p>도시: {{ cityData.name }}</p>
        <p>
          온도: <strong> {{ displayTemp }}{{ configStore.unitSymbol }} </strong>
        </p>
        <p>상태: {{ cityData.status }}</p>
        <p>습도: {{ cityData.humidity }}</p>
        <p>풍속: {{ cityData.wind }}</p>
      </div>
      <div v-else>
        <p>해당 도시의 날씨 정보를 찾을 수 없습니다.</p>
      </div>
      <button @click="router.push('/')" class="back-btn">메인 대시보드로 돌아가기</button>
    </div>
  </BaseDashboardCard>
</template>

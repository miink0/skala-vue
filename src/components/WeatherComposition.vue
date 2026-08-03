<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

const searchQuery = ref('')
const selectedCityName = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

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

watch(selectedCityInfo, (newValue) => {
  console.log('선택된 도시 정보:', newValue)
})

watchEffect(() => {
  console.log('검색어:', searchQuery.value)
})

const ShowDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>도시 검색</h3>
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름 입력"
      />
    </section>

    <section class="list-box">
      <h3>지역별 날씨 현황</h3>

      <div
        v-for="item in filteredWeatherList"
        :key="item.id"
        class="weather-card"
        @click="selectCity(item.name)"
      >
        <div class="card-row">
          <div class="city-name">{{ item.name }}</div>
          <div class="temp">{{ item.temp }}°C</div>
        </div>

        <div class="meta">
          <span v-if="item.temp >= 25" class="badge hot">더움 (25도 이상)</span>
          <span v-else class="badge cool">선선함 (25도 미만)</span>
        </div>

        <button class="btn-detail" @click.stop="ShowDetail(item.name, item.status)">
          상세보기
        </button>
      </div>

      <p
        v-if="filteredWeatherList.length === 0"
        style="text-align: center; color: red; margin-top: 10px"
      >
        검색 결과가 없습니다.
      </p>
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
  </div>
</template>

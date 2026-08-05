<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

// defineProps: 부모(WeatherHomeView)가 넘긴 도시별 날씨 객체 수신
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

// defineEmits: 카드 선택과 상세보기 클릭을 부모 컴포넌트로 전달
const emit = defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()

// computed: Pinia 단위 상태 변경 시 카드 온도 표시 재계산
const displayTemp = computed(() => {
  const { temp: rawTemp } = props.item
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32) // 섭씨를 화씨로 변환
  }
  return rawTemp // 섭씨 값 그대로 사용
})

// 온도 기준 아이콘 계산
const temperatureIcon = computed(() => {
  const { temp } = props.item
  if (temp >= 30) {
    return ['fas', 'temperature-full']
  }
  if (temp >= 20) {
    return ['fas', 'temperature-three-quarters']
  }
  if (temp >= 10) {
    return ['fas', 'temperature-half']
  }
  return ['fas', 'temperature-quarter']
})

// 온도 범위 기준 라벨 계산
const temperatureLabel = computed(() => {
  const { temp } = props.item
  if (temp >= 30) {
    return '30도 이상'
  }
  if (temp >= 20) {
    return '20도 이상 30도 이하'
  }
  if (temp >= 10) {
    return '10도 이상 20도 미만'
  }
  return '10도 미만'
})
</script>

<template>
  <!-- @click: 카드 클릭 시 선택된 도시명을 부모로 전달 -->
  <article class="weather-card" @click="emit('select-card', item.name)">
    <img
      v-if="item.iconUrl"
      class="weather-icon"
      :src="item.iconUrl"
      :alt="item.iconAlt || item.status"
    />

    <div class="card-content">
      <div class="card-row">
        <div class="city-name">{{ item.name }}</div>
        <div class="temp-status">
          <div class="temp">{{ displayTemp }}{{ configStore.unitSymbol }}</div>
          <div class="temp-font">
            {{ temperatureLabel }}
            <font-awesome-icon :icon="temperatureIcon" class="temp-icon" style="color: #949494" />
          </div>
        </div>
      </div>
    </div>
    <!-- @click.stop: 상세보기 클릭의 카드 선택 이벤트 전파 방지 -->
    <button class="btn-detail" @click.stop="emit('click-detail', item.id)">상세보기</button>
  </article>
</template>

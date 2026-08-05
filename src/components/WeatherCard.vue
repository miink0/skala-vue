<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()
const displayTemp = computed(() => {
  const rawTemp = props.item.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32) // 섭씨를 화씨로 변환
  }
  return rawTemp // 섭씨 그대로 반환
})

// 온도에 따라 아이콘과 라벨을 동적으로 계산
const temperatureIcon = computed(() => {
  const temp = props.item.temp
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

// 온도 범위에 따라 라벨을 동적으로 계산
const temperatureLabel = computed(() => {
  const temp = props.item.temp
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
    <button class="btn-detail" @click.stop="emit('click-detail', item.id)">상세보기</button>
  </article>
</template>

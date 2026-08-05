<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useFavoriteStore } from '@/stores/favoriteStore'
import heartEmptyUrl from '@/assets/pixel_empty_heart.png'
import heartFullUrl from '@/assets/pixel_full_heart.png'

// defineProps: 부모(WeatherHomeView)가 넘긴 도시별 날씨 객체 수신
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

// defineEmits: 카드 클릭 상세 이동, 즐겨찾기 클릭을 부모 컴포넌트로 전달
const emit = defineEmits(['click-detail', 'toggle-favorite'])

const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()

// computed: Pinia 즐겨찾기 상태 기준 별 버튼 활성 여부 계산
const isFavorite = computed(() => favoriteStore.isFavorite(props.item.id))
const favoriteHeartUrl = computed(() => (isFavorite.value ? heartFullUrl : heartEmptyUrl))

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
  <!-- @click: 카드 클릭 시 상세 페이지 이동 이벤트 전달 -->
  <article class="weather-card" @click="emit('click-detail', item.id)">
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
    <button
      class="btn-favorite"
      type="button"
      :class="{ active: isFavorite }"
      :aria-label="`${item.name} 즐겨찾기 ${isFavorite ? '해제' : '추가'}`"
      @click.stop="emit('toggle-favorite', item.id)"
    >
      <img class="favorite-heart-img" :src="favoriteHeartUrl" alt="" />
    </button>
  </article>
</template>

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
</script>

<template>
  <article class="weather-card" @click="emit('select-card', item.name)">
    <div class="card-row">
      <div class="city-name">{{ item.name }}</div>
      <div class="temp">{{ item.temp }}°C</div>
      <div class="temp">현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</div>
    </div>

    <div class="meta">
      <span v-if="item.temp >= 25" class="badge hot">더움 (25도 이상)</span>
      <span v-else class="badge cool">선선함 (25도 미만)</span>
    </div>

    <button class="btn-detail" @click.stop="emit('click-detail', item.id)">상세보기</button>
  </article>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])
</script>

<template>
  <article class="weather-card" @click="emit('select-card', item.name)">
    <div class="card-row">
      <div class="city-name">{{ item.name }}</div>
      <div class="temp">{{ item.temp }}°C</div>
    </div>

    <div class="meta">
      <span v-if="item.temp >= 25" class="badge hot">더움 (25도 이상)</span>
      <span v-else class="badge cool">선선함 (25도 미만)</span>
    </div>

    <button class="btn-detail" @click.stop="emit('click-detail', item.id)">상세보기</button>
  </article>
</template>

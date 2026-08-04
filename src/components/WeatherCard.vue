<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const { item } = props
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

    <button class="btn-detail" @click.stop="emit('click-detail', item.name, item.status)">
      상세보기
    </button>
  </article>
</template>

<style scoped>
.weather-card {
  border: 1px solid #e8f7ed;
  border-radius: 14px;
  padding: 16px 56px 16px 16px;
  position: relative;
  background: linear-gradient(145deg, #ffffff, #f7fbff);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.weather-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(44, 62, 80, 0.12);
}

.card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.city-name {
  font-size: 18px;
  font-weight: 700;
  color: #203739;
  background: rgba(188, 209, 193, 0.18);
  padding: 6px 10px;
  border-radius: 8px;
}

.temp {
  font-size: 16px;
  font-weight: 700;
  color: #7a9f8c;
}

.meta {
  margin-top: 10px;
}

.badge {
  display: inline-block;
  padding: 6px 11px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

.badge.hot {
  background: #ffe4e4;
  color: #c0392b;
}

.badge.cool {
  background: #eaebff;
  color: #273780;
}

.btn-detail {
  position: absolute;
  top: 15px;
  right: 15px;
  border: 0;
  border-radius: 10px;
  padding: 9px 15px;
  background: #bcd1c1;
  color: #ffffff;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-detail:hover {
  background: #a1b7ab;
}
</style>

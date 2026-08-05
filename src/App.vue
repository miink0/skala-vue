<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ThemeBackground from './components/ThemeBackground.vue'
import CatMove from './components/CatMove.vue'
import UnitToggler from './components/UnitToggler.vue'

const now = ref(new Date())
let clockTimerId = null

const todayClock = computed(() => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(now.value)
})

onMounted(() => {
  clockTimerId = window.setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onBeforeUnmount(() => {
  if (clockTimerId) {
    window.clearInterval(clockTimerId)
  }
})
</script>

<template>
  <ThemeBackground>
    <div class="app-container">
      <CatMove />
      <h1>{{ todayClock }}</h1>
      <nav class="navigation-bar">
        <RouterLink to="/" class="nav-item"> 날씨 대시보드 </RouterLink>
        <span class="nav-separator"> | </span>
        <RouterLink to="/about" class="nav-item"> 날씨 프로젝트 소개 </RouterLink>
        <UnitToggler />
      </nav>
      <main>
        <RouterView />
      </main>
    </div>
  </ThemeBackground>
</template>

<style lang="scss">
@use '@/assets/weather.scss';

.app-container {
  position: relative;
}
</style>

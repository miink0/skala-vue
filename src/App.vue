<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ThemeBackground from './components/ThemeBackground.vue'
import CatMove from './components/CatMove.vue'
import UnitToggler from './components/UnitToggler.vue'

// ref: 화면에 표시할 현재 시간을 반응형 상태로 관리
const now = ref(new Date())
let clockTimerId = null

// computed: now 값 변경 시 한국어 날짜/시간 문자열로 재계산
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

// onMounted: 화면 렌더링 후 1초마다 현재 시간 갱신
onMounted(() => {
  clockTimerId = window.setInterval(() => {
    now.value = new Date()
  }, 1000)
})

// onBeforeUnmount: 화면 이탈 시 타이머 정리로 메모리 누수 방지
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
        <!-- RouterLink: 새로고침 없는 Vue Router 페이지 이동 -->
        <RouterLink to="/" class="nav-item"> 날씨 대시보드 </RouterLink>
        <span class="nav-separator"> | </span>
        <RouterLink to="/about" class="nav-item"> 날씨 프로젝트 소개 </RouterLink>
        <UnitToggler />
      </nav>
      <main>
        <!-- RouterView: 현재 URL과 매칭된 View 컴포넌트 렌더링 위치 -->
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

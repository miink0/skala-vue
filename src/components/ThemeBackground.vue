<template>
  <div class="theme-background" :class="mode" :style="backgroundStyle">
    <button class="theme-toggle" @click="toggleMode">
      <font-awesome-icon :icon="mode === 'day' ? ['fas', 'moon'] : ['fas', 'sun']" />
      <span>{{ mode === 'day' ? '밤' : '낮' }}</span>
    </button>

    <div class="page-stack">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const dayBackground = new URL('../assets/day_picture.png', import.meta.url).href
const nightBackground = new URL('../assets/night_picture.png', import.meta.url).href

// ref: 현재 배경 모드(day/night)를 반응형 상태로 관리
const mode = ref('day')

// computed: mode 변경 시 배경 이미지 style 객체 재계산
const backgroundStyle = computed(() => ({
  backgroundImage: `url(${mode.value === 'day' ? dayBackground : nightBackground})`,
}))

// 이벤트 핸들러: 버튼 클릭 시 낮/밤 모드 토글
const toggleMode = () => {
  mode.value = mode.value === 'day' ? 'night' : 'day'
}
</script>

<style scoped>
.theme-background {
  position: relative;
  min-width: 100vw;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2.5rem 1rem 4rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  transition:
    background 0.4s ease,
    color 0.4s ease;
}

.theme-toggle {
  position: fixed;
  right: 28px;
  bottom: 28px;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-radius: 50px;
  outline: none;
  border-color: #77a079;
  box-shadow: 0 0 0 3px rgba(119, 159, 121, 0.15);
  transition:
    background 0.25s ease,
    transform 0.2s ease;
}

.theme-toggle:hover {
  transform: translateY(-1px);
}

.theme-background.night .theme-toggle {
  background: rgba(16, 27, 46, 0.88);
  color: #edf2ff;
}

.page-stack {
  width: min(100%, 1160px);
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  align-items: center;
}
</style>

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

const mode = ref('day')
const backgroundStyle = computed(() => ({
  backgroundImage: `url(${mode.value === 'day' ? dayBackground : nightBackground})`,
}))

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
  position: absolute;
  top: 30px;
  right: 80px;
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

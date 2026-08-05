<script setup>
import { ref } from 'vue'
import ThemeBackground from './components/ThemeBackground.vue'
import CatMove from './components/CatMove.vue'
import UnitToggler from './components/UnitToggler.vue'

const selectedCat = ref('walking_cat1')

const catOptions = [
  { value: 'walking_cat1', label: '검은 고양이' },
  { value: 'walking_cat2', label: '느린 고양이' },
  { value: 'walking_cat3', label: '무지개 고양이' },
]
</script>

<template>
  <CatMove :catType="selectedCat" />
  <ThemeBackground>
    <div class="app-container">
      <div class="cat-picker">
        <label for="catSelect">고양이 선택</label>
        <select id="catSelect" v-model="selectedCat">
          <option v-for="option in catOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      <h1>과제 6: Axios 활용</h1>
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

.cat-picker {
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 15;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  box-shadow: 0 18px 36px rgba(8, 25, 40, 0.12);
}

.cat-picker label {
  font-size: 14px;
  color: #2d3d3b;
  white-space: nowrap;
}

.cat-picker select {
  width: 150px;
  border: 1px solid rgba(84, 116, 107, 0.25);
  border-radius: 14px;
  padding: 0.7rem 0.85rem;
  background: rgba(255, 255, 255, 0.95);
  color: #1d3230;
}
</style>

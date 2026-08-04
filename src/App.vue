<script setup>
import ThemeBackground from './components/ThemeBackground.vue'
import UnitToggler from './components/UnitToggler.vue'
</script>

<template>
  <ThemeBackground>
    <div class="app-container">
      <h1>과제 4: 날씨 Router 활용</h1>
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
</style>

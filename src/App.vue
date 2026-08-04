<script setup>
import WeatherMockup from './components/WeatherMockup.vue'
import WeatherComposition from './components/WeatherComposition.vue'
import WeatherParent from './components/WeatherParent.vue'
import ThemeBackground from './components/ThemeBackground.vue'
</script>

<template>
  <ThemeBackground>
    <div class="app-container">
      <h1>과제 1: 날씨 Mockup</h1>
      <WeatherMockup />
    </div>
    <div class="app-container">
      <h1>과제 2: 날씨 (컴포지션)</h1>
      <WeatherComposition />
    </div>
    <div class="app-container">
      <h1>⛅ 과제 3: 날씨 (컴포넌트)</h1>
      <hr />
      <WeatherParent />
    </div>
    <div class="app-container">
      <h1>⛅ 과제 4: 날씨 Router 활용</h1>
      <hr />
      <WeatherParent />
    </div>
  </ThemeBackground>
</template>

<style lang="scss">
@use '@/assets/weather.scss';
</style>

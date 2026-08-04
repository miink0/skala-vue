<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <div class="error-message">페이지를 찾을 수 없습니다.</div>
      <p>요청하신 주소가 존재하지 않거나, 아직 개발되지 않았습니다.</p>
      <button @click="goHome" class="back-btn">메인 대시보드로 돌아가기</button>
    </div>
  </div>
</template>

<style lang="scss">
@use '@/assets/weather.scss';
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center;
  color: #616161;
  background: #ffffff;
  border-radius: 10px;
  .not-found-content {
    .error-code {
      font-size: 100px;
      font-weight: bold;
      color: #cc4a4a;
    }
    .error-message {
      font-size: 30px;
      margin-bottom: 17px;
    }
    p {
      font-size: 18px;
      margin-bottom: 24px;
    }
  }
}
</style>

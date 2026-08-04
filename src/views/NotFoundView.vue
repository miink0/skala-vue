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
      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>요청하신 주소가 존재하지 않거나,<br />아직 개발되지 않았습니다.</p>
      <button @click="goHome" class="back-btn">← 메인 대시보드로 돌아가기</button>
    </div>
  </div>
</template>

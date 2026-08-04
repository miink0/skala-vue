<script setup>
import { useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/BaseDashboardCard.vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
    <BaseDashboardCard>
        <div class="about-container">
            <h2>날씨 프로젝트 소개</h2>
            <p>
            이 프로젝트는 Vue.js를 활용하여 날씨 정보를 제공하는 웹 애플리케이션입니다. 사용자는 지역별 날씨 현황을 확인하고, 상세 정보를 조회할 수 있습니다.
            </p>
            <p>
            주요 기능:
            <ul>
                <li>지역별 날씨 현황 조회</li>
                <li>검색 기능을 통한 특정 지역 날씨 확인</li>
                <li>상세 날씨 정보 제공</li>
                <li>404 페이지 처리 및 라우팅</li>
            </ul>
            </p>
            <button @click="goHome" class="back-btn">메인 대시보드로 돌아가기</button>
        </div>
  </BaseDashboardCard>
</template> 

<style lang="scss">
@use '@/assets/weather.scss';
.about-container {
  h2 {
    font-size: 28px;
    font-weight: 500;
    margin-bottom: 20px;
  }
  p {
    font-size: 18px;
    line-height: 1.6;
    margin-bottom: 20px;
    ul {
      list-style-type: disc;
      padding-left: 20px;
      li {
        margin-bottom: 10px;
      }
    }
  }
}
</style>    
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
        이 프로젝트는 Vue.js와 Axios를 활용하여 OpenWeatherMap API의 실시간 날씨 정보를 제공하는 웹
        애플리케이션입니다. 사용자는 여러 지역의 날씨 현황을 한눈에 확인하고, 상세 페이지에서 현재
        날씨와 시간별 예보를 함께 조회할 수 있습니다.
      </p>

      <section class="about-section">
        <h3>주요 기능</h3>
        <ul>
          <li>서울, 수원, 부산, 성남, 대구, 제주 지역별 날씨 현황 조회</li>
          <li>검색 기능을 통한 특정 지역 날씨 확인</li>
          <li>하트 버튼을 활용한 관심 지역 즐겨찾기 추가 및 해제</li>
          <li>Pinia 전역 상태와 localStorage를 활용한 즐겨찾기 유지</li>
          <li>상세 페이지에서 현재 온도, 날씨 상태, 습도, 풍속 제공</li>
          <li>OpenWeatherMap 예보 API를 활용한 3시간 간격 시간별 온도 표시</li>
          <li>섭씨와 화씨 단위 전환 기능</li>
          <li>상세 날씨 데이터 로컬 캐싱으로 빠른 재방문 화면 제공</li>
          <li>Element Plus Skeleton을 활용한 날씨 데이터 로딩 화면 제공</li>
          <li>낮/밤 배경 테마 전환 기능</li>
          <li>움직이는 고양이 선택, 멈춤, 숨김 기능</li>
          <li>오늘 날짜와 현재 시간을 실시간으로 표시</li>
          <li>404 페이지 처리 및 Vue Router 기반 라우팅</li>
        </ul>
      </section>

      <section class="about-section">
        <h3>사용 기술</h3>
        <ul>
          <li>Vue.js Composition API</li>
          <li>Vue Router를 활용한 페이지 이동</li>
          <li>Pinia를 활용한 날씨 단위와 즐겨찾기 상태 관리</li>
          <li>Axios를 활용한 OpenWeatherMap API 연동</li>
          <li>localStorage를 활용한 상세 날씨 캐싱</li>
          <li>Element Plus 컴포넌트를 활용한 로딩 UI 구성</li>
          <li>SCSS 기반 컴포넌트 스타일링</li>
        </ul>
      </section>

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
  }
}

.about-section {
  margin-bottom: 20px;

  h3 {
    margin-bottom: 12px;
    color: #212121;
    font-size: 20px;
    font-weight: 600;
  }

  ul {
    list-style-type: disc;
    padding-left: 20px;
  }

  li {
    margin-bottom: 10px;
    color: #424242;
    font-size: 16px;
    line-height: 1.5;
  }
}
</style>

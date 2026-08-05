import { createRouter, createWebHistory } from 'vue-router'
import WeatherHomeView from '../views/WeatherHomeView.vue'

// routes: URL path와 View 컴포넌트를 연결하는 라우팅 설정
const routes = [
  {
    path: '/',
    name: 'WeatherHome',
    component: WeatherHomeView,
  },
  {
    path: '/about',
    name: 'WeatherAbout',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: '/weather/:cityId',
    name: 'WeatherDetail',
    // :cityId: 상세 페이지에서 route.params.cityId로 읽는 동적 라우트 파라미터
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
  },
]

// createWebHistory: 브라우저 주소창 기반 SPA 라우팅 방식
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

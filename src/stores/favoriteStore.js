import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'favorite-city-ids'

const readStoredFavoriteIds = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch (error) {
    console.error('즐겨찾기 저장값 파싱 실패:', error)
    return []
  }
}

export const useFavoriteStore = defineStore('favorite', () => {
  // ref: 즐겨찾기 도시 id 목록을 Pinia 전역 상태로 관리
  const favoriteCityIds = ref(readStoredFavoriteIds())

  // computed: 즐겨찾기 개수 표시용 값 계산
  const favoriteCount = computed(() => favoriteCityIds.value.length)

  const isFavorite = (cityId) => favoriteCityIds.value.includes(cityId)

  const toggleFavorite = (cityId) => {
    if (isFavorite(cityId)) {
      favoriteCityIds.value = favoriteCityIds.value.filter((id) => id !== cityId)
      return
    }

    favoriteCityIds.value = [...favoriteCityIds.value, cityId]
  }

  // watch: 즐겨찾기 변경 시 localStorage에 저장
  watch(
    favoriteCityIds,
    (nextFavoriteCityIds) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavoriteCityIds))
    },
    { deep: true },
  )

  return {
    favoriteCityIds,
    favoriteCount,
    isFavorite,
    toggleFavorite,
  }
})

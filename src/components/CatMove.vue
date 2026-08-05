<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

// ref: 선택된 동물, 멈춤 여부, 이미지 DOM 참조를 반응형으로 관리
const selectedCat = ref('walking_cat1')
const isCatPaused = ref(false)
const catRef = ref(null)
const catGif = ref(new URL('../assets/walking_cat1.gif', import.meta.url).href)

// select 옵션용 동물 목록, v-for 렌더링 데이터로 사용
const catOptions = [
  { value: 'walking_cat1', label: '검은 고양이' },
  { value: 'walking_cat3', label: '무지개 고양이' },
  { value: 'whale', label: '고래' },
  { value: 'none', label: '동물 없음' },
]

const catMap = {
  walking_cat1: new URL('../assets/walking_cat1.gif', import.meta.url).href,
  whale: new URL('../assets/whale.gif', import.meta.url).href,
  walking_cat3: new URL('../assets/walking_cat3.gif', import.meta.url).href,
}

// watch: selectedCat 변경 시 표시할 gif 이미지 교체
watch(
  selectedCat,
  (value) => {
    if (value === 'none') {
      isCatPaused.value = false
      return
    }

    catGif.value = catMap[value] || catMap.walking_cat1
  },
  { immediate: true },
)

let mouseX = window.innerWidth / 2
let mouseY = window.innerHeight / 2

let catX = mouseX
let catY = mouseY

let animationFrameId = null

// 마우스 좌표 저장 후 requestAnimationFrame으로 동물 이동 처리
const handleMouseMove = (event) => {
  mouseX = event.clientX
  mouseY = event.clientY
}

const animateCat = () => {
  const followSpeed = 0.002

  if (!isCatPaused.value) {
    catX += (mouseX - catX) * followSpeed
    catY += (mouseY - catY) * followSpeed
  }

  if (catRef.value) {
    const direction = mouseX < catX ? -1 : 1

    catRef.value.style.transform = `
      translate3d(${catX}px, ${catY}px, 0)
      translate(-50%, -50%)
      scaleX(${direction})
    `
  }
  animationFrameId = requestAnimationFrame(animateCat)
}

// onMounted: DOM 준비 후 마우스 이벤트와 애니메이션 루프 시작
onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  animationFrameId = requestAnimationFrame(animateCat)
})

// onBeforeUnmount: 화면 이탈 시 이벤트와 애니메이션 정리
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleMouseMove)

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <div class="cat-picker">
    <label for="catSelect">고양이 선택</label>
    <!-- v-model: select 값과 selectedCat 상태를 양방향 연결 -->
    <select id="catSelect" v-model="selectedCat">
      <option v-for="option in catOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <!-- @click: 버튼 클릭 시 멈춤 상태 true/false 토글 -->
    <button
      class="cat-pause-btn"
      type="button"
      :disabled="selectedCat === 'none'"
      @click="isCatPaused = !isCatPaused"
    >
      {{ isCatPaused ? '움직이기' : '멈추기' }}
    </button>
  </div>

  <!-- v-if: 동물 없음을 선택하면 img 렌더링 제외 -->
  <div v-if="selectedCat !== 'none'" class="cat-background" aria-hidden="true">
    <img ref="catRef" class="cursor-cat" :src="catGif" alt="" />
  </div>
</template>

<style scoped lang="scss">
.cat-picker {
  position: absolute;
  top: 15px;
  right: 18px;
  z-index: 15;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 9px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  box-shadow: 0 14px 28px rgba(8, 25, 40, 0.1);
}

.cat-picker label {
  font-size: 12px;
  color: #2d3d3b;
  white-space: nowrap;
}

.cat-picker select {
  width: 118px;
  border: 1px solid rgba(84, 116, 107, 0.25);
  border-radius: 10px;
  padding: 0.45rem 0.55rem;
  background: rgba(255, 255, 255, 0.95);
  color: #1d3230;
  font-size: 12px;
}

.cat-pause-btn {
  border: 1px solid rgba(84, 116, 107, 0.25);
  border-radius: 6px;
  padding: 0.45rem 0.6rem;
  background: #77a079;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.cat-pause-btn:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.cat-background {
  position: fixed;
  inset: 0;
  z-index: 10;
  overflow: hidden;
  pointer-events: none;
}

.cursor-cat {
  position: absolute;
  top: 0;
  left: 0;

  width: 70px;
  height: auto;

  pointer-events: none;
  user-select: none;
  will-change: transform;
}
</style>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch, defineProps } from 'vue'
const props = defineProps({
  catType: {
    type: String,
    default: 'walking_cat1',
  },
})
const catRef = ref(null)
const catGif = ref(new URL('../assets/walking_cat1.gif', import.meta.url).href)

const catMap = {
  walking_cat1: new URL('../assets/walking_cat1.gif', import.meta.url).href,
  walking_cat2: new URL('../assets/walking_cat2.gif', import.meta.url).href,
  walking_cat3: new URL('../assets/walking_cat3.gif', import.meta.url).href,
}

watch(
  () => props.catType,
  (value) => {
    catGif.value = catMap[value] || catMap.walking_cat1
  },
  { immediate: true },
)

let mouseX = window.innerWidth / 2
let mouseY = window.innerHeight / 2

let catX = mouseX
let catY = mouseY

let animationFrameId = null

const handleMouseMove = (event) => {
  mouseX = event.clientX
  mouseY = event.clientY
}

const animateCat = () => {
  const followSpeed = 0.002

  catX += (mouseX - catX) * followSpeed
  catY += (mouseY - catY) * followSpeed

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

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  animationFrameId = requestAnimationFrame(animateCat)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleMouseMove)

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <div class="cat-background" aria-hidden="true">
    <img ref="catRef" class="cursor-cat" :src="catGif" alt="" />
  </div>
</template>

<style scoped lang="scss">
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

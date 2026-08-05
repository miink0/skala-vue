<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
const catGif = new URL('../assets/walk_cat.gif', import.meta.url).href
const catRef = ref(null)

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

  width: 100px;
  height: auto;

  pointer-events: none;
  user-select: none;
  will-change: transform;
}
</style>

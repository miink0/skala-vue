<script setup>
import { useConfigStore } from '@/stores/configStore'
const configStore = useConfigStore()
</script>

<template>
  <div
    style="
      text-align: center;
      margin-left: auto;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    "
  >
    <span
      >날씨단위: <strong>{{ configStore.unit === 'celsius' ? '섭씨(℃)' : '화씨(℉)' }}</strong></span
    >
    <button @click="configStore.toggleUnit" class="toggle-btn">단위변경</button>
  </div>
</template>

<style scoped>
.toggle-btn {
  padding: 8px 15px;
  background-color: #77a079;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
}
.toggle-btn:hover {
  background-color: rgba(16, 27, 46, 0.8);
}
</style>

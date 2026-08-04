<template>
  <div class="base-dashboard-card">
    <slot></slot>
  </div>
</template>

<style scoped>
.base-dashboard-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 24px;
  box-shadow: 0 14px 32px rgba(44, 62, 80, 0.08);
  padding: 24px;
  display: grid;
  gap: 20px;
}

.base-dashboard-card .list-box {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 6px 16px rgba(44, 62, 80, 0.08);
}

.base-dashboard-card .status-bar {
  min-height: 56px;
  display: flex;
  align-items: center;
  padding: 14px 18px;
  border-radius: 16px;
  background: #ffffff;
  color: #616161;
}
</style>

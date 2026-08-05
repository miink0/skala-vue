<script setup>
// defineProps: 부모 컴포넌트에서 내려준 검색어 읽기
const props = defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
})

// defineEmits: input 변경 값을 부모 이벤트로 전달
const emit = defineEmits(['update-query'])
</script>

<template>
  <section class="search-box">
    <h3>도시 검색</h3>
    <p>
      검색 중인 도시: <strong>{{ props.searchQuery }}</strong>
    </p>
    <div class="input-wrapper with-icon">
      <font-awesome-icon class="search-icon" :icon="['fas', 'magnifying-glass']" />
      <!-- @input: 사용자 입력마다 부모 searchQuery 갱신 요청 -->
      <input
        type="text"
        :value="props.searchQuery"
        @input="(e) => emit('update-query', e.target?.value ?? '')"
        placeholder="검색할 도시 이름 입력"
      />
    </div>
  </section>
</template>

<style scoped>
.input-wrapper {
  position: relative;
}

.input-wrapper.with-icon input {
  padding-left: 42px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #7a9f8c;
  font-size: 18px;
}
</style>

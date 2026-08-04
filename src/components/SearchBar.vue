<script setup>
const props = defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
})

const { searchQuery } = props
const emit = defineEmits(['update-query'])
</script>

<template>
  <section class="search-box">
    <h3>도시 검색</h3>
    <p>
      검색 중인 도시: <strong>{{ searchQuery }}</strong>
    </p>
    <input
      type="text"
      :value="searchQuery"
      @input="(e) => emit('update-query', e.target.value)"
      placeholder="검색할 도시 이름 입력"
    />
  </section>
</template>

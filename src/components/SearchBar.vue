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

<style scoped>
.search-box {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 6px 16px rgba(44, 62, 80, 0.08);
}

.search-box h3 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #203739;
}

.search-box p {
  margin: 0 0 12px;
  color: #6b7a82;
}

.search-box input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #dbf0df;
  border-radius: 999px;
  outline: none;
  font-size: 15px;
}

.search-box input:focus {
  border-color: #55a57a;
  box-shadow: 0 0 0 3px rgba(85, 165, 122, 0.15);
}
</style>

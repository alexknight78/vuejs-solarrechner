<template>
  <div class="d-inline">
    <i
      :class="`bi bi-${sortUpDown ? `sort-${props.sortIcon}-down` : `sort-${props.sortIcon}-up-alt`}`"
      @click="handleClickSort(props.sortKey)"
    ></i>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['sortKey', 'sortIcon'])

const sortUpDown = ref(true)

const emit = defineEmits(['click:SortData'])

const handleClickSort = (key) => {
  sortUpDown.value = !sortUpDown.value
  emit('click:SortData', key, sortUpDown)
}
</script>

<style scoped></style>

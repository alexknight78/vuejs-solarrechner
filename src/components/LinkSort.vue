<template>
  <div class="d-inline">
    <i
      :class="`bi bi-${sortUpDown === 'up' ? `sort-${props.sortIcon}-down` : `sort-${props.sortIcon}-up-alt`} ${props.sortActive === props.sortKey ? 'text-success' : 'text-secondary'}`"
      @click="handleClickSort(props.sortKey)"
    ></i>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import { SortKey } from '../types/dataWr'
const props = defineProps(['sortKey', 'sortIcon', 'sortActive'])

// interface Props {
//   sortKey: SortKey
//   sortIcon: string
//   sortActive: string
// }

// const props = defineProps<Props>()

const sortUpDown = ref('up')

const emit = defineEmits(['click:SortData'])

const handleClickSort = (key) => {
  sortUpDown.value =
    sortUpDown.value === 'up' ? (sortUpDown.value = 'down') : (sortUpDown.value = 'up')
  emit('click:SortData', key, sortUpDown.value)
}
</script>

<style scoped>
i:hover {
  cursor: pointer;
}
</style>

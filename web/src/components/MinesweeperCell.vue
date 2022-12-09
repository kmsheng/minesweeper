<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  num: {
    type: Number,
    default: 0
  },
  mark: {
    type: String,
    default: ''
  },
  pressing: Boolean,
  isMine: Boolean,
  gory: Boolean,
  swept: Boolean,
  debug: Boolean
})

const classname = computed(() => {
  const { num } = props
  return {
    'minesweeper-cell--gory': props.gory,
    [`minesweeper-cell--num${num}`]: num
  }
})
const maskClass = computed(() => {
  return {
    'minesweeper-cell__mask--debug': props.debug,
    'minesweeper-cell__mask--pressing': props.pressing,
    'minesweeper-cell__mask--swept': props.swept
  }
})
</script>

<template>
  <div class="minesweeper-cell" :class="classname" data-cy="cell">
    <span v-if="isMine" class="scale-150">✹</span>
    <span v-else-if="num" class="scale-130">{{ num }}</span>
    <div class="minesweeper-cell__mask"
         :class="maskClass"
         data-cy="cell-mask" />
    <span v-if="mark === 'flag'"
          class="minesweeper-cell__mark">&#128681;</span>
    <span v-else-if="mark === 'guess'"
          class="minesweeper-cell__mark text-black">?</span>
  </div>
</template>

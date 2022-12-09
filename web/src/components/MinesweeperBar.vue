<script setup lang="ts">
import { computed } from 'vue'

const emit = defineEmits(['face-click', 'debug-click'])

const props = defineProps({
  face: {
    type: String,
    default: ''
  },
  markCount: {
    type: Number,
    required: true
  },
  seconds: {
    type: Number,
    required: true
  },
  debug: Boolean
})

const emoji = computed(() => {
  switch (props.face) {
    case 'elation':
      return '*()*'
    case 'shy':
      return '~o~'
    case 'sad':
      return 'x_x'
    default:
      return '^_^'
  }
})
</script>

<template>
  <div class="flex justify-between items-center px-4 py-2">
    <div class="basis-1/3">{{ markCount }}</div>
    <button class="flex-none bg-yellow-400 rounded-md p-2"
            data-cy="face"
            @click="emit('face-click')">
      {{ emoji }}
    </button>
    <div class="basis-1/3 text-right">{{ seconds }}</div>
  </div>
</template>

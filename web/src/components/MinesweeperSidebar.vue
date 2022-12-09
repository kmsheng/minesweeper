<script setup lang="ts">
defineProps({
  debug: Boolean
})
const emit = defineEmits(['toggle-debug', 'mode'])
</script>

<template>
  <div class="pl-4 space-y-3">
    <button class="minesweeper-toolbar__btn"
            @click="emit('mode', 'beginner')">Beginner</button>
    <button class="minesweeper-toolbar__btn"
            @click="emit('mode', 'intermediate')">Intermediate</button>
    <button class="minesweeper-toolbar__btn"
            @click="emit('mode', 'expert')">Expert</button>
    <button class="minesweeper-toolbar__btn"
            data-cy="debug"
            @click="emit('toggle-debug')">Debug: {{ debug ? 'ON' : 'OFF' }}</button>
  </div>
</template>

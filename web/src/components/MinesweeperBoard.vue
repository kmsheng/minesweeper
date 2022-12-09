<script setup lang="ts">
import { reactive } from 'vue'
import MinesweeperCell from '@/components/MinesweeperCell.vue'
import MinesweeperBar from '@/components/MinesweeperBar.vue'
import MinesweeperSidebar from '@/components/MinesweeperSidebar.vue'
import isRightClick from '@/utils/isRightClick'
import { Cell, Game } from '@ctci/minesweeper'

const props = defineProps({
  mode: {
    type: String,
    default: 'beginner'
  }
})
const data = reactive({
  face: '',
  pressingCell: null,
  debug: false
})

interface Config {
  mode: string,
  matrix: Cell[][]
}
const config: Config = reactive({
  mode: props.mode,
  matrix: []
})
const game = new Game(config)
const board = game.board

const url = new URL(location.href)
const pos = url.searchParams.get('pos')
if (pos) {
  const posArr = pos.split(',').map(v => v.trim())
  board.setMatrix(posArr)
}
else {
  board.genMatrix()
}

game.subscribe(() => {
  if (game.won) {
    data.face = 'elation'
  }
  if (game.lost) {
    data.face = 'sad'
  }
})
const isPressing = (cell: Cell) => cell === data.pressingCell
const mousedown = (event: MouseEvent, cell: Cell) => {
  if (game.done) {
    return
  }
  if (isRightClick(event)) {
    return board.toggleMark(cell)
  }
  if ((! cell.swept) && (! cell.flagged)) {
    data.pressingCell = cell
    data.face = 'shy'
  }
}
const mouseup = (event: MouseEvent, cell: Cell) => {
  if (game.done) {
    return
  }
  if (isRightClick(event)) {
    return
  }
  data.pressingCell = null
  data.face = ''
  board.sweep(cell)
  game.check()
}
const reload = () => {
  data.face = ''
  game.reload()
}
</script>

<template>
  <div class="flex">
    <div class="w-fit border-3d border-4 bg-gray-400">
      <minesweeper-bar :mark-count="board.markCount"
                       :face="data.face"
                       :debug="data.debug"
                       :seconds="999"
                       @face-click="reload"
                       @debug-click="data.debug = (! data.debug)" />
      <div>
        <div v-for="(row, i) in config.matrix" :key="i" class="flex">
          <minesweeper-cell v-for="(cell, j) in row"
                            :key="cell.id"
                            :data-cy-pos="`${i}:${j}`"
                            :num="cell.num"
                            :is-mine="cell.isMine"
                            :mark="cell.mark"
                            :pressing="isPressing(cell)"
                            :gory="cell.gory"
                            :swept="cell.swept"
                            :debug="data.debug"
                            @mousedown="mousedown($event, cell)"
                            @mouseup="mouseup($event, cell)"
                            @contextmenu.prevent />
        </div>
      </div>
    </div>
    <minesweeper-sidebar :debug="data.debug"
                         @mode="mode => game.setMode(mode)"
                         @toggle-debug="data.debug = (! data.debug)" />
  </div>
</template>

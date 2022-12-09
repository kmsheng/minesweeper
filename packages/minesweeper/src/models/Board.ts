import Config from '@/models/Config'
import Cell from '@/models/Cell'

type Pos = {
  i: number,
  j: number
}

class Board {

  private config: Config
  private _posMap = new Map()

  constructor(config: Config) {
    this.config = config
    this.init()
  }

  get markCount() {
    return this.config.mines - this.filterCell(cell => cell.hasMark).length
  }

  get sweptCells() {
    return this.filterCell(cell => cell.swept && (! cell.isMine))
  }

  get sweptMineCells() {
    return this.filterCell(cell => cell.swept && cell.isMine)
  }

  clearAllMarks() {
    return this.eachCell(cell => cell.clearMark())
  }

  flagAllMines() {
    return this.filterCell(cell => cell.isMine)
      .forEach(cell => cell.setFlag())
  }

  reload() {
    const { customMinePos } = this.config
    this.init()
    if (customMinePos.length > 0) {
      return this.setMatrix(customMinePos)
    }
    this.genMatrix()
  }

  setGory(cells: Cell[]) {
    cells.forEach(cell => cell.setGory(true))
  }

  sweepAll() {
    this.eachCell(cell => cell.sweep())
  }

  sweepAround(cell: Cell) {
    const emptyCells = [cell]
    while (emptyCells.length > 0) {
      // weird return type of Array.prototype.shift()
      // see https://github.com/microsoft/TypeScript/issues/18718
      const current = emptyCells.shift()!
      const surroundingCells = this.getSurroundingCells(current)
      // sweep self
      current.sweep()

      // sweep numeric cells
      surroundingCells.filter(c => c.sweepable && (c.num > 0))
        .forEach(c => {
          c.sweep()
        })

      const nextCells = surroundingCells.filter(c => c.sweepable && c.empty)
      emptyCells.push(...nextCells)
    }
  }

  sweep(cell: Cell) {
    if (cell.flagged) {
      return
    }
    if (! cell.sweepable) {
      return
    }
    if (cell.isMine) {
      return cell.sweep()
    }
    if (cell.empty) {
      this.sweepAround(cell)
    }
    cell.sweep()
  }

  toggleMark(cell: Cell) {
    if (cell.noMark && (this.markCount === 0)) {
      return
    }
    cell.toggleMark()
  }

  setMatrix(posArr: Array<string>) {
    const { config } = this
    const { rows, cols, matrix } = config
    const minesSet = new Set(posArr)

    matrix.length = 0
    for (let i = 0; i < rows; i++) {
      matrix[i] = []
      for (let j = 0; j < cols; j++) {
        const cell = new Cell()
        const key = `${i}:${j}`
        if (minesSet.has(key)) {
          cell.setMine()
          minesSet.delete(key)
        }
        matrix[i].push(cell)
      }
    }
    if (minesSet.size > 0) {
      throw new Error(`There are mines which haven't been placed: ${Array.from(minesSet)}`)
    }
    config.setCustomMinePos(posArr)
    this.setCellPosToMap()
    this.markNums()
  }

  genMatrix() {
    const { rows, cols, mines, matrix } = this.config
    let minesSet = mines
    matrix.length = 0
    for (let i = 0; i < rows; i++) {
      matrix[i] = []
      for (let j = 0; j < cols; j++) {
        const cell = new Cell()
        if (minesSet > 0) {
          cell.setMine()
          minesSet -= 1
        }
        matrix[i].push(cell)
      }
    }
    this.shuffle()
    this.setCellPosToMap()
    this.markNums()
  }

  private init() {
    this._posMap.clear()
  }

  private shuffle() {
    const { cols, totalCells, matrix } = this.config

    for (let index1 = totalCells - 1; index1 > 0; index1--) {

      const index2 = Math.floor(Math.random() * index1)

      const row1 = Math.floor(index1 / cols)
      const col1 = index1 % cols

      const row2 = Math.floor(index2 / cols)
      const col2 = index2 % cols

      // swap
      const temp = matrix[row1][col1]
      matrix[row1][col1] = matrix[row2][col2]
      matrix[row2][col2] = temp
    }
  }

  private filterCell(fn: (cell: Cell) => boolean) {
    const arr = []
    const { rows, cols, matrix } = this.config
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const cell = matrix[i][j]
        const wanted = fn(cell)
        if (wanted) {
          arr.push(cell)
        }
      }
    }
    return arr
  }

  private eachCell(fn: (cell: Cell) => void | false) {
    const { rows, cols, matrix } = this.config
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const next = fn(matrix[i][j])
        if (next === false) {
          break
        }
      }
    }
  }

  private inBounds(pos: Pos) {
    const { rows, cols } = this.config
    const { i, j } = pos
    return (0 <= i) && (i < rows) && (0 <= j) && (j < cols)
  }

  private getSurroundingCells(cell: Cell) {
    const pos = this.getCellPos(cell)
    const { matrix } = this.config
    const deltas: number[][] = [
      [-1, -1], [-1, 0], [-1, 1],
      [0,  -1],          [0, 1],
      [1,  -1], [1, 0],  [1, 1]
    ]
    return deltas.map(d => {
      const [i, j] = d
      return { i: pos.i + i, j: pos.j + j }
    })
    .filter(p => this.inBounds(p))
    .map(p => matrix[p.i][p.j])
  }

  private markMineCount(cell: Cell) {
    const mineCount = this.getSurroundingCells(cell)
      .filter(c => c.isMine)
      .length
    cell.setNum(mineCount)
  }

  private markNums() {
    const { mines } = this.config
    let marked = 0
    this.eachCell(cell => {
      if (cell.isMine) {
        this.getSurroundingCells(cell)
          .filter(cell => (! cell.isMine))
          .forEach(cell => this.markMineCount(cell))
        marked++
      }
      if (marked >= mines) {
        return false
      }
    })
  }

  private getCellPos(cell: Cell) {
    return this._posMap.get(cell)
  }

  private setCellPos(cell: Cell, pos: Pos) {
    this._posMap.set(cell, pos)
  }

  private setCellPosToMap() {
    const { rows, cols, matrix } = this.config
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const pos = { i, j }
        const cell = matrix[i][j]
        this.setCellPos(cell, pos)
      }
    }
  }
}

export default Board

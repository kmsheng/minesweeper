import Config, { Mode } from '@/models/Config'
import Cell from '@/models/Cell'
import Board from '@/models/Board'

enum Status {
  Init = 'init',
  Playing = 'playing',
  Gamewon = 'gamewon',
  Gameover = 'gameover'
}

type Listener = (status: Status) => void

class Game {

  board: Board

  private config: Config
  private _status = Status.Init
  private _fns: Listener[] = []

  constructor(options: object = {}) {
    this.config = new Config(options)
    this.board = new Board(this.config)
  }

  get status() {
    return this._status
  }

  get won() {
    return this._status === Status.Gamewon
  }

  get lost() {
    return this._status === Status.Gameover
  }

  get done() {
    return this.won || this.lost
  }

  setMode(mode: Mode) {
    this.config.setConfig({ mode })
    this.board.genMatrix()
  }

  subscribe(fn: () => void) {
    this._fns.push(fn)
    return () => {
      this._fns = this._fns.filter(f => f !== fn)
    }
  }

  reload() {
    this._status = Status.Init
    this.board.reload()
  }

  check() {
    const { config, board } = this
    const deadCells = board.sweptMineCells
    if (deadCells.length > 0) {
      return this.gameover(deadCells)
    }
    if ((config.totalCells - board.sweptCells.length) === config.mines) {
      return this.gamewon()
    }
  }

  private gameover(deadCells: Cell[]) {
    const { board } = this
    board.setGory(deadCells)
    board.sweepAll()
    this._status = Status.Gameover
    this._fns.forEach(fn => fn(this._status))
  }

  private gamewon() {
    const { board } = this
    board.clearAllMarks()
    board.flagAllMines()
    this._status = Status.Gamewon
    this._fns.forEach(fn => fn(this._status))
  }
}

export default Game

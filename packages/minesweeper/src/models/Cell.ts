import uniqId from '@/utils/uniqId'

enum Mark {
  NONE = 'none',
  FLAG = 'flag',
  GUESS = 'guess'
}

class Cell {

  private _id: string
  private _isMine = false
  private _mark = Mark.NONE
  private _num = 0
  private _swept = false
  private _gory = false

  constructor() {
    this._id = uniqId('cell')
  }

  get id() {
    return this._id
  }

  get isMine() {
    return this._isMine
  }

  get mark() {
    return this._mark
  }

  get num() {
    return this._num
  }

  get empty() {
    return this._num === 0
  }

  get gory() {
    return this._gory
  }

  get swept() {
    return this._swept
  }

  get sweepable() {
    return (! this._swept)
  }

  get noMark() {
    return this._mark === Mark.NONE
  }

  get hasMark() {
    return this._mark !== Mark.NONE
  }

  get flagged() {
    return this._mark === Mark.FLAG
  }

  get isGuess() {
    return this._mark === Mark.GUESS
  }

  sweep() {
    this._swept = true
    this.clearMark()
  }

  setNum(num: number) {
    this._num = num
  }

  setMine() {
    this._isMine = true
  }

  setGory(gory: boolean) {
    this._gory = gory
  }

  setFlag() {
    this._mark = Mark.FLAG
  }

  clearMark() {
    this._mark = Mark.NONE
  }

  setMark(mark: Mark) {
    this._mark = mark
  }

  toggleMark() {
    if (this.swept) {
      return
    }
    if (this.noMark) {
      return this.setMark(Mark.FLAG)
    }
    if (this.flagged) {
      return this.setMark(Mark.GUESS)
    }
    this.setMark(Mark.NONE)
  }
}

export default Cell

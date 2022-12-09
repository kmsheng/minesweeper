import Cell from '@/models/Cell'
import extend from '@/utils/extend'
import pick from '@/utils/pick'

export enum Mode {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Expert = 'expert'
}

export const BEGINNER_CONFIG = {
  cols: 8,
  rows: 8,
  mines: 10
}

export const INTERMEDIATE_CONFIG = {
  cols: 16,
  rows: 16,
  mines: 40
}

export const EXPERT_CONFIG = {
  cols: 30,
  rows: 16,
  mines: 99
}

export const CONFIG_MAP = {
  [Mode.Beginner]: BEGINNER_CONFIG,
  [Mode.Intermediate]: INTERMEDIATE_CONFIG,
  [Mode.Expert]: EXPERT_CONFIG
}

type Options = {
  mode?: Mode,
  cols?: number,
  rows?: number,
  mines?: number,
  matrix?: [][]
}

class Config {

  cols: number = BEGINNER_CONFIG.cols
  rows: number = BEGINNER_CONFIG.rows
  mines: number = BEGINNER_CONFIG.mines
  matrix: Cell[][] = []

  customMinePos: Array<string> = []

  constructor(options: Options = {}) {
    this.init(options)
  }

  get totalCells() {
    return this.rows * this.cols
  }

  init(options: Options) {
    if (options.matrix) {
      this.matrix = options.matrix
    }
    this.setConfig(options)
  }

  setCustomMinePos(posArr: Array<string>) {
    this.customMinePos = posArr
    this.mines = posArr.length
  }

  setConfig(options: Options) {
    const mode = options.mode as keyof typeof CONFIG_MAP
    const configProps = CONFIG_MAP[mode] || {}
    const customProps = pick(options, ['rows', 'cols', 'mines'])
    extend(this, configProps, customProps)

    if (this.mines > this.totalCells) {
      throw new Error('Mine count should not be greater than cells total.')
    }
  }
}

export default Config

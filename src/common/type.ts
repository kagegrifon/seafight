export type SCREENS_NAMES = 'start' | 'place' | 'fight'

export type AxisDirection = 'vertical' | 'horizontal'

export type ShootResult = 'missed' | 'hit' | 'kill'

export interface Cell {
    x: number,
    y: number
}

export interface ShipCell extends Cell {
    isHit: boolean
}

export interface Enemy {
    chooseNextCell(): Cell
    processingResult({ cell, result }: { cell: Cell, result: ShootResult }): void
}

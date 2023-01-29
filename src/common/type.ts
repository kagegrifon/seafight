export type SCREENS_NAMES = 'start' | 'place' | 'fight'

export type AxisDirection = 'vertical' | 'horizontal'

export type FieldMap = Array<Array<number>>

export interface Ship {
    x: number,
    y: number,
    direction: AxisDirection,
    shipSize: number,
}

export type State = {
    disposition: FieldMap
}

export type PageScript = (params: { state: State, onGoNext?: Function }) => void
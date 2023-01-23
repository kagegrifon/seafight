export type AxisDirection = 'vertical' | 'horizontal'

export type FieldMap = Array<Array<number>>

export interface Ship {
    x: number,
    y: number,
    direction: AxisDirection,
    shipSize: number,
}
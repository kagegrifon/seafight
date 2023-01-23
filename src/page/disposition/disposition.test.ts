import { Ship } from 'common/type'
import { incrementByDirection, isPositionFit } from './disposition'

describe('incrementByDirection', () => {

    test('increase x for horizontal direction', () => {
        expect(incrementByDirection.horizontal.x(1)).toBe(2)
    })

    test('not increase y for horizontal direction', () => {
        expect(incrementByDirection.horizontal.y(1)).toBe(1)
    })

    test('not increase x for vertical direction', () => {
        expect(incrementByDirection.vertical.x(1)).toBe(1)
    })

    test('increase y for vertical direction', () => {
        expect(incrementByDirection.vertical.y(1)).toBe(2)
    })
})

describe('isPositionFit', () => {
    const map = [
        [-1, -1, -1, -1, 0, 0, 0, 0, 0, 0],
        [-1, 1, -1, -1, 0, 0, 0, 0, 0, 0],
        [-1, -1, -1, -1, 0, 0, 0, 0, 0, 0],
        [-1, 2, 2, -1, 0, 0, 0, 0, 0, 0],
        [-1, -1, -1, -1, 0, 0, 0, 0, 0, 0],
        [3, 3, 3, -1, 0, 0, 0, 0, 0, 0],
        [-1, -1, -1, -1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]

    const shipsWithFitPos: Ship[] = [{
        direction: 'horizontal',
        shipSize: 4,
        x: 1,
        y: 8,
    },
    {
        direction: 'horizontal',
        shipSize: 4,
        x: 5,
        y: 3,
    },
    {
        direction: 'vertical',
        shipSize: 4,
        x: 5,
        y: 1,
    },
    {
        direction: 'vertical',
        shipSize: 4,
        x: 8,
        y: 1,
    }]

    const shipsWithNotFitPos: Ship[] = [{
        direction: 'horizontal',
        shipSize: 4,
        x: 3,
        y: 4,
    },
    {
        direction: 'horizontal',
        shipSize: 4,
        x: 2,
        y: 6,
    },
    {
        direction: 'vertical',
        shipSize: 4,
        x: 1,
        y: 1,
    },
    {
        direction: 'vertical',
        shipSize: 4,
        x: 1,
        y: 4,
    }]

    test('should be true on correct positions', () => {
        debugger
        shipsWithFitPos.forEach(shipWithFitPos => {
            expect(isPositionFit(map, shipWithFitPos)).toBe(true)
        })
    })

    test('should be false on correct positions', () => {

        shipsWithNotFitPos.forEach(shipWithNotFitPos => {
            expect(isPositionFit(map, shipWithNotFitPos)).toBe(false)
        })
    })
})

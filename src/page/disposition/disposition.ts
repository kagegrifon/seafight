import { FIRST_ALPHABETH_CHAR } from 'common/constant'
import type { AxisDirection, Ship, FieldMap } from 'common/type'

const FIELD_MAP_TEMPLATE: FieldMap = Array(10).fill(0).map(() => Array(10).fill(0))

const SHIP_DIRECTION: AxisDirection[] = ['horizontal', 'vertical']

export const incrementByDirection: {
    [direction in AxisDirection]: {
        x: (x: number) => number,
        y: (y: number) => number
    }
} = {
    horizontal: {
        x: (x: number) => x + 1,
        y: (y: number) => y,
    },
    vertical: {
        x: (x: number) => x,
        y: (y: number) => y + 1,
    }
}

export const initDispositionScreen = function () {
    const fieldNode = document.getElementById('field');
    drawField(fieldNode);
    const mapOfShipDisposition = createShipDisposition();
    placeShipByDisposition(mapOfShipDisposition, fieldNode)
}

function drawField(rootNode: HTMLElement) {
    const startCharCode = FIRST_ALPHABETH_CHAR.charCodeAt(0);

    for (let x = 0; x < 11; x++) {
        for (let y = 0; y < 11; y++) {
            const cellNode = document.createElement('div');
            cellNode.className = `cell cell-${x + 1}-${y + 1}`

            if (x === 0 && y !== 0) {
                cellNode.innerText = String.fromCharCode(startCharCode + y - 1)
            }

            if (y === 0 && x !== 0) {
                cellNode.innerText = String(x)
            }

            rootNode.append(cellNode)
        }
    }
}

export function createShipDisposition() {
    const newFieldMap: FieldMap = JSON.parse(JSON.stringify(FIELD_MAP_TEMPLATE));
    const ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

    ships.forEach(shipSize => {
        let ship = getRandomShipParams(shipSize);
        let isCorrectPositon = isPositionFit(newFieldMap, ship);

        while (!isCorrectPositon) {
            ship = getRandomShipParams(shipSize)
            isCorrectPositon = isPositionFit(newFieldMap, ship);
        }

        updateMap(newFieldMap, ship)
    });

    return newFieldMap;
}

function getRandomShipParams(shipSize: number): Ship {
    return {
        x: getRandomValue(0, 9 - shipSize),
        y: getRandomValue(0, 9 - shipSize),
        direction: SHIP_DIRECTION[getRandomValue(0, 1)],
        shipSize,
    }
}

function getRandomValue(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isPositionFit(newFieldMap: FieldMap, ship: Ship) {
    let y = ship.y;
    let x = ship.x;
    let length = ship.shipSize

    while (length > 0) {
        if (newFieldMap[y][x] !== 0) {
            return false;
        }

        if (ship.direction === 'vertical') {
            y += 1;
        } else {
            x += 1;
        }

        length--
    }

    return true;
}

function updateMap(map: FieldMap, ship: Ship) {
    const pointMatrix = Array(3).fill(0).map(() => Array(3).fill(0))

    let curX = ship.x
    let curY = ship.y

    for (let i = 0; i < ship.shipSize; i++) {
        map[curY][curX] = ship.shipSize;

        pointMatrix.forEach((subArray, yIndex) => {
            subArray.forEach((_, xIndex) => {
                const shiftX = xIndex - 1;
                const shiftY = yIndex - 1;

                if (
                    map[curY + shiftY]?.[curX + shiftX] === undefined
                    || map[curY + shiftY][curX + shiftX] > 0
                ) {
                    return
                }

                if (map[curY + shiftY][curX + shiftX] === 0) {
                    map[curY + shiftY][curX + shiftX] = -1
                }
            })
        })

        curY = incrementByDirection[ship.direction].y(curY)
        curX = incrementByDirection[ship.direction].x(curX)
    }
}

function placeShipByDisposition(shipDisposition: FieldMap, fieldNode: HTMLElement) {
    shipDisposition.forEach((rowArray, yIndex) => {
        rowArray.forEach((value, xIndex) => {
            const cell = fieldNode.querySelector(`.cell-${yIndex + 2}-${xIndex + 2}`)
            if (cell && value > 0) cell.innerHTML = String(value)
        })
    })
}


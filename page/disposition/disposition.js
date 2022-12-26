import { FIRST_ALPHABETH_CHAR } from '../../common/constant.js'

const fieldNode = document.getElementById('field');
const FIELD_MAP_TEMPLATE = [
    Array(10).fill(0).map(() => Array(10).fill(0))
]
const SHIP_DIRECTION = ['horizontal', 'vertical']

const incrementByDirection = {
    horizontal: {
        x: (x) => x + 1,
        y: (y) => y,
    },
    vertical: {
        x: (x) => x,
        y: (y) => y + 1,
    }
}

function drawField(rootNode) {
    const startCharCode = FIRST_ALPHABETH_CHAR.charCodeAt(0);

    for (let x = 0; x < 11; x++) {
        for (let y = 0; y < 11; y++) {
            const cellNode = document.createElement('div');
            cellNode.className = `cell cell-${x + 1}-${y + 1}`

            if (x === 0 && y !== 0) {
                cellNode.innerText = String.fromCharCode(startCharCode + y - 1 )
            }

            if (y === 0 && x !== 0) {
                cellNode.innerText = x
            }
            
            rootNode.append(cellNode)
        }   
    }
}

export function createShipDisposition() {
    const newFieldMap = JSON.parse(JSON.stringify(FIELD_MAP_TEMPLATE));
    const ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

    ships.forEach(shipSize => {
        let ship = getRandomShipParams(shipSize);
        debugger
        let isCorrectPositon = isPositionFit(newFieldMap, ship);
        debugger
         while (!isCorrectPositon) {
            ship = getRandomShipParams(shipSize)
            isCorrectPositon = isPositionFit(newFieldMap, ship);
        }
        debugger
        updateMap(newFieldMap, ship)
        debugger
    });
    
    return newFieldMap;
}

function getRandomShipParams(shipSize) {
    return {
        x: getRandomValue(0, 9 - shipSize),
        y: getRandomValue(0, 9 - shipSize),
        direction: SHIP_DIRECTION[getRandomValue(0, 1)],
        shipSize,
    }
}

function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isPositionFit(newFieldMap, ship) {
    let y = ship.x;
    let x = ship.y;
    let length = ship.shipSize

    while (length > 0) {
         if (newFieldMap[y[x]] !== 0) {
            return false;
         }

         if (ship.direction === 'vertical') {
            y += 1;
         } {
            x += 1;
         }

         length--
    }

    return true;
}

function updateMap(map, ship) {
    const pointMatrix = [
        Array(3).fill(0).map(() => Array(3).fill(0))
    ]

    let shipXCoord = ship.x;

    for (let i=0; i < ship.shipSize; i++) {
        = ship.x + incrementByDirection[ship.direction](i)
        map[ship.y[ship.x]] = shipSize;

        pointMatrix.forEach((subArray, yIndex) => {
            subArray.forEach((_, xIndex) => {
                const shiftX = xIndex - 1;
                const shiftY = yIndex - 1;

                if (
                    map[ship.y + shiftY[ship.x + shiftX]] === undefined 
                    || map[ship.y + shiftY[ship.x + shiftX]] > 0
                ) {
                    return
                }
                
                if (map[ship.y + shiftY[ship.x + shiftX]] === 0) {
                    map[ship.y + shiftY[ship.x + shiftX]] = -1
                }

                console.log('something wrong')
            })
        })


    }
}

export const initDispositionScreen = function() {
    drawField(fieldNode);
    const mapOfShipDisposition = createShipDisposition();
}
import { SHIPS_VARIANTS } from "common/constant";
import { getPointsAround, SeaMap, } from "entity/map";
import { AxisDirection, Cell, Enemy, ShootResult } from "common/type";
import { axisByDirection, defineDirecton, getRandomValue } from "common/utils";
import { IDefaultShipConstructor, Ship } from "entity/map/Ship";

export class AiLogic implements Enemy {
    battleField: SeaMap
    restShips: number[]
    finishingHistory: Cell[]
    cellVariants: Cell[]

    constructor() {
        this.battleField = new SeaMap()
        this.restShips = SHIPS_VARIANTS.slice()
        this.finishingHistory = []
        this.cellVariants = this.getCellVariants()
    }

    chooseNextCell(): Cell {
        if (!this.finishingHistory.length) {
            return this.cellVariants[0]
        }

        const possiblePoints = this.getPossiblePointsForFinishing().filter(point => this.battleField.isEmptyPoint(point))

        return possiblePoints[getRandomValue(0, possiblePoints.length)]
    }

    processingResult({cell, result}: {cell: Cell, result: ShootResult}) {
        console.log(cell, result)
    }

    getPossiblePointsForFinishing() {
        if (this.finishingHistory.length === 1) {
            return getPointsAround(this.finishingHistory[0]).flat()
        }

        return getEdgePoints(this.finishingHistory)
    }

    private getCellVariants() {
        const { cellVariants: cellsOnHorizontal, pointedBattleField } = this.getCellVariantsByDirection({ battleField: this.battleField, direction: 'horizontal' })
        const { cellVariants: cellsOnVertical } = this.getCellVariantsByDirection({ battleField: pointedBattleField, direction: "vertical" })

        return [...cellsOnHorizontal, ...cellsOnVertical]
    }

    getAvailableCells(battleField: SeaMap) {
        return battleField.table.reduce<{ x: number, y: number }[]>((acc, cur, y) => {
            cur.forEach((c, x) => {
                if (c.state === 'empty') {
                    acc.push({ x, y })
                }
            })
            return acc
        }, [])
    }

    getCellVariantsByDirection({ battleField, direction }: { battleField: SeaMap, direction: AxisDirection }) {
        const cellVariants = []
        const copyOfBattleField = new SeaMap({table: battleField.table})

        let availableCells = this.getAvailableCells(copyOfBattleField)

        const shipDraft: Pick<IDefaultShipConstructor, 'size' | 'direction'> = {
            size: Math.max(...this.restShips),
            direction
        }

        while (availableCells.length) {
            const curShip = new Ship({
                ...shipDraft,
                startPoint: availableCells[0]
            })

            const isFoundPlaceForShip = copyOfBattleField.isPositionFit(curShip)

            if (isFoundPlaceForShip) {
                const { cells: shipCells } = curShip

                // выбираем точку для стрельбы
                const cellForShoot = shipCells[getRandomValue(0, shipCells.length - 1)]
                cellVariants.push(cellForShoot)

                // помечаем на поле выбранную точку
                copyOfBattleField.table[cellForShoot.y][cellForShoot.x].state = 'notAllowed'

                // убираем все точки корабля из доступных
                availableCells = availableCells.filter((cell) => !shipCells.some(({ x, y }) => x === cell.x && y === cell.y))
            } else {
                availableCells.shift()
            }
        }

        return { cellVariants, pointedBattleField: copyOfBattleField }
    }
}

function getEdgePoints(points: Cell[]) {
    const [p1, p2] = points

    const direction: AxisDirection = defineDirecton(p1, p2)

    const axis = axisByDirection[direction]

    const valuesByMainAxis = points.map(p => p[axis.main])
    const ortogonalValue = points[0][axis.ortogonal]
    const minMain = Math.min(...valuesByMainAxis)
    const maxMain = Math.max(...valuesByMainAxis)

    return [
        { [axis.main]: minMain - 1, [axis.ortogonal]: ortogonalValue },
        { [axis.main]: maxMain - 1, [axis.ortogonal]: ortogonalValue }
    ]
}
import { SHIPS_VARIANTS } from "common/constant";
import { IShootOnMapResult, SeaMap } from "entity/map";
import { IAxisDirection, ICell, IEnemy } from "common/type";
import {
    axisByDirection,
    defineDirecton,
    getRandomArrIndex,
} from "common/utils";
import { IDefaultShipConstructor, Ship } from "entity/map/Ship";

type IChooseDirection = "ascend" | "descent";

export class AiLogic implements IEnemy {
    workMap: SeaMap;
    restShips: number[];
    finishingHistory: ICell[];
    cellVariants: ICell[];
    chooseDirection?: IChooseDirection;
    lastChosenCellIndex: number | null;

    constructor({
        workMap,
        finishingHistory,
    }: {
        workMap: SeaMap;
        finishingHistory?: ICell[];
    }) {
        this.workMap = workMap;
        this.restShips = SHIPS_VARIANTS.slice();
        this.finishingHistory = finishingHistory || [];
        this.generateVariantsForNewHunt();
    }

    private generateVariantsForNewHunt() {
        this.cellVariants = this.getCellVariants();
        this.lastChosenCellIndex = null;
    }

    public chooseNextCell(): ICell {
        console.log({ finishingHistory: this.finishingHistory });
        if (!this.finishingHistory.length) {
            return this.chooseCellFromVariants();
        }

        const possiblePoints = this.getPossiblePointsForFinishing();

        const result = possiblePoints[getRandomArrIndex(possiblePoints)];

        return result;
    }

    public processingResult({
        cell,
        result,
    }: {
        cell: ICell;
        result: IShootOnMapResult;
    }) {
        const logicByResult = {
            missed: () => {
                this.removeCellVariant(cell);
            },

            hit: () => {
                this.finishingHistory.push(cell);
            },

            kill: () => {
                // const shipCells: IShipCell[] = [
                //     ...this.finishingHistory,
                //     cell,
                // ].map((shipCell) => ({ ...shipCell, isHit: true }));

                // const killedShip = new Ship(shipCells);
                const killedShipSize = this.finishingHistory.length + 1;
                this.restShips.splice(
                    this.restShips.indexOf(killedShipSize),
                    1
                );

                this.finishingHistory = [];
                this.generateVariantsForNewHunt();
            },
        };

        logicByResult[result.shootResult]();

        // console.log(cell, result);
    }

    private chooseCellFromVariants(): ICell {
        let cellToShoot;

        if (this.lastChosenCellIndex) {
            cellToShoot = this.chooseVariantByLastChosen();
        } else {
            cellToShoot = this.chooseVariantByRandom();
        }

        return cellToShoot;
    }

    private chooseVariantByRandom(): ICell {
        const randomIndex = getRandomArrIndex(this.cellVariants);
        const isMoreHalf = this.cellVariants.length / 2 - randomIndex > 0;
        this.chooseDirection = isMoreHalf ? "descent" : "ascend";

        console.log("chooseVariantByRandom", this.cellVariants[randomIndex]);
        return this.cellVariants[randomIndex];
    }

    private chooseVariantByLastChosen(): ICell {
        const nextIndex =
            this.chooseDirection === "ascend"
                ? this.lastChosenCellIndex
                : this.lastChosenCellIndex - 1;
        if (nextIndex === -1 || nextIndex === this.cellVariants.length) {
            this.changeChooseDirection();

            return this.chooseVariantByLastChosen();
        }

        return this.cellVariants[nextIndex];
    }

    private changeChooseDirection() {
        console.warn("changeChooseDirection");
        this.chooseDirection =
            this.chooseDirection === "ascend" ? "descent" : "ascend";
    }

    private removeCellVariant(cell: ICell) {
        const cellIndex = this.cellVariants.findIndex(
            ({ x, y }) => cell.x === x && cell.y === y
        );

        if (cellIndex !== -1) {
            this.cellVariants.splice(cellIndex, 1);
            this.lastChosenCellIndex = cellIndex;
        }
    }

    // TODO: remove to another class
    getPossiblePointsForFinishing(): ICell[] {
        let possiblePoints: ICell[];

        if (this.finishingHistory.length === 1) {
            possiblePoints = getPointsForAllDirections(
                this.finishingHistory[0]
            );
        } else {
            possiblePoints = getEdgePoints(this.finishingHistory);
        }

        const result = possiblePoints.filter((point) =>
            this.workMap.isEmptyPoint(point)
        );

        return result;
    }

    // TODO: remove to another class
    private getCellVariants(): ICell[] {
        const { cellVariants: cellsOnHorizontal, pointedBattleField } =
            this.getCellVariantsByDirection({
                map: this.workMap,
                direction: "horizontal",
            });

        const { cellVariants: cellsOnVertical } =
            this.getCellVariantsByDirection({
                map: pointedBattleField,
                direction: "vertical",
            });

        return [...cellsOnHorizontal, ...cellsOnVertical].reverse();
    }

    // TODO: remove to another class
    getAvailableCells(battleField: SeaMap) {
        return battleField.table.reduce<{ x: number; y: number }[]>(
            (acc, cur, y) => {
                cur.forEach((c, x) => {
                    if (c.state === "empty") {
                        acc.push({ x, y });
                    }
                });
                return acc;
            },
            []
        );
    }

    // TODO: remove to another class
    private getCellVariantsByDirection({
        map: map,
        direction,
    }: {
        map: SeaMap;
        direction: IAxisDirection;
    }) {
        const cellVariants: ICell[] = [];
        const copyOfBattleField = new SeaMap({ table: map.table });

        let availableCells = this.getAvailableCells(copyOfBattleField);

        const shipDraft: Pick<IDefaultShipConstructor, "size" | "direction"> = {
            size: Math.max(...this.restShips),
            direction,
        };

        while (availableCells.length) {
            const curShip = new Ship({
                ...shipDraft,
                startPoint: availableCells.at(-1),
            });

            const isFoundPlaceForShip =
                copyOfBattleField.isPositionFit(curShip);

            if (isFoundPlaceForShip) {
                const { cells: shipCells } = curShip;

                // выбираем точку для стрельбы
                const cellForShoot = shipCells[getRandomArrIndex(shipCells)];
                cellVariants.push(cellForShoot);

                // помечаем на поле выбранную точку
                copyOfBattleField.table[cellForShoot.y][cellForShoot.x].state =
                    "notAllowed";

                // убираем все точки корабля из доступных
                availableCells = availableCells.filter(
                    (cell) =>
                        !shipCells.some(
                            ({ x, y }) => x === cell.x && y === cell.y
                        )
                );
            } else {
                availableCells.length = availableCells.length - 1;
            }
        }

        return { cellVariants, pointedBattleField: copyOfBattleField };
    }
}

// TODO: remove to another class
export function getPointsForAllDirections(point: ICell): ICell[] {
    const diffCells = [
        {
            x: -1,
            y: 0,
        },
        {
            x: 0,
            y: -1,
        },
        {
            x: 1,
            y: 0,
        },
        {
            x: 0,
            y: 1,
        },
    ];

    const result = diffCells.map(({ x, y }) => ({
        x: x + point.x,
        y: y + point.y,
    }));

    return result;
}

// TODO: remove to another class
export function getEdgePoints(points: ICell[]) {
    const [p1, p2] = points;

    const direction: IAxisDirection = defineDirecton(p1, p2);

    const axis = axisByDirection[direction];

    const valuesByMainAxis = points.map((p) => p[axis.main]);
    const ortogonalValue = points[0][axis.ortogonal];
    const minMain = Math.min(...valuesByMainAxis);
    const maxMain = Math.max(...valuesByMainAxis);

    const result = [
        { [axis.main]: minMain - 1, [axis.ortogonal]: ortogonalValue },
        { [axis.main]: maxMain + 1, [axis.ortogonal]: ortogonalValue },
    ];

    return result as unknown as ICell[];
}

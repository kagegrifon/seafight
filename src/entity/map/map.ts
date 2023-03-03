import { SHIPS_VARIANTS } from "common/constant";
import { Cell } from "common/type";
import { quickObjectCopy } from "common/utils";
import { Ship } from "./Ship";

const FIELD_MAP_TEMPLATE: number[][] = Array(10)
    .fill(0)
    .map(() => Array(10).fill(0));

const COORD_DELIMETER = "-";
const CELL_DELIMENTER = "||";

export function getPointsAround(point: Cell) {
    const { x: centralX, y: centralY } = point;
    const pointMatrix = Array(3)
        .fill(0)
        .map(() => Array(3).fill(0));

    pointMatrix.forEach((subArray, yIndex) => {
        subArray.forEach((_, xIndex) => {
            const x = centralX + xIndex - 1;
            const y = centralY + yIndex - 1;

            pointMatrix[yIndex][xIndex] = { y, x };
        });
    });

    return pointMatrix;
}

export type CellState = "empty" | "hit" | "notAllowed";
type ShipCode = string;

export interface SeaTableItem {
    shipCode?: ShipCode;
    state: CellState;
}

export type SeaTable = Array<Array<SeaTableItem>>;

type PrefilledDataConstructor = {
    table: SeaTable;
};

export type ShipsHash = {
    [shipCode: ShipCode]: Ship;
};

type WithRandomShipsConstructor = { withRandomShips: boolean };

export class SeaMap {
    table: SeaTable;
    shipsHash: ShipsHash;

    constructor();
    constructor(withRandomShips: WithRandomShipsConstructor);
    constructor(prefilledData: PrefilledDataConstructor);

    constructor(
        inputData?: PrefilledDataConstructor | WithRandomShipsConstructor
    ) {
        this.shipsHash = {};

        if (!inputData) {
            this.table = this.createNewTable();

            return;
        }

        if ("withRandomShips" in inputData) {
            if (inputData.withRandomShips) {
                this.createRandomShipDisposition();
            } else {
                this.table = this.createNewTable();
            }

            return;
        }

        if ("table" in inputData) {
            this.createFromInputData(inputData);

            return;
        }

        throw Error("Unexpected parameters in SeaMap constructor");
    }

    createNewTable(): SeaTable {
        return quickObjectCopy(FIELD_MAP_TEMPLATE).map((subArr) =>
            subArr.map(() => ({ state: "empty" }))
        );
    }

    createRandomShipDisposition() {
        this.table = this.createNewTable();
        this.shipsHash = {};

        SHIPS_VARIANTS.forEach((size) => {
            let ship = Ship.getRandomShipParams(size);
            let isCorrectPositon = this.isPositionFit(ship);

            while (!isCorrectPositon) {
                ship = Ship.getRandomShipParams(size);
                isCorrectPositon = this.isPositionFit(ship);
            }

            this.placeShip(ship);
        });
    }

    private createFromInputData(inputData: PrefilledDataConstructor) {
        const shipCodes = new Set<ShipCode>();

        this.table = inputData.table.map((row) =>
            row.map((cell) => {
                if (cell.shipCode) {
                    shipCodes.add(cell.shipCode);
                }

                return quickObjectCopy(cell);
            })
        );

        shipCodes.forEach((shipCode) => {
            this.shipsHash[shipCode] = this.restoreShipByName(shipCode);
        });
    }

    getShipNameByCells(cells: Cell[]) {
        return cells
            .map(({ x, y }) => `${x}${COORD_DELIMETER}${y}`)
            .join(CELL_DELIMENTER);
    }

    getCellsFromShipCode(shipCode: ShipCode): Cell[] {
        return shipCode.split(CELL_DELIMENTER).map((cell) => {
            const [x, y] = cell.split(COORD_DELIMETER).map((v) => +v);
            return { x, y };
        });
    }

    getTableCell(point: Cell): SeaTableItem | undefined {
        return this.table?.[point.y]?.[point.x];
    }

    getShip(shipCode: string): Ship | undefined {
        return this.shipsHash[shipCode];
    }

    isPositionFit(ship: Ship) {
        const { cells: shipCells } = ship;
        return shipCells.every((cell) => this.isEmptyPoint(cell));
    }

    isEmptyPoint(point: Cell) {
        const tableItem = this.getTableCell(point);

        return tableItem?.state === "empty" && !tableItem?.shipCode;
    }

    placeShip(ship: Ship) {
        if (!this.isPositionFit(ship)) {
            return false;
        }

        const shipName = this.getShipNameByCells(ship.cells);
        this.shipsHash[shipName] = ship;

        const { cells: shipCells } = ship;

        shipCells.forEach((shipCell) => {
            const tableCell = this.getTableCell(shipCell);

            if (!tableCell) {
                return;
            }

            tableCell.shipCode = shipName;

            getPointsAround(shipCell)
                .flat()
                .filter((point) => this.isEmptyPoint(point))
                .forEach((point) => {
                    const tableCell = this.getTableCell(point);

                    if (!tableCell?.shipCode) {
                        tableCell.state = "notAllowed";
                    }
                });
        });
    }

    restoreShipByName(shipCode: ShipCode): Ship {
        const cells = this.getCellsFromShipCode(shipCode);

        return new Ship(
            cells.map((cell) => ({
                ...cell,
                isHit: this.getTableCell(cell)?.state === "hit",
            }))
        );
    }
}

import { SHIPS_VARIANTS } from "common/constant";
import { ICell, IShootResult } from "common/type";
import { get2DMatrix, quickObjectCopy } from "common/utils";
import { Ship } from "./Ship";

const FIELD_MAP_TEMPLATE: number[][] = get2DMatrix({
    xSize: 10,
    ySize: 10,
    prefilled: 0,
});

const COORD_DELIMETER = "-";
const CELL_DELIMENTER = "||";

export function getPointsAround(point: ICell) {
    const { x: centralX, y: centralY } = point;
    const pointMatrix = get2DMatrix({ xSize: 3, ySize: 3, prefilled: 0 });

    pointMatrix.forEach((subArray, yIndex) => {
        subArray.forEach((_, xIndex) => {
            const x = centralX + xIndex - 1;
            const y = centralY + yIndex - 1;

            pointMatrix[yIndex][xIndex] = { y, x };
        });
    });

    return pointMatrix;
}

export type ICellState = "empty" | "hit" | "notAllowed";
export type IShipCode = string;

export interface ISeaTableItem {
    shipCode?: IShipCode;
    state: ICellState;
}

export type ISeaTable = Array<Array<ISeaTableItem>>;

type IPrefilledDataConstructor = {
    table: ISeaTable;
};

export type IShipsHash = {
    [shipCode: IShipCode]: Ship;
};

export type IShootOnMapResult = {
    shootResult: IShootResult;
    killedShip?: Ship;
};

type IWithRandomShipsConstructor = { withRandomShips: boolean };

export class SeaMap {
    table: ISeaTable;
    shipsHash: IShipsHash;

    constructor();
    constructor(withRandomShips: IWithRandomShipsConstructor);
    constructor(prefilledData: IPrefilledDataConstructor);

    constructor(
        inputData?: IPrefilledDataConstructor | IWithRandomShipsConstructor
    ) {
        this.shipsHash = {};

        if (!inputData) {
            this.table = SeaMap.createNewEmptyTable();

            return;
        }

        if ("withRandomShips" in inputData) {
            if (inputData.withRandomShips) {
                this.table = SeaMap.createNewEmptyTable();

                this.createRandomShipDisposition();
            } else {
                this.table = SeaMap.createNewEmptyTable();
            }

            return;
        }

        if ("table" in inputData) {
            this.createFromInputData(inputData);

            return;
        }

        throw Error("Unexpected parameters in SeaMap constructor");
    }

    static createNewEmptyTable(): ISeaTable {
        return quickObjectCopy(FIELD_MAP_TEMPLATE).map((subArr) =>
            subArr.map(() => ({ state: "empty" }))
        );
    }

    createRandomShipDisposition() {
        SHIPS_VARIANTS.forEach((size) => {
            let ship = Ship.getRandomShip(size);
            let isCorrectPositon = this.isPositionFit(ship);

            while (!isCorrectPositon) {
                ship = Ship.getRandomShip(size);
                isCorrectPositon = this.isPositionFit(ship);
            }

            this.placeShip({ ship });
        });
    }

    private createFromInputData(inputData: IPrefilledDataConstructor) {
        const shipCodes = new Set<IShipCode>();

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

    // TODO вынести в отдельный класс
    static getShipNameByCells(cells: ICell[]) {
        return cells
            .map(({ x, y }) => `${x}${COORD_DELIMETER}${y}`)
            .join(CELL_DELIMENTER);
    }

    getCellsFromShipCode(shipCode: IShipCode): ICell[] {
        return shipCode.split(CELL_DELIMENTER).map((cell) => {
            const [x, y] = cell.split(COORD_DELIMETER).map((v) => +v);
            return { x, y };
        });
    }

    getTableCell(point: ICell): ISeaTableItem | undefined {
        return this.table?.[point.y]?.[point.x];
    }

    getShip(shipCode: string): Ship | undefined {
        return this.shipsHash[shipCode];
    }

    isPositionFit(ship: Ship) {
        const { cells: shipCells } = ship;
        return shipCells.every((cell) => this.isEmptyPoint(cell));
    }

    isEmptyPoint(point: ICell) {
        const tableItem = this.getTableCell(point);

        return tableItem?.state === "empty" && !tableItem?.shipCode;
    }

    public placeShip({
        ship,
        isJustKilledShip,
    }: {
        ship: Ship;
        isJustKilledShip?: boolean;
    }) {
        if (!isJustKilledShip && !this.isPositionFit(ship)) {
            throw Error("ship is not in map area");
        }

        const shipName = SeaMap.getShipNameByCells(ship.cells);
        this.shipsHash[shipName] = ship;

        const { cells: shipCells } = ship;

        shipCells.forEach((shipCell) => {
            const shipTableCell = this.getTableCell(shipCell);

            if (!shipTableCell) {
                throw Error("Ship cell is outside of tableCell");
            }

            shipTableCell.shipCode = shipName;
            shipTableCell.state = shipCell.isHit ? "hit" : "empty";

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

    setCellState(changingCell: ICell, state: ICellState) {
        const foundCell = this.getTableCell(changingCell);

        if (foundCell) {
            foundCell.state = state;
        }
    }

    restoreShipByName(shipCode: IShipCode): Ship {
        const cells = this.getCellsFromShipCode(shipCode);

        return new Ship(
            cells.map((cell) => ({
                ...cell,
                isHit: this.getTableCell(cell)?.state === "hit",
            }))
        );
    }

    shootCell(cell: ICell): IShootOnMapResult {
        let result: IShootResult = "missed";
        let killedShip: Ship;
        const tableItem = this.getTableCell(cell);

        if (!tableItem) {
            throw Error("Try to shoot to not existing cell");
        }

        if (tableItem.shipCode) {
            tableItem.state = "hit";

            const ship = this.getShip(tableItem.shipCode);
            // todo rework
            ship.damageShip(cell);

            result = ship.isAlive() ? "hit" : "kill";
            killedShip = ship;
        }

        return { shootResult: result, killedShip };
    }

    hasLiveShip() {
        return Object.values(this.shipsHash).some((ship) => ship.isAlive());
    }
}

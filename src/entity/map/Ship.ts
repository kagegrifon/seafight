import { AxisDirection, Cell, ShipCell } from "common/type";
import { axisByDirection, defineDirecton, getRandomValue } from "common/utils";

export interface IDefaultShipConstructor {
    startPoint: Cell;
    direction: AxisDirection;
    size: number;
}

export type IShipConstructorFromCells = ShipCell[];

export class Ship {
    startPoint: Cell;
    direction: AxisDirection;
    size: number;
    cells: ShipCell[];

    constructor(opt: IDefaultShipConstructor);
    constructor(cells: IShipConstructorFromCells);

    constructor(params: IDefaultShipConstructor | IShipConstructorFromCells) {
        if (Array.isArray(params)) {
            this.createShipFromCells(params);
        } else {
            this.startPoint = params.startPoint;
            this.direction = params.direction;
            this.size = params.size;
            this.cells = this.getShipCells();
        }
    }

    createShipFromCells(cells: ShipCell[]) {
        this.cells = cells;
        this.size = cells.length;

        if (cells.length === 1) {
            this.direction = "horizontal";
            this.startPoint = cells[0];
        }

        this.direction =
            cells.length > 1
                ? defineDirecton(cells[0], cells[1])
                : "horizontal";
        const { main, ortogonal } = axisByDirection[this.direction];
        const mainMinValue = Math.min(...cells.map((cell) => cell[main]));

        this.startPoint = {
            [ortogonal]: cells[0][ortogonal],
            [main]: mainMinValue,
        } as unknown as Cell;
        console.log({ startPoint: this.startPoint });
    }

    getShipCells() {
        let {
            startPoint: { x, y },
            size,
        } = this;
        const shipCells = [];

        while (size > 0) {
            shipCells.push({ y, x });

            if (this.direction === "horizontal") {
                x++;
            } else {
                y++;
            }

            size--;
        }
        return shipCells;
    }

    isAlive() {
        return this.cells.some((c) => !c.isHit);
    }

    static getRandomShipParams(size: number): Ship {
        return new Ship({
            startPoint: {
                x: getRandomValue(0, 9 - size),
                y: getRandomValue(0, 9 - size),
            },
            direction: !getRandomValue(0, 1) ? "horizontal" : "vertical",
            size,
        });
    }
}

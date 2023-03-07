import { ICellState, SeaMap, ISeaTable, IShipCode } from "./map";
import { IDefaultShipConstructor, Ship } from "./Ship";

type Pointer = -1 | 0 | "x";

type MapForCellState = {
    [prop in Pointer]: ICellState;
};

export type ShipHash = {
    [prop: string]: IShipCode;
};

type IPointedtableItem = Pointer | number | string;

export type IPointedtable = IPointedtableItem[][];

export const mapForValues: MapForCellState = {
    "-1": "notAllowed",
    "0": "empty",
    x: "hit",
};

describe("isPositionFit", () => {
    const pointedtable: IPointedtable = [
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
    ];

    const testShips: ShipHash = {
        "2": SeaMap.getShipNameByCells(
            new Ship({
                startPoint: { y: 3, x: 1 },
                direction: "horizontal",
                size: 2,
            }).getShipCells()
        ),
        "3": SeaMap.getShipNameByCells(
            new Ship({
                startPoint: { y: 5, x: 0 },
                direction: "horizontal",
                size: 3,
            }).getShipCells()
        ),
    };

    const testSeaTable: ISeaTable = prepareTable(pointedtable, testShips);

    const seaMap = new SeaMap({ table: testSeaTable });

    const shipsWithFitPos: IDefaultShipConstructor[] = [
        {
            direction: "horizontal",
            size: 4,
            startPoint: {
                x: 1,
                y: 8,
            },
        },
        {
            direction: "horizontal",
            size: 4,
            startPoint: {
                x: 5,
                y: 3,
            },
        },
        {
            direction: "vertical",
            size: 4,
            startPoint: {
                x: 5,
                y: 1,
            },
        },
        {
            direction: "vertical",
            size: 4,
            startPoint: {
                x: 8,
                y: 1,
            },
        },
    ];

    const shipsWithNotFitPos: IDefaultShipConstructor[] = [
        {
            direction: "horizontal",
            size: 4,
            startPoint: {
                x: 3,
                y: 4,
            },
        },
        {
            direction: "horizontal",
            size: 4,
            startPoint: {
                x: 2,
                y: 6,
            },
        },
        {
            direction: "vertical",
            size: 4,
            startPoint: {
                x: 1,
                y: 1,
            },
        },
        {
            direction: "vertical",
            size: 4,
            startPoint: {
                x: 1,
                y: 4,
            },
        },
    ];

    test("should be true on correct positions", () => {
        shipsWithFitPos.forEach((shipWithFitPos) => {
            expect(seaMap.isPositionFit(new Ship(shipWithFitPos))).toBe(true);
        });
    });

    test("should be false on uncorrect positions", () => {
        shipsWithNotFitPos.forEach((shipWithNotFitPos) => {
            expect(seaMap.isPositionFit(new Ship(shipWithNotFitPos))).toBe(
                false
            );
        });
    });
});

describe("placeShip", () => {
    test("should be false on uncorrect positions", () => {
        const variants: {
            pointedtable: IPointedtable;
            ship: Ship;
            shipHash: { [props: string]: string };
        }[] = [
            {
                pointedtable: [
                    [-1, -1, -1, 0, 0, 0, 0, 0, 0, 0],
                    [-1, "1x", -1, 0, 0, 0, 0, 0, 0, 0],
                    [-1, -1, -1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ],
                ship: new Ship([{ x: 1, y: 1, isHit: true }]),
                shipHash: {
                    1: SeaMap.getShipNameByCells(
                        new Ship([{ x: 1, y: 1, isHit: true }]).getShipCells()
                    ),
                },
            },
            {
                pointedtable: [
                    [-1, -1, -1, 0, 0, 0, 0, 0, 0, 0],
                    [-1, "1", -1, 0, 0, 0, 0, 0, 0, 0],
                    [-1, -1, -1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ],
                ship: new Ship([{ x: 1, y: 1, isHit: false }]),
                shipHash: {
                    1: SeaMap.getShipNameByCells(
                        new Ship([{ x: 1, y: 1, isHit: false }]).getShipCells()
                    ),
                },
            },
            {
                pointedtable: [
                    [-1, "2", "2", -1, 0, 0, 0, 0, 0, 0],
                    [-1, -1, -1, -1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ],
                ship: new Ship([
                    { x: 1, y: 0, isHit: false },
                    { x: 2, y: 0, isHit: false },
                ]),
                shipHash: {
                    2: SeaMap.getShipNameByCells(
                        new Ship([
                            { x: 1, y: 0, isHit: false },
                            { x: 2, y: 0, isHit: false },
                        ]).getShipCells()
                    ),
                },
            },
            {
                pointedtable: [
                    [-1, "2x", "2x", -1, 0, 0, 0, 0, 0, 0],
                    [-1, -1, -1, -1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ],
                ship: new Ship([
                    { x: 1, y: 0, isHit: true },
                    { x: 2, y: 0, isHit: true },
                ]),
                shipHash: {
                    2: SeaMap.getShipNameByCells(
                        new Ship([
                            { x: 1, y: 0, isHit: true },
                            { x: 2, y: 0, isHit: true },
                        ]).getShipCells()
                    ),
                },
            },
        ];

        variants.forEach((variant) => {
            const seaMap = new SeaMap();
            const table = prepareTable(variant.pointedtable, variant.shipHash);

            seaMap.placeShip({ ship: variant.ship });

            table.forEach((row, yIndex) => {
                row.forEach((expectTableItem, xIndex) => {
                    const tableCell = seaMap.getTableCell({
                        x: xIndex,
                        y: yIndex,
                    });

                    expect(tableCell).toEqual(expectTableItem);
                });
            });
        });
    });
});

export function prepareTable(
    table: IPointedtable,
    shipHash: ShipHash = {}
): ISeaTable {
    const seaTable: ISeaTable = table.map((row) =>
        row.map((cellValue) => {
            if (
                typeof cellValue === "string" &&
                cellValue.length > 1 &&
                cellValue.includes("x")
            ) {
                return {
                    state: mapForValues.x,
                    shipCode: shipHash[cellValue.replace("x", "")],
                };
            }

            return {
                state: cellValue > 0 ? "empty" : mapForValues[cellValue],
                shipCode: shipHash[cellValue],
            };
        })
    );

    return seaTable;
}

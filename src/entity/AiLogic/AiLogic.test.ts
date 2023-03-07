import { SeaMap } from "entity/map";
import { IPointedtable, prepareTable } from "entity/map/map.test";
import { AiLogic, getEdgePoints, getPointsForAllDirections } from "./Ailogic";

describe("chooseNextCell", () => {
    test("if no finishingHistory shood use cell from cellVariants", () => {
        const ai = new AiLogic({
            workMap: new SeaMap(),
            finishingHistory: [],
        });

        const cellVariants = ai.cellVariants.slice();

        const result = ai.chooseNextCell();

        expect(cellVariants).toContain(result);
    });

    test("if has finishingHistory calls getPossiblePointsForFinishing", () => {
        const ai = new AiLogic({
            workMap: new SeaMap(),
            finishingHistory: [{ x: 1, y: 1 }],
        });

        const getPossiblePointsForFinishing = jest.spyOn(
            ai,
            "getPossiblePointsForFinishing"
        );

        ai.chooseNextCell();

        expect(getPossiblePointsForFinishing).toHaveBeenCalled();
    });

    test("if has finishingHistory return result of getPossiblePointsForFinishing", () => {
        const ai = new AiLogic({
            workMap: new SeaMap(),
            finishingHistory: [{ x: 1, y: 1 }],
        });

        const possiblePoint = { x: 2, y: 1 };

        jest.spyOn(ai, "getPossiblePointsForFinishing").mockImplementation(
            () => [possiblePoint]
        );

        const result = ai.chooseNextCell();

        expect(result).toEqual(possiblePoint);
    });

    test("choose correct point for finishingHistory.length > 1", () => {
        const pointedtable: IPointedtable = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [-1, "x", "x", 0, 0, "x", "x", -1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, -1, 0, 0, 0, 0, 0, 0, 0],
            ["x", 0, "x", 0, 0, 0, 0, 0, 0, 0],
            ["x", 0, "x", 0, 0, 0, 0, 0, 0, 0],
            [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];

        const variants = [
            {
                finishingHistory: [
                    { x: 1, y: 1 },
                    { x: 2, y: 1 },
                ],
                expectedCell: { x: 3, y: 1 },
            },
            {
                finishingHistory: [
                    { x: 5, y: 1 },
                    { x: 6, y: 1 },
                ],
                expectedCell: { x: 4, y: 1 },
            },
            {
                finishingHistory: [
                    { x: 0, y: 4 },
                    { x: 0, y: 5 },
                ],
                expectedCell: { x: 0, y: 3 },
            },
            {
                finishingHistory: [
                    { x: 2, y: 4 },
                    { x: 2, y: 5 },
                ],
                expectedCell: { x: 2, y: 6 },
            },
        ];

        variants.forEach((variant) => {
            const { finishingHistory, expectedCell } = variant;

            const ai = createLogicByPointedTable({
                pointedtable,
                finishingHistory,
            });

            const result = ai.chooseNextCell();

            expect(result).toEqual(expectedCell);
        });
    });
});

describe("processingResult", () => {
    test("when missed remove missed cell from variants", () => {
        const ai = new AiLogic({
            workMap: new SeaMap(),
        });

        const cellToShoot = ai.chooseNextCell();

        const expectedVariants = ai.cellVariants.slice();
        const cellTOShootIndex = expectedVariants.findIndex(
            ({ x, y }) => x === cellToShoot.x && y === cellToShoot.y
        );
        expectedVariants.splice(cellTOShootIndex, 1);

        ai.processingResult({
            cell: cellToShoot,
            result: { shootResult: "missed" },
        });

        expect(ai.cellVariants).toEqual(
            expect.arrayContaining(expectedVariants)
        );
    });

    test("when hit add cell to finishingHistory", () => {
        const ai = new AiLogic({
            workMap: new SeaMap(),
        });

        const cellsToShoot = [
            { x: 1, y: 2 },
            { x: 1, y: 3 },
        ];

        expect(ai.finishingHistory).toHaveLength(0);

        ai.processingResult({
            cell: cellsToShoot[0],
            result: { shootResult: "hit" },
        });

        expect(ai.finishingHistory).toHaveLength(1);

        expect(ai.finishingHistory).toEqual(
            expect.arrayContaining([{ x: 1, y: 2 }])
        );

        ai.processingResult({
            cell: cellsToShoot[1],
            result: { shootResult: "hit" },
        });

        expect(ai.finishingHistory).toHaveLength(2);
        expect(ai.finishingHistory).toEqual(
            expect.arrayContaining(cellsToShoot)
        );
    });

    test("when kill clean finishingHistory", () => {
        const ai = new AiLogic({
            workMap: new SeaMap(),
            finishingHistory: [
                { x: 1, y: 1 },
                { x: 2, y: 2 },
            ],
        });

        expect(ai.finishingHistory).toHaveLength(2);

        const cellToShoot = { x: 1, y: 2 };

        ai.processingResult({
            cell: cellToShoot,
            result: { shootResult: "kill" },
        });

        expect(ai.finishingHistory).toHaveLength(0);
    });

    test("when kill correct update restShips", () => {
        const ai = new AiLogic({
            workMap: new SeaMap(),
        });

        const cellToShoot = { x: 1, y: 2 };

        const finishingHistoryVariants = [
            [],
            [{ x: 1, y: 1 }],
            [
                { x: 1, y: 1 },
                { x: 2, y: 2 },
            ],
            [
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 2, y: 2 },
            ],
        ];

        finishingHistoryVariants.forEach((finishingHistoryVariant) => {
            ai.finishingHistory = finishingHistoryVariant;

            const expectedRestShips = ai.restShips.slice();
            expectedRestShips.splice(
                expectedRestShips.indexOf(ai.finishingHistory.length + 1),
                1
            );

            ai.processingResult({
                cell: cellToShoot,
                result: { shootResult: "kill" },
            });

            expect(ai.restShips).toEqual(
                expect.arrayContaining(expectedRestShips)
            );
        });
    });

    test("when kill correct make new cellVariants", () => {
        const ai = new AiLogic({
            workMap: new SeaMap(),
        });

        const cellToShoot = { x: 1, y: 2 };

        const prevCellVariants = ai.cellVariants.slice();

        ai.processingResult({
            cell: cellToShoot,
            result: { shootResult: "kill" },
        });

        const newCellVariants = ai.cellVariants;

        expect(prevCellVariants).not.toEqual(
            expect.arrayContaining(newCellVariants)
        );
    });
});

function createLogicByPointedTable({ pointedtable, finishingHistory }) {
    const table = prepareTable(pointedtable);

    const ai = new AiLogic({
        workMap: new SeaMap({ table }),
        finishingHistory,
    });

    return ai;
}

describe("getPossiblePointsForFinishing", () => {
    test("return correct point for finishingHistory", () => {
        const pointedtable: IPointedtable = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, "x", 0, 0, 0, 0, "x", -1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, -1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, "x", -1, 0, 0, 0, 0, 0, 0],
            ["x", -1, 0, 0, 0, 0, 0, 0, 0, 0],
            [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, "x"],
        ];

        const variants = [
            {
                finishingHistory: [{ x: 1, y: 1 }],
                expectedCells: [
                    { x: 0, y: 1 },
                    { x: 1, y: 0 },
                    { x: 2, y: 1 },
                    { x: 1, y: 2 },
                ],
            },
            {
                finishingHistory: [{ x: 6, y: 1 }],
                expectedCells: [
                    { x: 6, y: 0 },
                    { x: 5, y: 1 },
                    { x: 6, y: 2 },
                ],
            },
            {
                finishingHistory: [{ x: 0, y: 5 }],
                expectedCells: [{ x: 0, y: 4 }],
            },
            {
                finishingHistory: [{ x: 2, y: 4 }],
                expectedCells: [
                    { x: 1, y: 4 },
                    { x: 2, y: 5 },
                ],
            },
            {
                finishingHistory: [{ x: 9, y: 9 }],
                expectedCells: [
                    { x: 8, y: 9 },
                    { x: 9, y: 8 },
                ],
            },
        ];

        variants.forEach((variant) => {
            const { finishingHistory, expectedCells } = variant;

            const ai = createLogicByPointedTable({
                pointedtable,
                finishingHistory,
            });

            const result = ai.getPossiblePointsForFinishing();
            expect(result).toEqual(expect.arrayContaining(expectedCells));
        });
    });
});

describe("getEdgePoints", () => {
    test("return correct edge points", () => {
        const variants = [
            {
                points: [
                    { x: 1, y: 1 },
                    { x: 2, y: 1 },
                ],
                expectedEdgePoints: [
                    { x: 0, y: 1 },
                    { x: 3, y: 1 },
                ],
            },
            {
                points: [
                    { x: 5, y: 1 },
                    { x: 6, y: 1 },
                ],
                expectedEdgePoints: [
                    { x: 4, y: 1 },
                    { x: 7, y: 1 },
                ],
            },
            {
                points: [
                    { x: 0, y: 4 },
                    { x: 0, y: 5 },
                ],
                expectedEdgePoints: [
                    { x: 0, y: 3 },
                    { x: 0, y: 6 },
                ],
            },
            {
                points: [
                    { x: 2, y: 4 },
                    { x: 2, y: 5 },
                ],
                expectedEdgePoints: [
                    { x: 2, y: 3 },
                    { x: 2, y: 6 },
                ],
            },
        ];

        variants.forEach((variant) => {
            const { expectedEdgePoints, points } = variant;

            const result = getEdgePoints(points);
            expect(result).toEqual(expect.arrayContaining(expectedEdgePoints));
        });
    });
});

describe("getPointForAllDirections", () => {
    test("return correct edge points", () => {
        const variants = [
            {
                input: { x: 1, y: 1 },

                expectedResult: [
                    { x: 0, y: 1 },
                    { x: 1, y: 0 },
                    { x: 2, y: 1 },
                    { x: 1, y: 2 },
                ],
            },
            {
                input: { x: 6, y: 1 },
                expectedResult: [
                    { x: 5, y: 1 },
                    { x: 6, y: 0 },
                    { x: 7, y: 1 },
                    { x: 6, y: 2 },
                ],
            },
            {
                input: { x: 0, y: 0 },

                expectedResult: [
                    { x: -1, y: 0 },
                    { x: 0, y: -1 },
                    { x: 0, y: 1 },
                    { x: 1, y: 0 },
                ],
            },
            {
                input: { x: 9, y: 9 },

                expectedResult: [
                    { x: 9, y: 10 },
                    { x: 10, y: 9 },
                    { x: 9, y: 8 },
                    { x: 8, y: 9 },
                ],
            },
        ];

        variants.forEach((variant) => {
            const { expectedResult, input } = variant;

            const result = getPointsForAllDirections(input);
            expect(result).toEqual(expect.arrayContaining(expectedResult));
        });
    });
});

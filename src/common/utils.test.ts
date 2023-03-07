import { get2DMatrix } from "./utils";

describe("get2DMatrix", () => {
    test("return correct result", () => {
        const variants = [
            {
                input: {
                    xSize: 10,
                    ySize: 10,
                    prefilled: 0,
                },
                expected: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ],
            },
            {
                input: {
                    xSize: 3,
                    ySize: 3,
                    prefilled: null,
                },
                expected: [
                    [null, null, null],
                    [null, null, null],
                    [null, null, null],
                ],
            },
        ];

        variants.forEach((variant) => {
            const { input, expected } = variant;

            const result = get2DMatrix(input);

            expect(result.length).toEqual(expected.length);

            result.forEach((subArr, yIndex) => {
                expect(subArr.length).toEqual(expected[yIndex].length);
                expect(subArr).toEqual(
                    expect.arrayContaining(expected[yIndex])
                );
            });
        });
    });
});

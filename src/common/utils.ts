import { IAxisDirection, ICell } from "./type";

export function getRandomValue(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomArrIndex(array: Array<unknown>): number {
    return getRandomValue(0, array.length - 1);
}

export function quickObjectCopy<T>(object: T): T {
    return JSON.parse(JSON.stringify(object)) as T;
}

export function defineDirecton(p1: ICell, p2: ICell): IAxisDirection {
    return p1.x - p2.x === 0 ? "vertical" : "horizontal";
}

type IGet2DMatrix<T> = {
    xSize: number;
    ySize: number;
    prefilled: T;
};

export function get2DMatrix<T>({ xSize, ySize, prefilled }: IGet2DMatrix<T>) {
    return Array(ySize)
        .fill(0)
        .map(() => Array(xSize).fill(prefilled));
}

type AxisByDirection = {
    [direction in IAxisDirection]: {
        main: "x" | "y";
        ortogonal: "x" | "y";
    };
};

export const axisByDirection: AxisByDirection = {
    horizontal: {
        main: "x",
        ortogonal: "y",
    },
    vertical: {
        main: "y",
        ortogonal: "x",
    },
};

import { AxisDirection, Cell } from "./type";

export function getRandomValue(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function quickObjectCopy<T>(object: T): T {
    return JSON.parse(JSON.stringify(object)) as T
}

export function defineDirecton(p1: Cell, p2: Cell): AxisDirection {
    return p1.x - p2.x === 0 ? 'horizontal' : 'vertical'
}

type AxisByDirection = {
    [direction in AxisDirection]: {
        main: 'x' | 'y';
        ortogonal: 'x' | 'y';
    };
};

export const axisByDirection: AxisByDirection = {
    'horizontal': {
        main: 'x',
        ortogonal: 'y'
    },
    'vertical': {
        main: 'y',
        ortogonal: 'x'
    }
}

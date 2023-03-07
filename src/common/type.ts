import { IShootOnMapResult } from "entity/map";

export type ISCREENS_NAMES = "start" | "place" | "fight";

export type IAxisDirection = "vertical" | "horizontal";

export type IShootResult = "missed" | "hit" | "kill";

export type IPlayerType = "enemy" | "player";

export interface ICell {
    x: number;
    y: number;
}

export interface IShipCell extends ICell {
    isHit: boolean;
}

export interface IEnemy {
    chooseNextCell(): ICell;
    processingResult({
        cell,
        result,
    }: {
        cell: ICell;
        result: IShootOnMapResult;
    }): void;
}

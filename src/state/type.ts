import { SeaMap } from "entity/map";
import { IPlayerType } from "common/type";

export type IState = {
    rootNode: HTMLElement;
    map: {
        [player in IPlayerType]: {
            own?: SeaMap; // карта расположения своих кораблей
            work?: SeaMap; // карта расположения кораблей противника
        };
    };
};

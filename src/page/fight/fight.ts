import { SeaMap } from "entity/map";
import { PageScript } from "page/type";
import { drawField, placeShipByDisposition } from "view/SeaMapView";
import { FightWithAIController } from "./FightController";

export const initFightScreen: PageScript = ({ state }) => {
    const node = {
        userMap: document.getElementById("userDispositionField"),
        enemyMap: document.getElementById("enemyDispositionField"),
    };

    drawField(node.userMap);
    drawField(node.enemyMap);

    placeShipByDisposition({ fieldNode: node.userMap, seaMap: state.userMap });

    state.enemyMap = new SeaMap({ withRandomShips: true });

    placeShipByDisposition({
        fieldNode: node.enemyMap,
        seaMap: state.enemyMap,
    });

    new FightWithAIController({
        enemyFieldNode: node.enemyMap,
        enemyMap: state.enemyMap,
        playerFieldNode: node.userMap,
        playerMap: state.userMap,
    });
};

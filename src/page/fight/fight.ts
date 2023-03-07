import { getCloneOfTemplate, pageMountingDecorator } from "common/pageUtils";
import { SeaMap } from "entity/map";
import { IPageScript } from "page/type";
import { drawField, drawSeaMap } from "view/SeaMapView";
import { FightWithAIController } from "./FightController";

function prepareBattleFieldNode(pageTemplate: DocumentFragment) {
    const node = {
        userMap: pageTemplate.querySelector(".user-field"),
        enemyMap: pageTemplate.querySelector(".enemy-field"),
    };

    drawField(node.userMap);
    drawField(node.enemyMap);

    return node;
}

export const fightScreen: IPageScript = ({ state, onGoNext }) => {
    const pageTemplate = getCloneOfTemplate("screen-fight-template");

    const node = prepareBattleFieldNode(pageTemplate);

    state.map.player.work = new SeaMap();
    state.map.enemy = {
        own: new SeaMap({ withRandomShips: true }),
        work: new SeaMap(),
    };

    drawSeaMap({ fieldNode: node.userMap, map: state.map.player.own });
    drawSeaMap({ fieldNode: node.enemyMap, map: state.map.player.work });

    const onGameOver = (winPlayer) => {
        const isWantToRestart = confirm(
            `${winPlayer} is win. Game over. Do you like to start new game?`
        );

        if (isWantToRestart) {
            onGoNext();
        }
    };

    new FightWithAIController({
        onGameOver: onGameOver,
        enemyFieldNode: node.enemyMap,
        playerFieldNode: node.userMap,
        map: {
            enemy: {
                own: state.map.enemy.own!,
                work: state.map.enemy.work!,
            },
            player: {
                own: state.map.player.own!,
                work: state.map.player.work!,
            },
        },
    });

    return pageTemplate;
};

export const initFightScreen = pageMountingDecorator(fightScreen);

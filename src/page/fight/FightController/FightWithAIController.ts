import { ICell, IEnemy, IPlayerType, IShootResult } from "common/type";
import { AiLogic } from "entity/AiLogic";
import { SeaMap, IShootOnMapResult } from "entity/map";
import { drawSeaMapDuringFight, getCoordFromCell } from "view/SeaMapView";

type IOnGameOver = (IPlayerType) => void;

type FightControllerConstuctor = {
    enemyFieldNode: HTMLElement | Element;
    playerFieldNode: HTMLElement | Element;
    map: {
        [player in IPlayerType]: {
            own: SeaMap; // карта расположения своих кораблей
            work: SeaMap; // карта расположения кораблей противника
        };
    };
    onGameOver: IOnGameOver;
};

export class FightWithAIController {
    isPlayerTurn: boolean;
    onGameOver: IOnGameOver;
    node: {
        enemyField: HTMLElement | Element;
        playerField: HTMLElement | Element;
    };
    map: {
        [player in IPlayerType]: {
            own: SeaMap; // карта расположения своих кораблей
            work: SeaMap; // карта расположения кораблей противника
            toShoot: SeaMap;
        };
    };
    enemy: IEnemy;

    constructor({
        enemyFieldNode,
        playerFieldNode,
        map,
        onGameOver,
    }: FightControllerConstuctor) {
        this.isPlayerTurn = true;
        this.onGameOver = onGameOver;
        this.node = {
            enemyField: enemyFieldNode,
            playerField: playerFieldNode,
        };

        this.map = {
            enemy: {
                own: map.enemy.own,
                work: map.enemy.work,
                toShoot: map.player.own,
            },
            player: {
                own: map.player.own,
                work: map.player.work,
                toShoot: map.enemy.own,
            },
        };

        this.enemy = new AiLogic({ workMap: this.map.enemy.work });
        this.onPlayerFire = this.onPlayerFire.bind(this);

        this.startGame();
    }

    playerTurn() {
        this.node.enemyField.addEventListener("click", this.onPlayerFire);
    }

    getCurPlayerContext(playerType: IPlayerType) {
        return {
            workMap: this.isPlayerTurn
                ? this.map.player.work
                : this.map.enemy.work,
            mapToShoot: !this.isPlayerTurn
                ? this.map.player.own
                : this.map.enemy.own,
            enemyField: this.node[`${playerType}FieldNode`],
        };
    }

    processingShoot({
        cellToShoot,
        map,
        fieldNodeToDrawResult,
    }: {
        cellToShoot: ICell;
        map: SeaMap;
        fieldNodeToDrawResult: HTMLElement | Element;
    }) {
        const result = map.shootCell(cellToShoot);
        console.log(this.isPlayerTurn ? "player" : "enemy", result);

        const workMap = this.isPlayerTurn
            ? this.map.player.work
            : this.map.enemy.work;

        this.updateWorkMapAfterShoot({
            workMap,
            result,
            cellToShoot,
        });

        this.updateViewMap({ fieldNode: fieldNodeToDrawResult, workMap });

        // this.mergeUpdateView(map, this.node.enemyField)

        return result;
    }

    updateWorkMapAfterShoot({
        workMap,
        result,
        cellToShoot,
    }: {
        workMap: SeaMap;
        result: IShootOnMapResult;
        cellToShoot: ICell;
    }) {
        const logicByResult = {
            missed: () => {
                workMap.setCellState(cellToShoot, "notAllowed");
            },

            hit: () => {
                workMap.setCellState(cellToShoot, "hit");
            },

            kill: () => {
                // workMap.setCellState(cellToShoot, "hit");
                workMap.placeShip({
                    ship: result.killedShip,
                    isJustKilledShip: true,
                });
            },
        };

        logicByResult[result.shootResult]();
    }

    onPlayerFire(e: Event) {
        const battleCell = e.target as Element;
        if (!battleCell.classList.contains("ship-field-cell")) {
            return;
        }

        this.node.enemyField.removeEventListener("click", this.onPlayerFire);

        const cellToShoot = getCoordFromCell(battleCell as HTMLDivElement);

        const result = this.processingShoot({
            cellToShoot,
            map: this.map.enemy.own,
            fieldNodeToDrawResult: this.node.enemyField,
        });

        // TODO rework common part
        if (this.isGameOver()) {
            this.onGameOver(this.isPlayerTurn ? "player" : "enemy");
        } else {
            this.nextTurn(result.shootResult);
        }
    }

    updateViewMap({
        workMap,
        fieldNode,
    }: {
        workMap: SeaMap;
        fieldNode: HTMLElement | Element;
    }) {
        drawSeaMapDuringFight({ workMap, fieldNode });
    }

    enemyTurn() {
        const cellToShoot = this.enemy.chooseNextCell();

        const result = this.processingShoot({
            cellToShoot,
            map: this.map.player.own,
            fieldNodeToDrawResult: this.node.playerField,
        });

        // TODO rework common part
        if (this.isGameOver()) {
            this.onGameOver(this.isPlayerTurn ? "player" : "enemy");
        } else {
            this.enemy.processingResult({ cell: cellToShoot, result });

            this.nextTurn(result.shootResult);
        }
    }

    isGameOver(): boolean {
        const curMapToShoot = this.isPlayerTurn
            ? this.map.player.toShoot
            : this.map.enemy.toShoot;

        return !curMapToShoot.hasLiveShip();
    }

    nextTurn(result: IShootResult) {
        if (result === "missed") {
            this.changeCurPlayer();
        }

        this.curPlayerTurn();
    }

    curPlayerTurn() {
        // console.log("curPlayerTurn turn", this.isPlayerTurn);
        if (this.isPlayerTurn) {
            this.playerTurn();
        } else {
            this.enemyTurn();
        }
    }

    startGame() {
        this.curPlayerTurn();
    }

    changeCurPlayer() {
        this.isPlayerTurn = !this.isPlayerTurn;
    }
}

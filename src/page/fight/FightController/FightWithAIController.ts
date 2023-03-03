import { Cell, Enemy, ShootResult } from "common/type";
import { AiLogic } from "entity/AiLogic";
import { SeaMap } from "entity/map";

export class FightWithAIController {
    isPlayerTurn: boolean
    node: {
        enemyField: Element
        playerField: Element
    }
    map: {
        enemy: SeaMap
        player: SeaMap
    }
    enemy: Enemy

    constructor(
        { enemyFieldNode,
            playerFieldNode,
            enemyMap,
            playerMap
        }: {
            enemyFieldNode: Element,
            playerFieldNode: Element,
            enemyMap: SeaMap,
            playerMap: SeaMap
        }) {
        this.isPlayerTurn = true
        this.node = {
            enemyField: enemyFieldNode,
            playerField: playerFieldNode,
        }

        this.map = {
            enemy: enemyMap,
            player: playerMap,
        }
    
        this.enemy = new AiLogic()
        this.startGame()
    }

    playerTurn() {
        this.node.enemyField.addEventListener('click', (e) => this.onPlayerFire(e))
    }

    processingShoot({cellToShoot, map}: {cellToShoot: Cell, map: SeaMap}) {
        const result = this.shootOnMap(cellToShoot, map)

        this.updateMap({ cell: cellToShoot, map, result})

        // this.mergeUpdateView(map, this.node.enemyField)

        return result
    }


    onPlayerFire(e: Event) {
        const battleCell = e.target as Element
        if (!(battleCell).classList.contains('ship-field-cell')) {
            return
        }

        this.node.enemyField.removeEventListener('click', (e) => this.onPlayerFire(e))

        const cellToShoot = this.getCoordFromCell(battleCell as HTMLDivElement)

        const result = this.processingShoot({ cellToShoot, map: this.map.enemy })

        this.nextTurn(result)
    }

    updateMap({ cell, map, result}: { cell: Cell, map: SeaMap, result: ShootResult}) {
        console.log('TODO updateMap', cell, map, result)
    }

    getCoordFromCell(cellNode: HTMLDivElement): Cell {
        const coord = cellNode.dataset.shipFieldCoord

        const [y, x] = coord.split('-').map(n => +n - 1)

        return {x, y}
    }

    enemyTurn() {
        const cellToShoot = this.enemy.chooseNextCell()

        const result = this.processingShoot({ cellToShoot, map: this.map.player })

        this.enemy.processingResult({ cell: cellToShoot, result })

        this.nextTurn(result)
    }

    nextTurn(result: ShootResult) {
        if (result === "missed") {
            this.changeCurPlayer()
        }

        this.curPlayerTurn()
    }

    curPlayerTurn() {
        console.log('curPlayerTurn turn',this.isPlayerTurn)
        if (this.isPlayerTurn) {
            this.playerTurn()
        } else {
            this.enemyTurn()
        }
    }

    startGame() {
        this.curPlayerTurn()
    }

    changeCurPlayer() {
        this.isPlayerTurn = !this.isPlayerTurn
    }

    shootOnMap(cell: Cell, map: SeaMap): ShootResult {
        console.log('TODO shootOnMap', cell, map)

        return 'missed'
    }

    mergeUpdateView(map: SeaMap, node: Element): void {
        console.log('TODO mergeUpdateView', map, node)
    }
}
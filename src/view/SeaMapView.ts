import { FIRST_ALPHABETH_CHAR } from "common/constant";
import { ICell } from "common/type";
import { SeaMap } from "entity/map";

export function drawField(rootNode: HTMLElement | Element) {
    rootNode.innerHTML = "";
    const startCharCode = FIRST_ALPHABETH_CHAR.charCodeAt(0);

    for (let y = 0; y < 11; y++) {
        for (let x = 0; x < 11; x++) {
            const cellNode = document.createElement("div");
            cellNode.classList.add("cell");

            if (x > 0 && y > 0) {
                cellNode.classList.add("ship-field-cell");
                cellNode.dataset.shipFieldCoord = `${x}-${y}`;
            }

            if (x === 0 && y !== 0) {
                cellNode.innerText = String.fromCharCode(startCharCode + y - 1);
            }

            if (y === 0 && x !== 0) {
                cellNode.innerText = String(x);
            }

            rootNode.append(cellNode);
        }
    }
}

interface IDrawSeaMap {
    map: SeaMap;
    fieldNode: HTMLElement | Element;
    clean?: boolean;
}

export function drawSeaMap({ map, fieldNode, clean }: IDrawSeaMap) {
    const fieldCells = Array.from(
        fieldNode.querySelectorAll(".ship-field-cell")
    ) as HTMLDivElement[];

    if (clean) {
        fieldCells.forEach((cell) => (cell.innerHTML = ""));
    }

    map.table.forEach((rowArray, yIndex) => {
        rowArray.forEach((seaMapItem, xIndex) => {
            const cell = fieldCells.find(
                (cell) =>
                    cell.dataset.shipFieldCoord ===
                    `${xIndex + 1}-${yIndex + 1}`
            );
            if (cell && seaMapItem.shipCode) {
                const ship = map.getShip(seaMapItem.shipCode);
                cell.innerHTML = String(ship?.size);
            }
        });
    });
}

interface IDrawMergingSeaMap {
    workMap: SeaMap;
    fieldNode: HTMLElement | Element;
}

export function drawSeaMapDuringFight({
    workMap,
    fieldNode,
}: IDrawMergingSeaMap) {
    // const fieldCells = Array.from(
    //     fieldNode.querySelectorAll(".ship-field-cell")
    // ) as HTMLDivElement[];
    const classByState = {
        hit: "hit",
        notAllowed: "missed",
    };

    workMap.table.forEach((rowArray, yIndex) => {
        rowArray.forEach((curTableCell, xIndex) => {
            const curCell = { x: xIndex, y: yIndex };

            if (curTableCell.state !== "empty") {
                const cellNode = getCellNode({
                    node: fieldNode,
                    cell: curCell,
                });

                if (cellNode) {
                    // todo
                    cellNode.classList.add(classByState[curTableCell.state]);
                    // cell.innerHTML = String(ship?.size);
                }
            }
        });
    });
    // console.log("todo", map, mergingMap, fieldNode);
}

export function getCellNode({
    node,
    cell,
}: {
    node: HTMLElement | Element;
    cell: ICell;
}) {
    return node.querySelector(
        `[data-ship-field-coord="${cell.x + 1}-${cell.y + 1}"]`
    );
}

export function getCoordFromCell(cellNode: HTMLDivElement): ICell {
    const coord = cellNode.dataset.shipFieldCoord;

    const [x, y] = coord.split("-").map((n) => +n - 1);

    return { x, y };
}

import { FIRST_ALPHABETH_CHAR } from "common/constant";
import { SeaMap } from "entity/map";

export function drawField(rootNode: HTMLElement) {
    const startCharCode = FIRST_ALPHABETH_CHAR.charCodeAt(0);

    for (let x = 0; x < 11; x++) {
        for (let y = 0; y < 11; y++) {
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

interface IPlaceShipByDisposition {
    seaMap: SeaMap;
    fieldNode: HTMLElement;
    clearFieldNode?: boolean;
}

export function placeShipByDisposition({
    seaMap,
    fieldNode,
    clearFieldNode = true,
}: IPlaceShipByDisposition) {
    const fieldCells = Array.from(
        fieldNode.querySelectorAll(".ship-field-cell")
    ) as HTMLDivElement[];

    if (clearFieldNode) {
        fieldCells.forEach((cell) => (cell.innerHTML = ""));
    }

    seaMap.table.forEach((rowArray, yIndex) => {
        rowArray.forEach((seaMapItem, xIndex) => {
            const cell = fieldCells.find(
                (cell) =>
                    cell.dataset.shipFieldCoord ===
                    `${xIndex + 1}-${yIndex + 1}`
            );
            if (cell && seaMapItem.shipCode) {
                const ship = seaMap.getShip(seaMapItem.shipCode);
                cell.innerHTML = String(ship?.size);
            }
        });
    });
}

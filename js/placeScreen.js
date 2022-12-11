import { FIRST_ALPHABETH_CHAR } from './share/constant.js'

const fieldNode = document.getElementById('field');

function drawField(rootNode) {
    const tableNode = document.createElement('table');
    const startCharCode = FIRST_ALPHABETH_CHAR.charCodeAt(0);

    for (let x = 0; x < 11; x++) {
        const rowNode = document.createElement('tr');
        rowNode.className = `row row-${x + 1}`

        for (let y = 0; y < 11; y++) {
            const cellNode = document.createElement('td');
            cellNode.className = `cell cell-${x + 1}-${y + 1}`

            if (x === 0 && y !== 0) {
                cellNode.innerText = String.fromCharCode(startCharCode + y - 1 )
            }

            if (y === 0 && x !== 0) {
                cellNode.innerText = x
            }
            
            rowNode.append(cellNode)
        }   
        tableNode.append(rowNode)
    }

    rootNode.append(tableNode);
}

export const initPlaceScreen = function() {
    drawField(fieldNode);
}
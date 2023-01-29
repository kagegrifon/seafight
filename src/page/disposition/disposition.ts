import { PageScript } from "common/type";
import { createShipDisposition, drawField, placeShipByDisposition } from "./map";

export const initDispositionScreen: PageScript = function ({ state, onGoNext }) {
    const fieldNode = document.getElementById('field');

    drawField(fieldNode);
    
    const shipDisposition = createShipDisposition();
    placeShipByDisposition({fieldNode, shipDisposition})

    const autoPlaceButton = document.getElementById('autoPlaceButton');
    const goToFightButton = document.getElementById('startFightButton');

    const autoPlaceButtonOnClick = () => {
        const shipDisposition = createShipDisposition();
        state.disposition = shipDisposition
        placeShipByDisposition({shipDisposition, fieldNode})
    }

    autoPlaceButton.addEventListener('click', autoPlaceButtonOnClick)
    goToFightButton.addEventListener('click', () => onGoNext())
}

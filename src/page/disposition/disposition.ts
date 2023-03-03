
import { SeaMap } from "entity/map";
import { PageScript } from "page/type";
import { drawField, placeShipByDisposition } from "view/SeaMapView";

export const initDispositionScreen: PageScript = function ({ state, onGoNext }) {
    const fieldNode = document.getElementById('field');

    drawField(fieldNode);
    
    state.userMap = new SeaMap({ withRandomShips: true });

    placeShipByDisposition({fieldNode, seaMap: state.userMap})

    const autoPlaceButton = document.getElementById('autoPlaceButton');
    const goToFightButton = document.getElementById('startFightButton');

    const autoPlaceButtonOnClick = () => {
        state.userMap.createRandomShipDisposition();
        placeShipByDisposition({seaMap: state.userMap, fieldNode})
    }

    autoPlaceButton.addEventListener('click', autoPlaceButtonOnClick)
    goToFightButton.addEventListener('click', () => onGoNext())
}

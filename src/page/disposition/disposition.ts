import { getCloneOfTemplate, pageMountingDecorator } from "common/pageUtils";
import { SeaMap } from "entity/map";
import { IPageScript } from "page/type";
import { IState } from "state/type";
import { drawField, drawSeaMap } from "view/SeaMapView";

type IMakeNewRandomMap = {
    state: IState;
    fieldNode: HTMLElement;
    clean?: boolean;
};

function makeNewRandomMap({ state, fieldNode, clean }: IMakeNewRandomMap) {
    state.map.player.own = new SeaMap({ withRandomShips: true });
    drawSeaMap({ fieldNode, map: state.map.player.own, clean });
}

export const dispositionScreen: IPageScript = function ({ state, onGoNext }) {
    const dispositionPageTemplate = getCloneOfTemplate("screen-place-template");

    const fieldNode = dispositionPageTemplate.getElementById("field");

    drawField(fieldNode);

    makeNewRandomMap({ fieldNode, state });

    const autoPlaceButton =
        dispositionPageTemplate.getElementById("autoPlaceButton");
    const goToFightButton =
        dispositionPageTemplate.getElementById("startFightButton");

    const autoPlaceButtonOnClick = () => {
        makeNewRandomMap({ fieldNode, state, clean: true });
    };

    autoPlaceButton.addEventListener("click", autoPlaceButtonOnClick);
    goToFightButton.addEventListener("click", () => {
        onGoNext();
    });

    return dispositionPageTemplate;
};

export const initDispositionScreen = pageMountingDecorator(dispositionScreen);

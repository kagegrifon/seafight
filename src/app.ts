import { initFightScreen } from "page/fight/fight";
import { IState } from "state/type";
import { initDispositionScreen } from "./page/disposition/disposition";
import { initStartScreen } from "./page/start/start";

function getInitalState(): IState {
    return {
        rootNode: document.getElementById("root"),
        map: {
            enemy: {},
            player: {},
        },
    };
}

const state: IState = getInitalState();

export function app() {
    initStartScreen({
        onGoNext: goToDispositionScreen,
        state,
    });

    function goToDispositionScreen() {
        initDispositionScreen({
            onGoNext: goToFightScreen,
            state,
        });
    }

    function goToFightScreen() {
        initFightScreen({ state, onGoNext: restartGame });
    }

    function restartGame() {
        goToDispositionScreen();
    }
}

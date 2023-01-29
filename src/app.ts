import { switchActiveScreen } from 'common/domUtils';
import { State } from 'common/type';
import { initFightScreen } from 'page/fight/fight';
import { initDispositionScreen } from './page/disposition/disposition'
import { initStartScreen } from './page/start/start'

const state: State = {
    disposition: [[]],
}

export function app() {
    initStartScreen({
        onGoNext: goToDispositionScreen,
        state
    });

    function goToDispositionScreen() {
        switchActiveScreen('place')
        initDispositionScreen({
            onGoNext: goToFightScreen,
            state
        });
    }

    function goToFightScreen() {
        switchActiveScreen('fight')
        initFightScreen({ state })
    }

    switchActiveScreen('start')
}

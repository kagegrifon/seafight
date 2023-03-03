import { switchActiveScreen } from 'common/pageUtils';
import { initFightScreen } from 'page/fight/fight';
import { State } from 'state/type';
import { initDispositionScreen } from './page/disposition/disposition'
import { initStartScreen } from './page/start/start'

const state: State = {}

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

import { PageScript } from 'common/type';

export const initStartScreen: PageScript = function ({ onGoNext }) {
    const startButton = document.getElementById('start-button');

    startButton.addEventListener('click', () => {
        onGoNext()
    })
}

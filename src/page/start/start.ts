import { SCREENS_NAMES } from 'common/constant'

export function initStartScreen() {
    const startButton = document.getElementById('start-button');
    const screens = Array.from(document.querySelectorAll('.screen'));

    const screenByName = SCREENS_NAMES.reduce((acc, screenName) => {
        acc[screenName] = screens.find(s => s.classList.contains(`screen-${screenName}`))
        return acc;
    }, {})

    const setScreenActive = (screenName) => {
        if (!SCREENS_NAMES.includes(screenName)) {
            return
        }

        const curScreen = screens.find(s => s.classList.contains('active'))
        screenByName[screenName].classList.add('active')
        curScreen.classList.remove('active')
    }
    
    startButton.addEventListener('click', () => setScreenActive('place'))
}

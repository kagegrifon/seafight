import { SCREENS_NAMES } from "./type"

export const switchActiveScreen = (screenName: SCREENS_NAMES) => {
    const newActiveScreen = document.getElementById(`screen-${screenName}`)

    if (!newActiveScreen) {
        throw Error(`Something went wrong, no ${screenName} screen in layout`)
    }

    const curActiveScreen = document.querySelector('[id^=screen-].active')
    newActiveScreen.classList.add('active')
    curActiveScreen.classList.remove('active')
}
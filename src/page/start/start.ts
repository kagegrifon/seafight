import { PageScript } from "page/type";

export const initStartScreen: PageScript = function ({ onGoNext }) {
    const startButton = document.getElementById("start-button");

    startButton.addEventListener("click", () => {
        onGoNext();
    });
};

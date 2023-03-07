import { getCloneOfTemplate, pageMountingDecorator } from "common/pageUtils";
import { IPageScript } from "page/type";

const startScreen: IPageScript = function ({ onGoNext }) {
    const startPageTemplate = getCloneOfTemplate("screen-start-template");
    const startButton = startPageTemplate.getElementById("start-button");

    startButton.addEventListener("click", () => {
        onGoNext();
    });

    return startPageTemplate;
};

export const initStartScreen = pageMountingDecorator(startScreen);

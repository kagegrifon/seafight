import { IPageScript } from "page/type";

export function getCloneOfTemplate(templateId: string) {
    const template = document.getElementById(templateId);

    if (!template) {
        throw Error("No such template with id " + templateId);
    }

    const templateClone = template.cloneNode(true);

    if ("content" in templateClone) {
        return (templateClone as HTMLTemplateElement).content;
    } else {
        throw Error(`Template with id = ${templateId} has no content`);
    }
}

export function cleanContainer(container: HTMLElement) {
    container.innerHTML = "";
}

export function pageMountingDecorator(pageScript: IPageScript): IPageScript {
    return (params) => {
        cleanContainer(params.state.rootNode);

        const pageNode = pageScript(params);

        params.state.rootNode.append(pageNode);

        return pageNode;
    };
}

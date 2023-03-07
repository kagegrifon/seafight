import { IState } from "state/type";

export type IPageScript = (params: {
    state: IState;
    // TODO fix type error
    // eslint-disable-next-line @typescript-eslint/ban-types
    onGoNext?: Function;
}) => HTMLElement | DocumentFragment;

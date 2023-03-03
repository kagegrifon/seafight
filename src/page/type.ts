import { State } from "state/type";

// TODO fix type error
// eslint-disable-next-line @typescript-eslint/ban-types
export type PageScript = (params: { state: State, onGoNext?: Function }) => void
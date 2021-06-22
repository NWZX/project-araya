/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createContext, useContext, useReducer } from 'react';

interface IDialogData {
    currentDialog?: string;
}
const initialState: IDialogData = {
    currentDialog: undefined,
};

function reducer(state: IDialogData, action: { type: string; payload?: Record<string, any> }): IDialogData {
    switch (action.type) {
        case 'open-target-dialog':
            return { ...state, currentDialog: action.payload?.currentDialog };
        case 'close-dialog':
            return { ...state, currentDialog: undefined };
        default:
            throw new Error();
    }
}

const DialogDataContext = createContext<[IDialogData, (type: string, payload?: Record<string, any>) => void]>([
    initialState,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {},
]);
export const AccountDialogProvider: React.FC = ({ children }) => {
    const [data, dispatchData] = useReducer(reducer, initialState);

    return (
        <DialogDataContext.Provider value={[data, (t, p) => dispatchData({ type: t, payload: p })]}>
            {children}
        </DialogDataContext.Provider>
    );
};

export const useAccountDialog = () => {
    const [context, dispatch] = useContext(DialogDataContext);
    const openDialog = (target: string): void => {
        dispatch('open-target-dialog', { currentDialog: target });
    };
    const closeDialog = (): void => {
        dispatch('close-dialog');
    };
    return { ...context, openDialog, closeDialog };
};

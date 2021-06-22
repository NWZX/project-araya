/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createContext, useContext, useReducer } from 'react';
import { IProduct, IProductGroup } from '.';

// interface IDialogData {
//     selectProduct?: [IProduct | undefined, Dispatch<SetStateAction<IProduct | undefined>>];
//     addProduct?: [IProductGroup | undefined, Dispatch<SetStateAction<IProductGroup | undefined>>];
//     updateProduct?: [IProduct | undefined, Dispatch<SetStateAction<IProduct | undefined>>];
//     addGroup?: [boolean, Dispatch<SetStateAction<boolean>>];
//     delGroup?: [IProductGroup | undefined, Dispatch<SetStateAction<IProductGroup | undefined>>];
//     review: [string | undefined, Dispatch<SetStateAction<string | undefined>>];
// }
interface IDialogData {
    selectedProduct?: IProduct;
    selectedGroup?: IProductGroup;
    storeId?: string;
    currentDialog?: string;
}
const initialState: IDialogData = {
    selectedProduct: undefined,
    selectedGroup: undefined,
    storeId: undefined,
    currentDialog: undefined,
};

function reducer(state: IDialogData, action: { type: string; payload?: Record<string, any> }): IDialogData {
    switch (action.type) {
        case 'open-target-dialog':
            return { ...state, currentDialog: action.payload?.currentDialog };
        case 'close-dialog':
            return { ...state, currentDialog: undefined };
        case 'set-store':
            return { ...state, storeId: action.payload?.storeId };
        case 'set-group':
            return { ...state, selectedGroup: action.payload?.selectedGroup };
        case 'set-product':
            return { ...state, selectedProduct: action.payload?.selectedProduct };
        default:
            throw new Error();
    }
}

const DialogDataContext = createContext<[IDialogData, (type: string, payload?: Record<string, any>) => void]>([
    initialState,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {},
]);
export const DialogDataProvider: React.FC = ({ children }) => {
    const [data, dispatchData] = useReducer(reducer, initialState);

    return (
        <DialogDataContext.Provider value={[data, (t, p) => dispatchData({ type: t, payload: p })]}>
            {children}
        </DialogDataContext.Provider>
    );
};

export const useDialogData = () => {
    const [context, dispatch] = useContext(DialogDataContext);
    const openDialog = (target: string): void => {
        dispatch('open-target-dialog', { currentDialog: target });
    };
    const closeDialog = (): void => {
        dispatch('close-dialog');
    };
    const setStore = (id: string): void => {
        dispatch('set-store', { storeId: id });
    };
    const setGroup = (group: IProductGroup): void => {
        dispatch('set-group', { selectedGroup: group });
    };
    const setProduct = (product: IProduct): void => {
        dispatch('set-product', { selectedProduct: product });
    };

    return { ...context, openDialog, closeDialog, setStore, setGroup, setProduct };
};

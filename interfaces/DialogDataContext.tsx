import { createContext, Dispatch, SetStateAction, useState, useContext } from 'react';
import { IProduct, IProductGroup } from '.';

interface IDialogData {
    selectProduct?: [IProduct | undefined, Dispatch<SetStateAction<IProduct | undefined>>];
    addProduct?: [IProductGroup | undefined, Dispatch<SetStateAction<IProductGroup | undefined>>];
    updateProduct?: [IProduct | undefined, Dispatch<SetStateAction<IProduct | undefined>>];
    addGroup?: [boolean, Dispatch<SetStateAction<boolean>>];
    delGroup?: [IProductGroup | undefined, Dispatch<SetStateAction<IProductGroup | undefined>>];
}

const DialogDataContext = createContext<IDialogData>({});
export const DialogDataProvider: React.FC = ({ children }) => {
    const selectProduct = useState<IProduct | undefined>();
    const addProduct = useState<IProductGroup | undefined>();
    const updateProduct = useState<IProduct | undefined>();
    const addGroup = useState<boolean>(false);
    const delGroup = useState<IProductGroup | undefined>();

    return (
        <DialogDataContext.Provider
            value={{
                selectProduct,
                addProduct,
                updateProduct,
                addGroup,
                delGroup,
            }}
        >
            {children}
        </DialogDataContext.Provider>
    );
};

export const useDialogData = (): IDialogData => useContext(DialogDataContext);

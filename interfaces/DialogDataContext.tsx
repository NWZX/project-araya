import { createContext, Dispatch, SetStateAction, useState, useContext } from 'react';
import { IProduct, IProductGroup } from '.';

interface IDialogData {
    selectProduct?: [IProduct | undefined, Dispatch<SetStateAction<IProduct | undefined>>];
    addProduct?: [IProductGroup | undefined, Dispatch<SetStateAction<IProductGroup | undefined>>];
    updateProduct?: [IProduct | undefined, Dispatch<SetStateAction<IProduct | undefined>>];
    addGroup?: [boolean, Dispatch<SetStateAction<boolean>>];
    delGroup?: [IProductGroup | undefined, Dispatch<SetStateAction<IProductGroup | undefined>>];
    review?: [string | undefined, Dispatch<SetStateAction<string | undefined>>];
}

const DialogDataContext = createContext<IDialogData>({});
export const DialogDataProvider: React.FC = ({ children }) => {
    return (
        <DialogDataContext.Provider
            value={{
                selectProduct: useState<IProduct | undefined>(),
                addProduct: useState<IProductGroup | undefined>(),
                updateProduct: useState<IProduct | undefined>(),
                addGroup: useState<boolean>(false),
                delGroup: useState<IProductGroup | undefined>(),
                review: useState<string | undefined>(),
            }}
        >
            {children}
        </DialogDataContext.Provider>
    );
};

export const useDialogData = (): IDialogData => useContext(DialogDataContext);

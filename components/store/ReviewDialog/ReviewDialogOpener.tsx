import React from 'react';
import { Link } from '@material-ui/core';
import { useDialogData } from 'interfaces/DialogDataContext';

interface Props {
    id?: string;
}

const ReviewDialogOpener: React.FC<Props> = ({ id }) => {
    const { openDialog, setStore } = useDialogData();
    return (
        <Link
            onClick={() => {
                if (id) {
                    setStore(id);
                    openDialog('review');
                }
            }}
        >
            Voir les avis
        </Link>
    );
};

export default ReviewDialogOpener;

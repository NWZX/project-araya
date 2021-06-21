import React from 'react';
import { Link } from '@material-ui/core';
import { useDialogData } from 'interfaces/DialogDataContext';

interface Props {
    id?: string;
}

const ReviewDialogOpener: React.FC<Props> = ({ id }) => {
    const dialogContext = useDialogData().review;
    const setReview = dialogContext?.[1];
    return (
        <Link
            onClick={() => {
                setReview && setReview(id);
            }}
        >
            Voir les avis
        </Link>
    );
};

export default ReviewDialogOpener;

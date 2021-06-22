import { Button } from '@material-ui/core';
import React from 'react';
import { useDialogData } from 'interfaces/DialogDataContext';

interface Props {}

const AddGroupButton: React.FC<Props> = () => {
    const { openDialog } = useDialogData();
    return (
        <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={() => {
                openDialog('add-product-group');
            }}
        >
            Ajouter un groupe
        </Button>
    );
};

export default AddGroupButton;

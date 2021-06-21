import { Button } from '@material-ui/core';
import React from 'react';
import { useDialogData } from 'interfaces/DialogDataContext';

interface Props {}

const AddGroupButton: React.FC<Props> = () => {
    const dialogContext = useDialogData();
    const setAddGroup = dialogContext.addGroup?.[1];
    return (
        <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={() => {
                setAddGroup && setAddGroup(true);
            }}
        >
            Ajouter un groupe
        </Button>
    );
};

export default AddGroupButton;
